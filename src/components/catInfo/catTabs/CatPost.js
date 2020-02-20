import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import {
  Text,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import { withNavigation } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    width: 370,
    borderRadius: 20,
    overflow: 'hidden',
  },
  reportView: { alignItems: 'flex-end' },
  ellipsis: { fontSize: 24, paddingRight: 10 },
  userImg: {
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  date: { color: 'grey' },
  photo: { height: 300, width: null, flex: 1 },
});

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';

class CatPost extends React.Component {
  _showActionSheet = () => this.ActionSheet.show();

  setCatPostHere = item => {
    this.props.setCatPost(item);
    this.props.navigation.navigate('SelectedPost');
  };

  render() {
    const { content, createAt, user, photos, comments } = this.props.item;
    const { processPostActions, userInfo, setReplyNum } = this.props;
    const usrImgUri =
      user.photoPath !== null ? user.photoPath : defaultPhotoUrl;

    return (
      <Card style={styles.container}>
        <View style={styles.reportView}>
          <TouchableOpacity
            onPress={() => {
              this._showActionSheet();
            }}
          >
            <AntDesign name="ellipsis1" style={styles.ellipsis} />
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          // title="Which one do you like ?"
          options={
            userInfo && userInfo.id === user.id
              ? ['수정', '삭제', '취소']
              : ['게시물 신고', '취소']
          }
          cancelButtonIndex={userInfo && userInfo.id === user.id ? 2 : 1}
          destructiveButtonIndex={
            userInfo && userInfo.id === user.id ? 1 : null
          }
          onPress={index => {
            processPostActions(
              userInfo && userInfo.id === user.id,
              index,
              this.props.item,
            );
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.setCatPostHere(this.props.item);
            setReplyNum(comments);
          }}
        >
          <CardItem>
            <Left>
              <Thumbnail
                square
                style={styles.userImg}
                source={{ uri: usrImgUri }}
              />
              <Body>
                <Text>{user.nickname}</Text>
              </Body>
            </Left>
            <Right>
              <Text style={styles.date}>
                {this.props.convertDateTime(createAt)}
              </Text>
            </Right>
          </CardItem>
          <CardItem cardBody>
            {photos.length > 0 ? (
              <Image source={{ uri: photos[0].path }} style={styles.photo} />
            ) : (
              <View />
            )}
          </CardItem>
          <CardItem>
            <Text>{content}</Text>
          </CardItem>
          <CardItem style={{ alignSelf: 'flex-end' }}>
            <Left />
            <Right>
              <Button transparent>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '10%' }}>
                    <Icon
                      active
                      name="chatbubbles"
                      style={{ color: '#6772f1' }}
                    />
                  </View>
                  <View style={{ width: '45%' }}>
                    <Text note style={{ paddingLeft: 5, paddingRight: 0 }}>
                      {comments.length > 0
                        ? `${comments.length}개의 댓글`
                        : '댓글 없음'}
                    </Text>
                  </View>
                  <View style={{ width: '45%' }}>
                    <Text note style={{ paddingLeft: 0 }}>
                      댓글달기
                    </Text>
                  </View>
                </View>
              </Button>
            </Right>
          </CardItem>
        </TouchableWithoutFeedback>
      </Card>
    );
  }
}

export default inject(({ auth, post, cat, report }) => ({
  userInfo: auth.userInfo,
  replyNum: post.replyNum,
  setReplyNum: post.setReplyNum,
  selectedCatPost: cat.selectedCatPost,
  processPostActions: report.processPostActions,
}))(observer(withNavigation(CatPost)));
