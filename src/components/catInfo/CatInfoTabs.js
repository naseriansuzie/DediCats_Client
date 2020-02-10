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
  hide: {
    display: 'none',
  },
  tab: {
    backgroundColor: '#6772f1',
  },
  textColor: { color: '#e0e2e8' },
  activeTab: {
    backgroundColor: '#6772f1',
  },
  activeText: { color: 'white', fontSize: 18 },
});
const CatInfoTabs = () => (
  <Container style={styles.container}>
    <Header hasTabs style={styles.hide} />
    <Tabs tabBarUnderlineStyle={styles.hide}>
      <Tab
        heading="Bio"
        tabStyle={styles.tab}
        textStyle={styles.textColor}
        activeTabStyle={styles.activeTab}
        activeTextStyle={styles.activeText}
      >
        <CatBio />
      </Tab>
      <Tab
        heading="Posts"
        tabStyle={styles.tab}
        textStyle={styles.textColor}
        activeTabStyle={styles.activeTab}
        activeTextStyle={styles.activeText}
      >
        <CatPostList />
      </Tab>
      <Tab
        heading="Albums"
        tabStyle={styles.tab}
        textStyle={styles.textColor}
        activeTabStyle={styles.activeTab}
        activeTextStyle={styles.activeText}
      >
        <CatAlbum />
      </Tab>
      <Tab
        heading="Followers"
        tabStyle={styles.tab}
        textStyle={styles.textColor}
        activeTabStyle={styles.activeTab}
        activeTextStyle={styles.activeText}
      >
        <CatFollowerList />
      </Tab>
    </Tabs>
  </Container>
);

export default CatInfoTabs;
