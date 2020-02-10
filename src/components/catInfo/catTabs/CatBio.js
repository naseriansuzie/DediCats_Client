import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CatBio = () => (
  <View style={styles.container}>
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
    >
      <Text>cat bio info!</Text>
    </View>
  </View>
);

export default CatBio;
