import { observable, action, decorate } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import socketio from 'socket.io-client';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };
class CommentStore {
  constructor(root) {
    this.root = root;
  }

  // post에 해당하는 commentList
  commentList = [];

  // 수정, 삭제, 신고를 위해 선택한 comment
  selectedComment = null;

  // 작성하는 댓글
  inputComment = '';

  // comment를 수정하는 중인지 상태 - true면 수정 중
  commentModifyState = false;

  // * 소켓 아이디
  socketId = null;

  //! 소켓 연결 여부
  isConnectSocket = false;

  //! 추가된 댓글
  newComment = null;

  //! 댓글 페이지
  commentPage = 0;

  // 처음 방에 입장했을 때 댓글 수
  initialComments = 0;

  // onPress한 포스트 정보 저장, 소켓 연결
  setCatPost = item => {
    this.root.cat.selectedCatPost = item;
    this.initialComments = item.comments.length;
    this.connectSocket();
  };

  // socket 연결 시작
  connectSocket = () => {
    const { cat } = this.root;
    const socket = socketio.connect(`${SERVER_URL}`, {
      query: `postId=${cat.selectedCatPost.id}`,
    });
    const helper = sockets => {
      sockets.emit('new comment', 'hello');

      sockets.on('connect', () => {
        if (socket.connected) {
          this.socketId = sockets.id;
          this.isConnectSocket = true;
        }
      });

      sockets.on('drop', () => {
        sockets.disconnect();
        this.isConnectSocket = false;
      });

      sockets.on('new comment', comment => {
        this.newComment = comment;
        this.commentList = [this.newComment, ...this.commentList];
      });
    };
    helper(socket);
  };

  // 소켓 연결해제
  offUser = async navigation => {
    const result = await axios
      .get(
        `${SERVER_URL}/post/disconnect/?socket_id=${this.socketId}`,
        defaultCredential,
      )
      .then(res => true)
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation, this.offUser);
      });
    return result;
  };

  // 선택한 포스트 기준으로 댓글 리스트를 받아오는 함수
  getCommentList = async navigation => {
    try {
      const postId = this.root.cat.selectedCatPost.id;
      const url = `${SERVER_URL}/comment/${postId}/${this.commentPage}`;
      const comment = await axios.get(url);
      if (comment) {
        this.commentList = this.commentList.concat(comment.data);
      }
      return;
    } catch (error) {
      this.root.auth.expiredTokenHandler(err, navigation, this.getCommentList);
    }
  };

  // 댓글 창에서 나갈 때 리셋
  resetCommentState = type => {
    this.commentList = [];
    this.selectedComment = null;
    this.commentPage = 0;
    this.newComment = null;
    if (type === 'back') {
      this.initialComments = 0;
    }
  };

  // 예전 댓글 로드
  _handleLoadMoreComments = async navigation => {
    this.commentPage += 1;
    await this.getCommentList(navigation);
  };

  // * 댓글 추가와 수정 둘다 가능
  addComment = (mode, navigation) => {
    const url =
      mode === 'new'
        ? `${SERVER_URL}/comment/add`
        : `${SERVER_URL}/comment/update`;

    const postId = this.root.cat.selectedCatPost.id;
    if (mode === 'new') {
      const newCommentInfo = { postId, content: this.inputComment };
      return axios
        .post(url, newCommentInfo, defaultCredential)
        .then(res => {
          this.initialComments += 1;
          this.root.helper.clearInput('comment', 'inputComment');
          return res;
        })
        .catch(err => {
          if (err.response && err.response.status === 409) {
            Alert.alert('댓글 업로드에 실패했습니다. 다시 한 번 등록해주세요!');
          } else {
            this.root.auth.expiredTokenHandler(
              err,
              navigation,
              this.addComment,
              mode,
            );
          }
        });
    }

    const updateCommentInfo = {
      commentId: this.selectedComment.id,
      content: this.inputComment,
    };
    return axios
      .post(url, updateCommentInfo, defaultCredential)
      .then(res => {
        this.root.helper.clearInput('comment', 'inputComment');
        return res.data;
      })
      .catch(err => {
        if (err.response && err.response.status === 409) {
          Alert.alert('댓글 수정에 실패했습니다. 다시 한 번 등록해주세요!');
        }
      });
  };

  // 댓글을 state에 할당
  setCatComment = async comment => {
    this.selectedComment = comment;
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  };

  // 수정 상황 불린 변경
  setCommentModify = () => {
    this.commentModifyState = true;
  };

  // 수정 취소 시 원상태로 복귀
  resetModifyComment = () => {
    this.root.helper.clearInput('comment', 'inputComment');
    this.commentModifyState = false;
  };

  // 댓글 수정
  modifyComment = comment => {
    this.setCatComment(comment);
    this.setCommentModify();
    this.inputComment = comment.content;
  };

  // 댓글 삭제
  deleteComment = async (comment, navigation) => {
    await this.setCatComment(comment);
    const result = axios
      .post(
        `${SERVER_URL}/comment/delete`,
        { commentId: this.selectedComment.id },
        defaultCredential,
      )
      .then(res => {
        this.initialComments -= 1;
        Alert.alert('게시글이 삭제되었습니다.');
        return true;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(
          err,
          navigation,
          this.deleteComment,
          comment,
        );
      });
    return result;
  };
}

decorate(CommentStore, {
  commentList: observable,
  selectedComment: observable,
  inputComment: observable,
  commentModifyState: observable,
  socketId: observable,
  isConnectSocket: observable,
  newComment: observable,
  commentPage: observable,
  initialComments: observable,
  setCatPost: action,
  connectSocket: action,
  offUser: action,
  getCommentList: action,
  resetCommentState: action,
  _handleLoadMoreComments: action,
  addComment: action,
  setCatComment: action,
  setCommentModify: action,
  resetModifyComment: action,
  modifyComment: action,
  deleteComment: action,
});

export default CommentStore;
