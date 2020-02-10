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
  Text,
  Input,
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
  flex1: { flex: 1 },
  reportBtn: { marginTop: 10, marginRight: 25 },
  width100: { width: '100%' },
  row: { flexDirection: 'row' },
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
      rainbowOpen,
      toggleRainbowOpen,
      cutClicked,
      selectCut,
      postCut,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
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
                  <SimpleLineIcons style={styles.font15} name="arrow-down" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
          {rainbowOpen ? <Rainbow /> : <View />}
          <Container style={styles.flex}>
            <Header style={{ display: 'none' }} />
            <Content padder>
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
                    <Text style={styles.width100}>중성화 유무</Text>
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
  rainbowOpen: cat.info.rainbowOpen,
  cutClicked: cat.info.cutClicked,
  getSelectedCatInfo: cat.getSelectedCatInfo,
  toggleRainbowOpen: cat.toggleRainbowOpen,
  selectCut: cat.selectCut,
  postCut: cat.postCut,
}))(observer(CatBio));
