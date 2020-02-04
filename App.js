import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';
import AuthLoadingScreen from './src/components/authInfo/AuthLoadingScreen';
import Main from './src/pages/Main';
import CatInfo from './src/pages/CatInfo';
import AddCatTab from './src/pages/AddCatTab';
import AddCatModal from './src/pages/AddCatModal';
import MyPage from './src/pages/MyPage';
import EditMyProfile from './src/pages/EditMyProfile';
import ChangePW from './src/pages/ChangePW';
import SelectedPost from './src/pages/SelectedPost';

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

MyPageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const MainStack = createStackNavigator(
  {
    Main,
    CatInfo,
    SelectedPost,
  },
  {
    initialRouteName: 'Main',
  },
);

MainStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const HomeTabs = createBottomTabNavigator(
  {
    AddCatTab,
    MainStack,
    MyPageStack,
  },
  {
    initialRouteName: 'MainStack',
    defaultNavigationOptions: {
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (navigation.state.key === 'AddCatTab') {
          navigation.navigate('AddCatModal');
        } else {
          defaultHandler();
        }
      },
    },
  },
);

const AppStack = createStackNavigator(
  {
    Home: {
      screen: HomeTabs,
      navigationOptions: {
        header: null,
      },
    },
    AddCatModal,
  },
  {
    initialRouteName: 'Home',
    modal: 'modal',
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
