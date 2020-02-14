import React from 'react';
import { StyleSheet, View } from 'react-native';
import CatSelectedPost from '../components/catInfo/catTabs/CatSelectedPost';
import CatCommentInput from '../components/catInfo/catTabs/CatCommentInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SelectedPost = () => (
  <View style={styles.container}>
    <CatSelectedPost />
    <CatCommentInput />
  </View>
);

export default SelectedPost;
