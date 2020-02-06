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
});

const SignUp_Info = ({
  email,
  nickName,
  confirmPW,
  reConfirmPW,
  updateInput,
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
            <MaterialCommunityIcons name="email-check-outline" size="16" />{' '}
            hello@cat.com
          </Label>
          <Input
            onChangeText={text => updateInput('email', text)}
            value={email}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="paw" size="16" /> Nickname
          </Label>
          <Input
            onChangeText={text => updateInput('nickName', text)}
            value={nickName}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" size="16" /> Password
          </Label>
          <Input
            onChangeText={text => updateInput('confirmPW', text)}
            value={confirmPW}
          />
        </Item>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons name="lock-outline" size="16" /> Password
            재확인
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
          await updateState('SignUp');
          navigation.navigate('Sign In');
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

export default inject(({ user }) => ({
  updateInput: user.updateInput,
  email: user.userInfo.email,
  nickName: user.userInfo.nickName,
  confirmPW: user.userInfo.confirmPW,
  reConfirmPW: user.userInfo.reConfirmPW,
  updateState: user.updateState,
}))(observer(withNavigation(SignUp_Info)));
