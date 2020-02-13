import React from 'react';
import { StyleSheet, Image, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  defaultPhoto: {
    width: 115,
    height: 115,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 5,
    marginHorizontal: 1,
  },
});

const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const CatPhoto = ({ path, photo, selectPhoto, navigation }) => (
  <TouchableHighlight
    onPress={async () => {
      await selectPhoto(photo);
      navigation.navigate('PhotoModal');
    }}
  >
    <Image style={styles.defaultPhoto} source={{ uri: path || DEFAULT_CAT }} />
  </TouchableHighlight>
);

export default withNavigation(CatPhoto);
