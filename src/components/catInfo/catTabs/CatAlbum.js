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

const CatAlbum = () => (
  <View style={styles.container}>
    <Text>cat photos</Text>
  </View>
);

export default CatAlbum;
