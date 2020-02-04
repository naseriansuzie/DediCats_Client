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

const EditMyProfile = props => (
  <View style={styles.container}>
    <Text>Editing My Profile</Text>
    <Button
      title="비밀번호 수정"
      onPress={() => props.navigation.navigate('ChangePW')}
    />
  </View>
);

export default EditMyProfile;
