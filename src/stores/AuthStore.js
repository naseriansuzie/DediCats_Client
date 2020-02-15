import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

class AuthStore {
  constructor(root) {
    this.root = root;
  }
}

export default AuthStore;
