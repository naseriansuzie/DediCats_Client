import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
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
    paddingTop: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
});

class CatPostList extends React.Component {
  // render() {

  //   console.log(this.props.postList[0].content);
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.radiusView}>
  //       {/* <FlatList/> */}
  //         {/* <CatPost post={this.props.postList[0]}/> */}
  //         {/* <CatPost />
  //         <CatPost /> */}
  //         {
  //           this.props.postList.map((item) =>
  //             <CatPost
  //               item={item}
  //             />
  //           )
  //         }
  //       </View>
  //     </View>
  //   )
  // }

  // _getData = () => {
  //   const url = 'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' + this.state.page;
  //   fetch(url)
  //     .then(r => r.json())
  //     .then(data => {
  //       this.setState({
  //         data: this.state.data.concat(data), // 기존 data에 추가.
  //         page: this.state.page + 1
  //       })
  //     });
  // }  --> to mobX

  // componentDidMount() {
  //   this._getData();  --> this.props._getData();
  // }

  _renderItem = ({ item }) => (
    <CatPost item={item} setCatPost={this.props.setCatPost}/>
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.radiusView}>
          <FlatList
            data={this.props.postList}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => `${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
        <CatPostInput />
      </View>
    );
  }
}

export default inject(({ cat }) => ({
  postList: cat.info.postList,
  setCatPost: cat.setCatPost,
}))(
  observer(CatPostList),
);
