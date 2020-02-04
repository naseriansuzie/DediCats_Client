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

const Main = () => (
  <View style={styles.container}>
    <Text>This is Main Page!</Text>
  </View>
);

export default Main;
