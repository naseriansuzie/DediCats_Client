import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Content, Item, Label, Input, Textarea } from 'native-base';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 3,
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
  bioView: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
    fontSize: 14,
  },
  intro: { borderRadius: 10, marginVertical: 10 },
  peanuts: { flex: 1, flexDirection: 'row', paddingVertical: 15 },
  peanutF: {
    width: 50,
    height: 40,
    marginRight: 10,
    backgroundColor: '#edf1f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peanutT: {
    width: 50,
    height: 40,
    marginRight: 10,
    backgroundColor: '#f38847',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutTxtT: { color: 'white', fontWeight: 'bold' },
  cutTxtF: { color: '#767577', fontWeight: 'bold' },
  submit: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#677ef1',
    borderRadius: 14,
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
  catNickname,
  catSpecies,
  catDescription,
  cutClicked,
  catTag,
  getPermissionAsync,
  pickImage,
  updateInput,
  selectCut,
  validateAddCat,
  addCat,
  navigation,
}) => (
  <View style={styles.container}>
    <View style={styles.flex1}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior="padding"
        enabled
      >
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
              <Input
                value={catNickname}
                maxLength={10}
                onChangeText={text => {
                  updateInput('addCatBio', 'catNickname', text);
                }}
              />
            </Item>
            <Item stackedLabel last>
              <Label>추정 종(예: 코숏)</Label>
              <Input
                value={catSpecies}
                maxLength={12}
                onChangeText={text => {
                  updateInput('addCatBio', 'catSpecies', text);
                }}
              />
            </Item>
            <Item stackedLabel last>
              <Label>대표 태그(예: 소심, 귀염)</Label>
              <Input
                value={catTag}
                maxLength={12}
                onChangeText={text => {
                  updateInput('addCatBio', 'catTag', text);
                }}
              />
            </Item>
            <Textarea
              rowSpan={3}
              maxLength={30}
              bordered
              placeholder="간략한 고양이 소개(30자 이내)"
              style={styles.intro}
              value={catDescription}
              onChangeText={text => {
                updateInput('addCatBio', 'catDescription', text);
              }}
            />
            <Item stackedLabel last>
              <Label>중성화</Label>
              <View style={styles.peanuts}>
                <TouchableOpacity
                  style={cutClicked.Y ? styles.peanutT : styles.peanutF}
                  onPress={() => selectCut('Y')}
                >
                  <Text style={cutClicked.Y ? styles.cutTxtT : styles.cutTxtF}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={cutClicked.N ? styles.peanutT : styles.peanutF}
                  onPress={() => selectCut('N')}
                >
                  <Text style={cutClicked.N ? styles.cutTxtT : styles.cutTxtF}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={cutClicked.unknown ? styles.peanutT : styles.peanutF}
                  onPress={() => selectCut('unknown')}
                >
                  <Text
                    style={cutClicked.unknown ? styles.cutTxtT : styles.cutTxtF}
                  >
                    몰라요
                  </Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Content>
        </View>
        <View style={styles.submit}>
          <TouchableOpacity
            onPress={async () => {
              const validation = await validateAddCat();
              if (validation) {
                await addCat();
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.submitTxt}>Finish</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  </View>
);

export default inject(({ cat }) => ({
  photoPath: cat.addCatBio.photoPath,
  catNickname: cat.addCatBio.catNickname,
  catSpecies: cat.addCatBio.catSpecies,
  catDescription: cat.addCatBio.catDescription,
  cutClicked: cat.addCatBio.cutClicked,
  catTag: cat.addCatBio.catTag,
  getPermissionAsync: cat.getPermissionAsync,
  pickImage: cat.pickImage,
  updateInput: cat.updateInput,
  selectCut: cat.selectCut,
  validateAddCat: cat.validateAddCat,
  addCat: cat.addCat,
}))(observer(withNavigation(AddCatBio)));
