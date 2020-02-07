import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import CatProfile from '../components/catInfo/CatProfile';
import CatInfoTabs from '../components/catInfo/CatInfoTabs';

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },
  tabs: {
    flex: 3,
  },
});

const CatInfo = () => (
  <Container>
    <View style={styles.profile}>
      <CatProfile />
    </View>
    <View style={styles.tabs}>
      <CatInfoTabs />
    </View>
  </Container>
);

// CatInfo.navigationOptions = {
//   title: '고양이 정보',
// };

export default CatInfo;
