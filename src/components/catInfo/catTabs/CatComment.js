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
});

const defaultPhotoUrl = [
  'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512',
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512',
][Math.floor(Math.random() * 2)];
// const defaultPhotoUrl =
//   'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg';

const CatComment = ({
  myPhoto,
  userNickname,
  comment,
  date,
  convertDateTime,
  canReportComment,
  reportComment,
  setCanReportComment,
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
        <Text>{comment}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Text note>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text note>삭제</Text>
          </TouchableOpacity>
          {canReportComment ? (
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
                        const result = await reportComment();
                        if (result) {
                          setCanReportComment(false);
                        }
                      },
                    },
                  ]);
                }}
              >
                신고
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    </Body>
    <Right style={styles.marginRight10}>
      <Text>{convertDateTime(date)}</Text>
    </Right>
  </ListItem>
);

export default inject(({ helper, report }) => ({
  convertDateTime: helper.convertDateTime,
  canReportComment: report.canReportComment,
  reportComment: report.reportComment,
  setCanReportComment: report.setCanReportComment,
}))(observer(CatComment));
