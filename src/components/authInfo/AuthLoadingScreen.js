import React from 'react';
import axios from 'axios';
import {
  ActivityIndicator, StatusBar, View,
} from 'react-native';

import { SERVER_URL } from 'react-native-dotenv';

class AuthLoadingScreen extends React.Component {
  // lifecycle
  componentDidMount() {
    this.verifyToken();
  }

  async verifyToken() {
    const result = await axios.get(`${SERVER_URL}/`)
      .then((res) => (!!res.data.accessToken)).catch(() => false);

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
