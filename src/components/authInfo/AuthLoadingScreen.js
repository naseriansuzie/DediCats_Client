import React from 'react';
import axios from 'axios';
import {
  ActivityIndicator, StatusBar, View, AsyncStorage,
} from 'react-native';

import { AUTH_SERVER } from 'react-native-dotenv';

class AuthLoadingScreen extends React.Component {
  // lifecycle
  componentDidMount() {
    this.verifyToken();
  }

  async verifyToken() {
    const result = await axios.post(`${AUTH_SERVER}/auth/token`)
      .then(async (res) => {
        if (!res.data.accessToken) return false;
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        return true;
      }).catch((e) => {
        console.log(e);
        return false;
      });
    return this.props.navigation.navigate(result ? 'App' : 'Auth');
  }

  render() {
    console.disableYellowBox = 'true';
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
