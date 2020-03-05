import { action, decorate } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };

class ReportStore {
  constructor(root) {
    this.root = root;
  }

  // action
  // 고양이 정보 신고
  reportCatBio = async navigation => {
    const { cat } = this.root;
    const catId = cat.selectedCatBio[0].id;
    const criminalId = cat.selectedCatBio[0].user.id;
    const result = await axios
      .post(`${SERVER_URL}/report`, { catId, criminalId }, defaultCredential)
      .then(res =>
        Alert.alert('신고 완료', '해당 신고 요청이 처리되었습니다.', [
          { text: '확인', onPress: () => {} },
        ]),
      )
      .catch(err => this.alertFailure(err, navigation));
    return result;
  };

  // 포스트 신고
  reportPost = async (postId, criminalId, navigation) => {
    const result = await axios
      .post(`${SERVER_URL}/report`, { postId, criminalId }, defaultCredential)
      .then(res => {
        Alert.alert('신고가 완료되었습니다.');
        return true;
      })
      .catch(err => this.alertFailure(err, navigation));
    return result;
  };

  // 댓글 신고
  reportComment = async navigation => {
    const { comment } = this.root;
    const commentId = comment.selectedComment.id;
    const criminalId = comment.selectedComment.user.id;
    const result = await axios
      .post(
        `${SERVER_URL}/report`,
        { commentId, criminalId },
        defaultCredential,
      )
      .then(res => true)
      .catch(err => this.alertFailure(err, navigation));
    return result;
  };

  // 등록 실패 알림
  alertFailure = (err, navigation) => {
    this.root.auth.expiredTokenHandler(err, navigation, this.reportComment);
    if (err.response && err.response.status === 409) {
      Alert.alert('등록이 실패되었습니다. 다시 시도해주세요.');
    }
    return false;
  };

  // 포스트 수정, 삭제, 신고버튼 클릭에 따른 함수
  processPostActions = (isMyPost, idx, item, navigation) => {
    const { cat, post } = this.root;
    if (isMyPost) {
      if (idx === 0) {
        // 게시글 수정
        cat.postModifyState = true;
        cat.selectedCatPost = item;
        cat.selectedCatInputContent = item.content;
        // CatPostInput이 Modal로 수정되면서 visible state 변경 함수 추가
        post.toggleModalVisible();
        /* 사진도 수정하려면 아래 내용 포함 */
        // cat.selectedCatPhotoPath = item.photos && item.photos.length > 0 ? item.photos[0].path : null;
        // cat.selectedCatUri = photos && photos.length > 0 ? photos[0].path : null;
      }
      if (idx === 1) {
        // 게시글 삭제
        post.deletePost(item, navigation);
      }
    } else if (isMyPost !== true && idx === 0) {
      // 게시물 신고
      Alert.alert('부적절한 게시글 신고', '해당 포스트를 신고하시겠습니까?', [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '신고',
          onPress: () => this.reportPost(item.id, item.user.id, navigation),
        },
      ]);
    }
  };
}

decorate(ReportStore, {
  reportCatBio: action,
  reportPost: action,
  reportComment: action,
  alertFailure: action,
  processPostActions: action,
});

export default ReportStore;
