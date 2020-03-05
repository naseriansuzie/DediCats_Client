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

  // observables
  // 가입 여부 확인하는 boolean
  isSignUp = false;

  // 이메일
  email = '';

  // 닉네임
  nickname = '';

  // 패스워드 확인
  confirmPW = '';

  // 패스워드 재확인
  reConfirmPW = '';

  // 패스워드
  PW = '';

  // 이메일 확인
  emailVerification = '';

  // 이메일 확인 코드
  emailCode = '';

  // 유저 정보
  userInfo = null;

  // actions
  // email 형식 확인
  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // sign up input form 확인
  validateSignUp = () => {
    let isValidated = false;
    if (!this.validateEmail(this.email)) {
      Alert.alert('올바른 이메일 주소를 넣어주세요!(ex: hello@cat.com)');
    } else if (this.confirmPW !== this.reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else if (this.email && this.confirmPW && this.nickname) {
      isValidated = true;
    } else {
      Alert.alert('모든 정보를 입력해주세요.');
    }
    return isValidated;
  };

  // email 증명 확인
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
        return false;
      });

    return result;
  };

  // 가입하려는 회원 정보 서버로 POST
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

  // 로그인 하려는 정보 서버로 POST
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
        const { refreshToken } = res.data;
        await AsyncStorage.setItem('refreshToken', refreshToken);
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert(
            '회원 정보가 일치하지 않습니다. 이메일 또는 비밀번호를 확인해주세요.',
          );
        }
        return false;
      });
    return result;
  };

  // 로그아웃 요청 POST & 토큰 제거
  signOut = async () => {
    const { user, map, cat } = this.root;
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const result = await axios
      .post(`${AUTH_SERVER}/auth/signout`, { refreshToken }, defaultCredential)
      .then(async res => {
        await AsyncStorage.removeItem('user');
        user.resetUserObservable();
        map.hideBriefCat();
        cat.resetRainbowReport();
        await AsyncStorage.removeItem('refreshToken');
        Alert.alert('로그아웃 되었습니다!');
        this.userInfo = null;
        return true;
      })
      .catch(err => {
        Alert.alert(
          '로그아웃에 실패하였습니다. 다시한번 시도해보시고, 문제가 지속될경우 문의해주세요',
        );
        return false;
      });
    return result;
  };

  // 유저 정보 AsyncStorage 에 저장
  getMyInfo = async () => {
    const userStr = await AsyncStorage.getItem('user');
    this.userInfo = JSON.parse(userStr);
  };

  // 사진 촬영 권한
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('사진을 올리기 위해 접근 권한이 필요합니다.');
      }
    }
  };

  // 만료된 토큰 처리
  expiredTokenHandler = async (err, navigation, ...args) => {
    if (
      (err.response && err.response.status === 401) || err.code === 'ECONNABORTED'
    ) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      // accessToken 요청
      const statusCode = await axios
        .post(`${AUTH_SERVER}/auth/token`, { refreshToken }, defaultCredential)
        .then(res => {
          const { accessToken } = res.data;
          if (!accessToken) return false;
          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          return res.status;
        })
        .catch(err => {
          return err.response.status;
        });
      if (statusCode === 200) {
        // accessToken 정상 도착
        const func = args[0];
        const params = args.slice(1);
        func(...params);
      }
      if (statusCode === 401) {
        // refreshToken이 만료된 상태
        Alert.alert('로그인이 필요합니다.');
        await this.signOut();
        navigation.navigate('AuthLoading');
      }
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
  validateEmail: action,
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
