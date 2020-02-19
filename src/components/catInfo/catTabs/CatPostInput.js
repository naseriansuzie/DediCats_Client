/* eslint-disable no-nested-ternary */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import { Form, Textarea, Text } from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  inputView: {
    width: '95%',
  },
  inputForm: {
    borderWidth: 2,
    width: '100%',
    borderRadius: 5,
    borderColor: '#edf1f5',
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
    top: -5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: '#f38847',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  removeBtnTxt: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#edf1f5',
  },
  addImageBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageIcon: { fontSize: 30, paddingLeft: 10, color: '#677ef1' },
  addImageTxt: { fontSize: 14, color: '#677ef1', paddingLeft: 5 },
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 20,
    marginRight: 30,
    padding: 10,
    margin: 0,
    backgroundColor: '#677ef1',
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: 'white',
    fontSize: 17,
  },
  paddingTop5: {
    paddingTop: 5,
  },
});

const CatPostInput = ({
  postModifyState,
  selectedCatInputContent,
  selectedCatUri,
  updateInput,
  getPermissionAsync,
  pickImage,
  removePhoto,
  validateAddInput,
  addPost,
  setPostModify,
  _handleRefresh,
}) => (
  <View style={styles.container}>
    <View style={styles.inputView}>
      <Form style={styles.inputForm}>
        <Textarea
          rowSpan={selectedCatInputContent.length > 27 ? 4 : 2}
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
                  underlayColor="#ffece0"
                  onPress={removePhoto}
                >
                  <Text style={styles.removeBtnTxt}>X</Text>
                </TouchableHighlight>
                <Image style={styles.image} source={{ uri: selectedCatUri }} />
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
          <View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={async () => {
                try {
                  const validation = validateAddInput(
                    'selectedCatInputContent',
                  );
                  if (validation) {
                    postModifyState
                      ? await addPost('update')
                      : await addPost('new');
                  }
                } catch (err) {
                  console.log('something is wrong');
                  console.dir(err);
                }
              }}
            >
              <Text style={styles.submitBtnTxt}>
                {postModifyState ? '수정' : '등록'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.paddingTop5} />
      </View>
    </View>
  </View>
);

export default inject(({ cat, helper, auth, post }) => ({
  postModifyState: cat.postModifyState,
  selectedCatInputContent: cat.selectedCatInputContent,
  selectedCatUri: cat.selectedCatUri,
  updateInput: helper.updateInput,
  getPermissionAsync: auth.getPermissionAsync,
  pickImage: helper.pickImage,
  removePhoto: helper.removePhoto,
  validateAddInput: helper.validateAddInput,
  addPost: post.addPost,
  setPostModify: post.setPostModify,
  _handleRefresh: post._handleRefresh,
}))(observer(CatPostInput));
