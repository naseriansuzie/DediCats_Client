import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';

const AppNavigator = createStackNavigator({
  Home: {
    screen: Signin,
  },
  Second: {
    screen: Signup,
  },
},
{
  initialRouteName: 'Home',
});

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});

export default function App() {
  return (
    // <Provider>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    <AppContainer />
    // {/* </View> */}
    // </Provider>
  );
}
