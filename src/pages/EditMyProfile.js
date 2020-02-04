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

const EditMyProfile = () => (
  <View style={styles.container}>
    <Text>Editing My Profile</Text>
  </View>
);

export default EditMyProfile;
