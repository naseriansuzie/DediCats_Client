import React from 'react';
import { View } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

const defaultPhotoUrl = [
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512',
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512',
][Math.floor(Math.random() * 2)];

const CatFollower = ({ idx, myPhoto, userNickName, catName }) => {
  if (typeof idx === 'number') {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: myPhoto || defaultPhotoUrl }} />
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
