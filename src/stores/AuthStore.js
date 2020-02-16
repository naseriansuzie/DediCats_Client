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

  // observable
  isSignUp = false;

  isSignIn = false;

  email = '';

  nickname = '';

  confirmPW = '';

  reConfirmPW = '';

  PW = '';

  emailVerification = '';

  emailCode = '';

  myInfo =
    // null;
    { userId: 2, nickname: '김집사', created_at: '2020-02-09' };

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

  emailCertified = async signUpInfo => {
    const { email, nickname } = signUpInfo;
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
          console.dir(err);
        }
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
      })
      .catch(err => {
        if (err.response && err.response.status === 409) {
          Alert.alert('이미 존재하는 아이디입니다. 로그인 해주세요!');
        } else {
          console.dir(err);
          return false;
        }
      });

    if (!result) {
      Alert.alert('회원가입에 실패하였습니다. 관리자에게 문의해주세요!');
      return false;
    }
    Alert.alert('회원가입에 성공하였습니다!');
    return true;
  };

  validateSignIn = () => {
    let isValidated = false;
    if (this.email && this.PW) {
      isValidated = true;
    } else {
      Alert.alert('모든 정보를 입력해주세요.');
    }
    return isValidated;
  };

  signIn = async info => {
    const result = await axios
      .post(`${AUTH_SERVER}/auth/signin`, info, defaultCredential)
      .then(res => {
        if (res.status !== 201) {
          return false;
        }
        this.isSignIn = true;
        AsyncStorage.setItem('isLogin', true);
        runInAction(() => {
          this.root.helper.clearInput('auth', 'email', 'PW');
        });
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert(
            '회원 정보가 일치하지 않습니다. 이메일주소와 비밀번호를 확인해주세요.',
          );
        } else console.dir(err);
        return false;
      });
    return result;
  };

  signOut = id => {
    axios
      .post(`${SERVER_URL}/user/signout`, id, defaultCredential)
      .then(async res => {
        await AsyncStorage.clear();
        Alert.alert('로그아웃 되었습니다!');
        this.signIn = false;
        this.myInfo = null;
      })
      .catch(err => console.dir(err));
  };

  updateState = async field => {
    if (field === 'SignUp') {
      const signUpInfo = {
        email: this.email,
        password: this.confirmPW,
        nickname: this.nickname,
      };
      // 실패시 false return
      // 성공시 obj return -> Signup info param로 넣어주면 됨
      const result = await this.emailCertified(signUpInfo);
      return result;
    }
    if (field === 'SignIn') {
      const signInInfo = {
        email: this.email,
        password: this.PW,
      };
      const result = await this.signIn(signInInfo);
      return result;
    }
    this.signOut();
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('사진을 올리기 위해 접근 권한이 필요합니다.');
      }
    }
  };
}

decorate(AuthStore, {
  isSignUp: observable,
  isSignIn: observable,
  email: observable,
  nickname: observable,
  confirmPW: observable,
  reConfirmPW: observable,
  PW: observable,
  emailVerification: observable,
  emailCode: observable,
  myInfo: observable,
  validateSignUp: action,
  emailCertified: action,
  signUp: action,
  validateSignIn: action,
  signIn: action,
  signOut: action,
  updateState: action,
  getPermissionAsync: action,
});
export default AuthStore;
