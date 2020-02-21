import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
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
  navigation,
  updateInput,
  emailVerification,
  emailCode,
  signUp,
}) => (
  <Container>
    <Header style={styles.hide} />
    <View style={styles.logo}>
      <Text style={styles.logoTxt}>Dedicats</Text>
      <Text style={styles.title}>이메일 인증</Text>
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
            onChangeText={text =>
              updateInput('auth', 'emailVerification', text)
            }
            value={emailVerification}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          if (emailCode === emailVerification) {
            const signUpResult = signUp();
            if (signUpResult) {
              navigation.navigate('Sign In');
            }
          } else {
            Alert.alert(
              '이메일 인증 코드가 다릅니다. 이메일을 다시 확인해주세요!',
            );
          }
        }}
      >
        <Text style={styles.white}>Submit</Text>
      </TouchableOpacity>
    </Content>
  </Container>
);

export default inject(({ helper, auth }) => ({
  updateInput: helper.updateInput,
  emailVerification: auth.emailVerification,
  emailCode: auth.emailCode,
  signUp: auth.signUp,
}))(observer(withNavigation(emailCertified)));
