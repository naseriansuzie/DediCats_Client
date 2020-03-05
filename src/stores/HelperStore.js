import { action, decorate, runInAction } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };

class HelperStore {
  constructor(root) {
    this.root = root;
  }

  // 인풋 창 상태 update
  // cat(info) -> selectedCat, inputContent, inputComment, newTag
  // auth -> email, nickname, confirmPW, reConfirmPW, PW, emailVerification
  // cat(addCat) -> catNickname, catSpecies, catDescription
  updateInput = (store, variable, text) => {
    this.root[store][variable] = text;
  };

  // 인풋 창 리셋
  // auth: 'email', 'nickname', 'confirmPW', 'reConfirmPW', 'emailVerification', 'PW',
  // selectedCatNewTag, inputComment -> selectedCatInputComment
  clearInput = (store, ...variable) => {
    variable.forEach(el => {
      runInAction(() => {
        this.root[store][el] = '';
      });
    });
  };

  // 고양이 추가 후/취소할 때 고양이 정보 리셋
  clearAddCatBio = () => {
    // From CatStore
    const { cat } = this.root;
    cat.addCatLocation = { latitude: 37.049784, longitude: 127.049784 };
    cat.addCatPhotoPath = null;
    cat.addCatUri = null;
    cat.addCatNickname = '';
    cat.addCatDescription = '';
    cat.addCatSpecies = '';
    cat.addCatCutClicked = { Y: false, N: false, unknown: false };
    cat.addCatCut = { Y: 0, N: 0, unknown: 0 };
  };

  // selectedCat inputComment, inputContent
  validateAddInput = (store, type) => {
    if (this.root[store][type]) {
      return true;
    }
    Alert.alert('글을 입력하신 후 등록해주세요!');
    return false;
  };

  // ImagePicker를 이용해 이미지 선택
  pickImage = async (store, type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      if ((store === 'user', type === 'my')) {
        this.root[store].tempUri = this.root[store].myUri;
      }
      const imageTarget = `data:image/jpeg;base64,${result.base64}`;
      this.root[store][`${type}Uri`] = result.uri;
      this.root[store][`${type}PhotoPath`] = imageTarget;
    }
    return result;
  };

  // 선택된 사진 제거
  removePhoto = () => {
    this.root.cat.selectedCatUri = null;
  };

  // 시간 string 정리하는 함수
  makeDateTime = () => moment().format('YYYY-MM-DD');

  // 시간 string 정리하는 함수
  changeToDateTime = timeInfo => {
    if (timeInfo === 'today') {
      timeInfo = new Date();
      return JSON.stringify(new Date()).slice(1, 11);
    }
    return timeInfo.slice(0, 10);
  };

  // 시간 string 정리하는 함수
  // 'YYYY/MM/DD HH:MM a/pm
  convertDateTime = str => moment(str).format('YY/MM/DD h:mm a');
}

decorate(HelperStore, {
  updateInput: action,
  clearInput: action,
  clearAddCatBio: action,
  validateAddInput: action,
  pickImage: action,
  removePhoto: action,
  makeDateTime: action,
  changeToDateTime: action,
  convertDateTime: action,
});
export default HelperStore;
