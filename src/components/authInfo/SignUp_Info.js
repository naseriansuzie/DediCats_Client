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
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    padding: 50,
  },
  logoTxt: {
    fontSize: 50,
    fontWeight: '600',
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

const SignUp_Info = ({
  email,
  nickname,
  confirmPW,
  reConfirmPW,
  updateInput,
  validateSignUp,
  updateState,
  navigation,
}) => (
  <Container>
    <Header />
    <View style={styles.logo}>
      <Text
        style={styles.logoTxt}
        onPress={() => navigation.navigate('Sign In')}
      >
        Dedicat
      </Text>
      <Text style={styles.title}>회원가입</Text>
    </View>
    <Content>
      <Form>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons
              name="email-check-outline"
              style={styles.font16}
            />{' '}
            hello@cat.com
          </Label>
          <Input
            onChangeText={text => updateInput('email', text)}
            value={email}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="paw" style={{ fontSize: 16 }} />{' '}
            nickname
          </Label>
          <Input
            onChangeText={text => updateInput('nickname', text)}
            value={nickname}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" style={styles.font16} />{' '}
            Password
          </Label>
          <Input
            onChangeText={text => updateInput('confirmPW', text)}
            value={confirmPW}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" style={styles.font16} />{' '}
            Password 재확인
          </Label>
          <Input
            onChangeText={text => updateInput('reConfirmPW', text)}
            value={reConfirmPW}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          const validation = validateSignUp();
          console.log(validation);
          if (validation) {
            const emailResult = await updateState('SignUp');
            if (emailResult) {
              navigation.navigate('Email Certified');
            }
          }
        }}
      >
        <Text style={styles.white}>Submit</Text>
      </TouchableOpacity>
    </Content>
  </Container>
);

SignUp_Info.navigationOptions = {
  title: '회원가입',
};

export default inject(({ auth, helper }) => ({
  isSignUp: auth.isSignUp,
  email: auth.email,
  nickName: auth.nickName,
  confirmPW: auth.confirmPW,
  reConfirmPW: auth.reConfirmPW,
  validateSignUp: auth.validateSignUp,
  updateState: auth.updateState,
  updateInput: helper.updateInput,
}))(observer(withNavigation(SignUp_Info)));
