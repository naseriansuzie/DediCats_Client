import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import CatFollower from './CatFollower';

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  listView: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  noFollowerView: { alignItems: 'center', paddingTop: 50 },
  noFollowerTxt: { color: '#7f8296' },
});

class CatFollowerList extends React.Component {
  componentDidMount() {
    console.log('CatFollowerList mount');
    this.props.getFollowerList(this.props.catId);
  }

  render() {
    const { myInfo, followerList, nickname } = this.props;
    if (myInfo && followerList) {
      return (
        <Container style={styles.flex1}>
          <Content>
            <Header style={{ display: 'none' }} />
            <List style={styles.listView}>
              {followerList[0].users.map((follower, idx) => (
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
      );
    }
    if (myInfo) {
      return (
        <View style={styles.noFollowerView}>
          <Text style={styles.noFollowerTxt}>
            {`There's no follower for ${nickname} now.`}
          </Text>
          <Text>Be the First Follower!</Text>
        </View>
      );
    }
    return <View />;
  }
}

export default inject(({ cat, user }) => ({
  myInfo: user.info.myInfo,
  followerList: cat.info.followerList,
  catId: cat.info.selectedCat[0].id,
  nickname: cat.info.selectedCat[0].nickname,
  getFollowerList: cat.getFollowerList,
}))(observer(CatFollowerList));
