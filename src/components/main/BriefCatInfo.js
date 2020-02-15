import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Badge, Text } from 'native-base';
import { withNavigation } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

const BriefCatInfo = ({ item, navigation }) => (
  <View style={styles.card}>
    <View>
      <View style={styles.closeBtn}>
        <TouchableOpacity onPress={() => this.props.hideCarousel()}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        style={styles.row}
        onPress={() => navigation.navigate('CatInfo')}
      >
        <View style={styles.row30}>
          <Image style={styles.cardImg} source={item.img} />
        </View>
        <View style={styles.row70}>
          <Text style={styles.nickName}>{item.name}</Text>
          <Text style={styles.address}>어느 동네 주소</Text>
          <Text style={styles.intro}>{item.content}</Text>
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

export default withNavigation(BriefCatInfo);
