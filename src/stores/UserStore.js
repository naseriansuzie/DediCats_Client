/* eslint-disable arrow-parens */
import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import axios from 'axios';
import { SERVER_URL, AUTH_SERVER } from 'react-native-dotenv';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

/**
 * 1. user 관련 정보
 *  - isSignUp, email, nickName, confirmPW, reConfirmPW
 *  - isSignIn, email, PW
 *  - info = {userId:user_id, nickname: nickname, created_at:Date, user_photo: url}
 *    myInfo는 로그인할 때 응답으로 오는 데이터 객체
 *  - myPhoto = 업로드할 이미지 파일(기본이 defaultPhotoUrl)
 *
 * 2. my cat 관련 정보
 *  - myCatList = [{내가 팔로우하는 고양이 정보}]
 *  - unfollowed = {고양이정보(catID)}
 */
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
  info = {
    isSignUp: false,
    isSignIn: false,
    email: '',
    nickname: '',
    confirmPW: '',
    reConfirmPW: '',
    PW: '',
    emailVerification: '',
    emailCode: '',
    myInfo:
      // null,
      { userId: 2, nickname: '김집사', created_at: '2020-02-09' },
    myPhoto: defaultPhotoUrl,
  };

  myCat = {
    list: null,
    unFollowed: null,
  };

  emailCertified = async (signUpInfo) => {
    const { email, nickname } = signUpInfo;
    const result = await axios.post(`${SERVER_URL}/signup/email`, { email, nickname }, defaultCredential)
      .then((res) => {
        Alert.alert(`${email}로 이메일 전송이 성공하였습니다!`);
        this.info.emailCode = res.data;
        return true;
      }).catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert('이미 가입된 이메일입니다. 로그인을 해주세요!');
          return false;
        }
        console.dir(err);
      });

    return result;
  };

  // actions
  signUp = async () => {
    const { email, confirmPW, nickname } = this.info;
    const result = await axios
      .post(`${SERVER_URL}/signup/`, { email, password: confirmPW, nickname }, defaultCredential)
      .then((res) => {
        if (res.status !== 201) return false;

        Alert.alert('회원가입에 성공했습니다!');
        this.info.isSignUp = true;

        runInAction(() => {
          this.clearInput('email', 'nickname', 'confirmPW', 'reConfirmPW', 'emailVerification');
        });
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 409) {
          Alert.alert('이미 존재하는 아이디입니다. 로그인 해주세요!');
        } else {
          console.dir(err);
        }
        return false;
      });

    if (!result) {
      Alert.alert('회원가입에 실패하였습니다. 관리자에게 문의해주세요!');
      return false;
    }
    Alert.alert('회원가입에 성공하였습니다!');
    return true;
  };

  signIn = async (info) => {
    const reuslt = await axios
      .post(`${AUTH_SERVER}/auth/signin`, info, defaultCredential)
      .then((res) => {
        if (res.status !== 201) return false;

        this.info.isSignIn = true;
        AsyncStorage.setItem('isLogin', true);
        runInAction(() => {
          this.clearInput('email', 'PW');
        });

        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          Alert.alert('회원 정보가 일치하지 않습니다. 이메일주소와 비밀번호를 확인해주세요.');
        } else console.dir(err);


        return false;
      });
    console.log('reuslt : ', reuslt);
    return reuslt;
  };

  signOut = id => {
    axios
      .post(`${SERVER_URL}/user/signout`, id, defaultCredential)
      .then(async res => {
        await AsyncStorage.clear();
        Alert.alert('로그아웃 되었습니다!');
        this.info.signIn = false;
        this.info.myInfo = null;
      })
      .catch(err => console.dir(err));
  };

  validateSignUp = () => {
    let isValidated = false;
    if (this.info.confirmPW !== this.info.reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else if (this.info.email && this.info.confirmPW && this.info.nickname) {
      isValidated = true;
    } else {
      Alert.alert('모든 정보를 입력해주세요.');
    }
    return isValidated;
  };

  validateSignIn = () => {
    let isValidated = false;
    if (this.info.email && this.info.PW) {
      isValidated = true;
    } else {
      Alert.alert('모든 정보를 입력해주세요.');
    }
    return isValidated;
  };

  updateState = async field => {
    if (field === 'SignUp') {
      const signUpInfo = {
        email: this.info.email,
        password: this.info.confirmPW,
        nickname: this.info.nickname,
      };
      // 실패시 false return
      // 성공시 obj return -> Signup info param로 넣어주면 됨
      const result = await this.emailCertified(signUpInfo);
      return result;
    }
    if (field === 'SignIn') {
      const signIpInfo = {
        email: this.info.email,
        password: this.info.PW,
      };
      const result = await this.signIn(signIpInfo);
      return result;
    }
    this.signOut();
  };

  updateInput = (field, text) => {
    console.log('text ', text);
    this.info[field] = text;
    console.log(this.info[field]);
  };

  clearInput = (...types) => {
    types.forEach(type => {
      runInAction(() => {
        this.info[type] = '';
      });
    });
  };

  unFollowCat = () => {
    const catId = this.root.cat.info.selectedCat[0].id;
    axios
      .post(`${SERVER_URL}/cat/unfollow`, { catId }, defaultCredential)
      .then(res => {
        this.myCat.unFollowed = catId;
        runInAction(() => {
          this.root.cat.getSelectedCatInfo(catId);
        });
      })
      .catch(err => console.dir(err));
  };

  uploadMyImg = () => {
    if (this.info.myPhoto !== defaultPhotoUrl) {
      const imgInfo = {
        userId: this.info.myInfo.userId,
        photoPath: this.info.myPhoto,
      };
      axios.post(`${SERVER_URL}/photo/profile`, imgInfo, defaultPhotoUrl);
    }
  };

  changePW = () => {
    if (this.confirmPW !== this.reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else {
      const updateInfo = {
        userId: this.info.myInfo.userId,
        password: this.info.confirmPW,
      };
      axios
        .patch(`${SERVER_URL}/user/changepw`, updateInfo, defaultCredential)
        .then(res => res)
        .catch(err => console.dir(err));
    }
  };

  // 현재 나의 위치
  currentPosition = {
    latitude: 0,
    longitude: 0,
  };

  addCatMarker = {
    latitude: 0,
    longitude: 0,
  };

  // 현재 화면의 위치
  currentRegion = {
    latitude: 0,
    latitudeDelta: 0,
    longitude: 0,
    longitudeDelta: 0,
  };

  // 현재 화면의 범위
  currentBoundingBox = {
    NElatitude: 0,
    NElongitude: 0,
    SWlatitude: 0,
    SWlongitude: 0,
  };

  permissionState = false;

  requestMapPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.permissionState = true;
        this.getCurrentPosition();
      } else {
        console.log('not Granted');
        this.permissionState = false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        this.onRegionChangeComplete({
          latitude,
          latitudeDelta: 0.005,
          longitude,
          longitudeDelta: 0.005,
        });
      },
      error => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  onRegionChangeComplete = async region => {
    this.currentRegion = { ...region };
    this.currentBoundingBox = {
      NElatitude: region.latitude + region.latitudeDelta / 2, // northLat - max lat
      NElongitude: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      SWlatitude: region.latitude - region.latitudeDelta / 2, // southLat - min lat
      SWlongitude: region.longitude - region.longitudeDelta / 2, // westLng - min lng
    };
  };
}

decorate(UserStore, {
  info: observable,
  myCat: observable,
  currentPosition: observable,
  currentRegion: observable,
  permissionState: observable,
  addCatMarker: observable,
  requestMapPermission: action,
  getCurrentPosition: action,
  getWatchPosition: action,
  setUserLocation: action,
  setUserRegion: action,
  getBoundingBox: action,
  onRegionChangeComplete: action,
  signUp: action,
  signIn: action,
  signOut: action,
  validateSignUp: action,
  validateSignIn: action,
  updateState: action,
  updateInput: action,
  clearInput: action,
  unFollowCat: action,
  uploadMyImg: action,
  changePW: action,
});

export default UserStore;
