import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  cardItem: { alignSelf: 'flex-end' },
  card: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  leftSection: { width: '10%' },
  iconColor: { color: '#6772F1' },
  rightSection: { width: '45%' },
  replyTxt: { paddingLeft: 5, paddingRight: 0 },
  addReply: { width: '45%' },
  noPadding: { paddingLeft: 0 },
});

_URL = 'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_USER.png';

class CatPost extends React.Component {
  _showActionSheet = () => this.ActionSheet.show();

  setCatPostHere = item => {
    this.props.setCatPost(item);
    this.props.navigation.navigate('SelectedPost');
  };

  render() {
    const { content, createAt, user, photos, comments } = this.props.item;
    const {
      navigation,
      item,
      userInfo,
      setReplyNum,
      convertDateTime,
      processPostActions,
    } = this.props;
    const usrImgUri =
      user.photoPath !== null ? user.photoPath : DEFAULT_USER_URL;

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
              item,
              navigation,
            );
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.setCatPostHere(item);
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
              <Text style={styles.date}>{convertDateTime(createAt)}</Text>
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
          <CardItem style={styles.cardItem}>
            <Left />
            <Right>
              <Button transparent>
                <View style={styles.card}>
                  <View style={styles.leftSection}>
                    <Icon active name="chatbubbles" style={styles.iconColor} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text note style={styles.replyTxt}>
                      {comments.length > 0
                        ? `${comments.length}개의 댓글`
                        : '댓글 없음'}
                    </Text>
                  </View>
                  <View style={styles.addReply}>
                    <Text note style={styles.noPadding}>
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

export default inject(({ auth, post, helper, report }) => ({
  userInfo: auth.userInfo,
  setReplyNum: post.setReplyNum,
  convertDateTime: helper.convertDateTime,
  processPostActions: report.processPostActions,
}))(observer(withNavigation(CatPost)));
