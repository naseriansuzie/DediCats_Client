import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
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
    paddingTop: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
  keyboard: { width: '95%' },
});

class CatPostList extends React.Component {
  // componentDidMount() {
  //   this.props.getPostList(); //  --> this.props._getData();
  // }

  _renderItem = ({ item }) => (
    <CatPost
      item={item}
      setCatPost={this.props.setCatPost}
      convertDateTime={this.props.convertDateTime}
    />
  );

  renderFooter = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  );

  render() {
    const { selectedCatPost } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
          <KeyboardAvoidingView style={styles.keyboard}>
            <CatPostInput />
          </KeyboardAvoidingView>
          <SafeAreaView>
            <FlatList
              data={selectedCatPost}
              renderItem={this._renderItem}
              keyExtractor={item => `${item.id}`}
              showsVerticalScrollIndicator={false}
              // onEndReached={this.props._handleLoadMorePosts}
              // onEndReachedThreshold={1}
              // ListFooterComponent={this.renderFooter}
              // refreshing={this.props.isRefreshingPost}
              // onRefresh={this.props._handleRefresh}
            />
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

export default inject(({ cat, post, helper }) => ({
  selectedCatPost: cat.selectedCatPost,
  setCatPost: cat.setCatPost,
  getPostList: post.getPostList,
  _handleLoadMorePosts: post._handleLoadMorePosts,
  _handleRefresh: post._handleRefresh,
  isRefreshingPost: helper.isRefreshingPost,
  convertDateTime: helper.convertDateTime,
}))(observer(CatPostList));
