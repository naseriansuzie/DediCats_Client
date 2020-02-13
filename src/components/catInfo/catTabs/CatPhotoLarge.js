import React from 'react';
import { StyleSheet, Image, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  defaultPhoto: {
    width: 350,
    height: 350,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 5,
  },
});

const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const CatPhotoLarge = ({ path }) => (
  <TouchableHighlight>
    <Image style={styles.defaultPhoto} source={{ uri: path || DEFAULT_CAT }} />
  </TouchableHighlight>
);

export default CatPhotoLarge;
