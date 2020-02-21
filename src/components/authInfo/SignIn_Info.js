import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
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
} from 'native-base';
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
  scrollView: { paddingLeft: 10, paddingRight: 10 },
  btn: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#677ef1',
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  signUpBtn: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#EDF1F5',
    borderRadius: 5,
    marginHorizontal: 120,
  },
  white: {
    color: 'white',
  },
  light: {
    color: '#868e96',
  },
  font16: {
    fontSize: 16,
  },
});

const SignIn_Info = ({
  email,
  PW,
  updateInput,
  signIn,
  clearInput,
  navigation,
}) => (
  <Container>
    <Header />
    <View style={styles.logo}>
      <Text style={styles.logoTxt}>Dedicats</Text>
    </View>
    <Content style={styles.scrollView}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior="padding"
        enabled
      >
        <Form>
          <Item floatingLabel>
            <Label>
              <MaterialCommunityIcons
                style={styles.font16}
                name="email-check-outline"
              />{' '}
              hello@cat.com
            </Label>
            <Input
              onChangeText={text => {
                updateInput('auth', 'email', text);
              }}
              value={email}
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <MaterialCommunityIcons
                style={styles.font16}
                name="lock-outline"
              />{' '}
              Password
            </Label>
            <Input
              onChangeText={text => updateInput('auth', 'PW', text)}
              secureTextEntry
              value={PW}
            />
          </Item>
        </Form>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            if (email && PW) {
              const signInResult = await signIn();
              if (signInResult) navigation.navigate('AuthLoading');
              return;
            }

            Alert.alert('모든 정보를 입력해주세요.');
          }}
        >
          <Text style={styles.white}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => {
            clearInput(
              'auth',
              'email',
              'PW',
              'nickname',
              'confirmPW',
              'reConfirmPW',
            );
            navigation.navigate('Sign Up');
          }}
        >
          <Text style={styles.light}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 30 }}>
          <Text style={{ textAlign: 'center' }}>비밀번호를 잊으셨나요?</Text>
          <Text style={{ textAlign: 'center' }}>
            <Text
              style={{ color: 'blue', fontWeight: 'bold' }}
              onPress={() => {
                clearInput(
                  'auth',
                  'email',
                  'PW',
                  'nickname',
                  'confirmPW',
                  'reConfirmPW',
                );
                navigation.navigate('findPW');
              }}
            >
              여기
            </Text>
            를 클릭해주세요
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Content>
  </Container>
);

export default inject(({ auth, helper }) => ({
  email: auth.email,
  PW: auth.PW,
  signIn: auth.signIn,
  updateInput: helper.updateInput,
  clearInput: helper.clearInput,
}))(observer(withNavigation(SignIn_Info)));
