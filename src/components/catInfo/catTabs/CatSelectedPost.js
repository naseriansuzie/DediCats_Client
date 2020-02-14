import React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: '100%',
  },
  image: { flex: 1, height: 300, width: 380 },
  noComment: { color: '#7f8296', paddingTop: 15, paddingLeft: 15 },
  flex1: { flex: 1 },
});

const CatSelectedPost = ({ selectedPost, commentList }) => (
  <Container style={styles.container}>
    <Header style={{ display: 'none' }} />
    <Content>
      <Card style={styles.flex1}>
        <CardItem style={styles.flex1}>
          <Left>
            <Thumbnail
              style={{ borderWidth: 1, borderColor: 'green' }}
              source={{
                uri:
                  '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img2.jpg',
              }}
            />
            <Body>
              <Text>NativeBase</Text>
              <Text note>April 15, 2016</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem style={styles.flex1}>
          <Body>
            <Image
              source={{
                uri:
                  '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img3.jpg',
              }}
              style={styles.image}
            />
            <Text>{selectedPost.content}</Text>
          </Body>
        </CardItem>
      </Card>
      <List>
        {commentList ? (
          commentList.map((comment, idx) => (
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

export default inject(({ cat }) => ({
  selectedPost: cat.info.selectedPost,
  commentList: cat.info.commentList,
}))(observer(CatSelectedPost));
