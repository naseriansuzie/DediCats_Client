/* eslint-disable react/state-in-constructor */
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
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
  card: {
    backgroundColor: '#ececec',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  cardImg: {
    height: 120,
    width: 200,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
});

class MainMap extends React.Component {
  state = {
    isShowingCarousel: false,
  };

  componentDidMount() {
    this.props.getLocationPermission();
  }

  renderCarouselItem = ({ item }) => {
    const { isShowingCarousel } = this.state;
    return (
      <BriefCatInfo
        item={item}
        isShowingCarousel={isShowingCarousel}
        hideCarousel={this.hideCarousel}
      />
    );
  };

  hideCarousel = () => {
    this.setState({ isShowingCarousel: false });
  }

  onCarouselItemChange = (index) => {
    const { onRegionChangeComplete, markers, getBoundingBox } = this.props;
    const location = markers[index];
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    };
    onRegionChangeComplete(region);
    this._map.animateToRegion(region);
  }

  onMarkerPressed = (location, index) => {
    const { isShowingCarousel } = this.state;
    const { onRegionChangeComplete, getBoundingBox } = this.props;
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    };
    onRegionChangeComplete(region);
    this._map.animateToRegion(region);
    this._carousel.snapToItem(index);
    if (!isShowingCarousel) {
      this.setState({ isShowingCarousel: true });
    }
  }

  render() {
    console.disableYellowBox = 'true';
    const { markers, currentRegion, onRegionChangeComplete } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={(map) => this._map = map}
          style={styles.map}
          showsUserLocation={true}
          region={currentRegion}
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
      </View>
    );
  }
}

export default inject(({ cat, user }) => ({
  markers: cat.markers,
  currentPosition: user.currentPosition,
  currentRegion: user.currentRegion,
  currentBoundingBox: user.currentBoundingBox,
  getLocationPermission: user.getLocationPermission,
  onRegionChangeComplete: user.onRegionChangeComplete,
}))(
  observer(MainMap),
);
