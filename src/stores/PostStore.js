import { observable, action, decorate } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };

class PostStore {
  constructor(root) {
    this.root = root;
  }

  // 포스트들을 담은 배열
  postList = [];

  // 현재 페이지의 카운트
  postPage = 0;

  // 포스트들을 새로고침할 boolean
  isRefreshingPost = false;

  // 포스트를 로딩할 boolean
  isLoadingPost = false;

  // 댓글 수
  replyNum = null;

  // 해당 고양이가 가진 최대 페이지네이션 수
  maxPostPage = 0;

  // CatPostInput 모달 나타내는 boolean
  modalVisible = false;

  // 탭 렌더 시 포스트를 받아오는 함수
  getPostList = async navigation => {
    // axios로 catPost들을 get해서 this.info.postList 업데이트
    try {
      const catId = this.root.cat.selectedCatBio[0].id;
      const url = `${SERVER_URL}/post/${catId}/${this.postPage}`;
      const res = await axios.get(url);
      if (res) {
        this.maxPostPage = res.data.maxcount;
        if (this.isRefreshingPost) {
          this.postList = res.data.post;
          this.isRefreshingPost = false;
          return res;
        }
        this.postList = this.postList.concat(res.data.post);
        this.isLoadingPost = false;
      }
    } catch (err) {
      this.root.auth.expiredTokenHandler(err, navigation, this.getPostList);
    }
  };

  // 포스트 로딩
  _handleLoadMorePosts = navigation => {
    if (this.maxPostPage > this.postPage) {
      this.isLoadingPost = true;
      this.postPage += 1;
      this.getPostList(navigation);
    }
  };

  // 포스트 새로고침
  _handleRefresh = navigation => {
    this.isRefreshingPost = true;
    this.postPage = 0;
    this.getPostList(navigation);
  };

  // 포스트 등록 함수
  addPost = (mode, navigation) => {
    const url =
      mode === 'new' ? `${SERVER_URL}/post/new` : `${SERVER_URL}/post/update`;
    const { cat, helper } = this.root;
    const {
      selectedCatPhotoPath,
      selectedCatInputContent,
      selectedCatBio,
      selectedCatPost,
    } = cat;
    const postInfo =
      mode === 'new'
        ? {
          content: selectedCatInputContent,
          catId: selectedCatBio[0].id,
        }
        : { content: selectedCatInputContent, postId: selectedCatPost.id };
    if (selectedCatPhotoPath) {
      postInfo.photoPath = selectedCatPhotoPath;
    }
    axios
      .post(url, postInfo, defaultCredential)
      .then(res => {
        helper.clearInput(
          'cat',
          'selectedCatInputContent',
          'selectedCatPhotoPath',
          'selectedCatUri',
        );
        this._handleRefresh(navigation);
        this.setPostModify();
        cat.getAlbums(navigation);
        return res.data;
      })
      .catch(err => {
        if (err.response && err.response.status === 405) {
          Alert.alert(
            '등록 과정에 문제가 발생했습니다. 관리자에게 문의해주세요.',
          );
        } else {
          Alert.alert('등록에 실패했습니다. 다시 등록해주세요.');
          this.root.auth.expiredTokenHandler(
            err,
            navigation,
            this.addPost,
            mode,
          );
        }
      });
    this.toggleModalVisible();
  };

  // 포스트 삭제 함수
  deletePost = (item, navigation) => {
    const { cat } = this.root;
    cat.selectedCatPost = item;
    axios
      .post(
        `${SERVER_URL}/post/delete`,
        { postId: cat.selectedCatPost.id },
        defaultCredential,
      )
      .then(res => {
        Alert.alert('게시글이 삭제되었습니다.');
        this._handleRefresh(navigation);
        cat.getAlbums(navigation);
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(
          err,
          navigation,
          this.deletePost,
          item,
        );
      });
  };

  // 등록/수정 상태 확인
  setPostModify = () => {
    const { cat } = this.root;
    cat.postModifyState = false;
  };

  // CatInfo 종료 때 리셋 함수
  resetPostState = () => {
    this.postList = [];
    this.postPage = 0;
    this.isRefreshingPost = false;
    this.isLoadingPost = false;
  };

  // 댓글수 상태 저장
  setReplyNum = comments => {
    this.replyNum = comments.length;
  };

  // 새로고침 상태 확인
  validateRefreshMode = navigation => {
    const { commentList } = this.root.comment;
    const commentCount = commentList.length;
    if (commentCount !== this.replyNum) {
      this._handleRefresh(navigation);
    }
  };

  // 모달창 toggle
  toggleModalVisible = () => {
    this.modalVisible = !this.modalVisible;
  }

  // 포스트 인풋 모달창 종료 함수
  exitInputModal = () => {
    const { cat, helper } = this.root;
    // 인풋창이 비어있거나 수정 중이 아닐 때
    if (!cat.selectedCatInputContent && !cat.selectedCatPhotoPath
      && !cat.selectedCatUri && !cat.postModifyState) {
      this.toggleModalVisible();
      return;
    }
    Alert.alert(
      '정말 나가시겠습니까?',
      '작성한 내용이 사라집니다. 그래도 나가시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          onPress: () => {
            helper.clearInput(
              'cat',
              'selectedCatInputContent',
              'selectedCatPhotoPath',
              'selectedCatUri',
            );
            this.setPostModify();
            this.toggleModalVisible();
          },
        },
      ],
      { cancelable: false },
    );
  };
}

decorate(PostStore, {
  postList: observable,
  postPage: observable,
  isRefreshingPost: observable,
  isLoadingPost: observable,
  replyNum: observable,
  maxPostPage: observable,
  modalVisible: observable,
  getPostList: action,
  _handleLoadMorePosts: action,
  _handleRefresh: action,
  addPost: action,
  deletePost: action,
  setPostModify: action,
  resetPostState: action,
  setReplyNum: action,
  validateRefreshMode: action,
  toggleModalVisible: action,
  exitInputModal: action,
});
export default PostStore;
