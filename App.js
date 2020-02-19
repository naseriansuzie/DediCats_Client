/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Provider } from 'mobx-react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { HeaderBackButton, createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';
import AuthLoadingScreen from './src/components/authInfo/AuthLoadingScreen';
import Main from './src/pages/Main';
import CatInfo from './src/pages/CatInfo';
import AddCatTab from './src/pages/AddCatTab';
import EmailCertified from './src/pages/EmailCertified';
import AddCatModal from './src/pages/AddCatModal';
import MyPage from './src/pages/MyPage';
import EditMyProfile from './src/pages/EditMyProfile';
import ChangePW from './src/pages/ChangePW';
import SelectedPost from './src/pages/SelectedPost';
import PhotoModal from './src/pages/PhotoModal';
import RootStore from './src/stores';
import findPW from './src/pages/findPW';

const root = new RootStore();

const MyPageStack = createStackNavigator(
  {
    MyPage,
    EditMyProfile,
    ChangePW: { screen: ChangePW, navigationOptions: { headerShown: false } },
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
    CatInfo: {
      screen: CatInfo,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#6772f1',
        },
        headerTintColor: 'white',
        headerTitleStyle: { display: 'none' },
      },
    },
    SelectedPost: {
      screen: SelectedPost,
      navigationOptions: ({ navigation }) => ({
        headerLeft: () => (
          <HeaderBackButton
            onPress={async () => {
              await root.cat.offUser();
              // 여기에 socket disconnect 추가
              navigation.goBack();
            }}
          />
        ),
      }),
    },
    PhotoModal,
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
        headerShown: false,
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
    'Sign In': {
      screen: Signin,
      navigationOptions: {
        headerShown: false,
      },
    },
    'Sign Up': Signup,
    'Email Certified': EmailCertified,
    findPW,
  },
  {
    initialRouteName: 'Sign In',
  },
);

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack,
  },
  { initialRouteName: 'AuthLoading' },
);

const AppContainer = createAppContainer(RootNavigator);

export default function App() {
  return (
    <Provider {...root}>
      <AppContainer />
    </Provider>
  );
}
