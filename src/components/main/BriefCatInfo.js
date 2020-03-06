import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#ffffff',
    height: 210,
    width: 345,
    paddingTop: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6772F1',
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    paddingLeft: 10,
  },
  closeBtn: {
    position: 'absolute',
    width: '13%',
    height: '16%',
    fontSize: 20,
    marginTop: 10,
    zIndex: 1,
    top: -10,
    right: 0,
  },
  cardImg: {
    height: 120,
    width: 120,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
    borderRadius: 10,
  },
  nickName: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  species: {
    fontSize: 16,
    paddingTop: 10,
  },
  address: {
    fontSize: 16,
    paddingTop: 10,
  },
  intro: {
    fontSize: 15,
    color: '#444444',
    paddingVertical: 5,
    flexWrap: 'wrap',
  },
  btn: {
    backgroundColor: '#6772F1',
    alignSelf: 'center',
    marginTop: 5,
    marginLeft: -80,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnTxt: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    marginTop: 10,
  },
  row45: { width: '45%' },
  row55: { width: '55%' },
});

const BriefCatInfo = ({
  navigation,
  getSelectedCatInfo,
  item,
  hideBriefCat,
  resetPostState,
}) => (
  <View style={styles.card}>
    <View style={styles.content}>
      <TouchableWithoutFeedback
        style={styles.row}
        onPress={async () => {
          const result = await getSelectedCatInfo(item.catId, navigation);
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
          <Text style={styles.species}>추정 종: {item.catSpecies}</Text>
          <Text style={styles.address}>{item.catAddress}</Text>
          <Text style={styles.intro}>{item.description}</Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt}>고양이 보러가기</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
    <TouchableOpacity style={styles.closeBtn} onPress={() => hideBriefCat()}>
      <MaterialCommunityIcons
        style={{ fontSize: 30, left: 4 }}
        name="close"
        color="#767577"
      />
    </TouchableOpacity>
  </View>
);
export default inject(({ cat, post }) => ({
  getSelectedCatInfo: cat.getSelectedCatInfo,
  resetPostState: post.resetPostState,
}))(observer(withNavigation(BriefCatInfo)));
