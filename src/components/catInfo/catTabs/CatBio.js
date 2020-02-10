import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CatBio = () => (
  <View style={styles.container}>
    <Text>cat bio info!</Text>
  </View>
);

export default CatBio;
