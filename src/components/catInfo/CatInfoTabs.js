import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import CatBio from './catTabs/CatBio';
import CatPostList from './catTabs/CatPostList';
import CatAlbum from './catTabs/CatAlbum';
import CatFollowerList from './catTabs/CatFollowerList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const CatInfoTabs = () => (
  <Container style={styles.container}>
    <Header hasTabs style={{ display: 'none' }} />
    <Tabs
      tabBarUnderlineStyle={{
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: '#e0e2e8',
      }}
      tabBarActiveTextColor="#6772f1"
    >
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

export default CatInfoTabs;
