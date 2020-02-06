/* eslint-disable arrow-parens */
import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert, AsyncStorage } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

/**
 * 1. user 관련 정보
 *  - isSignUp, email, nickName, confirmPW, reConfirmPW
 *  - isSignIn, email, PW
 *  - myInfo = {userId:user_id, nickname: nickname, created_at:Date, user_photo: url}
 *    myInfo는 로그인할 때 응답으로 오는 데이터 객체
 *  - myPhoto = 업로드할 이미지 파일(기본이 defaultPhotoUrl)
 *
 * 2. my cat 관련 정보
 *  - myCatList = [{내가 팔로우하는 고양이 정보}]
 *  - unfollowedCat = {고양이정보(catID)}
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
  userInfo = {
    isSignUp: false,
    isSignIn: false,
    email: '',
    nickName: '',
    confirmPW: '',
    reConfirmPW: '',
    PW: '',
    myInfo: null,
    myPhoto: defaultPhotoUrl,
  };

  myCat = {
    list: null,
    unFollowedCat: null,
  };

  // actions
  signUp = info => {
    axios
      .post(`${process.env.SERVER_URL}/user/signup`, info, defaultCredential)
      .then(res => {
        Alert.alert('회원가입에 성공했습니다!');
        this.userInfo.isSignUp = true;
      })
      .catch(err => {
        if (err.response.status === 401) {
          Alert.alert('이미 존재하는 아이디입니다. 로그인 해주세요!');
        } else {
          console.log(err);
        }
      });
  };

  signIn = info => {
    axios
      .post(`${process.env.SERVER_URL}/user/signin`, info, defaultCredential)
      .then(res => {
        this.userInfo.isSignIn = true;
        AsyncStorage.setItem('isLogin', true);
      })
      .catch(err => {
        if (err.response.status === 401) {
          Alert.alert(
            '회원 정보가 일치하지 않습니다. 이메일주소와 비밀번호를 확인해주세요.',
          );
        } else {
          console.log(err);
        }
      });
  };

  signOut = id => {
    axios
      .post(`${process.env.SERVER_URL}/user/signout`, id, defaultCredential)
      .then(res => {
        Alert.alert('로그아웃 되었습니다!');
        this.userInfo.signIn = false;
        this.userInfo.myInfo = null;
      })
      .catch(err => console.log(err));
  };

  updateState = field => {
    if (field === 'SignUp') {
      if (this.userInfo.confirmPW !== this.userInfo.reConfirmPW) {
        Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
      } else {
        const signUpInfo = {
          email: this.userInfo.email,
          password: this.userInfo.confirmPW,
          nickname: this.userInfo.nickName,
        };
        if (
          signUpInfo.email === '' ||
          signUpInfo.password === '' ||
          signUpInfo.nickName === ''
        ) {
          Alert.alert('모든 정보를 입력해주세요.');
        } else {
          this.signUp(signUpInfo);
        }
      }
      runInAction(() => {
        this.clearInput('email', 'nickName', 'confirmPW', 'reConfirmPW');
      });
    } else if (field === 'SignIn') {
      const signIpInfo = {
        email: this.userInfo.email,
        password: this.userInfo.PW,
      };
      this.signIn(signIpInfo);
      runInAction(() => this.clearInput('email', 'PW'));
    } else {
      this.signOut();
    }
  };

  updateInput = (field, text) => {
    this.userInfo[field] = text;
  };

  clearInput = (...types) => {
    types.forEach(type => {
      runInAction(() => {
        this.userInfo[type] = '';
      });
    });
  };

  unFollowCat = catId => {
    axios
      .post(`${process.env.SERVER_URL}/cat/unfollow`, catId, defaultCredential)
      .then(res => res)
      .catch(err => console.log(err));
  };

  uploadMyImg = () => {
    if (this.userInfo.myPhoto !== defaultPhotoUrl) {
      const imgInfo = {
        userId: this.userInfo.myInfo.userId,
        photoPath: this.userInfo.myPhoto,
      };
      axios.post(
        `${process.env.SERVER_URL}/photo/profile`,
        imgInfo,
        defaultPhotoUrl,
      );
    }
  };

  changePW = () => {
    if (this.confirmPW !== this.reConfirmPW) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    } else {
      const updateInfo = {
        userId: this.userInfo.myInfo.userId,
        password: this.userInfo.confirmPW,
      };
      axios
        .patch(
          `${process.env.SERVER_URL}/user/changepw`,
          updateInfo,
          defaultCredential,
        )
        .then(res => res)
        .catch(err => console.log(err));
    }
  };
}

decorate(UserStore, {
  userInfo: observable,
  myCat: observable,
  signUp: action,
  signIn: action,
  signOut: action,
  updateState: action,
  updateInput: action,
  clearInput: action,
  unFollowCat: action,
  uploadMyImg: action,
  changePW: action,
});

export default UserStore;
