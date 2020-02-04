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

const SelectedPost = () => (
  <View style={styles.container}>
    <Text>selected post</Text>
  </View>
);

export default SelectedPost;
