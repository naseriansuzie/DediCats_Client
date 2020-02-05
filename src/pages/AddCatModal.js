import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AddCatModal = () => (
  <View style={styles.container}>
    <Text>Add cat!</Text>
  </View>
);

export default AddCatModal;

AddCatModal.navigationOptions = ({ navigation }) => {
  const onBack = () => {
    Alert.alert(
      '정말 나가시겠습니까?',
      '작성한 내용이 사라집니다. 그래도 나가시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };

  return {
    title: '길고양이 등록하기',
    headerLeft: () => <HeaderBackButton onPress={() => onBack()} />,
  };
};
