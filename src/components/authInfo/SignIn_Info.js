import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SignIn_Info = props => (
  <View style={styles.container}>
    <Text>Sign-In!</Text>
    <Button
      title="Sign in!"
      onPress={() => props.navigation.navigate('AuthLoading')}
    />
    <Button
      title="Sign up!"
      onPress={() => props.navigation.navigate('Signup')}
    />
  </View>
);

export default withNavigation(SignIn_Info);
