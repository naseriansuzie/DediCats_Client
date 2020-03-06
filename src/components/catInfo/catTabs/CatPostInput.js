/* eslint-disable no-nested-ternary */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Form, Textarea, Text } from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '70%',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: '20%',
    marginBottom: '60%',
    borderRadius: 25,
    position: 'absolute',
    zIndex: 1,
  },
  inputView: {
    width: '95%',
    marginTop: '5%',
  },
  inputForm: {
    borderWidth: 2,
    width: '100%',
    borderRadius: 5,
    borderColor: '#EDF1F5',
    marginTop: 5,
  },
  inputBottomView: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  imageView: {
    width: '80%',
    flexDirection: 'row',
  },
  removeBtn: {
    position: 'absolute',
    zIndex: 1,
    top: 40,
    left: 15,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#F38847',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  removeBtnTxt: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EDF1F5',
    position: 'absolute',
    left: 25,
    marginTop: 50,
  },
  addImageBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageIcon: { fontSize: 30, paddingLeft: 10, color: '#6772F1' },
  addImageTxt: { fontSize: 14, color: '#6772F1', paddingLeft: 5 },
  btnView: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginRight: '18%',
  },
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -50,
    right: 50,
    padding: 10,
    margin: 0,
    backgroundColor: '#6772F1',
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: '#ffffff',
    fontSize: 16,
  },
  paddingTop5: {
    paddingTop: 5,
  },
});

const CatPostInput = ({
  navigation,
  postModifyState,
  selectedCatInputContent,
  selectedCatUri,
  updateInput,
  getPermissionAsync,
  pickImage,
  removePhoto,
  validateAddInput,
  addPost,
  exitInputModal,
}) => (
  <TouchableWithoutFeedback onPress={() => {}}>
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.inputView}>
        <Form style={styles.inputForm}>
          <Textarea
            rowSpan={selectedCatInputContent.length > 27 ? 4 : 2}
            maxLength={100}
            placeholder="글을 입력해주세요."
            value={selectedCatInputContent}
            onChangeText={text =>
              updateInput('cat', 'selectedCatInputContent', text)
            }
          />
        </Form>
        <View>
          <View style={styles.inputBottomView}>
            <View style={styles.imageView}>
              {postModifyState ? (
                <View>
                  <Text note>*게시글만 수정 가능합니다.</Text>
                </View>
              ) : selectedCatUri ? (
                <View>
                  <TouchableHighlight
                    style={styles.removeBtn}
                    underlayColor="#FFECE0"
                    onPress={removePhoto}
                  >
                    <Text style={styles.removeBtnTxt}>X</Text>
                  </TouchableHighlight>
                  <Image
                    style={styles.image}
                    source={{ uri: selectedCatUri }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addImageBtn}
                  onPress={async () => {
                    await getPermissionAsync();
                    pickImage('cat', 'selectedCat');
                  }}
                >
                  <SimpleLineIcons style={styles.imageIcon} name="picture" />
                  <Text style={styles.addImageTxt}>이미지 첨부(1장)</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.btnView}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={async () => {
                  const validation = validateAddInput(
                    'cat',
                    'selectedCatInputContent',
                  );
                  if (validation) {
                    postModifyState
                      ? await addPost('update', navigation)
                      : await addPost('new', navigation);
                  }
                }}
              >
                <Text style={styles.submitBtnTxt}>
                  {postModifyState ? '수정' : '등록'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnView}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => exitInputModal()}
              >
                <Text style={styles.submitBtnTxt}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.paddingTop5} />
        </View>
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default inject(({ cat, helper, auth, post }) => ({
  postModifyState: cat.postModifyState,
  selectedCatInputContent: cat.selectedCatInputContent,
  selectedCatUri: cat.selectedCatUri,
  updateInput: helper.updateInput,
  pickImage: helper.pickImage,
  removePhoto: helper.removePhoto,
  validateAddInput: helper.validateAddInput,
  getPermissionAsync: auth.getPermissionAsync,
  addPost: post.addPost,
  exitInputModal: post.exitInputModal,
}))(observer(withNavigation(CatPostInput)));
