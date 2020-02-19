import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text, Image } from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
  List,
} from 'native-base';
import CatComment from './CatComment';

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';

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
    const { getCommentList, selectedCatPost } = this.props;
    console.log('CatSelectedPost mount');
    console.log('selectedCatPost = ', selectedCatPost);
    getCommentList();
  }

  render() {
    const {
      selectedCatPost,
      selectedCatCommentList,
      convertDateTime,
    } = this.props;

    const usrImgUri =
      selectedCatPost.user.photoPath !== null
        ? selectedCatPost.user.photoPath
        : defaultPhotoUrl;

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
          <List>
            {selectedCatCommentList.length > 0 ? (
              selectedCatCommentList.map((comment, idx) => (
                <CatComment
                  key={`comment_${comment.id}_${idx}`}
                  idx={idx}
                  userId={comment.user.id}
                  comment={comment}
                  myPhoto={comment.user.photoPath}
                  userNickname={comment.user.nickname}
                  content={comment.content}
                  date={comment.createAt}
                />
              ))
            ) : (
              <Text style={styles.noComment}>댓글이 없습니다.</Text>
            )}
          </List>
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
}))(observer(CatSelectedPost));
