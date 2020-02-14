import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#ececec',
    height: height * 0.3,
    width: width * 0.9,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 24,
  },
  cardImg: {
    height: 120,
    width: 120,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 24,
  },
  cardtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -110,
    marginBottom: 20,
    marginRight: 20,
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
    textAlign: 'right',
  },
  hideCarouselBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    top: 15,
    right: 15,
    width: 350,
  },
  catInfoBtn: {
    marginTop: 130,
    alignItems: 'center',
  },
});


class BriefCatInfo extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.hideCarouselBtn}
          onPress={() => this.props.hideCarousel()}
        >
          <Text>X</Text>
        </TouchableOpacity>
        <View>
          <Image
            style={styles.cardImg}
            source={this.props.item.img}
          />
          <Text style={styles.cardtitle}>{this.props.item.name}</Text>
          <Text style={styles.cardDescription}>{this.props.item.content}</Text>
        </View>
        <TouchableOpacity
          style={styles.catInfoBtn}
          onPress={() => this.props.navigation.navigate('CatInfo')}
        >
          <Text style={{ fontSize: 15 }}>고양이 정보 보러가기</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BriefCatInfo);
