import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { Form, Textarea } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  inputView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputForm: {
    borderWidth: 2,
    width: '80%',
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: '#edf1f5',
  },
  textArea: {
    width: '100%',
  },
  submitBtn: {
    width: 50,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#677ef1',
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: 'white',
    fontSize: 17,
  },
});

const CatCommentInput = ({
  navigation,
  selectedCatInputComment,
  commentModifyState,
  getCommentList,
  addComment,
  setCommentModify,
  resetCommentState,
  validateAddInput,
  updateInput,
}) => (
  <View style={styles.container}>
    <KeyboardAvoidingView>
      <View style={styles.inputView}>
        <Form style={styles.inputForm}>
          <Textarea
            style={styles.textArea}
            rowSpan={selectedCatInputComment.length > 27 ? 3 : 2}
            placeholder="댓글을 입력해주세요."
            value={selectedCatInputComment}
            onChangeText={text =>
              updateInput('cat', 'selectedCatInputComment', text)
            }
          />
        </Form>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={async () => {
            try {
              const validation = validateAddInput('selectedCatInputComment');
              if (validation) {
                if (commentModifyState) {
                  await addComment('update', navigation);
                  setCommentModify();
                  resetCommentState();
                  getCommentList(navigation);
                } else {
                  await addComment('new', navigation);
                }
              }
            } catch (err) {
              console.dir(err);
            }
          }}
        >
          <Text style={styles.submitBtnTxt}>
            {commentModifyState ? '수정' : '등록'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </View>
);

export default inject(({ cat, helper }) => ({
  selectedCatInputComment: cat.selectedCatInputComment,
  commentModifyState: cat.commentModifyState,
  getCommentList: cat.getCommentList,
  addComment: cat.addComment,
  setCommentModify: cat.setCommentModify,
  resetCommentState: cat.resetCommentState,
  validateAddInput: helper.validateAddInput,
  updateInput: helper.updateInput,
}))(observer(withNavigation(CatCommentInput)));
