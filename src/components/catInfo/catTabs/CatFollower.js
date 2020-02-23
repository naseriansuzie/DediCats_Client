import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
});

const DEFAULT_USER_URL =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_USER.png';

const CatFollower = ({ idx, myPhoto, userNickName, catName }) => {
  if (typeof idx === 'number') {
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail
            square
            source={{ uri: myPhoto || DEFAULT_USER_URL }}
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
