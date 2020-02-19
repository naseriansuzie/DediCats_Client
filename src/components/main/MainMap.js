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
  componentDidMount() {
    this.props.requestMapPermission();
    // this.props.getMapInfo();
  }

  renderCarouselItem = ({ index }) => {
    let { carousels, carouselIndex, isShowingCarousel, hideCarousel } = this.props;
    // selectedCatId = carousels[index].catId;

    // console.log('carousels.length :', carousels.length);
    // console.log('carouselIndex :', carouselIndex);
    // console.log('isShowingCarousel :', isShowingCarousel);
    if (isShowingCarousel && carousels[carouselIndex]) {
      return (
        <BriefCatInfo
          item={carousels[carouselIndex]}
          isShowingCarousel={isShowingCarousel}
          hideCarousel={hideCarousel}
        />
      );
    }
    return null;
  };

  onCarouselItemChange = (index) => {
    let { carousels, refIndex, setRefIndex, carouselIndex, setCarouselIndex, setSelectedCatId } = this.props;
    // console.log('Carousel:: ', Carousel.toString());
    // console.log('positions :', Carousel.positions.toString());
    console.log('change index:::', index);
    let item;
    let newIndex;
    if (index > refIndex) {
      if (carousels.length - 1 > carouselIndex) {
        console.log('increase:::', index);
        console.log('carousels.length - 1:::', carousels.length - 1);
        console.log('carouselIndex:::', carouselIndex);
        setCarouselIndex(carouselIndex + 1);
        item = carousels[carouselIndex + 1];
        newIndex = carouselIndex + 1;
      }
    } else if (index < refIndex) {
      if (carouselIndex > 0) {
        console.log('decrease:::', index);
        console.log('carouselIndex:::', carouselIndex);
        setCarouselIndex(carouselIndex - 1);
        item = carousels[carouselIndex - 1];
        newIndex = carouselIndex + 1;
      }
    }
    if (!item) {
      return;
    }
    this.onMarkerPressed(item, newIndex);

    // const region = {
    //   latitude: item.latitude,
    //   longitude: item.longitude,
    //   latitudeDelta: 0.0035,
    //   longitudeDelta: 0.0035,
    // };
    // setSelectedCatId(item.catId, () => this._map.animateToRegion(region));
  };

  onMarkerPressed = (item, index) => {
    let { setRefIndex, setCarouselIndex, carouselIndex, isShowingCarousel, showCarousel, setSelectedCatId } = this.props;
    setRefIndex(index);
    setCarouselIndex(index);
    const region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.0035,
      longitudeDelta: 0.0035,
    };
    setSelectedCatId(item.catId, () => this._map.animateToRegion(region));
    // carouselIndex = carousels.findIndex((data) => data.catId === selectedCatId);
    this._carousel.snapToItem(index);
    console.log('carouselIndex in onMarkerPressed', carouselIndex);
    if (!isShowingCarousel) {
      showCarousel();
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
                key={marker.catNickname + marker.longitude + marker.latitude}
                marker={marker}
                // carousel={carousels[index]}
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
            onBeforeSnapToItem={(index) => this.onCarouselItemChange(index)}
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
  selectedCatId: map.selectedCatId,
  carouselIndex: map.carouselIndex,
  refIndex: map.refIndex,
  markers: map.markers,
  carousels: map.carousels,
  getMapInfo: map.getMapInfo,
  currentPosition: map.currentPosition,
  currentRegion: map.currentRegion,
  currentBoundingBox: map.currentBoundingBox,
  permissionState: map.permissionState,
  requestMapPermission: map.requestMapPermission,
  getCurrentPosition: map.getCurrentPosition,
  onRegionChangeComplete: map.onRegionChangeComplete,
  syncCarousel: map.syncCarousel,
  isShowingCarousel: map.isShowingCarousel,
  showCarousel: map.showCarousel,
  hideCarousel: map.hideCarousel,
  setCarouselIndex: map.setCarouselIndex,
  setSelectedCatId: map.setSelectedCatId,
  setRefIndex: map.setRefIndex,
}))(observer(MainMap));
