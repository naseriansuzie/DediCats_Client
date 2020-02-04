import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';
import AuthLoadingScreen from './src/components/authInfo/AuthLoadingScreen';
import Main from './src/pages/Main';
import CatInfo from './src/pages/CatInfo';
import AddCat from './src/pages/AddCat';
import MyPage from './src/pages/MyPage';
import EditMyProfile from './src/pages/EditMyProfile';
import ChangePW from './src/pages/ChangePW';

const MyPageStack = createStackNavigator(
  {
    MyPage,
    EditMyProfile,
    ChangePW,
  },
  {
    initialRouteName: 'MyPage',
  },
);

const MainStack = createStackNavigator(
  {
    Main,
    CatInfo,
  },
  {
    initialRouteName: 'Main',
  },
);

const AddCatStack = createStackNavigator(
  {
    AddCat,
  },
  {
    initialRouteName: 'AddCat',
  },
);

const HomeTabs = createBottomTabNavigator(
  {
    MyPageStack,
    MainStack,
    AddCatStack,
  },
  {
    initialRouteName: 'MainStack',
  },
);

const AppStack = createStackNavigator(
  {
    Home: HomeTabs,
  },
  {
    initialRouteName: 'Home',
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
