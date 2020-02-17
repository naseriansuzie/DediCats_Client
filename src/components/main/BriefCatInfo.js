import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Badge, Text } from 'native-base';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#edf1f5',
    height: 230,
    width: 320,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderRadius: 20,
  },
  closeBtn: {
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  cardImg: {
    height: 80,
    width: 80,
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
  },
  tagView: { flexDirection: 'row', overflow: 'hidden' },
  tag: {
    backgroundColor: '#f38847',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  btn: {
    width: '40%',
    alignSelf: 'center',
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
  row30: { width: '30%' },
  row70: { width: '70%' },
});

const BriefCatInfo = ({
  getSelectedCatInfo,
  item,
  navigation,
  hideCarousel,
}) => (
  <View style={styles.card}>
    <View>
      <View style={styles.closeBtn}>
        <TouchableOpacity onPress={() => hideCarousel()}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        style={styles.row}
        onPress={async () => {
          // console.log('카루셀 클릭시: ', item.catId);
          const result = await getSelectedCatInfo(item.catId);
          // console.log('카드', result);
          if (result) {
            navigation.navigate('CatInfo');
          }
        }}
      >
        <View style={styles.row30}>
          <Image style={styles.cardImg} source={{ uri: item.catProfile }} />
        </View>
        <View style={styles.row70}>
          <Text style={styles.nickName}>{item.catNickname}</Text>
          <Text style={styles.address}>{item.catAddress}</Text>
          <Text style={styles.intro}>{item.description}</Text>
          <View style={styles.tagView}>
            <Badge style={styles.tag}>
              <Text>태그</Text>
            </Badge>
            <Badge style={styles.tag}>
              <Text>태그태그태그태그</Text>
            </Badge>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity style={styles.btn} onPress={() => {}}>
        <Text style={styles.btnTxt}>Follow</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default inject(({ cat }) => ({
  getSelectedCatInfo: cat.getSelectedCatInfo,
}))(observer(withNavigation(BriefCatInfo)));
