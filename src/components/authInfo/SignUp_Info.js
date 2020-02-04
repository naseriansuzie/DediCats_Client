import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Signup extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Sign-Up!</Text>
        <Button
          title="Submit"
          onPress={() => this.props.navigation.navigate('Signin')}
        />
      </View>
    );
  }
}

export default withNavigation(Signup);
