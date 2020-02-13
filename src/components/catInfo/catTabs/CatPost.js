import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';


const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 20,
  },
});

// {
//   id: 3,
//   content: "바보",
//   status: "Y",
//   createAt: "2020-02-05T04:15:21.607Z",
//   updateAt: "2020-02-05T04:15:21.607Z",
//   user: {
//       id: 1,
//       nickname: "testUser",
//       photoPath: null
//   },
//   photos: [
//       {
//           id: 2,
//           path: "경로"
//       }
//   ]
// },

class CatPost extends React.Component {
  setCatPostHere = (item) => {
    console.log('setCatPostHere :', item);
    this.props.setCatPost(item);
    this.props.navigation.navigate('SelectedPost');
  };

  render() {
    // console.log(this.props)
    const { content, createAt, user } = this.props.item
    return (
      <TouchableWithoutFeedback onPress={() => this.setCatPostHere(this.props.item)}>
        <Card style={{ width: 400, borderRadius: 20, overflow: 'hidden' }}>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img2.jpg'}} />
              <Body>
                <Text>{user.nickname}</Text>
              </Body>
            </Left>
            <Right>
              <Text>{createAt}</Text>
            </Right>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img3.jpg'}} style={{height: 200, width: null, flex: 1}}/>
          </CardItem>
          <CardItem>
            {/* <Left><L/eft> */}
            <Text note>{content}</Text>
          </CardItem>
          <CardItem style={{ marginLeft: 260 }}>
            <Right>
              <Button
                // onPress={() => this.props.navigation.navigate('SelectedPost')}
                transparent
              >
                <Icon active name="chatbubbles" style={{ marginRight: 10 }} />
                <Text>4 Comments</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </TouchableWithoutFeedback>
    // <TouchableOpacity
    //   style={styles.container}
    //   onPress={() => props.navigation.navigate('SelectedPost')}
    // >
    //   <Text>cat post</Text>
    // </TouchableOpacity>
    );
  }
}

export default withNavigation(CatPost);
