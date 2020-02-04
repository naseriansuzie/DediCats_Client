import React, { Component } from 'react';
import { Container, Header, Content, Tab, Tabs, View, Text } from 'native-base';
import CatBio from '../components/catInfo/catTabs/CatBio';
import CatPostList from '../components/catInfo/catTabs/CatPostList';
import CatAlbum from '../components/catInfo/catTabs/CatAlbum';
import CatFollowerList from '../components/catInfo/catTabs/CatFollowerList';

export default class CatInfo extends Component {
  render() {
    return (
      <Container>
        <View>
          <Text>여기에 cat profile component</Text>
        </View>
        <Header hasTabs style={{ display: 'none' }} />
        <Tabs>
          <Tab heading="Bio">
            <CatBio />
          </Tab>
          <Tab heading="Posts">
            <CatPostList />
          </Tab>
          <Tab heading="Albums">
            <CatAlbum />
          </Tab>
          <Tab heading="Followers">
            <CatFollowerList />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

// CatInfo.navigationOptions = {
//   title: '고양이 정보',
// };

// export default CatInfo;
