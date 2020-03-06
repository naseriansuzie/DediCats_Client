import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Text, BackHandler } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
  },
  dediCatsView: {
    alignItems: 'flex-start',
    marginTop: 50,
    marginLeft: 30,
  },
  iconView: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginLeft: 30,
  },
  text: {
    fontSize: 17,
  },
});

class CreditInfo extends React.Component {
  componentDidMount = async () => {
    await this.handleAndroidBackButton();
  }

  handleAndroidBackButton = async () => {
    const { navigation } = this.props;

    BackHandler.addEventListener('hardwareBackPress', async () => {
      navigation.goBack();
    });
  };

  removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.dediCatsView}>
          <Text style={styles.text}>
            Copyrights by Team CodeStake.{'\n'}
            For the further use, please contact Team CodeStake via dedicats16@gmail.com.
          </Text>
        </View>
        <View style={styles.iconView}>
          <Text style={styles.text}>
            Icon made by Vitaly Gorbachev from www.flaticon.com
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(CreditInfo);
