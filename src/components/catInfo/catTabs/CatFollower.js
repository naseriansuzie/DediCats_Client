import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
});

const DEFAULT_USER =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_USER.png';

const CatFollower = ({ idx, myPhoto, userNickName }) => {
  if (typeof idx === 'number') {
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail
            square
            source={{ uri: myPhoto || DEFAULT_USER }}
            style={styles.radius}
          />
        </Left>
        <Body>
          <Text>{userNickName}</Text>
        </Body>
      </ListItem>
    );
  }
  return <View />;
};

export default CatFollower;
