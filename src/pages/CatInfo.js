import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Container, Spinner } from 'native-base';
import CatProfile from '../components/catInfo/CatProfile';
import CatInfoTabs from '../components/catInfo/CatInfoTabs';

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },
  tabs: {
    flex: 3,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class CatInfo extends React.Component {
  componentDidMount() {
    this.handleAndroidBackButton();
  }

  handleAndroidBackButton = () => {
    const {
      navigation,
      resetRainbowReport,
      toggleRainbowOpen,
    } = this.props;

    BackHandler.addEventListener('hardwareBackPress', async () => {
      resetRainbowReport();
      toggleRainbowOpen();
      navigation.goBack();
      return true;
    });
  };

  removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  };

  render() {
    const { selectedCatBio } = this.props;
    if (selectedCatBio) {
      return (
        <Container>
          <View style={styles.profile}>
            <CatProfile />
          </View>
          <View style={styles.tabs}>
            <CatInfoTabs />
          </View>
        </Container>
      );
    }
    return <Spinner style={styles.spinner} color="#6772f1" />;
  }
}
export default inject(({ cat }) => ({
  selectedCatBio: cat.selectedCatBio,
  resetRainbowReport: cat.resetRainbowReport,
  toggleRainbowOpen: cat.toggleRainbowOpen,
}))(observer(CatInfo));
