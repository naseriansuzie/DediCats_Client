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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
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
});

class MainMap extends React.Component {
  state = {
    isShowingCarousel: false,
  };

  componentDidMount() {
    this.props.requestMapPermission();
    this.props.getMapInfo();
  }

  renderCarouselItem = ({ item }) => {
    const { isShowingCarousel } = this.state;

    if (isShowingCarousel) {
      return (
        <BriefCatInfo
          item={item}
          isShowingCarousel={isShowingCarousel}
          hideCarousel={this.hideCarousel}
        />
      );
    }
  };

  hideCarousel = () => {
    this.setState({ isShowingCarousel: false });
  };

  onCarouselItemChange = index => {
    const { carousels } = this.props;
    const location = carousels[index];
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0035,
      longitudeDelta: 0.0035,
    };
    this._map.animateToRegion(region);
  };

  onMarkerPressed = (location, index) => {
    const { isShowingCarousel } = this.state;
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0035,
      longitudeDelta: 0.0035,
    };
    this._map.animateToRegion(region);
    this._carousel.snapToItem(index);
    if (!isShowingCarousel) {
      this.setState({ isShowingCarousel: true });
    }
  };

  render() {
    console.disableYellowBox = 'true';
    const {
      markers,
      carousels,
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
            ref={map => (this._map = map)}
            style={styles.map}
            showsUserLocation
            region={{ ...currentRegion }}
            onRegionChangeComplete={onRegionChangeComplete}
            maxZoomLevel={18}
          >
            {markers.map((marker, index) => (
              <MainMarker
                key={marker.longitude + marker.latitude}
                marker={marker}
                index={index}
                onMarkerPressed={this.onMarkerPressed}
                currentRegion={currentRegion}
              />
            ))}
          </MapView>
          <TouchableOpacity
            onPress={() => getCurrentPosition()}
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: 20,
              left: 20,
              borderRadius: 30,
              backgroundColor: '#d2d2d2',
            }}
          >
            <MaterialIcons
              name="my-location"
              style={{
                fontSize: 30,
                width: 30,
                height: 40,
                margin: 10,
              }}
            />
          </TouchableOpacity>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={carousels}
            renderItem={this.renderCarouselItem}
            onSnapToItem={index => this.onCarouselItemChange(index)}
            removeClippedSubviews={false}
            sliderWidth={width}
            itemWidth={width * 0.9}
            containerCustomStyle={styles.carousel}
          />
        </View>
      );
    }
    return (
      <View style={{ position: 'absolute' }}>
        <Text style={{ flex: 1 }}>No Permission for location</Text>
      </View>
    );
  }
}

export default inject(({ map }) => ({
  carousels: map.carousels,
  markers: map.markers,
  getMapInfo: map.getMapInfo,
  currentPosition: map.currentPosition,
  currentRegion: map.currentRegion,
  currentBoundingBox: map.currentBoundingBox,
  permissionState: map.permissionState,
  requestMapPermission: map.requestMapPermission,
  getCurrentPosition: map.getCurrentPosition,
  onRegionChangeComplete: map.onRegionChangeComplete,
}))(observer(MainMap));
