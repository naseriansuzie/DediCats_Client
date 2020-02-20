import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#677df1',
  },
  btnTxt: {
    color: '#677ef1',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const MyCat = ({ catId, catPhoto, address, catNickname, unFollowCat }) => (
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
    <Right>
      <TouchableOpacity style={styles.btn} onPress={() => unFollowCat(catId)}>
        <Text style={styles.btnTxt}>Unfollow</Text>
      </TouchableOpacity>
    </Right>
  </ListItem>
);

export default inject(({ helper }) => ({
  unFollowCat: helper.unFollowCat,
}))(observer(MyCat));
