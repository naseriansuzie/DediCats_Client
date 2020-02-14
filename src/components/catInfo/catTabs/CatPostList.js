import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import CatPost from './CatPost';
import CatPostInput from './CatPostInput';

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
    paddingTop: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
  keyboard: { width: '95%' },
});

class CatPostList extends React.Component {
  _renderItem = ({ item }) => (
    <CatPost item={item} setCatPost={this.props.setCatPost} />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
          <KeyboardAvoidingView style={styles.keyboard}>
            <CatPostInput />
          </KeyboardAvoidingView>
          <SafeAreaView>
            <FlatList
              data={this.props.postList}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => `${item.id}`}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

export default inject(({ cat }) => ({
  postList: cat.info.postList,
  setCatPost: cat.setCatPost,
}))(observer(CatPostList));
