import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Content, Item, Label, Input, Textarea } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  row: {
    flex: 2,
    width: '100%',
    flexDirection: 'row',
  },
  photoView: {
    width: '50%',
    flex: 1,
  },
  photo: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  defaultPhoto: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: 30,
  },
  catPhoto: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: 30,
    borderColor: '#edf1f5',
    borderWidth: 1,
  },
  uploading: { flex: 1, alignItems: 'center', marginTop: 10 },
  uploadBtn: { color: '#767577' },
  bioView: { flex: 1, width: '100%', paddingTop: 10 },
  intro: { borderRadius: 10, marginVertical: 10 },
  peanuts: { flex: 1, flexDirection: 'row', paddingVertical: 5 },
  peanut: {
    width: 50,
    height: 40,
    marginRight: 10,
    backgroundColor: '#edf1f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutTxt: { color: '#767577', fontWeight: 'bold' },
  submit: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#677ef1',
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  submitTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const AddCatBio = ({
  photoPath,
  catCut,
  getPermissionAsync,
  pickImage,
  updateCut,
  addCat,
}) => (
  <View style={styles.container}>
    <View sytle={styles.flex1}>
      <View style={styles.row}>
        <View style={styles.photoView}>
          <View style={styles.photo}>
            {photoPath ? (
              <Image style={styles.catPhoto} source={{ uri: photoPath }} />
            ) : (
              <Image
                style={styles.defaultPhoto}
                source={{
                  uri:
                    'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png',
                }}
              />
            )}
          </View>
          <View style={styles.uploading}>
            <TouchableOpacity
              onPress={async () => {
                await getPermissionAsync();
                pickImage();
              }}
            >
              <Text style={styles.uploadBtn}>Upload photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Content style={styles.bioView}>
          <Item stackedLabel last>
            <Label>별명</Label>
            <Input />
          </Item>
          <Item stackedLabel last>
            <Label>추정 종(예: 코숏)</Label>
            <Input />
          </Item>
          <Textarea
            rowSpan={3}
            bordered
            placeholder="간략히 고양이를 소개해주세요(20자 이내)"
            style={styles.intro}
          />
          <Item stackedLabel last>
            <Label>중성화</Label>
            <View style={styles.peanuts}>
              <TouchableHighlight
                style={styles.peanut}
                underlayColor="#f38847"
                onPress={() => updateCut('Y')}
              >
                <Text style={styles.cutTxt}>Yes {catCut.Y}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.peanut}
                underlayColor="#f38847"
                onPress={() => updateCut('N')}
              >
                <Text style={styles.cutTxt}>No {catCut.Y}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.peanut}
                underlayColor="#f38847"
                onPress={() => updateCut('unknown')}
              >
                <Text style={styles.cutTxt}>몰라요 {catCut.unknown} </Text>
              </TouchableHighlight>
            </View>
          </Item>
          <Item stackedLabel last>
            <Label>상태</Label>
          </Item>
        </Content>
      </View>
      <View style={styles.submit}>
        <TouchableOpacity onPress={addCat}>
          <Text style={styles.submitTxt}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default inject(({ cat }) => ({
  photoPath: cat.addCatBio.photoPath,
  catCut: cat.addCatBio.catCut,
  getPermissionAsync: cat.getPermissionAsync,
  pickImage: cat.pickImage,
  updateCut: cat.updateCut,
  addCat: cat.addCat,
}))(observer(AddCatBio));
