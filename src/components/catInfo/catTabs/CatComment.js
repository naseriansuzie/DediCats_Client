import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem, Left, Body, Right, Thumbnail } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  marginRight10: {
    marginRight: 10,
  },
});

const defaultPhotoUrl = [
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512',
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512',
][Math.floor(Math.random() * 2)];
// const defaultPhotoUrl =
//   'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg';

const CatComment = ({
  myPhoto,
  userNickname,
  comment,
  date,
  changeToDateTime,
}) => (
  <ListItem thumbnail style={styles.container}>
    <Left>
      <Thumbnail
        square
        source={{ uri: myPhoto || defaultPhotoUrl }}
        style={styles.radius}
      />
    </Left>
    <Body>
      <View>
        <Text>{userNickname}</Text>
        <Text>{comment}</Text>
      </View>
    </Body>
    <Right style={styles.marginRight10}>
      <Text>{changeToDateTime(date)}</Text>
    </Right>
  </ListItem>
);

export default inject(({ cat }) => ({
  changeToDateTime: cat.changeToDateTime,
}))(observer(CatComment));
