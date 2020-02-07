import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const CatProfile = () => (
  <View style={styles.container}>
    <Text>profile이다옹</Text>
  </View>
);

export default CatProfile;
