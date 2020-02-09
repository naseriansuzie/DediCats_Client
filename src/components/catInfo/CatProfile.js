import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fa',
  },
  profileView: { flex: 1, flexDirection: 'row' },
  photoView: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 20,
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
    borderColor: '#edf1f5',
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
    color: '#080811',
    marginVertical: 5,
  },
  address: {
    fontSize: 15,
    color: '#7f8296',
    marginBottom: 10,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#677ef1',
  },
  btnTxt: { color: 'white', fontWeight: 'bold' },
});

const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const CatProfile = ({ selectedCat, followCat, unFollowCat }) => (
  <View style={styles.container}>
    {selectedCat && selectedCat.length > 0 ? (
      <View style={styles.profileView}>
        <View style={styles.photoView}>
          {selectedCat[3].path ? (
            <Image
              style={styles.catPhoto}
              source={{ uri: selectedCat[3].path }}
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
          <Text style={styles.nickName}>{selectedCat[0].nickname}</Text>
          <Text style={styles.address}>{selectedCat[0].address}..</Text>
          {selectedCat[1].isFollowing ? (
            <TouchableOpacity style={styles.btn} onPress={unFollowCat}>
              <Text style={styles.btnTxt}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={followCat}>
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

export default inject(({ cat, user }) => ({
  selectedCat: cat.info.selectedCat,
  followCat: cat.followCat,
  unFollowCat: user.unFollowCat,
  test: cat.test,
}))(observer(CatProfile));
