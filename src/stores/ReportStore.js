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

  canReportPost = true;

  canReportComment = true;

  // action
  setCatReportVisible = boolean => {
    this.catReportVisible = boolean;
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

  setCanReportPost = boolean => {
    this.canReportPost = boolean;
  };

  reportPost = async () => {
    const { cat } = this.root;
    const postId = cat.selectedCatPost.id;
    const criminalId = cat.selectedCatPost.user.id;
    const result = await axios
      .post(`${SERVER_URL}/report`, { postId, criminalId }, defaultCredential)
      .then(res => true)
      .catch(err => this.alertFailure(err));
    return result;
  };

  setCanReportComment = boolean => {
    this.canReportComment = boolean;
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
}

decorate(ReportStore, {
  catReportVisible: observable,
  canReportPost: observable,
  canReportComment: observable,
  setCatReportVisible: action,
  reportCatBio: action,
  setCanReportPost: action,
  reportPost: action,
  setCanReportComment: action,
  reportComment: action,
  alertFailure: action,
});

export default ReportStore;
