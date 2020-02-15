import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text } from 'react-native';
import { Content } from 'native-base';
import CatPhoto from './CatPhoto';

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
  photoView: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 50,
  },
  noPhotoView: {
    flex: 1,
    backgroundColor: '#6772f1',
  },
  noPhotoRadiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    paddingTop: 50,
    alignItems: 'center',
  },
  noPhotoTxt: { color: '#7f8296', fontSize: 18, paddingBottom: 15 },
});
class CatAlbum extends React.Component {
  componentDidMount() {
    console.log('CatAlbum mount');
    this.props.getAlbums();
  }

  render() {
    const { album, nickname, selectPhoto } = this.props;
    if (album && album.length) {
      return (
        <View style={styles.container}>
          <View style={styles.radiusView}>
            <Content>
              <View style={styles.photoView}>
                {album.map(photo => (
                  <CatPhoto
                    key={photo.id}
                    path={photo.path}
                    photo={photo}
                    selectPhoto={selectPhoto}
                  />
                ))}
              </View>
            </Content>
          </View>
        </View>
      );
    }
    if (album && album.length === 0) {
      return (
        <View style={styles.noPhotoView}>
          <View style={styles.noPhotoRadiusView}>
            <Text style={styles.noPhotoTxt}>
              {`There's no photo of ${nickname} now.`}
            </Text>
            <Text>Upload the FIRST photo!</Text>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

export default inject(({ cat }) => ({
  album: cat.info.album,
  nickname: cat.info.selectedCat[0].nickname,
  getAlbums: cat.getAlbums,
  selectPhoto: cat.selectPhoto,
}))(observer(CatAlbum));
