import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';

class PostStore {
  constructor(root) {
    this.root = root;
  }
}

export default PostStore;
