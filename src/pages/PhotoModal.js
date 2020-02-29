import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, BackHandler } from 'react-native';
import CatPhotoLarge from '../components/catInfo/catTabs/CatPhotoLarge';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 20,
  },
});

class PhotoModal extends React.Component {
  componentDidMount() {
    this.handleAndroidBackButton();
  }

  componentWillUnmount() {
    this.removeAndroidBackButtonHandler();
  }

  handleAndroidBackButton = () => {
    const { navigation } = this.props;

    BackHandler.addEventListener('hardwareBackPress', async () => {
      navigation.goBack();
      return true;
    });
  };

  removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  };

  render() {
    const { selectedCatPhoto } = this.props;
    if (selectedCatPhoto) {
      return (
        <View style={styles.container}>
          <CatPhotoLarge path={selectedCatPhoto.path} />
        </View>
      );
    }
    return <View />;
  }
}

export default inject(({ cat }) => ({
  selectedCatPhoto: cat.selectedCatPhoto,
}))(observer(PhotoModal));
