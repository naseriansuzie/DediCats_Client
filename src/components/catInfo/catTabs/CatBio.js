import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
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
    backgroundColor: '#6772F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    paddingTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#F38847',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  },
  rainbowView: { alignItems: 'flex-end' },
  reportBtn: { marginTop: 10, marginRight: 25 },
  cut: { width: '100%', paddingBottom: 10 },
  peanuts: { flex: 1, flexDirection: 'row', paddingVertical: 15 },
  peanut: {
    width: 80,
    height: 40,
    marginRight: 10,
    backgroundColor: '#EDF1F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPeanut: {
    width: 80,
    height: 40,
    marginRight: 10,
    backgroundColor: '#FFECE0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutTxt: { color: '#767577', fontWeight: 'bold' },
  catTodayForm: {
    width: '100%',
    flexDirection: 'row',
  },
  picker: {
    alignItems: 'flex-start',
    width: '90%',
    height: 30,
  },
  tagGuide: { width: '100%', paddingBottom: 10 },
  tagView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F38847',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  submit: {
    alignItems: 'center',
    padding: 10,
    margin: 0,
    backgroundColor: '#6772F1',
    borderRadius: 10,
  },
  submitTxt: {
    color: '#ffffff',
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
    const { catId } = this.props;
    this.props.getSelectedCatInfo(catId, this.props.navigation);
    this.props.getMyInfo();
  }

  render() {
    const {
      navigation,
      selectedCatBio,
      selectedCatToday,
      selectedCatRainbowOpen,
      toggleRainbowOpen,
      selectedCatCutClicked,
      tags,
      selectedCatNewTag,
      selectCut,
      postCut,
      postCatToday,
      validateTag,
      updateInput,
      changeToDateTime,
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
                    {selectedCatRainbowOpen ? (
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
              {selectedCatRainbowOpen ? <Rainbow /> : <View />}
              <Card transparent>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>{'추정하는 종 : '}</Text>
                    <CardItem style={styles.content}>
                      <Text>{selectedCatBio.species}</Text>
                    </CardItem>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>
                      {`${selectedCatBio.nickname} 고양이를 소개해요!`}
                    </Text>
                    <CardItem style={styles.content}>
                      <Text>{`${selectedCatBio.description}`}</Text>
                    </CardItem>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.width100}>
                      오늘 {selectedCatBio.nickname}의 건강 상태
                    </Text>
                    {selectedCatBio.today &&
                    selectedCatBio.todayTime === changeToDateTime('today') ? (
                      <CardItem style={styles.content}>
                        <Text>{selectedCatBio.today}</Text>
                      </CardItem>
                      ) : (
                      <Form style={styles.catTodayForm}>
                        <Picker
                          note
                          enabled
                          mode="dialog"
                          iosIcon={<Icon name="arrow-down" />}
                          style={styles.picker}
                          placeholder="오늘의 건강 상태 선택하기"
                          placeholderStyle={styles.font15}
                          selectedValue={selectedCatToday}
                          onValueChange={postCatToday}
                        >
                          <Picker.Item
                            label="오늘의 건강 상태 선택하기"
                            value="오늘의 건강 상태 선택하기"
                          />
                          <Picker.Item
                            label="😼기운 넘쳐요"
                            value="😼기운 넘쳐요"
                          />
                          <Picker.Item label="😺튼튼해요" value="😺튼튼해요" />
                          <Picker.Item
                            label="😻사랑스러워요"
                            value="😻사랑스러워요"
                          />
                          <Picker.Item
                            label="😾가까이 가지 마세요"
                            value="😾가까이 가지 마세요"
                          />
                          <Picker.Item
                            label="😿기운이 없어요"
                            value="😿기운이 없어요"
                          />
                          <Picker.Item label="🙀아파요" value="🙀아파요" />
                        </Picker>
                      </Form>
                      )}
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.cut}>중성화 유무</Text>
                    <View style={styles.row}>
                      <TouchableHighlight
                        style={
                          selectedCatCutClicked.Y
                            ? styles.noPeanut
                            : styles.peanut
                        }
                        underlayColor="#F38847"
                        onPress={async () => {
                          if (
                            selectedCatCutClicked.Y ||
                            selectedCatCutClicked.N ||
                            selectedCatCutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await postCut('Y', navigation);
                            selectCut('selectedCat', 'Y');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>
                          Yes {selectedCatBio.cut.Y}
                        </Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={
                          selectedCatCutClicked.N
                            ? styles.noPeanut
                            : styles.peanut
                        }
                        underlayColor="#F38847"
                        onPress={async () => {
                          if (
                            selectedCatCutClicked.Y ||
                            selectedCatCutClicked.N ||
                            selectedCatCutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await postCut('N', navigation);
                            selectCut('selectedCat', 'N');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>
                          No {selectedCatBio.cut.N}
                        </Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={
                          selectedCatCutClicked.unknown
                            ? styles.noPeanut
                            : styles.peanut
                        }
                        underlayColor="#F38847"
                        onPress={async () => {
                          if (
                            selectedCatCutClicked.Y ||
                            selectedCatCutClicked.N ||
                            selectedCatCutClicked.unknown
                          ) {
                            Alert.alert('중성화 정보를 이미 입력하셨습니다.');
                          } else {
                            await postCut('unknown', navigation);
                            selectCut('selectedCat', 'unknown');
                          }
                        }}
                      >
                        <Text style={styles.cutTxt}>
                          몰라요 {selectedCatBio.cut.unknown}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.tagGuide}>#Tags</Text>
                    <View style={styles.tagView}>
                      {tags.length > 0 ? (
                        tags.map(tagInfo => (
                          <Badge style={styles.tag} key={`tag_${tagInfo.id}`}>
                            <Text>{`#${tagInfo.tag.content}`}</Text>
                          </Badge>
                        ))
                      ) : (
                        <Text>
                          {selectedCatBio.nickname} 고양이를 표현해주세요.
                        </Text>
                      )}
                    </View>
                    <KeyboardAvoidingView style={styles.width100}>
                      <View>
                        <ListItem>
                          <Input
                            placeholder="ex) 귀염, 도도, 츄르만먹음"
                            maxLength={11}
                            value={selectedCatNewTag}
                            onChangeText={text => {
                              const noSpaceText = text.split(' ').join('');
                              updateInput(
                                'cat',
                                'selectedCatNewTag',
                                noSpaceText,
                              );
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

export default inject(({ cat, helper, auth }) => ({
  catId: cat.selectedCatBio[0].id,
  getSelectedCatInfo: cat.getSelectedCatInfo,
  getMyInfo: auth.getMyInfo,
  selectedCatBio: cat.selectedCatBio[0],
  selectedCatToday: cat.selectedCatToday,
  selectedCatRainbowOpen: cat.selectedCatRainbowOpen,
  toggleRainbowOpen: cat.toggleRainbowOpen,
  selectedCatCutClicked: cat.selectedCatCutClicked,
  tags: cat.selectedCatBio[2],
  selectedCatNewTag: cat.selectedCatNewTag,
  selectCut: cat.selectCut,
  postCut: cat.postCut,
  postCatToday: cat.postCatToday,
  validateTag: cat.validateTag,
  updateInput: helper.updateInput,
  changeToDateTime: helper.changeToDateTime,
}))(observer(withNavigation(CatBio)));
