import { observable, action, decorate } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

const defaultCredential = { withCredentials: true };

class ReportStore {
  constructor(root) {
    this.root = root;
  }

  // observable
  catReportVisible = false;

  // action
  setCatReportVisible = flag => {
    this.catReportVisible = flag;
  };

  reportCatBio = async () => {
    const { cat } = this.root;
    const catId = cat.selectedCatBio[0].id;
    // criminalId?? 어떻게 찾아서 body 에 담지?
    const result = await axios
      .post(`${SERVER_URL}/report`, { catId }, defaultCredential)
      .then(res => true)
      .catch(err => this.alertFailure(err));
    return result;
  };

  reportPost = async postId => {
    console.log('postId', postId);
    const { cat } = this.root;
    const criminalId = cat.selectedCatPost.user.id;
    console.log('criminalId', criminalId);
    const result = await axios
      .post(`${SERVER_URL}/report`, { postId, criminalId }, defaultCredential)
      .then(res => true)
      .catch(err => this.alertFailure(err));
    return result;
  };

  reportComment = async () => {
    const { cat } = this.root;
    const commentId = cat.selectedCatComment.id;
    const criminalId = cat.selectedCatComment.user.id;
    const result = await axios
      .post(
        `${SERVER_URL}/report`,
        { commentId, criminalId },
        defaultCredential,
      )
      .then(res => true)
      .catch(err => this.alertFailure(err));
    return result;
  };

  alertFailure = err => {
    console.dir(err);
    if (err.response && err.response.status === 409) {
      Alert.alert('신고 등록이 실패되었습니다. 다시 시도해주세요.');
    }
    return false;
  };

  processPostActions = (idx, id) => {
    if (idx === 2) {
      // 게시글 신고
      if (idx === 0) {
        // 게시글 수정 모드로 변경
        console.log('수정');
      }
      if (idx === 1) {
        // 게시글 삭제
        console.log('삭제');
      }
      if (idx === 2) {
        Alert.alert('부적절한 게시글 신고', '해당 포스트를 신고하시겠습니까?', [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '신고',
            onPress: () => this.reportPost(id),
          },
        ]);
      }
    }
  };
}

decorate(ReportStore, {
  catReportVisible: observable,
  setCatReportVisible: action,
  reportCatBio: action,
  reportPost: action,
  reportComment: action,
  alertFailure: action,
  processPostActions: action,
});

export default ReportStore;
