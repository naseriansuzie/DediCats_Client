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

const AddCat = () => (
  <View style={styles.container}>
    <Text>Add cat!</Text>
  </View>
);

export default AddCat;
