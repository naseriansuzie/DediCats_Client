/* eslint-disable react/prop-types */
/* eslint-disable react/state-in-constructor */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BriefCatInfo from './BriefCatInfo';
import MainMarker from './MainMarker';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    height: '10%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: height * 0.001,
  },
  titleText: {
    fontSize: height * 0.06,
    color: '#6772F1',
    marginLeft: 20,
  },
  map: {
    width,
    height: '90%',
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },
  briefCatInfo: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },
  itemLayout: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    alignSelf: 'center',
  },
  myLocation: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: height * 0.1,
    left: 20,
    borderRadius: 30,
    backgroundColor: '#d2d2d2',
    opacity: 0.8,
  },
  myLocationIcon: {
    fontSize: 30,
    width: 30,
    height: 40,
    margin: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

class MainMap extends React.Component {
  async componentDidMount() {
    this.props.getMyInfo();
    this.props.requestMapPermission();

    const changepw = await AsyncStorage.getItem('changepw');

    if (changepw) {
      Alert.alert(
        '비밀번호 변경 안내',
        '임시 비밀번호로 로그인되었습니다. 비밀번호를 변경해주세요!',
      );
      this.props.navigation.navigate('ChangePW');
    }
  }

  renderBriefCatInfo = () => {
    const { selectedMarker, isShowingBriefCat, hideBriefCat } = this.props;
    if (isShowingBriefCat && selectedMarker !== null) {
      return (
        <BriefCatInfo
          style={styles.briefCatInfo}
          item={selectedMarker}
          isShowingBriefCat={isShowingBriefCat}
          hideBriefCat={hideBriefCat}
        />
      );
    }
    return null;
  };

  onMarkerPressed = item => {
    const { setSelectedMarker } = this.props;
    const region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    };
    setSelectedMarker(item, () => this._map.animateToRegion(region));
  };

  render() {
    console.disableYellowBox = 'true';
    const {
      markers,
      onRegionChangeComplete,
      getCurrentPosition,
      currentRegion,
      permissionState,
    } = this.props;
    if (permissionState === true && currentRegion.longitude !== 0) {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <View>
              <Text style={styles.titleText}>DediCats</Text>
            </View>
            <Image
              source={require('../../../DediCatsLogo.png')}
              style={{ height: 70, width: 70, right: 10 }}
            />
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => (this._map = map)}
            style={styles.map}
            showsUserLocation
            region={{ ...currentRegion }}
            onRegionChangeComplete={onRegionChangeComplete}
            maxZoomLevel={18}
          >
            {markers.map(marker => (
              <MainMarker
                key={marker.catNickname + marker.longitude + marker.latitude}
                marker={marker}
                onMarkerPressed={this.onMarkerPressed}
                currentRegion={currentRegion}
              />
            ))}
          </MapView>
          <TouchableOpacity
            onPress={() => getCurrentPosition()}
            style={styles.myLocation}
          >
            <MaterialIcons name="my-location" style={styles.myLocationIcon} />
          </TouchableOpacity>
          <View style={styles.itemLayout}>{this.renderBriefCatInfo()}</View>
        </View>
      );
    }
    return (
      <View style={[styles.loading, styles.horizontal]}>
        <ActivityIndicator style={{ size: 'large', color: '#0000ff' }} />
      </View>
    );
  }
}

export default inject(({ map, auth }) => ({
  getMyInfo: auth.getMyInfo,
  requestMapPermission: map.requestMapPermission,
  markers: map.markers,
  selectedMarker: map.selectedMarker,
  currentRegion: map.currentRegion,
  permissionState: map.permissionState,
  getCurrentPosition: map.getCurrentPosition,
  onRegionChangeComplete: map.onRegionChangeComplete,
  isShowingBriefCat: map.isShowingBriefCat,
  hideBriefCat: map.hideBriefCat,
  setSelectedMarker: map.setSelectedMarker,
}))(observer(withNavigation(MainMap)));
