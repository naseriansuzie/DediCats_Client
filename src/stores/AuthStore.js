import { observable, action, decorate, runInAction } from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import axios from 'axios';
import { SERVER_URL, AUTH_SERVER } from 'react-native-dotenv';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const defaultCredential = { withCredentials: true };

class AuthStore {
  constructor(root) {
    this.root = root;
  }

  isSignUp = false;

  email = '';

  nickname = '';

  confirmPW = '';

  reConfirmPW = '';

  PW = '';

  emailVerification = '';

  emailCode = '';

  userInfo = null;

  // actions
  validateSignUp = () => {
    let isValidated = false;
    if (this.confirmPW !== this.reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else if (this.email && this.confirmPW && this.nickname) {
      isValidated = true;
    } else {
      Alert.alert('모든 정보를 입력해주세요.');
    }
    return isValidated;
  };

  emailCertified = async () => {
    const { email, nickname } = this;
    const result = await axios
      .post(
        `${SERVER_URL}/signup/email`,
        { email, nickname },
        defaultCredential,
      )
      .then(res => {
        this.emailCode = res.data;
        Alert.alert(`${email}로 이메일 전송이 성공하였습니다!`);
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert('이미 가입된 이메일입니다. 로그인을 해주세요!');
        } else {
          Alert.alert('이메일 전송에 실패하였습니다. 관리자에게 문의해주세요.');
        }

        console.dir(err);
        return false;
      });

    return result;
  };

  signUp = async () => {
    const { email, confirmPW, nickname } = this;
    const result = await axios
      .post(
        `${SERVER_URL}/signup/`,
        { email, password: confirmPW, nickname },
        defaultCredential,
      )
      .then(res => {
        if (res.status !== 201) return false;

        this.isSignUp = true;
        Alert.alert('회원가입에 성공했습니다!');
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 409) {
          Alert.alert('이미 존재하는 아이디입니다. 로그인 해주세요!');
        }
        console.dir(err);
        return false;
      });

    if (!result) {
      Alert.alert('회원가입에 실패하였습니다. 관리자에게 문의해주세요!');
    }

    runInAction(() => {
      this.root.helper.clearInput(
        'auth',
        'email',
        'nickname',
        'confirmPW',
        'reConfirmPW',
        'emailVerification',
      );
    });

    return true;
  };

  signIn = async () => {
    const { email, PW } = this;
    const result = await axios
      .post(
        `${AUTH_SERVER}/auth/signin`,
        { email, password: PW },
        defaultCredential,
      )
      .then(async res => {
        if (res.status !== 201) return false;

        runInAction(() => {
          this.root.helper.clearInput(
            'auth',
            'email',
            'PW',
            'confirmPW',
            'reConfirmPW',
          );
        });
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert(
            '회원 정보가 일치하지 않습니다. 이메일 또는 비밀번호를 확인해주세요.',
          );
        }
        console.dir('err : ', err);
        return false;
      });
    return result;
  };

  signOut = async () => {
    const { user } = this.root;
    const result = await axios
      .post(`${AUTH_SERVER}/auth/signout`, defaultCredential)
      .then(async res => {
        await AsyncStorage.removeItem('user');
        user.resetUserObservable();
        Alert.alert('로그아웃 되었습니다!');
        this.userInfo = null;
        return true;
      })
      .catch(err => {
        console.dir(err);
        Alert.alert('로그아웃에 실패하였습니다. 관리자에게 문의해주세요');
        return false;
      });
    return result;
  };

  getMyInfo = async () => {
    const userStr = await AsyncStorage.getItem('user');
    this.userInfo = JSON.parse(userStr);
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('사진을 올리기 위해 접근 권한이 필요합니다.');
      }
    }
  };

  expiredTokenHandler = async (err, navigation) => {
    if (err.response && err.response.status === 401) {
      Alert.alert('다시 로그인해주십시오.');
      await this.signOut();
      navigation.navigate('AuthLoading');
    }
  };
}

decorate(AuthStore, {
  isSignUp: observable,
  email: observable,
  nickname: observable,
  confirmPW: observable,
  reConfirmPW: observable,
  PW: observable,
  emailVerification: observable,
  emailCode: observable,
  userInfo: observable,
  validateSignUp: action,
  emailCertified: action,
  signUp: action,
  signIn: action,
  signOut: action,
  getMyInfo: action,
  getPermissionAsync: action,
  expiredTokenHandler: action,
});
export default AuthStore;
