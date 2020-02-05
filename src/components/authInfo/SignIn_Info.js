import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SignIn_Info = ({ navigation, email, updateInput, updateState }) => (
  <View style={styles.container}>
    <Text>Sign-In!</Text>
    <TextInput
      style={{
        width: '80%',
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      placeholder="your email"
      onChangeText={text => updateInput('email', text)}
      value={email}
    />
    <Button
      title="Sign in!"
      onPress={() => {
        updateState('SignIn');
        navigation.navigate('AuthLoading');
      }}
    />
    <Button title="Sign up!" onPress={() => navigation.navigate('Signup')} />
  </View>
);

export default inject(({ user }) => ({
  updateInput: user.updateInput,
  email: user.user.email,
  updateState: user.updateState,
}))(observer(withNavigation(SignIn_Info)));
