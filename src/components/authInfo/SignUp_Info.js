import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Text,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  hide: { display: 'none' },
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
  keyboardAvoiding: { width: '100%' },
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
  paddingLeft20: { paddingLeft: 20 },
});

const SignUp_Info = ({
  navigation,
  email,
  nickname,
  confirmPW,
  reConfirmPW,
  validateSignUp,
  emailCertified,
  updateInput,
}) => (
  <Container>
    <Header style={styles.hide} />
    <View style={styles.logo}>
      <Text
        style={styles.logoTxt}
        onPress={() => navigation.navigate('Sign In')}
      >
        Dedicats
      </Text>
      <Text style={styles.title}>회원가입</Text>
    </View>
    <Content>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior="padding"
        enabled
      >
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
              onChangeText={text => updateInput('auth', 'email', text)}
              value={email}
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <MaterialCommunityIcons name="paw" style={styles.font16} />{' '}
              nickname
            </Label>
            <Input
              onChangeText={text => updateInput('auth', 'nickname', text)}
              value={nickname}
            />
          </Item>
          <Text note style={styles.paddingLeft20}>
            *닉네임은 가입 시 1회 지정 가능합니다.
          </Text>
          <Item floatingLabel>
            <Label>
              <MaterialCommunityIcons
                name="lock-outline"
                style={styles.font16}
              />{' '}
              Password
            </Label>
            <Input
              onChangeText={text => updateInput('auth', 'confirmPW', text)}
              secureTextEntry
              value={confirmPW}
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <MaterialCommunityIcons
                name="lock-outline"
                style={styles.font16}
              />{' '}
              Password 재확인
            </Label>
            <Input
              onChangeText={text => updateInput('auth', 'reConfirmPW', text)}
              secureTextEntry
              value={reConfirmPW}
            />
          </Item>
        </Form>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            const validation = validateSignUp();
            if (!validation) return;

            const emailResult = await emailCertified();
            if (emailResult) {
              navigation.navigate('Email Certified');
            }
          }}
        >
          <Text style={styles.white}>Submit</Text>
        </TouchableOpacity>
        <Text note style={styles.paddingLeft20}>
          *가입 신청 후 이메일로 인증코드가 발송됩니다.
        </Text>
      </KeyboardAvoidingView>
    </Content>
  </Container>
);

SignUp_Info.navigationOptions = {
  title: '회원가입',
};

export default inject(({ auth, helper }) => ({
  email: auth.email,
  nickName: auth.nickName,
  confirmPW: auth.confirmPW,
  reConfirmPW: auth.reConfirmPW,
  validateSignUp: auth.validateSignUp,
  emailCertified: auth.emailCertified,
  updateInput: helper.updateInput,
}))(observer(withNavigation(SignUp_Info)));
