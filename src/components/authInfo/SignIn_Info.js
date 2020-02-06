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

const SignIn_Info = ({ email, navigation, updateInput, updateState }) => {
  console.log('프롭스는 = ', email);
  return (
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
        onPress={async () => {
          await updateState('SignIn');
          navigation.navigate('AuthLoading');
        }}
      />
      <Button title="Sign up!" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

export default inject(({ user }) => ({
  updateInput: user.updateInput,
  email: user.userInfo.email,
  updateState: user.updateState,
}))(observer(withNavigation(SignIn_Info)));
