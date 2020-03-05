import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  list: { paddingLeft: 10 },
  radius: {
    borderRadius: 15,
  },
  body: { paddingRight: 20 },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#677df1',
  },
  btnTxt: {
    color: '#6772F1',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const DEFAULT_CAT =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_CAT.png';

const MyCat = ({
  navigation,
  catId,
  catPhoto,
  address,
  catNickname,
  getSelectedCatInfo,
  unFollowCat,
  resetPostState,
}) => (
  <ListItem thumbnail style={styles.list}>
    <TouchableWithoutFeedback
      onPress={async () => {
        const result = await getSelectedCatInfo(catId, navigation);
        if (result) {
          resetPostState();
          navigation.navigate('CatInfo');
        }
      }}
    >
      <Left>
        <Thumbnail
          square
          source={{ uri: catPhoto || DEFAULT_CAT }}
          style={styles.radius}
        />
      </Left>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback
      onPress={async () => {
        const result = await getSelectedCatInfo(catId, navigation);
        if (result) {
          resetPostState();
          navigation.navigate('CatInfo');
        }
      }}
    >
      <Body style={styles.body}>
        <Text>{catNickname}</Text>
        <Text note>{address}</Text>
      </Body>
    </TouchableWithoutFeedback>
    <Right>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => unFollowCat(catId, navigation)}
      >
        <Text style={styles.btnTxt}>Unfollow</Text>
      </TouchableOpacity>
    </Right>
  </ListItem>
);

export default inject(({ cat, post }) => ({
  getSelectedCatInfo: cat.getSelectedCatInfo,
  unFollowCat: cat.unFollowCat,
  resetPostState: post.resetPostState,
}))(observer(withNavigation(MyCat)));
