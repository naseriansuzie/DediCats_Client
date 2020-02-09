import React from 'react';
import { inject, observer } from 'mobx-react';
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

class AddCatModal extends React.Component {
  // lifecycle
  componentDidMount() {
    this.props.clearAllInput('addCatBio');
  }

  render() {
    return (
      <View style={styles.container}>
        <AddCatForm />
      </View>
    );
  }
}

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

export default inject(({ cat }) => ({
  clearAllInput: cat.clearAllInput,
}))(observer(AddCatModal));
