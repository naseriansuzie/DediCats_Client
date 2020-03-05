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
    borderColor: '#EDF1F5',
  },
  textArea: {
    width: '100%',
  },
  submitBtn: {
    width: 50,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6772F1',
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: '#ffffff',
    fontSize: 17,
  },
});

const CatCommentInput = ({
  navigation,
  inputComment,
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
            rowSpan={inputComment.length > 27 ? 3 : 2}
            placeholder="댓글을 입력해주세요."
            value={inputComment}
            onChangeText={text => updateInput('comment', 'inputComment', text)}
          />
        </Form>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={async () => {
            const validation = validateAddInput('comment', 'inputComment');
            if (validation) {
              if (commentModifyState) {
                await addComment('update', navigation);
                setCommentModify();
                resetCommentState('update');
                getCommentList(navigation);
              } else {
                addComment('new', navigation);
              }
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

export default inject(({ helper, comment }) => ({
  inputComment: comment.inputComment,
  commentModifyState: comment.commentModifyState,
  getCommentList: comment.getCommentList,
  addComment: comment.addComment,
  setCommentModify: comment.setCommentModify,
  resetCommentState: comment.resetCommentState,
  validateAddInput: helper.validateAddInput,
  updateInput: helper.updateInput,
}))(observer(withNavigation(CatCommentInput)));
