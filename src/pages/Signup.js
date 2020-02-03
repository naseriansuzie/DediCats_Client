import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});

class Signup extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Sign-Up!
        </Text>
      </View>
    );
  }
}

export default Signup;