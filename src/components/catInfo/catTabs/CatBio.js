import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Badge,
  Text,
  Icon,
  Picker,
  Form,
  ListItem,
  Input,
  Right,
  Body,
} from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons';
import Rainbow from './Rainbow';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  rainbowView: { alignItems: 'flex-end' },
  reportBtn: { marginTop: 10, marginRight: 25 },
  catCut: { width: '100%', paddingBottom: 10 },
  peanuts: { flex: 1, flexDirection: 'row', paddingVertical: 15 },
  peanut: {
    width: 80,
    height: 40,
    marginRight: 10,
    backgroundColor: '#edf1f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPeanut: {
    width: 80,
    height: 40,
    marginRight: 10,
    backgroundColor: '#ffece0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutTxt: { color: '#767577', fontWeight: 'bold' },
  tagGuide: { width: '100%', paddingBottom: 10 },
  tagView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f38847',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  submit: {
    alignItems: 'center',
    padding: 10,
    margin: 0,
    backgroundColor: '#677ef1',
    borderRadius: 10,
  },
  submitTxt: {
    color: 'white',
    fontSize: 17,
  },
  flex1: { flex: 1 },
  width100: { width: '100%' },
  row: { flexDirection: 'row' },
  font15: { fontSize: 15 },
  font18: { fontSize: 18 },
  font20: { fontSize: 20 },
});

class CatBio extends React.Component {
  componentDidMount() {
    console.log('CatBio mount');
    const { catId } = this.props;
    console.log('bio 정보를 불러올 고양이 id: ', catId);
    this.props.getSelectedCatInfo(catId);
  }

  render() {
    const {
      cat,
      today,
      rainbowOpen,
      toggleRainbowOpen,
      cutClicked,
      tags,
      newTag,
      selectCut,
      postCut,
      postCatToday,
      validateTag,
      updateInput,
      makeDateTime,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
          <Container style={styles.flex}>
            <Header style={{ display: 'none' }} />
            <Content padder>
              <View style={styles.rainbowView}>
                <TouchableOpacity
                  onPress={toggleRainbowOpen}
                  style={styles.reportBtn}
                >
                  <Text style={styles.font18}>
                    <SimpleLineIcons style={styles.font20} name="directions" />
                    {'신고 '}
                    {rainbowOpen ? (
                      <SimpleLineIcons style={styles.font15} name="arrow-up" />
                    ) : (
                      <SimpleLineIcons
                        style={styles.font15}
                        name="arrow-down"
                      />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              {rainbowOpen ? <Rainbow /> : <View />}
              <Card transparent>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>
                      {`추정 종 : ${cat.species}`}
                    </Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>
                      {`${cat.nickname}를 소개해요!`}
                    </Text>
                    <Text>{`${cat.description}`}</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.catCut}>중성화 유무</Text>
                    <View style={styles.row}>
                      <TouchableHighlight
                        style={cutClicked.Y ? styles.noPeanut : styles.peanut}
                        underlayColor="#f38847"
                        onPress={async () => {
                          if (
                            cutClicked.Y ||
                            cutClicked.N ||
                            cutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await selectCut('info', 'Y');
                            postCut('Y');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>Yes {cat.cut.Y}</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={cutClicked.N ? styles.noPeanut : styles.peanut}
                        underlayColor="#f38847"
                        onPress={async () => {
                          if (
                            cutClicked.Y ||
                            cutClicked.N ||
                            cutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await selectCut('info', 'N');
                            postCut('N');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>No {cat.cut.N}</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={
                          cutClicked.unknown ? styles.noPeanut : styles.peanut
                        }
                        underlayColor="#f38847"
                        onPress={async () => {
                          if (
                            cutClicked.Y ||
                            cutClicked.N ||
                            cutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await selectCut('info', 'unknown');
                            postCut('unknown');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>
                          몰라요 {cat.cut.unknown}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>
                      오늘 {cat.nickname}의 건강 상태
                    </Text>
                    <Text>{cat.today}</Text>
                    {cat.today &&
                    makeDateTime(cat.todayTime) === makeDateTime(new Date()) ? (
                      <Text>{cat.today}</Text>
                    ) : (
                      <Form
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                        }}
                      >
                        <Picker
                          note
                          enabled
                          mode="dialog"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{
                            alignItems: 'flex-start',
                            width: '90%',
                            height: 30,
                          }}
                          placeholder="오늘의 건강 상태 선택하기"
                          placeholderStyle={{ fontSize: 15 }}
                          selectedValue={today}
                          onValueChange={postCatToday}
                        >
                          <Picker.Item label="😼기운 넘쳐요" value="key0" />
                          <Picker.Item label="😺튼튼해요" value="key1" />
                          <Picker.Item label="😻사랑스러워요" value="key2" />
                          <Picker.Item
                            label="😾가까이 가지 마세요"
                            value="key3"
                          />
                          <Picker.Item label="😿기운이 없어요" value="key4" />
                          <Picker.Item label="🙀아파요" value="key5" />
                        </Picker>
                      </Form>
                    )}
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.tagGuide}>#Tags</Text>
                    <View style={styles.tagView}>
                      {tags.length > 0 ? (
                        tags.map(tagInfo => (
                          <Badge style={styles.tag} key={tagInfo.id}>
                            <Text>{`#${tagInfo.tag.content}`}</Text>
                          </Badge>
                        ))
                      ) : (
                        <Text>{cat.nickname}를 표현해주세요.</Text>
                      )}
                    </View>
                    <KeyboardAvoidingView style={styles.width100}>
                      <View>
                        <ListItem>
                          <Input
                            placeholder="ex) 귀염, 도도, 츄르만먹음"
                            maxLength={11}
                            value={newTag}
                            onChangeText={text => {
                              const noSpaceText = text.split(' ').join('');
                              updateInput('info', 'newTag', noSpaceText);
                            }}
                          />
                          <Right>
                            <TouchableOpacity
                              style={styles.submit}
                              onPress={validateTag}
                            >
                              <Text style={styles.submitTxt}>등록</Text>
                            </TouchableOpacity>
                          </Right>
                        </ListItem>
                      </View>
                    </KeyboardAvoidingView>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Container>
        </View>
      </View>
    );
  }
}

export default inject(({ cat }) => ({
  cat: cat.info.selectedCat[0],
  catId: cat.info.selectedCat[0].id,
  today: cat.info.today,
  rainbowOpen: cat.info.rainbowOpen,
  cutClicked: cat.info.cutClicked,
  tags: cat.info.selectedCat[2],
  newTag: cat.info.newTag,
  getSelectedCatInfo: cat.getSelectedCatInfo,
  toggleRainbowOpen: cat.toggleRainbowOpen,
  selectCut: cat.selectCut,
  postCut: cat.postCut,
  postCatToday: cat.postCatToday,
  validateTag: cat.validateTag,
  updateInput: cat.updateInput,

  makeDateTime: cat.makeDateTime,
}))(observer(CatBio));
