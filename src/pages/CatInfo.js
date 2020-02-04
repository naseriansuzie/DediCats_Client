import React, { Component } from 'react';
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import CatBio from '../components/catInfo/catTabs/CatBio';
import CatPostList from '../components/catInfo/catTabs/CatPostList';
import CatAlbum from '../components/catInfo/catTabs/CatAlbum';
import CatFollowerList from '../components/catInfo/catTabs/CatFollowerList';

export default class TabsExample extends Component {
  render() {
    return (
      <Container>
        <Header hasTabs />
        <Tabs>
          <Tab heading="Tab1">
            <CatBio />
          </Tab>
          <Tab heading="Tab2">
            <CatPostList />
          </Tab>
          <Tab heading="Tab3">
            <CatAlbum />
          </Tab>
          <Tab heading="Tab4">
            <CatFollowerList />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
