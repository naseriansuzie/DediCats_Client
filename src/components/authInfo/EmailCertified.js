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

const emailCertified = ({
  email,
  nickName,
  confirmPW,
  reConfirmPW,
  updateInput,
  validateSignUp,
  updateState,
  navigation,
  emailCertified,
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
            이메일 인증 코드
          </Label>
          <Input
            onChangeText={(text) => updateInput('email', text)}
            value={email}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          const validation = await validateSignUp();
          if (validation) {
            const signUpResult = await updateState('SignUp');
            if (signUpResult) {
              navigation.navigate('Sign In');
            }
          }
        }}
      >
        <Text style={styles.white}>Submit</Text>
      </TouchableOpacity>
    </Content>
  </Container>
);
// SignUp_Info.navigationOptions = {
//   title: '회원가입',
// };

export default inject(({ user }) => ({
  email: user.info.email,
  nickName: user.info.nickName,
  confirmPW: user.info.confirmPW,
  reConfirmPW: user.info.reConfirmPW,
  updateInput: user.updateInput,
  validateSignUp: user.validateSignUp,
  updateState: user.updateState,
}))(observer(withNavigation(emailCertified)));
