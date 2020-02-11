import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CatPost from './CatPost';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
});

const CatPostList = () => (
  <View style={styles.container}>
    <View style={styles.radiusView}>
      <CatPost />
      <CatPost />
    </View>
  </View>
);

export default CatPostList;
