import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
  },
});

const defaultPhotoUrl =
  'https://scontent-gmp1-1.xx.fbcdn.net/v/t1.0-9/35362350_2128812463813083_109129312195575808_o.jpg?_nc_cat=100&_nc_ohc=UfkbqZH71McAX849PZo&_nc_ht=scontent-gmp1-1.xx&oh=e8d961f7d73f856eb7c5e9c42dfa4259&oe=5EF62D35';
const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const MyCat = ({ catPhoto, address, catNickname }) => (
  <ListItem thumbnail>
    <Left>
      <Thumbnail
        square
        source={{ uri: catPhoto || DEFAULT_CAT }}
        style={styles.radius}
      />
    </Left>
    <Body>
      <Text>{catNickname}</Text>
      <Text note>{address}</Text>
    </Body>
  </ListItem>
);

export default MyCat;
