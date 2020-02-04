import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CatFollowerList = () => (
  <View style={styles.container}>
    <Text>cat follower list</Text>
  </View>
);

export default CatFollowerList;
