import React from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { AUTH_SERVER } from 'react-native-dotenv';
import {
  ActivityIndicator, StatusBar, View, AsyncStorage,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
  // lifecycle
  async componentDidMount() {
    await this.verifyToken();
  }

  async verifyToken() {
    const { setMyUri } = this.props;
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const result = await axios
      .post(`${AUTH_SERVER}/auth/token`, { refreshToken })
      .then(async (res) => {
        const { accessToken } = res.data;
        if (!accessToken) return false;
        const { photoPath } = res.data.user;
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        setMyUri(photoPath);
        return 'App';
      })
      .catch((e) => 'Auth');

    return this.props.navigation.navigate(result);
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default inject(({ user }) => ({
  setMyUri: user.setMyUri,
}))(observer(AuthLoadingScreen));
