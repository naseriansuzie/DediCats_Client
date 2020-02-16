import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';


const defaultCredential = { withCredentials: true };

class HelperStore {
  constructor(root) {
    this.root = root;
  }

  // cat(info) -> selectedCat, inputContent, inputComment, newTag
  // auth -> email, nickname, confirmPW, reConfirmPW, PW, emailVerification
  // cat(addCat) -> catNickname, catSpecies, catDescription
  updateInput = (store, variable, text) => {
    this.root[store][variable] = text;
  };

  // auth: 'email', 'nickname', 'confirmPW', 'reConfirmPW', 'emailVerification', 'PW',
  // selectedCatNewTag, inputComment -> selectedCatInputComment
  clearInput = (store, ...variable) => {
    variable.forEach((el) => {
      runInAction(() => {
        this.root[store][el] = '';
      });
    });
  };

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
  validateAddInput = (type) => {
    if (this.root.cat[type]) {
      return true;
    }
    Alert.alert('글을 입력하신 후 등록해주세요!');
    return false;
  };

  unFollowCat = () => {
    const { cat, user } = this.root;
    const catId = cat.selectedCatBio[0].id;
    axios
      .post(`${SERVER_URL}/cat/unfollow`, { catId }, defaultCredential)
      .then((res) => {
        user.unFollowedCat = catId;
        runInAction(() => {
          cat.getSelectedCatInfo(catId);
          cat.getFollowerList(catId);
        });
      })
      .catch((err) => console.dir(err));
  };

  pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
      base64: true,
    });
    if (!result.cancelled) {
      const imageTarget = `data:image/jpeg;base64,${result.base64}`;
      this.root.cat[`${type}Uri`] = result.uri;
      this.root.cat[`${type}PhotoPath`] = imageTarget;
    }
  };

  removePhoto = () => {
    this.root.cat.selectedCatUri = null;
  };

  // * Helper Store from CatStore
  makeDateTime = () => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const YYYY = date.getFullYear();
    const MM = month > 8 ? month : `0${month + 1}`;
    const DD = date > 9 ? date : `0${date}`;
    return `${YYYY}-${MM}-${DD}`;
  };

  changeToDateTime = (timeInfo) => {
    const dateTimeArr = timeInfo
      .split('T')
      .join(' ')
      .split('.')[0]
      .split(' ');
    return dateTimeArr[0];
  };

  convertDateTime = (str) => {
    let dateStr = `${str.substring(0, 4)}/${str.substring(5, 7)}/${str.substring(8, 10)} ${str.substring(11, 16)}`;

    if (dateStr[11] === '1') {
      const convertedHour = Number(dateStr.substring(11, 13)) - 12;
      dateStr = `${dateStr.substring(0, 10)} 오후 ${String(convertedHour)
      + dateStr.substring(13, 19)}`;
    } else {
      dateStr = `${dateStr.substring(0, 10)} 오전 ${dateStr.substring(12, 19)}`;
    }
    return dateStr;
  };

  // * Helper Store from CatStore
}

decorate(HelperStore, {
  updateInput: action,
  clearInput: action,
  clearAddCatBio: action,
  validateAddInput: action,
  unFollowCat: action,
  pickImage: action,
  removePhoto: action,
  makeDateTime: action,
  changeToDateTime: action,
  convertDateTime: action,
});
export default HelperStore;
