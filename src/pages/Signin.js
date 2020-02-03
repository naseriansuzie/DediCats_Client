import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Signin extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Sign-In!
        </Text>
        <Button
          title="Sign up!"
          onPress={() => this.props.navigation.navigate('Second')}
        />
      </View>
    );
  }
}

export default Signin;
