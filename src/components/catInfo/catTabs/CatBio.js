import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
  reportBtn: { marginTop: 10, marginRight: 25 },
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
    const { rainbowOpen, toggleRainbowOpen } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.radiusView}>
          <View style={{ alignItems: 'flex-end' }}>
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
        </View>
      </View>
    );
  }
}

export default inject(({ cat }) => ({
  catId: cat.info.selectedCat[0].id,
  rainbowOpen: cat.info.rainbowOpen,
  getSelectedCatInfo: cat.getSelectedCatInfo,
  toggleRainbowOpen: cat.toggleRainbowOpen,
}))(observer(CatBio));
