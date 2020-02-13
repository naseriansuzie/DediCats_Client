import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body } from 'native-base';
import CatCommentList from './CatCommentList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    paddingTop: 20,
  },
});

class CatSelectedPost extends React.Component {
  render() {
    return (
      <Container>
        <Header style={{ display: 'none' }} />
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img2.jpg'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri: '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img3.jpg'}} style={{height: 300, width: 380, flex: 1}}/>
                <Text>{this.props.selectedPost.content}</Text>
              </Body>
            </CardItem>
            {this.props.commentList !== null
              ? (
                <CardItem style={{ borderTopWidth: 0.5, borderTopColor: 'grey' }}>
                  <CatCommentList />
                </CardItem>
              )
              : (
                <CardItem style={{ borderTopWidth: 0.5, borderTopColor: 'grey' }}>
                  <View>
                    <Text>첫번째 댓글을 달아주세요!</Text>
                  </View>
                </CardItem>
              )}
          </Card>
        </Content>
      </Container>
    );
  }
}

export default inject(({ cat }) => ({
  selectedPost: cat.info.selectedPost,
  commentList: cat.info.commentList,
}))(
  observer(CatSelectedPost),
);
