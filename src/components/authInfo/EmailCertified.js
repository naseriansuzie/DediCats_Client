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
  StyleSheet, Text, TouchableOpacity, View, Alert,
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
  updateInput,
  navigation,
  emailCode,
  emailVerification,
  signUp,
}) => (
  <Container>
    <Header />
    <View style={styles.logo}>
      <Text
        style={styles.logoTxt}
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
            onChangeText={(text) => updateInput('emailVerification', text)}
            value={emailVerification}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          if (emailCode === emailVerification) {
            const signUpresult = signUp();
            if (signUpresult) navigation.navigate('Sign In');
          } else {
            Alert.alert('이메일 인증 코드가 다릅니다. 이메일을 다시 확인해주세요!');
          }
        }}
      >
        <Text style={styles.white}>Submit</Text>
      </TouchableOpacity>
    </Content>
  </Container>
);

export default inject(({ user }) => ({
  updateInput: user.updateInput,
  emailCode: user.info.emailCode,
  emailVerification: user.info.emailVerification,
  signUp: user.signUp,
}))(observer(withNavigation(emailCertified)));
