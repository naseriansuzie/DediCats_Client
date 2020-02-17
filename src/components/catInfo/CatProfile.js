import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reportView: {
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: '#6772f1',
  },
  ellipsis: { fontSize: 24, color: 'white' },
  modalView: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 87,
  },
  reportBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    height: '15%',
    width: '60%',
    paddingTop: 5,
    marginRight: 10,
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
  profileView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6772f1',
  },
  photoView: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  defaultPhoto: {
    width: 160,
    height: 160,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
  },
  catPhoto: {
    width: 160,
    height: 160,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
    borderColor: '#6772f1',
    borderWidth: 1,
  },
  infoView: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickName: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
    marginVertical: 5,
  },
  address: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  btnTxt: {
    color: '#677ef1',
    fontWeight: 'bold',
  },
  paddingVertical5: { paddingVertical: 5 },
});

const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const CatProfile = ({
  selectedCatBio,
  followCat,
  unFollowCat,
  catReportVisible,
  setCatReportVisible,
  reportCatBio,
}) => (
  <View style={styles.container}>
    <View style={styles.reportView}>
      <TouchableOpacity
        onPress={() => {
          setCatReportVisible(true);
          console.log(catReportVisible);
        }}
      >
        <AntDesign name="ellipsis1" style={styles.ellipsis} />
      </TouchableOpacity>
    </View>
    <Modal
      transparent
      visible={catReportVisible}
      onRequestClose={() => {
        setCatReportVisible(false);
      }}
    >
      <View style={styles.modalView}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setCatReportVisible(false);
              console.log(catReportVisible);
            }}
          >
            <AntDesign name="ellipsis1" style={styles.ellipsis} />
          </TouchableOpacity>
        </View>
        <View style={styles.reportBox}>
          <Text style={styles.paddingVertical5}>
            <AntDesign name="warning" size="17" /> 고양이 등록 정보 신고
          </Text>
          <Text note style={styles.paddingVertical5}>
            고양이 정보에 부적절한 내용이 게시되어 신고합니다.
          </Text>
          <View style={styles.reportBtn}>
            <TouchableOpacity
              onPress={async () => {
                const result = await reportCatBio();
                if (result) {
                  Alert.alert('신고 완료', '해당 신고 요청이 처리되었습니다.', [
                    { text: '확인', onPress: () => setCatReportVisible(false) },
                  ]);
                }
              }}
            >
              <Text style={styles.reportTxt}>신고</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {selectedCatBio && selectedCatBio.length > 0 ? (
      <View style={styles.profileView}>
        <View style={styles.photoView}>
          {selectedCatBio[3].path ? (
            <Image
              style={styles.catPhoto}
              source={{ uri: selectedCatBio[3].path }}
            />
          ) : (
            <Image
              style={styles.defaultPhoto}
              source={{
                uri: DEFAULT_CAT,
              }}
            />
          )}
        </View>
        <View style={styles.infoView}>
          <Text style={styles.nickName}>{selectedCatBio[0].nickname}</Text>
          <Text style={styles.address}>{selectedCatBio[0].address}..</Text>
          {selectedCatBio[1].isFollowing ? (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => unFollowCat(selectedCatBio[0].id)}
            >
              <Text style={styles.btnTxt}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => followCat(selectedCatBio[0].id)}
            >
              <Text style={styles.btnTxt}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ) : (
      <View />
    )}
  </View>
);
export default inject(({ cat, helper, report }) => ({
  selectedCatBio: cat.selectedCatBio,
  followCat: cat.followCat,
  unFollowCat: helper.unFollowCat,
  catReportVisible: report.catReportVisible,
  setCatReportVisible: report.setCatReportVisible,
  reportCatBio: report.reportCatBio,
}))(observer(CatProfile));
