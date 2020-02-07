/* eslint-disable react/state-in-constructor */
import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import BriefCatInfo from '../components/main/BriefCatInfo';
import MainMarker from '../components/main/MainMarker';

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

class Main extends React.Component {
  state = {
    markers: [
      {
        latitude: 37.802597,
        longitude: -122.435197,
        name: 'Best Place',
        content: 'This is the best place in Portland',
        img: require('../../img1.jpg')
      },
      {
        latitude: 37.79552,
        longitude: -122.41612,
        name: 'Best Place2222',
        content: 'This is the best place in Portland2222',
        img: require('../../img2.jpg')
      },
      {
        latitude: 37.766552,
        longitude: -122.416128,
        name: 'Best Place3333',
        content: 'This is the best place in Portland3333',
        img: require('../../img3.jpg')
      },
      {
        latitude: 37.766552,
        longitude: 127.416128,
        name: 'Best Place4444',
        content: 'This is the best place in Portland4444',
        img: require('../../img3.jpg')
      },
    ],
    isShowingCarousel: false,
  };

  componentDidMount() {
    this.getLocationPermission();
  }

  getLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      console.log('Not granted');
      Alert.alert('위치 정보 사용을 허용해주세요!');
    } else {
      this.locateCurrentPosition();
    }
  };

  getWatchPosition = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        console.log(position);
        let currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };
        this.setState({ currentPosition });
        console.log(this.state.currentPosition);
      },
      (error) => { Alert.alert(error.code, error.message); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }

  locateCurrentPosition = () => {
    this.getWatchPosition();
  }

  renderCarouselItem = ({ item }) => (
    <BriefCatInfo
      item={item}
      isShowingCarousel={this.state.isShowingCarousel}
      hideCarousel={this.hideCarousel}
    />
  );

  hideCarousel = () => {
    this.setState({ isShowingCarousel: false });
  }

  onCarouselItemChange = (index) => {
    let location = this.state.markers[index];
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    };
    this.setState({ currentPosition: region });
    this._map.animateToRegion(region);
  }

  onMarkerPressed = (location, index) => {
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    };
    this.setState({ currentPosition: region });
    this._map.animateToRegion(region);
    if (!this.state.isShowingCarousel) {
      this.setState({ isShowingCarousel: true });
    }
    this._carousel.snapToItem(index);
  }

  render() {
    console.disableYellowBox = 'true';

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={(map) => this._map = map}
          style={styles.map}
          showsUserLocation={true}
          region={this.state.currentPosition}
        >
          {
            this.state.markers.map((marker, index) => (
              <MainMarker
                key={marker.name}
                marker={marker}
                index={index}
                onMarkerPressed={this.onMarkerPressed}
              />
            ))
          }
        </MapView>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.markers}
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

export default Main;
