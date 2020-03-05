import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reportView: {
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: '#6772F1',
  },
  ellipsis: { fontSize: 24, color: '#ffffff', paddingRight: 10 },
  profileView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6772f1',
    paddingLeft: '5%',
  },
  photoView: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
  },
  defaultPhoto: {
    width: '80%',
    height: '80%',
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
  },
  catPhoto: {
    width: '80%',
    height: '90%',
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
    borderColor: '#6772F1',
    borderWidth: 1,
  },
  infoView: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    right: '10%',
  },
  nickName: {
    fontSize: 25,
    fontWeight: '600',
    color: '#ffffff',
    marginVertical: 10,
  },
  address: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 10,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  btnTxt: {
    color: '#6772F1',
    fontWeight: 'bold',
  },
  paddingVertical5: { paddingVertical: 5 },
});

const DEFAULT_CAT =
  'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/DEFAULT_CAT.png';

class CatProfile extends React.Component {
  _showActionSheet = () => this.ActionSheet.show();

  render() {
    const {
      navigation,
      selectedCatBio,
      followCat,
      unFollowCat,
      reportCatBio,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.reportView}>
          <TouchableOpacity
            onPress={() => {
              this._showActionSheet();
            }}
          >
            <AntDesign name="ellipsis1" style={styles.ellipsis} />
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['고양이 정보 신고', '취소']}
          cancelButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              reportCatBio(navigation);
            }
          }}
        />
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
                  onPress={() => unFollowCat(selectedCatBio[0].id, navigation)}
                >
                  <Text style={styles.btnTxt}>Unfollow</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => followCat(selectedCatBio[0].id, navigation)}
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
  }
}

export default inject(({ cat, report }) => ({
  selectedCatBio: cat.selectedCatBio,
  followCat: cat.followCat,
  unFollowCat: cat.unFollowCat,
  reportCatBio: report.reportCatBio,
}))(observer(withNavigation(CatProfile)));
