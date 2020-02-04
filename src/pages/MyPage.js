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

const MyPage = props => (
  <View style={styles.container}>
    <Text>This is My Page!</Text>
    <Button
      title="회원정보 수정"
      onPress={() => props.navigation.navigate('EditMyProfile')}
    />
  </View>
);

export default MyPage;
