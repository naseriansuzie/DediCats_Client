import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class HelperStore {
  constructor(root) {
    this.root = root;
  }
}

export default HelperStore;
