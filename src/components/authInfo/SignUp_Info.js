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
import { Button } from 'react-native';
import { withNavigation } from 'react-navigation';

const SignUp_Info = props => (
  <Container>
    <Header />
    <Content>
      <Form>
        <Item floatingLabel>
          <Label>이메일 주소</Label>
          <Input />
        </Item>
        <Item floatingLabel last>
          <Label>닉네임</Label>
          <Input />
        </Item>
        <Item floatingLabel last>
          <Label>비밀번호</Label>
          <Input />
        </Item>
        <Item floatingLabel last>
          <Label>비밀번호 재확인</Label>
          <Input />
        </Item>
      </Form>
      <Button
        title="Submit"
        onPress={() => props.navigation.navigate('Signin')}
      />
    </Content>
  </Container>
);

SignUp_Info.navigationOptions = {
  title: '회원가입',
};

export default withNavigation(SignUp_Info);
