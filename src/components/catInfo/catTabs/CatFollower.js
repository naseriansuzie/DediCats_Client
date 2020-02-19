import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
    // borderWidth: 1,
    // borderColor: '#edf1f5'
  },
});

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512';
// const defaultPhotoUrl =
//   'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg';

const CatFollower = ({ idx, myPhoto, userNickName, catName }) => {
  if (typeof idx === 'number') {
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail
            square
            source={{ uri: myPhoto || defaultPhotoUrl }}
            style={styles.radius}
          />
        </Left>
        <Body>
          <Text>{userNickName}</Text>
          <Text note>{`${catName}의 ${idx + 1}번째 지킴이`}</Text>
        </Body>
      </ListItem>
    );
  }
  return <View />;
};

export default CatFollower;
