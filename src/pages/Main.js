import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Main = props => (
  <View style={styles.container}>
    <Text>This is Main Page!</Text>
    <Button
      title="Move to Cat Info"
      onPress={() => props.navigation.navigate('CatInfo')}
    />
  </View>
);

export default Main;
