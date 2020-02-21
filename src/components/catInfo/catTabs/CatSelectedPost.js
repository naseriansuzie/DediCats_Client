import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text, Image, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
} from 'native-base';
import CatComment from './CatComment';

const defaultPhotoUrl = 'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: '100%',
  },
  cardView: {
    flex: 1,
    borderWidth: 10,
  },
  reportView: { alignItems: 'flex-end' },
  ellipsis: { fontSize: 24 },
  modalView: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 2,
    marginTop: 93,
  },
  userImg: {
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    height: 300,
    width: 380,
  },
  noComment: { color: '#7f8296', paddingTop: 15, paddingLeft: 15 },
  flex1: { flex: 1 },
});

class CatSelectedPost extends React.Component {
  _showActionSheet = () => this.ActionSheet.show();

  componentDidMount() {
    const { getCommentList } = this.props;
    console.log('CatSelectedPost mount');
    getCommentList();
  }

  _renderItem = ({ item }) => (
    <CatComment
      userId={item.user.id}
      comment={item}
      myPhoto={item.user.photoPath}
      userNickname={item.user.nickname}
      content={item.content}
      date={item.createAt}
    />
  );

  render() {
    const {
      selectedCatPost,
      selectedCatCommentList,
      convertDateTime,
      initialComments,
      _handleLoadMoreComments
    } = this.props;

    const usrImgUri = selectedCatPost.user.photoPath !== null
      ? selectedCatPost.user.photoPath : defaultPhotoUrl;

    return (
      <Container style={styles.container}>
        <Header style={{ display: 'none' }} />
        <Content>
          <Card style={styles.cardView}>
            <CardItem style={styles.flex1}>
              <Left>
                <Thumbnail
                  square
                  style={styles.userImg}
                  source={{ uri: usrImgUri }}
                />
                <Body>
                  <Text>{selectedCatPost.user.nickname}</Text>
                  <Text note>{convertDateTime(selectedCatPost.createAt)}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem style={styles.flex1}>
              <Body>
                {selectedCatPost.photos.length > 0 ? (
                  <Image
                    source={{ uri: selectedCatPost.photos[0].path }}
                    style={styles.image}
                  />
                ) : (
                  <View />
                )}
                <Text style={{ paddingTop: 20 }}>
                  {selectedCatPost.content}
                </Text>
              </Body>
            </CardItem>
          </Card>
          {selectedCatPost.comments.length > 0 ? (
            <SafeAreaView>
              {initialComments - selectedCatCommentList.length > 0
                ? (
                  <TouchableOpacity
                    onPress={() => _handleLoadMoreComments()}
                  >
                    <Text style={{ textAlign: 'center', fontSize: 20 }}>load comments</Text>
                  </TouchableOpacity>
                ) : null}
              <FlatList
                data={selectedCatCommentList}
                renderItem={this._renderItem}
                keyExtractor={(item) => `post_${item.id}`}
                showsVerticalScrollIndicator={false}
                inverted
              />
            </SafeAreaView>
          ) : (
            <Text style={styles.noComment}>댓글이 없습니다.</Text>
          )}
        </Content>
      </Container>
    );
  }
}

export default inject(({ cat, helper }) => ({
  selectedCatPost: cat.selectedCatPost,
  selectedCatCommentList: cat.selectedCatCommentList,
  convertDateTime: helper.convertDateTime,
  getCommentList: cat.getCommentList,
  _handleLoadMoreComments: cat._handleLoadMoreComments,
  initialComments: cat.initialComments,
}))(observer(CatSelectedPost));
