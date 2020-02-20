import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import MyProfile from '../components/my/MyProfile';
import MyCatList from '../components/my/MyCatList';

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },
  content: {
    flex: 3,
  },
});
// const DEFAULT_CAT = 'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';
class MyPage extends React.Component {
  render() {
    return (
      <Container>
        <View style={styles.profile}>
          <MyProfile />
        </View>
        <View style={styles.content}>
          <MyCatList />
        </View>
      </Container>
    );
  }
}

export default MyPage;
