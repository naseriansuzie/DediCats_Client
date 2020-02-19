import React from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    padding: 50,
  },
  displayNone: {
    display: 'none',
  },
  title: {
    paddingTop: 20,
    fontSize: 25,
    fontWeight: '600',
  },
  btn: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#677ef1',
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  white: {
    color: 'white',
  },
  font16: {
    fontSize: 16,
  },
});

const ChangePW = ({
  PW, confirmPW, reConfirmPW, updateInput, changePW, navigation,
}) => (
  <Container>
    <Header style={styles.displayNone} />
    <View style={styles.logo}>
      <Text style={styles.title}>비밀번호 변경</Text>
    </View>
    <Content>
      <Form>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" style={styles.font16} />{' '}
            기존 비밀번호
          </Label>
          <Input
            onChangeText={(text) => updateInput('auth', 'PW', text)}
            secureTextEntry
            value={PW}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" style={styles.font16} />{' '}
            새로운 비밀번호
          </Label>
          <Input
            onChangeText={(text) => updateInput('auth', 'confirmPW', text)}
            secureTextEntry
            value={confirmPW}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" style={styles.font16} />{' '}
            새로운 비밀번호 재확인
          </Label>
          <Input
            onChangeText={(text) => updateInput('auth', 'reConfirmPW', text)}
            secureTextEntry
            value={reConfirmPW}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          const reuslt = await changePW();
          if (reuslt) navigation.goBack();
        }}
      >
        <Text style={styles.white}>비밀변호 변경</Text>
      </TouchableOpacity>
    </Content>

  </Container>
);

export default inject(({ helper, auth, user }) => ({
  changePW: user.changePW,
  PW: auth.PW,
  confirmPW: auth.confirmPW,
  reConfirmPW: auth.reConfirmPW,
  updateInput: helper.updateInput,
}))(observer(ChangePW));
