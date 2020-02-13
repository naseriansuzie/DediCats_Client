import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    <Text>selected post</Text>
    <CatCommentInput />
  </View>
);

export default SelectedPost;
