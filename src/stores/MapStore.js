import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL, KAKAO_MAPS_API_KEY } from 'react-native-dotenv';
import * as Permissions from 'expo-permissions';

const defaultCredential = { withCredentials: true };

class MapStore {
  constructor(root) {
    this.root = root;
  }

  // 현재 나의 위치
  currentPosition = {
    latitude: 0,
    longitude: 0,
  };

  // 현재 화면의 위치
  currentRegion = {
    latitude: 0,
    latitudeDelta: 0,
    longitude: 0,
    longitudeDelta: 0,
  };

  // 현재 화면의 범위
  currentBoundingBox = {
    NElatitude: 0,
    NElongitude: 0,
    SWlatitude: 0,
    SWlongitude: 0,
  };

  permissionState = false;

  isShowingCarousel = false;

  // 선택한 고양이 아이디
  selectedCatId = 0;

  // 아이디를 가진 객체의 배열 안 인덱스
  carouselIndex = 0;

  refIndex = 0;

  carousels = [
  //   //! sample data
  //   {
  //     catId: 1,
  //     latitude: 37.503528,
  //     longitude: 127.049784,
  //     catNickname: 'Best Place',
  //     catAddress: '서울시 선릉',
  //     description: 'This is the best place in Portland',
  //     catProfile:
  //       'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/CAT%20%2314',
  //   },
  ];

  markers = [
    // {
    //   catId: 1,
    //   latitude: 37.503528,
    //   longitude: 127.049784,
    //   catNickname: 'Best Place',
    //   catAddress: '서울시 선릉',
    //   description: 'This is the best place in Portland',
    //   catProfile:
    //     'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/CAT%20%2314',
    // },
  ];

  // actions
  getMapInfo = async () => {
    const currentBound = this.currentBoundingBox;
    // console.log('현재 바운드', currentBound);
    await axios
      .post(`${SERVER_URL}/map`, { location: currentBound }, defaultCredential)
      .then(res => {
        // console.log('Response data is : ', res.data);
        this.markers = res.data;
        this.carousels = res.data;
        const matchedIndex = this.carousels.findIndex((data) => data.catId === this.selectedCatId);
        if (matchedIndex === -1) {
          this.isShowingCarousel = false;
        } else {
          this.carouselIndex = matchedIndex;
        }

        return true;
      })
      .catch(err => console.dir(err));
    // if (result) {
    //   return true;
    // }
    // axios로 map 정보 get
    // res => this.spot.list에 추가
    // err => err.response.status = 404이면 this.spot.list를 빈 배열로 추가
  };

  requestMapPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        this.permissionState = true;
        this.getCurrentPosition();
      } else {
        console.log('not Granted');
        this.permissionState = false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        this.currentPosition = {
          latitude,
          latitudeDelta: 0.0015,
          longitude,
          longitudeDelta: 0.0005,
        };
        this.onRegionChangeComplete({
          latitude,
          latitudeDelta: 0.005,
          longitude,
          longitudeDelta: 0.005,
        });
        // this.getMapInfo();
      },
      error => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  onRegionChangeComplete = async region => {
    this.currentRegion = { ...region };
    this.currentBoundingBox = {
      NElatitude: region.latitude + region.latitudeDelta / 2, // northLat - max lat
      NElongitude: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      SWlatitude: region.latitude - region.latitudeDelta / 2, // southLat - min lat
      SWlongitude: region.longitude - region.longitudeDelta / 2, // westLng - min lng
    };
    await this.getMapInfo();

  };

  // {latitude: Number, longitude: Number}
  onDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.root.cat.addCatLocation = { latitude, longitude };
    this.root.cat.onDragstate = true;
    console.log("이동 후:", this.root.cat.onDragstate)
  };

  syncCarousel = () => {
    // this.carouselMarkers = this.markers;
    this.carousels = this.markers;
  }

  showCarousel = () => {
    this.isShowingCarousel = true;
  };

  hideCarousel = () => {
    this.isShowingCarousel = false;
  };

  setCarouselIndex = (index) => {
    this.carouselIndex = index;
  }

  setSelectedCatId = (id, callback) => {
    this.selectedCatId = id;
    callback();
  }

  setRefIndex = (index) => {
    this.refIndex = index;
  }
}

decorate(MapStore, {
  selectedCatId: observable,
  carouselIndex: observable,
  refIndex: observable,
  currentPosition: observable,
  currentRegion: observable,
  currentBoundingBox: observable,
  permissionState: observable,
  isShowingCarousel: observable,
  carousels: observable,
  markers: observable,
  getMapInfo: action,
  requestMapPermission: action,
  getCurrentPosition: action,
  onRegionChangeComplete: action,
  onDragEnd: action,
  syncCarousel: action,
  showCarousel: action,
  hideCarousel: action,
  setCarouselIndex: action,
  setSelectedCatId: action,
  setRefIndex: action,
});
export default MapStore;
