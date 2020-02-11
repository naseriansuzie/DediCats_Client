/* eslint-disable react/state-in-constructor */
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { inject, observer } from 'mobx-react';
import BriefCatInfo from './BriefCatInfo';
import MainMarker from './MainMarker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.props.watchId);
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
  }

  onCarouselItemChange = (index) => {
    const { markers } = this.props;
    const location = markers[index];
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    this._map.animateToRegion(region);
  }

  onMarkerPressed = (location, index) => {
    const { isShowingCarousel } = this.state;
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    this._map.animateToRegion(region);
    this._carousel.snapToItem(index);
    if (!isShowingCarousel) {
      this.setState({ isShowingCarousel: true });
    }
    console.log(isShowingCarousel);
  }

  render() {
    console.disableYellowBox = 'true';
    const { markers, onRegionChangeComplete, currentPosition, currentRegion, permissionState } = this.props;
    console.log('render watchId: ', this.props.watchId);
    if (permissionState === true) {
      return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={(map) => this._map = map}
            style={styles.map}
            showsUserLocation={true}
            region={{ ...currentRegion }}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {
              markers.map((marker, index) => (
                <MainMarker
                  key={marker.name}
                  marker={marker}
                  index={index}
                  onMarkerPressed={this.onMarkerPressed}
                  currentRegion={currentRegion}
                />
              ))
            }
          </MapView>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={markers}
            renderItem={this.renderCarouselItem}
            onSnapToItem={(index) => this.onCarouselItemChange(index)}
            removeClippedSubviews={false}
            sliderWidth={width}
            itemWidth={300}
            containerCustomStyle={styles.carousel}
          />
        </View>)
    } else {
      return (      
        <View>
          <Text style={{flex: 1}}>No Permission for location</Text>
        </View>
      )
    }
  }
}

export default inject(({ cat, user }) => ({
  markers: cat.markers,
  currentPosition: user.currentPosition,
  currentRegion: user.currentRegion,
  currentBoundingBox: user.currentBoundingBox,
  onRegionChangeComplete: user.onRegionChangeComplete,
  permissionState: user.permissionState,
  watchId: user.watchId,
  requestMapPermission: user.requestMapPermission,
}))(
  observer(MainMap),
);
