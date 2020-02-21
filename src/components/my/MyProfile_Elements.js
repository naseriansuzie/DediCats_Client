import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { MAIL_TO } from 'react-native-dotenv';
import * as MailComposer from 'expo-mail-composer';
import ActionSheet from 'react-native-actionsheet';
import { withNavigation } from 'react-navigation';
import { Button, ListItem, Content, Text } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    paddingTop: 20,
    fontSize: 25,
    fontWeight: '600',
  },
  profileView: {
    flex: 10,
    width: '100%',
    alignItems: 'center',
  },
  photo: {
    alignItems: 'center',
  },
  myPhoto: {
    width: 150,
    height: 150,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
    borderColor: '#edf1f5',
    borderWidth: 1,
    marginBottom: 20,
  },
  photoEdition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  photoEditionItem: {
    paddingHorizontal: 5,
  },
  photoEditionTxt: {
    color: '#677ef1',
  },
  content: { width: '95%' },
  listView: { flexDirection: 'row' },
  nickname: { width: '30%', paddingLeft: 0 },
  rest: { width: '30%', paddingRight: 30 },
  index: { color: '#444444' },
  field: { width: '70%' },
  disabledBtn: { width: '100%' },
  editTxt: { color: '#677ef1', fontWeight: 'bold' },
  askTxt: { color: '#677ef1' },
  font16: {
    fontSize: 16,
  },
});

class MyProfile_Elements extends React.Component {
  _showActionSheet = () => this.ActionSheet.show();

  componentDidMount() {
    console.log('MyProfile_Elements mount');
  }

  render() {
    console.disableYellowBox = 'true';
    const DEFAULT_USER_URL =
      'https://ca.slack-edge.com/T5K7P28NN-U5NKFNELV-g3d11e3cb933-512';
    const {
      navigation,
      userInfo,
      getPermissionAsync,
      pickImage,
      convertDateTime,
      myUri,
      myPhotoPath,
      setEditingMode,
      postMyPhoto,
      resetDefaultPhoto,
      deleteMyPhoto,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.title}>회원정보 수정</Text>
        </View>
        <View style={styles.profileView}>
          <Image
            style={styles.myPhoto}
            source={{
              uri: myUri || DEFAULT_USER_URL,
            }}
          />
          {myPhotoPath ? (
            <View style={styles.photoEdition}>
              <TouchableOpacity
                style={styles.photoEditionItem}
                onPress={async () => {
                  await postMyPhoto();
                  setEditingMode('no');
                }}
              >
                <Text style={styles.photoEditionTxt}>변경 완료</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoEditionItem}
                onPress={async () => {
                  await resetDefaultPhoto();
                  setEditingMode('no');
                }}
              >
                <Text style={styles.photoEditionTxt}>취소</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this._showActionSheet();
              }}
            >
              <Text>사진수정</Text>
            </TouchableOpacity>
          )}

          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title="프로필 사진 설정"
            options={
              myUri === null
                ? ['앨범에서 사진 선택', '취소']
                : ['앨범에서 사진 선택', '기본 이미지로 변경', '취소']
            }
            cancelButtonIndex={myUri === null ? 1 : 2}
            onPress={async index => {
              if (index === 0) {
                await getPermissionAsync();
                await pickImage('user', 'my');
                setEditingMode('yes');
              }
              if (myUri !== null) {
                if (index === 1) {
                  setEditingMode('yes');
                  await deleteMyPhoto();
                  setEditingMode('no');
                }
              }
            }}
          />

          <Content style={styles.content}>
            <ListItem style={styles.listView}>
              <View style={styles.nickname}>
                <Text style={styles.index}>
                  <MaterialCommunityIcons name="paw" style={styles.font16} />{' '}
                  Nickname
                </Text>
              </View>
              <View style={styles.field}>
                <Button disabled bordered style={styles.disabledBtn}>
                  <Text>{userInfo.nickname}</Text>
                </Button>
              </View>
            </ListItem>

            <ListItem style={styles.listView}>
              <View style={styles.rest}>
                <Text style={styles.index}>
                  <MaterialCommunityIcons
                    name="email-check-outline"
                    style={styles.font16}
                  />{' '}
                  Email
                </Text>
              </View>
              <View style={styles.field}>
                <Button disabled bordered style={styles.disabledBtn}>
                  <Text>{userInfo.email}</Text>
                </Button>
              </View>
            </ListItem>
            <ListItem style={styles.listView}>
              <View style={styles.rest}>
                <Text style={styles.index}>
                  <MaterialCommunityIcons
                    name="calendar"
                    style={styles.font16}
                  />{' '}
                  Since
                </Text>
              </View>
              <View style={styles.field}>
                <Button disabled bordered style={styles.disabledBtn}>
                  <Text>{convertDateTime(userInfo.createAt).slice(0, 8)}</Text>
                </Button>
              </View>
            </ListItem>
            <ListItem />
            <ListItem>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChangePW');
                }}
              >
                <Text style={styles.editTxt}>비밀번호 수정하기</Text>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <TouchableOpacity
                onPress={() => {
                  MailComposer.composeAsync({
                    recipients: [MAIL_TO],
                    subject: 'Dedicats 문의',
                    body: '',
                    isHtml: false,
                  });
                }}
              >
                <Text style={styles.askTxt}>문의하기</Text>
              </TouchableOpacity>
            </ListItem>
          </Content>
        </View>
      </View>
    );
  }
}

export default inject(({ auth, helper, user }) => ({
  userInfo: auth.userInfo,
  getPermissionAsync: auth.getPermissionAsync,
  pickImage: helper.pickImage,
  convertDateTime: helper.convertDateTime,
  myUri: user.myUri,
  myPhotoPath: user.myPhotoPath,
  setEditingMode: user.setEditingMode,
  postMyPhoto: user.postMyPhoto,
  resetDefaultPhoto: user.resetDefaultPhoto,
  deleteMyPhoto: user.deleteMyPhoto,
}))(observer(withNavigation(MyProfile_Elements)));
