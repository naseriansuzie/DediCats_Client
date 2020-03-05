import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Fab, Icon } from 'native-base';
import * as Font from 'expo-font';
import CatPost from './CatPost';
import CatPostInput from './CatPostInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#000000aa',
  },
  safeArea: {
    flex: 3,
    width: '95%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    zIndex: 1,
  },
  noPhotoView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  noPhotoTxt: { color: '#7f8296', fontSize: 18, paddingBottom: 15 },
});

class CatPostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: true,
      loadingFont: true,
    };
  }

  componentDidMount() {
    this.props.getPostList(this.props.navigation);
  }

  handledisappear = () => {
    this.setState({
      visibility: false,
    });
  }

  handleshow = () => {
    this.setState({
      visibility: true,
    });
  }

  loadFont = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    });
    this.setState({
      loadingFont: false,
    });
  };

  _renderItem = ({ item }) => (
    <CatPost
      catId={this.props.catId}
      item={item}
      setCatPost={this.props.setCatPost}
      convertDateTime={this.props.convertDateTime}
    />
  );

  renderFooter = () => (this.props.isLoadingPost ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View />
  ));

  render() {
    const {
      nickname,
      postList,
      _handleLoadMorePosts,
      isRefreshingPost,
      _handleRefresh,
      modalVisible,
      toggleModalVisible,
      exitInputModal,
    } = this.props;
    const { loadingFont } = this.state;
    if (loadingFont) {
      this.loadFont();
      return <View />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
          {postList.length !== 0 ? (
            <SafeAreaView style={styles.safeArea}>
              <FlatList
                data={postList}
                renderItem={this._renderItem}
                keyExtractor={(item, idx) => `post_${item.id}_${idx}`}
                showsVerticalScrollIndicator={false}
                onEndReached={_handleLoadMorePosts}
                onEndReachedThreshold={0}
                ListFooterComponent={this.renderFooter}
                refreshing={isRefreshingPost}
                onRefresh={_handleRefresh}
                initialNumToRender={3}
              />
            </SafeAreaView>
          ) : (
            <View style={styles.noPhotoView}>
              <Text style={styles.noPhotoTxt}>
                {`There's no Post of ${nickname} now.`}
              </Text>
              <Text>Upload the FIRST post!</Text>
            </View>
          )}
          <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => exitInputModal()}
          >
            <TouchableWithoutFeedback onPress={() => exitInputModal()}>
              <KeyboardAvoidingView style={styles.modalView}>
                <CatPostInput />
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Modal>
          <Fab
            active={false}
            direction="up"
            containerStyle={{ zIndex: 1 }}
            style={{ backgroundColor: '#6772F1' }}
            position="bottomRight"
            onPress={() => toggleModalVisible()}
          >
            <Icon name="create" />
          </Fab>
        </View>
      </View>
    );
  }
}

export default inject(({
  cat, post, helper, comment,
}) => ({
  catId: cat.selectedCatBio[0].id,
  nickname: cat.selectedCatBio[0].nickname,
  setCatPost: comment.setCatPost,
  postList: post.postList,
  getPostList: post.getPostList,
  _handleLoadMorePosts: post._handleLoadMorePosts,
  _handleRefresh: post._handleRefresh,
  isLoadingPost: post.isLoadingPost,
  isRefreshingPost: post.isRefreshingPost,
  convertDateTime: helper.convertDateTime,
  maxPostPage: post.maxPostPage,
  modalVisible: post.modalVisible,
  toggleModalVisible: post.toggleModalVisible,
  exitInputModal: post.exitInputModal,
}))(observer(withNavigation(CatPostList)));
