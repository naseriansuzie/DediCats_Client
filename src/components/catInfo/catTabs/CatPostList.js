import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CatPost from './CatPost';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    borderColor: 'red',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CatPostList = () => (
  <View style={styles.container}>
    <CatPost />
    <CatPost />
  </View>
);

export default CatPostList;
