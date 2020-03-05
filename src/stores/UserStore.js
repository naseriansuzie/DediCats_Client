import { observable, action, decorate } from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

const defaultCredential = { withCredentials: true };
const DEFAULT_USER =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_USER.png';
class UserStore {
  constructor(root) {
    this.root = root;
  }

  // observable
  // 유저 프로필 이미지
  myUri = null;

  // 유저 임시프로필 이미지
  tempUri = null;

  // 유저 정보 변경 상태
  isEditing = false;

  // 유저 프로필 이미지 path
  myPhotoPath = null;

  // 내가 팔로우하는 고양이 리스트
  myCatList = null;

  // 언팔로우하는 고양이
  unFollowedCat = null;

  // 유저정보 사진 임시 변경
  setMyUri = photoPath => {
    this.myUri = photoPath;
    this.tempUri = photoPath;
  };

  // 내가 팔로우하는 고양이리스트
  getMyCatList = navigation => {
    axios
      .get(`${SERVER_URL}/cat/catlist`, defaultCredential)
      .then(res => (this.myCatList = res.data))
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation, this.getMyCatList);
      });
  };

  // 유저 정보 변경 상태
  setEditingMode = answer => {
    if (answer === 'yes') {
      this.isEditing = true;
    } else this.isEditing = false;
  };

  // 유저 사진 정보 POST
  postMyPhoto = async navigation => {
    const photoPath = await axios
      .post(
        `${SERVER_URL}/photo/profile`,
        { photoPath: this.myPhotoPath },
        defaultCredential,
      )
      .then(res => {
        this.myUri = res.data.photoPath;
        this.myPhotoPath = null;
        return res.data.photoPath;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation, this.postMyPhoto);
      });
    return photoPath;
  };

  // 유저 사진 제거
  deleteMyPhoto = async navigation => {
    const photoPath = await axios
      .post(`${SERVER_URL}/photo/profile/delete`, defaultCredential)
      .then(res => {
        this.myUri = null;
        return true;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation, this.deleteMyPhoto);
      });
    return photoPath;
  };

  // 기본 사진 이미지로 변경
  resetDefaultPhoto = async () => {
    if (this.myUri !== this.tempUri && this.isEditing) {
      this.myUri = this.tempUri;
    }
    this.myPhotoPath = null;
    this.isEditing = false;
    return new Promise((resolve, reject) => resolve(true));
  };

  // 비밀번호 변경
  changePW = async navigation => {
    const { PW, confirmPW, reConfirmPW } = this.root.auth;

    if (!PW || !confirmPW || !reConfirmPW) {
      Alert.alert('모든 정보를 입력해주세요!');
      return false;
    }
    if (confirmPW !== reConfirmPW) {
      Alert.alert('비밀번호 확인이 일치하지 않습니다. 다시 입력해주세요!');
      return false;
    }
    if (PW === confirmPW) {
      Alert.alert('바꾸려는 비밀번호와 기존의 비밀번호가 동일합니다.');
      return false;
    }

    const result = await axios
      .patch(
        `${SERVER_URL}/user/changepw`,
        { password: PW, newPassword: confirmPW },
        defaultCredential,
      )
      .then(res => {
        if (res.status === 201) {
          Alert.alert('비밀번호가 성공적으로 변경되었습니다!');
          AsyncStorage.removeItem('changepw');
          this.root.helper.clearInput('auth', 'PW', 'confirmPW', 'reConfirmPW');
          return true;
        }
        return false;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation, this.changePW);
        if (err.response.status === 402) {
          Alert.alert(
            '기존 비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요',
          );
        } else {
          Alert.alert(
            '비밀번호 변경에 실패하였습니다. 관리자에게 문의해주세요',
          );
        }
        return false;
      });
    return result;
  };

  // 비밀번호 찾기
  findPW = async navigation => {
    const { email } = this.root.auth;
    const result = await axios
      .post(`${SERVER_URL}/signup/findpw`, { email }, defaultCredential)
      .then(async res => {
        if (res.status === 201) {
          Alert.alert('임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요');
          this.root.helper.clearInput(
            'auth',
            'email',
            'PW',
            'confirmPW',
            'reConfirmPW',
          );
          await AsyncStorage.setItem('changepw', 'true');
          return true;
        }
        return false;
      })
      .catch(err => {
        if (err.response.status === 401) {
          Alert.alert('가입된 이메일이 아닙니다. 이메일을 확인해주세요');
        } else {
          this.root.auth.expiredTokenHandler(err, navigation, this.findPW);
          Alert.alert('에러가 발생하였습니다. 관리자에게 문의해주세요');
        }
        return false;
      });

    return result;
  };

  // 유저 정보 초기화
  resetUserObservable = () => {
    this.myUri = DEFAULT_USER;
    this.myPhotoPath = null;
    this.myCatList = null;
    this.unFollowedCat = null;
  };
}

decorate(UserStore, {
  myUri: observable,
  tempUri: observable,
  isEditing: observable,
  myPhotoPath: observable,
  myCatList: observable,
  unFollowedCat: observable,
  setMyUri: action,
  getMyCatList: action,
  setEditingMode: action,
  postMyPhoto: action,
  deleteMyPhoto: action,
  resetDefaultPhoto: action,
  changePW: action,
  findPW: action,
  resetUserObservable: action,
});

export default UserStore;
