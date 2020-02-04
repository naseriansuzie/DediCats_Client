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

const ChangePW = () => (
  <View style={styles.container}>
    <Text>password change</Text>
  </View>
);

export default ChangePW;
