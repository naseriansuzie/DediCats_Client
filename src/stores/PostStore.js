import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

const defaultCredential = { withCredentials: true };

class PostStore {
  constructor(root) {
    this.root = root;
  }

  postList = [];

  postPage = 1;

  isRefreshingPost = false;

  getPostList = async () => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.info.postList 업데이트
    try {
      const url = `https://jsonplaceholder.typicode.com/photos?_limit=6&_page=${this.postPage}`;
      const post = await axios.get(url);
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
    const { cat, helper } = this.root;
    const { selectedCatPhotoPath, selectedCatInputContent, selectedCat } = cat;
    const postInfo = {
      content: selectedCatInputContent,
      catId: selectedCat[0].id,
    };
    if (selectedCatPhotoPath) {
      postInfo.photoPath = selectedCatPhotoPath;
    }
    axios
      .post(`${SERVER_URL}/post/new`, postInfo, defaultCredential)
      .then(res =>
        helper.clearInput('cat', 'selectedCatContent', 'selectedCatPhotoPath'),
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
}

decorate(PostStore, {
  postList: observable,
  postPage: observable,
  isRefreshingPost: observable,
  getPostList: action,
  handleLoadMorePosts: action,
  handleRefresh: action,
  addPost: action,
});
export default PostStore;
