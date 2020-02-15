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
    console.log('text ', text);
    this[field] = text;
    console.log(this[field]);
  };

  clearInput = (...types) => {
    types.forEach(type => {
      runInAction(() => {
        this[type] = '';
      });
    });
  };

  unFollowCat = () => {
    const catId = this.root.cat.info.selectedCat[0].id;
    axios
      .post(`${SERVER_URL}/cat/unfollow`, { catId }, defaultCredential)
      .then(res => {
        this.root.user.unFollowedCat = catId;
        runInAction(() => {
          this.root.cat.getSelectedCatInfo(catId);
          this.root.cat.getFollowerList(catId);
        });
      })
      .catch(err => console.dir(err));
  };
}

decorate(HelperStore, {
  updateInput: action,
  clearInput: action,
  unFollowCat: action,
});
export default HelperStore;
