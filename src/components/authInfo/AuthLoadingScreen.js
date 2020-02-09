import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';

class AuthLoadingScreen extends React.Component {
  // lifecycle
  componentDidMount() {
    this.verifyToken();
  }

  async verifyToken() {
    const userToken = await AsyncStorage.getItem('userToken');
    // 토큰 붙으면 아래 지우고 옆의 내용으로 적용 return this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    return this.props.navigation.navigate(userToken ? 'App' : 'App');
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
