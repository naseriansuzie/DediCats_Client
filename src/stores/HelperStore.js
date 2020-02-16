import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const defaultCredential = { withCredentials: true };

class HelperStore {
  constructor(root) {
    this.root = root;
  }

  updateInput = (field, text) => {
    // From CatStore
    console.log('text ', text);
    this.root.cat[field] = text;
    console.log(this.root.cat[field]);
  };

  clearInput = (...types) => {
    // From CatStore
    types.forEach(type => {
      runInAction(() => {
        this.root.cat[type] = '';
      });
    });
  };

  clearAllInput = (type) => {
    // From CatStore
    if (type === 'addCatBio') {
      this.addCatBio = {
        location: null,
        photoPath: null,
        uri: null,
        catNickname: '',
        catDescription: '',
        catSpecies: '',
        cutClicked: { Y: false, N: false, unknown: false },
        cut: { Y: 0, N: 0, unknown: 0 },
      };
    }
  };

  validateAddInput = type => {
    // From CatStore
    if (this.root.cat[type]) {
      return true;
    }
    Alert.alert('글을 입력하신 후 등록해주세요!');
    return false;
  };

  unFollowCat = () => {
    const catId = this.root.cat.selectedCat[0].id;
    axios
      .post(`${SERVER_URL}/cat/unfollow`, { catId }, defaultCredential)
      .then(res => {
        this.root.user.unFollowedCat = catId;
        runInAction(() => {
          this.root.getSelectedCatInfo(catId);
          this.root.getFollowerList(catId);
        });
      })
      .catch(err => console.dir(err));
  };

  pickImage = async type => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
      base64: true,
    });
    if (!result.cancelled) {
      const imageTarget = `data:image/jpeg;base64,${result.base64}`;
      this.root.cat[type].uri = result.uri;
      this.root.cat[type].photoPath = imageTarget;
    }
  };

  removePhoto = () => {
    // if (addCatPhoto) {
    //   new Photo -> this.cat.removeCatPhoto;
    // } else if (new post Photo) {
    //   null this.post.removePostPhoto;
    // } els if (user) {
    //   default photo this.user.removeUserPhoto;
    // }
    // From Cat Store
    this.uri = null;
  };

  // * Helper Store from CatStore
  makeDateTime = () => {
    const YYYY = new Date().getFullYear();
    const MM = new Date().getMonth() > 8
      ? new Date().getMonth()
      : `0${new Date().getMonth() + 1}`;
    const DD = new Date().getDate() > 9
      ? new Date().getDate()
      : `0${new Date().getDate()}`;
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
    let dateStr = `${str.substring(0, 4)}/${str.substring(
      5,
      7,
    )}/${str.substring(8, 10)} ${str.substring(11, 16)}`;

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
  clearAllInput: action,
  unFollowCat: action,
  pickImage: action,
  removePhoto: action,
  makeDateTime: action,
  changeToDateTime: action,
  convertDateTime: action,
  validateAddInput: action,
});
export default HelperStore;
