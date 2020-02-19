import React from 'react';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const EditMyProfile = ({ clearInput, navigation }) => (
  <View style={styles.container}>
    <Text>Editing My Profile</Text>
    <Button
      title="비밀번호 수정"
      onPress={() => {
        clearInput('auth', 'email', 'PW', 'nickname', 'confirmPW', 'reConfirmPW');
        navigation.navigate('ChangePW');
      }}
    />
  </View>
);

export default inject(({ helper }) => ({
  clearInput: helper.clearInput,
}))(observer(EditMyProfile));
