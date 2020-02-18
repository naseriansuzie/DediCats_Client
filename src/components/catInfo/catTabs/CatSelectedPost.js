import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
  List,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import CatComment from './CatComment';

const defaultPhotoUrl =
  'https://ca.slack-edge.com/T5K7P28NN-UFMJV5U03-g8dbe796546d-512';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: '100%',
  },
  cardView: {
    flex: 1,
    borderWidth: 10,
  },
  reportView: { alignItems: 'flex-end' },
  ellipsis: { fontSize: 24 },
  modalView: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 2,
    marginTop: 93,
  },
  reportBox: {
    backgroundColor: '#edf1f5',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    height: '10%',
    width: '60%',
    paddingTop: 5,
    paddingLeft: 5,
    marginRight: 10,
  },
  warningIcon: {
    fontSize: 17,
  },
  reportBtn: {
    backgroundColor: '#f38847',
    marginVertical: 10,
    marginLeft: 5,
    marginRight: 200,
    paddingVertical: 5,
    borderRadius: 5,
  },
  reportTxt: { color: 'white', textAlign: 'center' },
  userImg: {
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    height: 300,
    width: 380,
  },
  noComment: { color: '#7f8296', paddingTop: 15, paddingLeft: 15 },
  flex1: { flex: 1 },
});

class CatSelectedPost extends React.Component {
  componentDidMount() {
    console.log('CatSelectedPost mount');
    console.log('selectedCatPost = ', this.props.selectedCatPost);
  }

  render() {
    const {
      selectedCatPost,
      selectedCatCommentList,
      convertDateTime,
      canReportPost,
      setCanReportPost,
      reportPost,
    } = this.props;

    const usrImgUri =
      selectedCatPost.user.photoPath !== null
        ? selectedCatPost.user.photoPath
        : defaultPhotoUrl;

    return (
      <Container style={styles.container}>
        <Header style={{ display: 'none' }} />
        <Content>
          <Card style={styles.cardView}>
            <View style={styles.reportView}>
              <TouchableOpacity
                onPress={() => {
                  setCanReportPost(true);
                  console.log(canReportPost);
                }}
              >
                <AntDesign name="ellipsis1" style={styles.ellipsis} />
              </TouchableOpacity>
            </View>
            <Modal
              transparent
              visible={canReportPost}
              onRequestClose={() => {
                setCanReportPost(false);
              }}
            >
              <View style={styles.modalView}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setCanReportPost(false);
                      console.log(canReportPost);
                    }}
                  >
                    <AntDesign name="ellipsis1" style={styles.ellipsis} />
                  </TouchableOpacity>
                </View>
                <View style={styles.reportBox}>
                  <Text style={styles.paddingVertical5}>
                    <AntDesign name="warning" style={styles.warningIcon} />{' '}
                    게시글 신고
                  </Text>
                  <Text note style={styles.paddingVertical5}>
                    이 게시글에 부적절한 내용이 있습니다.
                  </Text>
                  <View style={styles.reportBtn}>
                    <TouchableOpacity
                      onPress={async () => {
                        const result = await reportPost();
                        if (result) {
                          Alert.alert(
                            '신고 완료',
                            '해당 신고 요청이 관리자에게 접수되었습니다.',
                            [
                              {
                                text: '확인',
                                onPress: () => setCanReportPost(false),
                              },
                            ],
                          );
                        }
                      }}
                    >
                      <Text style={styles.reportTxt}>신고</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => setCanReportPost(false)}
                />
              </View>
            </Modal>
            <CardItem style={styles.flex1}>
              <Left>
                <Thumbnail
                  square
                  style={styles.userImg}
                  source={{ uri: usrImgUri }}
                />
                <Body>
                  <Text>{selectedCatPost.user.nickname}</Text>
                  <Text note>{convertDateTime(selectedCatPost.createAt)}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem style={styles.flex1}>
              <Body>
                {selectedCatPost.photos.length > 0 ? (
                  <Image
                    source={{ uri: selectedCatPost.photos[0].path }}
                    style={styles.image}
                  />
                ) : (
                  <View />
                )}
                <Text style={{ paddingTop: 20 }}>
                  {selectedCatPost.content}
                </Text>
              </Body>
            </CardItem>
          </Card>
          <List>
            {selectedCatCommentList ? (
              selectedCatCommentList.map((comment, idx) => (
                <CatComment
                  key={`comment_${comment.id}`}
                  idx={idx}
                  myPhoto={comment.user.photoPath}
                  userNickname={comment.user.nickname}
                  comment={comment.content}
                  date={comment.createAt}
                />
              ))
            ) : (
              <Text style={styles.noComment}>댓글이 없습니다.</Text>
            )}
          </List>
        </Content>
      </Container>
    );
  }
}

export default inject(({ cat, helper, report }) => ({
  selectedCatPost: cat.selectedCatPost,
  selectedCatCommentList: cat.selectedCatCommentList,
  convertDateTime: helper.convertDateTime,
  canReportPost: report.canReportPost,
  setCanReportPost: report.setCanReportPost,
  reportPost: report.reportPost,
}))(observer(CatSelectedPost));
