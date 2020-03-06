import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  marginRight10: {
    marginRight: 10,
  },
  width70: {
    width: '70%',
  },
  modificationView: { flexDirection: 'row' },
  radius: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
});

const DEFAULT_USER =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_USER.png';

const CatComment = ({
  navigation,
  comment,
  userId,
  myPhoto,
  userNickname,
  content,
  date,
  userInfo,
  convertDateTime,
  reportComment,
  setCatComment,
  resetModifyComment,
  modifyComment,
  deleteComment,
  resetCommentState,
  getCommentList,
}) => (
  <ListItem thumbnail style={styles.container}>
    <Left>
      <Thumbnail
        square
        source={{ uri: myPhoto || DEFAULT_USER }}
        style={styles.radius}
      />
    </Left>
    <Body>
      <View>
        <Text>{userNickname}</Text>
        <Text>{content}</Text>
        <View style={styles.modificationView}>
          <View style={styles.width70}>
            <Text note>{convertDateTime(date)}</Text>
          </View>
          {userInfo.id === userId ? (
            <TouchableOpacity
              onPress={() => {
                modifyComment(comment);
              }}
            >
              <Text note>수정</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {userInfo.id === userId ? (
            <TouchableOpacity
              onPress={() => {
                resetModifyComment();
                Alert.alert('댓글 삭제', '해당 댓글을 삭제하시겠습니까?', [
                  {
                    text: '취소',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: '삭제',
                    onPress: async () => {
                      await deleteComment(comment, navigation);
                      resetCommentState('delete');
                      getCommentList(navigation);
                    },
                  },
                ]);
              }}
            >
              <Text note>삭제</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {userInfo.id === userId ? (
            <View />
          ) : (
            <TouchableOpacity>
              <Text
                note
                onPress={() => {
                  resetModifyComment();
                  Alert.alert('댓글 신고', '이 댓글 내용을 신고하시겠습니까?', [
                    {
                      text: '취소',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: '신고',
                      onPress: async () => {
                        setCatComment(comment);
                        const reportResult = await reportComment(navigation);
                        if (reportResult) {
                          Alert.alert('댓글 신고가 완료 되었습니다.');
                        }
                      },
                    },
                  ]);
                }}
              >
                신고
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Body>
    <Right style={styles.marginRight10} />
  </ListItem>
);

export default inject(({ auth, helper, report, comment }) => ({
  userInfo: auth.userInfo,
  convertDateTime: helper.convertDateTime,
  reportComment: report.reportComment,
  setCatComment: comment.setCatComment,
  resetModifyComment: comment.resetModifyComment,
  modifyComment: comment.modifyComment,
  deleteComment: comment.deleteComment,
  resetCommentState: comment.resetCommentState,
  getCommentList: comment.getCommentList,
}))(observer(withNavigation(CatComment)));
