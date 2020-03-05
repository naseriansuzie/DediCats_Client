import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, Text } from 'native-base';
import CatFollower from './CatFollower';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772F1',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#ffffff',
  },
  listView: {
    paddingTop: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  txt: {
    color: '#767577',
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
  },
  noFollowerView: {
    flex: 1,
    backgroundColor: '#6772F1',
  },
  noFollowerRadiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    alignItems: 'center',
  },
  noFollowerTxt: { color: '#7f8296', fontSize: 18, paddingBottom: 15 },
});

class CatFollowerList extends React.Component {
  componentDidMount() {
    this.props.getFollowerList(this.props.catId, this.props.navigation);
  }

  render() {
    const { selectedCatFollowerList, nickname } = this.props;
    if (
      selectedCatFollowerList &&
      selectedCatFollowerList[0].users.length > 0
    ) {
      return (
        <View style={styles.container}>
          <Container style={styles.radiusView}>
            <Content>
              <Header style={{ display: 'none' }} />
              <List style={styles.listView}>
                <Text style={styles.txt}>
                  {selectedCatFollowerList[0].users.length === 1
                    ? `${selectedCatFollowerList[0].users.length} follower`
                    : `${selectedCatFollowerList[0].users.length} followers`}
                </Text>
                {selectedCatFollowerList[0].users.map((follower, idx) => (
                  <CatFollower
                    key={`${follower.id}_${follower.nickname}`}
                    idx={idx}
                    myPhoto={follower.photoPath}
                    userNickName={follower.nickname}
                    catName={nickname}
                  />
                ))}
                <CatFollower />
              </List>
            </Content>
          </Container>
        </View>
      );
    }
    if (
      selectedCatFollowerList &&
      selectedCatFollowerList[0].users.length === 0
    ) {
      return (
        <View style={styles.noFollowerView}>
          <View style={styles.noFollowerRadiusView}>
            <Text style={styles.noFollowerTxt}>
              {`There's no follower for ${nickname} now.`}
            </Text>
            <Text>Be the FIRST Follower!</Text>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

export default inject(({ cat }) => ({
  catId: cat.selectedCatBio[0].id,
  getFollowerList: cat.getFollowerList,
  nickname: cat.selectedCatBio[0].nickname,
  selectedCatFollowerList: cat.selectedCatFollowerList,
}))(observer(withNavigation(CatFollowerList)));
