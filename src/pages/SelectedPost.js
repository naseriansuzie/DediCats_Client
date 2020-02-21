import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import CatSelectedPost from '../components/catInfo/catTabs/CatSelectedPost';
import CatCommentInput from '../components/catInfo/catTabs/CatCommentInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  keyboardAvoiding: {
    flex: 1,
    width: '100%',
  },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
});

class SelectedPost extends React.Component {
  componentDidMount() {
    this.handleAndroidBackButton();
  }

  componentWillUnmount() {
    this.removeAndroidBackButtonHandler();
  }

  handleAndroidBackButton = () => {
    const {
      navigation,
      offUser,
      resetCommentState,
      validateRefreshMode,
    } = this.props;

    BackHandler.addEventListener('hardwareBackPress', async () => {
      await offUser();
      validateRefreshMode();
      resetCommentState();
      navigation.goBack();
      return true;
    });
  };

  removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={styles.keyboardAvoiding}
        >
          <CatSelectedPost style={styles.flex2} />
          <CatCommentInput style={styles.flex1} />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default inject(({ cat, post }) => ({
  offUser: cat.offUser,
  resetCommentState: cat.resetCommentState,
  validateRefreshMode: post.validateRefreshMode,
}))(observer(SelectedPost));
