import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
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

const SelectedPost = () => (
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

export default SelectedPost;
