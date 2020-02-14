import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import CatPost from './CatPost';
import CatPostInput from './CatPostInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
});

class CatPostList extends React.Component {

  // componentDidMount() {
  //   this.props.getPostList(); //  --> this.props._getData();
  // }

  _renderItem = ({ item }) => (
    <CatPost item={item} setCatPost={this.props.setCatPost} convertDateTime={this.props.convertDateTime} />
  );

  renderFooter = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.radiusView}>
          <FlatList
            data={this.props.postList}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => `${item.id}`}
            showsVerticalScrollIndicator={false}
            // onEndReached={this.props._handleLoadMorePosts}
            // onEndReachedThreshold={1}
            // ListFooterComponent={this.renderFooter}
            // refreshing={this.props.isRefreshingPost}
            // onRefresh={this.props._handleRefresh}
          />
        </SafeAreaView>
        <CatPostInput />
      </View>
    );
  }
}

export default inject(({ cat }) => ({
  postList: cat.info.postList,
  setCatPost: cat.setCatPost,
  getPostList: cat.getPostList,
  isRefreshingPost: cat.isRefreshingPost,
  _handleLoadMorePosts: cat._handleLoadMorePosts,
  _handleRefresh: cat._handleRefresh,
  convertDateTime: cat.convertDateTime,
}))(
  observer(CatPostList),
);
