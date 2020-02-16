import { observable, action, computed, decorate, runInAction } from 'mobx';
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

  changePW = () => {
    const { confirmPW, reConfirmPW, myInfo } = this.root.auth;
    if (confirmPW !== reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else {
      const updateInfo = {
        userId: myInfo.userId,
        password: confirmPW,
      };
      axios
        .patch(`${SERVER_URL}/user/changepw`, updateInfo, defaultCredential)
        .then(res => res)
        .catch(err => console.dir(err));
    }
  };
}

decorate(UserStore, {
  myPhoto: observable,
  myCatList: observable,
  unFollowedCat: observable,
  changePW: action,
});

export default UserStore;
