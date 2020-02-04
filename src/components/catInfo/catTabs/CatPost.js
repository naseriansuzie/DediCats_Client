import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 20,
  },
});

const CatPost = props => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => props.navigation.navigate('SelectedPost')}
  >
    <Text>cat post</Text>
  </TouchableOpacity>
);

export default withNavigation(CatPost);
