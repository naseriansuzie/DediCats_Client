import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#ececec',
    height: 250,
    width: 320,
    padding: 24,
    borderRadius: 24,
  },
  cardImg: {
    height: 120,
    width: 200,
    alignItems: 'center',
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardAddress: {
    fontSize: 10,
    color: '#445', 
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
});

class BriefCatInfo extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => this.props.hideCarousel()}
        >
          <Text>X</Text>
        </TouchableOpacity>
        <Image
          style={styles.cardImg}
          source={{uri: this.props.item.catProfile }}
        />
        <Text style={styles.cardtitle}>{this.props.item.catNickname}</Text>
        <Text style={styles.cardAddress}>{this.props.item.catAddress}</Text>
        <Text style={styles.cardDescription}>{this.props.item.description}</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('CatInfo')}
        >
          <Text>Move to Cat Info</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BriefCatInfo);
