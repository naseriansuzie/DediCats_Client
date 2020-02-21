import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List, ListItem, Left, Body, Right, Text } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  guideList: {
    marginLeft: 0,
    paddingTop: 0,
    paddingBottom: 5,
  },
  guideMsg: {
    color: '#767577',
    paddingLeft: 0,
    fontSize: 18,
  },
  subGuideMsg: {
    color: '#f38847',
    paddingLeft: 0,
  },
  height100: { height: '100%' },
  abledReportBtn: {
    backgroundColor: '#edf1f5',
    borderRadius: 10,
    padding: 10,
  },
  disabledReportBtn: {
    backgroundColor: '#ffece0',
    borderRadius: 10,
    padding: 10,
  },
  font30: { fontSize: 30 },
  reportTxt: { color: '#767577' },
});
const Rainbow = ({
  nickName,
  rainbow,
  selectedCatRainbowYReported,
  selectedCatRainbowNReported,
  reportRainbow,
  disableReportBtn,
}) => (
  <List style={styles.list}>
    <ListItem style={styles.guideList}>
      <Body>
        <Text style={styles.guideMsg}>{nickName} 근황</Text>
        <Text style={styles.subGuideMsg}>
          사라졌거나 돌아왔을 때 신고해주세요!
        </Text>
      </Body>
    </ListItem>
    <ListItem avatar>
      <Left>
        <MaterialCommunityIcons
          style={styles.font30}
          name="paw-off"
          color="#767577"
        />
      </Left>
      {rainbow.Y > 0 ? (
        <Body>
          <Text>{`보이지 않아요ㅠㅠ ${rainbow.Y}번의 신고`}</Text>
          <Text note>{`최근 신고일 ${rainbow.YDate}`}</Text>
        </Body>
      ) : (
        <Body style={styles.height100}>
          <Text>보이지 않아요: 신고 내역 없음</Text>
        </Body>
      )}
      <Right>
        {selectedCatRainbowYReported ? (
          <TouchableOpacity
            style={styles.disabledReportBtn}
            onPress={() => Alert.alert('이미 실종 신고를 하셨습니다')}
          >
            <Text>완료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.abledReportBtn}
            onPress={() => {
              Alert.alert(`${nickName} 실종`, '실종 신고를 하시겠습니까?', [
                {
                  text: '취소',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: '신고',
                  onPress: async () => {
                    const result = await reportRainbow('Y');
                    if (result) {
                      disableReportBtn('Y');
                    }
                  },
                },
              ]);
            }}
          >
            <Text style={{ color: '#767577' }}>신고</Text>
          </TouchableOpacity>
        )}
      </Right>
    </ListItem>
    <ListItem avatar>
      <Left>
        <MaterialCommunityIcons
          style={styles.font30}
          name="paw"
          color="#f38847"
        />
      </Left>
      {rainbow.N > 0 ? (
        <Body>
          <View>
            <Text>{`다시 돌아왔어요! ${rainbow.N}번의 신고`}</Text>
            <Text note>{`최근 신고일 ${rainbow.NDate}`}</Text>
          </View>
        </Body>
      ) : (
        <Body style={styles.height100}>
          <Text>다시 돌아왔어요: 신고 내역 없음</Text>
        </Body>
      )}
      <Right>
        {selectedCatRainbowNReported ? (
          <TouchableOpacity
            style={styles.disabledReportBtn}
            onPress={() => Alert.alert('이미 실종 신고를 하셨습니다')}
          >
            <Text>완료</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.abledReportBtn}
            onPress={() => {
              Alert.alert(`${nickName} 실종`, '실종 신고를 하시겠습니까?', [
                {
                  text: '취소',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: '신고',
                  onPress: async () => {
                    const result = await reportRainbow('N');
                    if (result) {
                      disableReportBtn('N');
                    }
                  },
                },
              ]);
            }}
          >
            <Text style={styles.reportTxt}>신고</Text>
          </TouchableOpacity>
        )}
      </Right>
    </ListItem>
  </List>
);

export default inject(({ cat }) => ({
  nickName: cat.selectedCatBio[0].nickname,
  rainbow: cat.selectedCatBio[0].rainbow,
  selectedCatRainbowYReported: cat.selectedCatRainbowYReported,
  selectedCatRainbowNReported: cat.selectedCatRainbowNReported,
  reportRainbow: cat.reportRainbow,
  disableReportBtn: cat.disableReportBtn,
}))(observer(Rainbow));
