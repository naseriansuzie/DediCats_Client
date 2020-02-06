import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import AddCatForm from '../components/addCat/AddCatForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AddCatModal = () => (
  <View style={styles.container}>
    <AddCatForm />
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
    title: 'Add Cat',
    headerLeft: () => <HeaderBackButton onPress={() => onBack()} />,
  };
};
