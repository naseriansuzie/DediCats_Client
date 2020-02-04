import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';
import AuthLoadingScreen from './src/components/authInfo/AuthLoadingScreen';
import Main from './src/pages/Main';

const AppStack = createStackNavigator(
  {
    Main,
  },
  {
    initialRouteName: 'Main',
  },
);

const AuthStack = createStackNavigator(
  {
    Signin,
    Signup,
  },
  {
    initialRouteName: 'Signin',
  },
);

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  { initialRouteName: 'AuthLoading' },
);

const AppContainer = createAppContainer(RootNavigator);

export default function App() {
  return (
    // <Provider>
    <AppContainer />
    // </Provider>
  );
}
