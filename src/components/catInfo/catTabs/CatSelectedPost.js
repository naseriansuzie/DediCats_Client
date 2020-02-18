import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
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

const defaultPhotoUrl = [
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512',
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512',
][Math.floor(Math.random() * 2)];

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: '100%',
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
  componentDidMount() {
    console.log('selectedCatPost = ', this.props.selectedCatPost);
    console.log('CatSelectedPost mount');
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
          <Card style={styles.flex1}>
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
            {selectedCatCommentList ? (
              selectedCatCommentList.map((comment, idx) => (
                <CatComment
                  key={`comment_${comment.id}`}
                  idx={idx}
                  myPhoto={comment.user.photoPath}
                  userNickname={comment.user.nickname}
                  comment={comment.content}
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
}))(observer(CatSelectedPost));
