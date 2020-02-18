import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
  Text,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import { withNavigation } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  userImg: {
    borderRadius: 10,
    height: 50,
    width: 50,
  },
});

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';

class CatPost extends React.Component {
  setCatPostHere = item => {
    this.props.setCatPost(item);
    this.props.navigation.navigate('SelectedPost');
  };

  render() {
    const { content, createAt, user, photos, id } = this.props.item;
    const usrImgUri =
      user.photoPath !== null ? user.photoPath : defaultPhotoUrl;

    return (
      <TouchableWithoutFeedback
        onPress={() => this.setCatPostHere(this.props.item)}
      >
        <Card style={{ width: 400, borderRadius: 20, overflow: 'hidden' }}>
          <CardItem>
            <Left>
              <Thumbnail
                square
                style={styles.userImg}
                source={{ uri: usrImgUri }}
              />
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
            {photos.length > 0 ? (
              <Image
                source={{ uri: photos[0].path }}
                style={{ height: 300, width: null, flex: 1 }}
              />
            ) : (
              <View />
            )}
          </CardItem>
          <CardItem>
            <Text>{content}</Text>
          </CardItem>
          <CardItem style={{ alignSelf: 'flex-end' }}>
            <Left />
            <Right>
              <Button transparent>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '10%' }}>
                    <Icon
                      active
                      name="chatbubbles"
                      style={{ color: '#6772f1' }}
                    />
                  </View>
                  <View style={{ width: '45%' }}>
                    <Text note style={{ paddingLeft: 5, paddingRight: 0 }}>
                      n 개의 댓글
                    </Text>
                  </View>
                  <View style={{ width: '45%' }}>
                    <Text note style={{ paddingLeft: 5 }}>
                      댓글달기
                    </Text>
                  </View>
                </View>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(CatPost);
