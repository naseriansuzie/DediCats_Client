import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
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
    return <Spinner style={styles.spinner} color="#6772F1" />;
  }
}
export default inject(({ cat }) => ({
  selectedCatBio: cat.selectedCatBio,
}))(observer(CatInfo));
