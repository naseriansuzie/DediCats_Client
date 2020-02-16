import React from 'react';
import { inject, observer } from 'mobx-react';
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
  selectedCatInputComment,
  updateInput,
  validateAddInput,
  addComment,
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
          onPress={() => {
            const validation = validateAddInput('selectedCatInputComment');
            console.log(validation);
            if (validation) {
              addComment();
            }
          }}
        >
          <Text style={styles.submitBtnTxt}>등록</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </View>
);

export default inject(({ cat, helper }) => ({
  selectedCatInputComment: cat.selectedCatInputComment,
  addComment: cat.addComment,
  validateAddInput: helper.validateAddInput,
  updateInput: helper.updateInput,
}))(observer(CatCommentInput));
