import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 20,
  },
});

class CatPost extends React.Component {
  setCatPostHere = (item) => {
    this.props.setCatPost(item);
    this.props.navigation.navigate('SelectedPost');
  };

  render() {
    const { content, createAt, user, photos } = this.props.item;
    const usrImgUri = user.photoPath !== null ? user.photoPath : '';
    const postImgUri = photos[0].path !== null ? photos[0].path : '';
    const { canReportPost, setCanReportPost, reportPost } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={() => this.setCatPostHere(this.props.item)}
      >
        <Card style={{ width: 400, borderRadius: 20, overflow: 'hidden' }}>
          <CardItem>
            <Left>
              <Thumbnail source={{uri: usrImgUri}} />
              <Body>
                <Text>{user.nickname}</Text>
              </Body>
            </Left>
            <Right>
              <Text style={{ color: 'grey' }}>
                {this.props.convertDateTime(createAt)}
              </Text>
            </Right>
          </CardItem>
          <CardItem cardBody>
            <Image source={{uri: postImgUri}} style={{height: 200, width: null, flex: 1}}/>
          </CardItem>
          <CardItem>
            <Text note>{content}</Text>
          </CardItem>
          <CardItem style={{ marginLeft: 260 }}>
            <Right>
              <Button transparent>
                <Icon active name="chatbubbles" style={{ marginRight: 10 }} />
                <Text>4 Comments</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}

export default inject(({ report }) => ({
  canReportPost: report.canReportPost,
  setCanReportPost: report.setCanReportPost,
  reportPost: report.reportPost,
}))(observer(withNavigation(CatPost)));
