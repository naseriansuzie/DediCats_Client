import React from 'react';
import axios from 'axios';
import { ActivityIndicator, StatusBar, View, AsyncStorage } from 'react-native';

import { AUTH_SERVER } from 'react-native-dotenv';
import { inject, observer } from 'mobx-react';

class AuthLoadingScreen extends React.Component {
  // lifecycle
  async componentDidMount() {
    await this.verifyToken();
  }

  async verifyToken() {
    const result = await axios
      .post(`${AUTH_SERVER}/auth/token`)
      .then(async res => {
        if (!res.data.accessToken) return false;

        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        return 'App';
      })
      .catch(e => {
        console.log(e);
        return 'Auth';
      });

    return this.props.navigation.navigate(result);
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

export default inject(({ auth }) => ({
  getMyInfo: auth.getMyInfo,
}))(observer(AuthLoadingScreen));
