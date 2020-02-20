import React from 'react';
import { inject, observer } from 'mobx-react';
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
  modificationView: { flexDirection: 'row' },
});

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';
// const defaultPhotoUrl =
//   'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg';

const CatComment = ({
  comment,
  userId,
  myPhoto,
  userNickname,
  content,
  date,
  convertDateTime,
  userInfo,
  reportComment,
  setSelectedCatComment,
  modifyComment,
  deleteComment,
  resetCommentState,
  getCommentList,
}) => (
  <ListItem thumbnail style={styles.container}>
    <Left>
      <Thumbnail
        square
        source={{ uri: myPhoto || defaultPhotoUrl }}
        style={styles.radius}
      />
    </Left>
    <Body>
      <View>
        <Text>{userNickname}</Text>
        <Text>{content}</Text>
        <View style={styles.modificationView}>
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
                Alert.alert('댓글 삭제', '해당 댓글을 삭제하시겠습니까?', [
                  {
                    text: '취소',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: '삭제',
                    onPress: async () => {
                      await deleteComment(comment);
                      resetCommentState();
                      getCommentList();
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
                  Alert.alert('댓글 신고', '이 댓글 내용을 신고하시겠습니까?', [
                    {
                      text: '취소',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: '신고',
                      onPress: async () => {
                        setSelectedCatComment(comment);
                        const reportResult = await reportComment();
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
    <Right style={styles.marginRight10}>
      <Text>{convertDateTime(date)}</Text>
    </Right>
  </ListItem>
);

export default inject(({ helper, report, cat, auth }) => ({
  convertDateTime: helper.convertDateTime,
  reportComment: report.reportComment,
  setSelectedCatComment: cat.setSelectedCatComment,
  modifyComment: cat.modifyComment,
  deleteComment: cat.deleteComment,
  resetCommentState: cat.resetCommentState,
  getCommentList: cat.getCommentList,
  userInfo: auth.userInfo,
}))(observer(CatComment));
