import {
  observable, action, computed, decorate, runInAction,
} from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import axios from 'axios';
import { SERVER_URL, AUTH_SERVER } from 'react-native-dotenv';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const defaultCredential = { withCredentials: true };
const defaultPhotoUrl = [
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512',
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512',
][Math.floor(Math.random() * 2)];
class UserStore {
  constructor(root) {
    this.root = root;
  }

  // observable
  myUri = defaultPhotoUrl;

  myPhotoPath = '';

  myCatList = null;

  unFollowedCat = null;

  changePW = async () => {
    const { PW, confirmPW, reConfirmPW } = this.root.auth;
    if (confirmPW !== reConfirmPW) {
      Alert.alert('비밀번호 확인이 일치하지 않습니다. 다시 입력해주세요!');
      return false;
    }
    if (PW === confirmPW) {
      Alert.alert('바꾸려는 비밀번호와 기존의 비밀번호가 동일합니다.');
      return false;
    }

    const result = await axios
      .patch(`${SERVER_URL}/user/changepw`, { password: PW, newPassword: confirmPW }, defaultCredential)
      .then((res) => {
        if (res.status === 201) {
          Alert.alert('비밀번호가 성공적으로 변경되었습니다!');
          this.root.helper.clearInput('auth', 'PW', 'confirmPW', 'reConfirmPW');
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.dir(err);
        if (err.response.status === 402) {
          Alert.alert('기존 비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요');
        } else {
          Alert.alert('비밀번호 변경에 실패하였습니다. 관리자에게 문의해주세요');
        }
        return false;
      });

    return result;
  };
}

decorate(UserStore, {
  myUri: observable,
  myPhotoPath: observable,
  myCatList: observable,
  unFollowedCat: observable,
  changePW: action,
});

export default UserStore;
