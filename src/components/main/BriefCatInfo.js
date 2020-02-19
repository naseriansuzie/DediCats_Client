import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: 'white',
    height: 210,
    width: 345,
    paddingHorizontal: 20,
    paddingTop: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#677ef1',
  },
  closeBtn: {
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 5,
    fontSize: 20,
  },
  cardImg: {
    height: 110,
    width: 110,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  nickName: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 15,
    paddingTop: 10,
  },
  intro: {
    fontSize: 15,
    color: '#444',
    paddingVertical: 5,
    flexWrap: 'wrap',
  },
  btn: {
    width: '35%',
    alignSelf: 'center',
    marginLeft: 55,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#677ef1',
  },
  btnTxt: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  row: { flexDirection: 'row' },
  row45: { width: '45%' },
  row55: { width: '55%' },
});

const BriefCatInfo = ({
  getSelectedCatInfo,
  followCat,
  unFollowCat,
  item,
  navigation,
  hideBriefCat,
  resetPostState,
}) => (
  <View style={styles.card}>
    <View>
      <View style={styles.closeBtn}>
        <TouchableOpacity onPress={() => hideBriefCat()}>
          <MaterialCommunityIcons
            style={{ fontSize: 23, left: 10 }}
            name="close"
            color="#767577"
          />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        style={styles.row}
        onPress={async () => {
          const result = await getSelectedCatInfo(item.catId);
          if (result) {
            resetPostState();
            navigation.navigate('CatInfo');
          }
        }}
      >
        <View style={styles.row45}>
          <Image style={styles.cardImg} source={{ uri: item.catProfile }} />
        </View>
        <View style={styles.row55}>
          <Text style={styles.nickName}>{item.catNickname}</Text>
          <Text style={styles.address}>{item.catAddress}</Text>
          <Text style={styles.intro}>{item.description}</Text>
          <Text note>자세히 보기</Text>
        </View>
      </TouchableWithoutFeedback>
      {item.isFollowing ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => unFollowCat(item.catId)}
        >
          <Text style={styles.btnTxt}>UnFollow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => followCat(item.catId)}
        >
          <Text style={styles.btnTxt}>Follow</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
export default inject(({ cat, helper, post }) => ({
  getSelectedCatInfo: cat.getSelectedCatInfo,
  followCat: cat.followCat,
  unFollowCat: helper.unFollowCat,
  resetPostState: post.resetPostState,
}))(observer(withNavigation(BriefCatInfo)));
