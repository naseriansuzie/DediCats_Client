import { observable, action, decorate } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };

class PostStore {
  constructor(root) {
    this.root = root;
  }

  postList = [];

  postPage = 0;

  isRefreshingPost = false;

  isLoadingPost = false;

  replyNum = null;

  getPostList = async navigation => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.info.postList 업데이트
    try {
      const catId = this.root.cat.selectedCatBio[0].id;
      const url = `${SERVER_URL}/post/${catId}/${this.postPage}`;
      const post = await axios.get(url);
      if (post) {
        if (this.isRefreshingPost) {
          this.postList = post.data;
          this.isRefreshingPost = false;
          return post;
        }
        this.postList = this.postList.concat(post.data);
        this.isLoadingPost = false;
      }
    } catch (error) {
      this.root.auth.expiredTokenHandler(err, navigation);
      console.error(error);
    }
  };

  _handleLoadMorePosts = navigation => {
    this.isLoadingPost = true;
    this.postPage += 1;
    this.getPostList(navigation);
  };

  _handleRefresh = navigation => {
    this.isRefreshingPost = true;
    this.postPage = 0;
    this.getPostList(navigation);
  };

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
          this.root.auth.expiredTokenHandler(err, navigation);
          console.dir(err);
        }
      });
  };

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
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
  };

  setPostModify = () => {
    const { cat } = this.root;
    cat.postModifyState = false;
  };

  resetPostState = () => {
    this.postList = [];
    this.postPage = 0;
    this.isRefreshingPost = false;
    this.isLoadingPost = false;
  };

  setReplyNum = comments => {
    this.replyNum = comments.length;
  };

  validateRefreshMode = navigation => {
    const { cat } = this.root;
    const commentCount = cat.selectedCatCommentList.length;
    if (commentCount !== this.replyNum) {
      this._handleRefresh(navigation);
    }
  };
}

decorate(PostStore, {
  postList: observable,
  postPage: observable,
  isRefreshingPost: observable,
  isLoadingPost: observable,
  replyNum: observable,
  getPostList: action,
  _handleLoadMorePosts: action,
  _handleRefresh: action,
  addPost: action,
  deletePost: action,
  setPostModify: action,
  resetPostState: action,
  setReplyNum: action,
  validateRefreshMode: action,
});
export default PostStore;
