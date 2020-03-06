/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Provider } from 'mobx-react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { HeaderBackButton, createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Signin from './src/pages/Signin';
import Signup from './src/pages/Signup';
import AuthLoadingScreen from './src/pages/AuthLoadingScreen';
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
import AuthStore from './src/stores/AuthStore';
import CreditInfoPage from './src/pages/CreditInfoPage';

const root = new RootStore();

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  titleText: {
    fontSize: height * 0.05,
    color: '#677ef1',
  },
});

const MyPageStack = createStackNavigator(
  {
    MyPage: {
      screen: MyPage,
      navigationOptions: {
        headerTitle: false,
        headerStyle: {
          backgroundColor: '#EDF1F5',
          headerTintColor: '#444444',
          headerTitleStyle: { display: 'none' },
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      },
    },
    EditMyProfile: {
      screen: EditMyProfile,
      navigationOptions: ({ navigation }) => ({
        headerLeft: () => (
          <HeaderBackButton
            onPress={async () => {
              if (root.user.isEditing) {
                await root.user.resetDefaultPhoto();
              }
              navigation.goBack();
            }}
          />
        ),
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
        headerTitleStyle: { display: 'none' },
      }),
    },
    ChangePW: {
      screen: ChangePW,
      navigationOptions: {
        headerTitleStyle: { display: 'none' },
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      },
    },
    CreditInfoPage: {
      screen: CreditInfoPage,
      navigationOptions: {
        headerTitleStyle: { display: 'none' },
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      },
    },
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
    title: '마이페이지',
    tabBarIcon: ({ focused }) => {
      const color = focused ? '#6772F1' : '#767577';
      const size = 30;
      return (
        <MaterialCommunityIcons
          size={size}
          name="account-heart"
          color={color}
        />
      );
    },
    tabBarOptions: { activeTintColor: '#6772F1' },
  };
};

const MainStack = createStackNavigator(
  {
    Main: {
      screen: Main,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => (
          <View style={styles.title}>
            <View>
              <Text style={styles.titleText}>DediCats</Text>
            </View>
            <Image
              source={require('./DediCatsLogo.png')}
              style={{ height: 70, width: 70, right: 10 }}
            />
          </View>
        ),
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }),
    },
    CatInfo: {
      screen: CatInfo,
      navigationOptions: ({ navigation }) => ({
        headerLeft: () => (
          <HeaderBackButton
            tintColor="#ffffff"
            onPress={() => {
              const {
                resetRainbowReport,
                selectedCatRainbowOpen,
                toggleRainbowOpen,
                resetCatCut,
              } = root.cat;
              resetRainbowReport();
              resetCatCut();
              if (selectedCatRainbowOpen === true) {
                toggleRainbowOpen();
              }
              navigation.goBack();
            }}
          />
        ),
        headerTitleStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#6772F1',
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }),
    },
    SelectedPost: {
      screen: SelectedPost,
      navigationOptions: ({ navigation }) => ({
        headerLeft: () => (
          <HeaderBackButton
            onPress={async () => {
              await root.comment.offUser(navigation);
              root.post.validateRefreshMode(navigation);
              root.comment.resetCommentState('back');
              root.comment.resetModifyComment();
              navigation.goBack();
            }}
          />
        ),
        headerTitle: false,
      }),
    },
    PhotoModal: {
      screen: PhotoModal,
      navigationOptions: ({ navigation }) => ({
        headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
        headerTitleStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#6772f1',
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }),
    },
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
    title: 'Home',
    tabBarIcon: ({ focused }) => {
      const color = focused ? '#6772F1' : '#767577';
      const size = 30;
      return (
        <MaterialCommunityIcons size={size} name="home-outline" color={color} />
      );
    },
    tabBarOptions: { activeTintColor: '#6772F1' },
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
    AddCatModal: {
      screen: AddCatModal,
      navigationOptions: {
        headerTitle: false,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      },
    },
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
      navigationOptions: () => ({
        headerShown: false,
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }),
    },
    'Sign Up': {
      screen: Signup,
    },
    'Email Certified': {
      screen: EmailCertified,
      navigationOptions: () => ({
        headerTitle: false,
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }),
    },
    findPW,
  },
  {
    initialRouteName: 'Sign In',
    defaultNavigationOptions: {
      headerTitle: false,
      headerStyle: {
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
    },
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
  console.disableYellowBox = 'true';
  return (
    <Provider {...root}>
      <AppContainer />
    </Provider>
  );
}
