import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
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
  activeText: { color: '#ffffff', fontSize: 18 },
});

const CatInfoTabs = ({ selectedCatBio }) => (
  <Container style={styles.container}>
    {selectedCatBio && selectedCatBio.length > 0 ? (
      <View>
        <Header hasTabs style={styles.hide} />
        <Tabs
          tabBarUnderlineStyle={styles.tab}
          tabContainerStyle={{
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          }}
        >
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
            heading="Post"
            tabStyle={styles.tab}
            textStyle={styles.textColor}
            activeTabStyle={styles.activeTab}
            activeTextStyle={styles.activeText}
          >
            <CatPostList />
          </Tab>
          <Tab
            heading="Album"
            tabStyle={styles.tab}
            textStyle={styles.textColor}
            activeTabStyle={styles.activeTab}
            activeTextStyle={styles.activeText}
          >
            <CatAlbum />
          </Tab>
          <Tab
            heading="Follower"
            tabStyle={styles.tab}
            textStyle={styles.textColor}
            activeTabStyle={styles.activeTab}
            activeTextStyle={styles.activeText}
          >
            <CatFollowerList />
          </Tab>
        </Tabs>
      </View>
    ) : (
      <View />
    )}
  </Container>
);

export default inject(({ cat }) => ({
  selectedCatBio: cat.selectedCatBio,
}))(observer(CatInfoTabs));
