/* eslint-disable react/prop-types */
/* eslint-disable react/state-in-constructor */
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import BriefCatInfo from './BriefCatInfo';
import MainMarker from './MainMarker';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width,
    height,
    ...StyleSheet.absoluteFillObject,
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
    top: 20,
    left: 20,
    borderRadius: 30,
    backgroundColor: '#d2d2d2',
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
  componentDidMount() {
    this.props.getMyInfo();
    this.props.requestMapPermission();
  }

  renderBriefCatInfo = () => {
    let { selectedMarker, isShowingBriefCat, hideBriefCat } = this.props;
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

  onMarkerPressed = (item) => {
    let { setSelectedMarker } = this.props;
    const region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.0035,
      longitudeDelta: 0.0035,
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
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={(map) => (this._map = map)}
            style={styles.map}
            showsUserLocation
            region={{ ...currentRegion }}
            onRegionChangeComplete={onRegionChangeComplete}
            maxZoomLevel={18}
          >
            {markers.map((marker) => (
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
            <MaterialIcons
              name="my-location"
              style={styles.myLocationIcon}
            />
          </TouchableOpacity>
          <View
            style={styles.itemLayout}
          >
            {this.renderBriefCatInfo()}
          </View>
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
  markers: map.markers,
  selectedMarker: map.selectedMarker,
  getMapInfo: map.getMapInfo,
  currentPosition: map.currentPosition,
  currentRegion: map.currentRegion,
  currentBoundingBox: map.currentBoundingBox,
  permissionState: map.permissionState,
  requestMapPermission: map.requestMapPermission,
  getCurrentPosition: map.getCurrentPosition,
  onRegionChangeComplete: map.onRegionChangeComplete,
  isShowingBriefCat: map.isShowingBriefCat,
  hideBriefCat: map.hideBriefCat,
  setSelectedMarker: map.setSelectedMarker,
}))(observer(MainMap));
