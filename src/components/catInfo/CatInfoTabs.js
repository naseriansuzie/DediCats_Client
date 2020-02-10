import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Tab, Tabs } from 'native-base';
import CatBio from './catTabs/CatBio';
import CatPostList from './catTabs/CatPostList';
import CatAlbum from './catTabs/CatAlbum';
import CatFollowerList from './catTabs/CatFollowerList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarUnderline: {
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: '#e0e2e8',
  },
});
const CatInfoTabs = () => (
  <Container style={styles.container}>
    <Header hasTabs style={{ display: 'none' }} />
    <Tabs
      tabBarUnderlineStyle={{ display: 'none' }}
      // tabBarActiveTextColor="#6772f1"
    >
      <Tab
        heading="Bio"
        tabStyle={{
          backgroundColor: '#6772f1',
        }}
        textStyle={{ color: '#e0e2e8' }}
        activeTabStyle={{
          backgroundColor: '#6772f1',
        }}
        activeTextStyle={{ color: 'white', fontSize: 20 }}
      >
        <CatBio />
      </Tab>
      <Tab
        heading="Posts"
        tabStyle={{
          backgroundColor: '#6772f1',
        }}
        textStyle={{ color: '#e0e2e8' }}
        activeTabStyle={{
          backgroundColor: '#6772f1',
        }}
        activeTextStyle={{ color: 'white', fontSize: 20 }}
      >
        <CatPostList />
      </Tab>
      <Tab
        heading="Albums"
        tabStyle={{
          backgroundColor: '#6772f1',
        }}
        textStyle={{ color: '#e0e2e8' }}
        activeTabStyle={{
          backgroundColor: '#6772f1',
        }}
        activeTextStyle={{ color: 'white', fontSize: 20 }}
      >
        <CatAlbum />
      </Tab>
      <Tab
        heading="Followers"
        tabStyle={{
          // borderTopRightRadius: 15,
          backgroundColor: '#6772f1',
        }}
        textStyle={{ color: '#e0e2e8' }}
        activeTabStyle={{
          // borderTopRightRadius: 15,
          backgroundColor: '#6772f1',
        }}
        activeTextStyle={{ color: 'white', fontSize: 20 }}
      >
        <CatFollowerList />
      </Tab>
    </Tabs>
  </Container>
);

export default CatInfoTabs;
