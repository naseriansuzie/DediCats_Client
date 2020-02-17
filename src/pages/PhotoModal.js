import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import CatPhotoLarge from '../components/catInfo/catTabs/CatPhotoLarge';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
  },
});

const PhotoModal = ({ selectedCatPhoto }) => {
  if (selectedCatPhoto) {
    return (
      <View style={styles.container}>
        <CatPhotoLarge path={selectedCatPhoto.path} />
      </View>
    );
  }
  return <View />;
};

export default inject(({ cat }) => ({
  selectedCatPhoto: cat.selectedCatPhoto,
}))(observer(PhotoModal));