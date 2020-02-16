import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

class PostStore {
  constructor(root) {
    this.root = root;
  }

  postList = [];

  // * PostStore
  postPage = 1;

  isRefreshingPost = false;

  getPostList = async () => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.info.postList 업데이트
    try {
      const url = `https://jsonplaceholder.typicode.com/photos?_limit=6&_page=${this.postPage}`;
      const post = await Axios.get(url);
      if (post) {
        if (this.isRefreshingPost) {
          this.postList = post.data;
          this.isRefreshingPost = false;
        } else {
          this.postList = this.postList.concat(post.data);
          this.isLoadingPost = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  _handleLoadMorePosts = () => {
    this.postPage += 1;
    this.getPostList();
  };

  _handleRefresh = () => {
    this.isRefreshingPost = true;
    this.postPage = 1;
    this.getPostList();
  };

  addPost = () => {
    const postInfo = {
      content: this.root.cat.inputContent,
      catId: this.root.cat.selectedCat[0].id,
    };
    if (this.root.cat.photoPath) {
      postInfo.photoPath = this.root.cat.photoPath;
    }
    axios
      .post(`${SERVER_URL}/post/new`, postInfo, defaultCredential)
      .then(res =>
        // Helper Store
        this.clearInput(
          { group: 'info', key: 'content' },
          { group: 'info', key: 'photoPath' },
        ),
      )
      .catch(err => {
        if (err.response && err.response.status === 405) {
          Alert.alert(
            '등록 과정에 문제가 발생했습니다. 관리자에게 문의해주세요.',
          );
          // 로직 확인 필요
        } else {
          Alert.alert('등록에 실패했습니다. 다시 등록해주세요.');
          console.dir(err);
        }
      });
  };
  // * Post Store
}

decorate(PostStore, {
  postList: observable,
  postPage: observable,
  isRefreshingPost: observable,
  getPostList: action,
  handleLoadMorePosts: action,
  handleRefresh: action,
  alidateAddInput: action,
  addPost: action,
});
export default PostStore;
