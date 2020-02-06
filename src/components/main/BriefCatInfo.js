import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from 'react-native';

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
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
});

class BriefCatInfo extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <Image
          style={styles.cardImg}
          source={this.props.item.img}
        />
        <Text style={styles.cardtitle}>{this.props.item.name}</Text>
        <Text style={styles.cardDescription}>{this.props.item.content}</Text>
        <Button
          title="Move to Cat Info"
          onPress={() => this.props.navigation.navigate('CatInfo')}
        />
      </View>
    );
  }
}

export default BriefCatInfo;
