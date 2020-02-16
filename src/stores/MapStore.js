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

  // observable
  // 현재 나의 위치
  currentPosition = {
    latitude: 0,
    longitude: 0,
  };

  addCatMarker = {
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

  // actions
  getMapInfo = async () => {
    const currentBound = this.root.user.currentBoundingBox;
    console.log(currentBound);
    await axios
      .post(`${SERVER_URL}/map`, { location: currentBound }, defaultCredential)
      .then(res => {
        console.log('Response data is : ', res.data);
        this.root.cat.markers = res.data;
        console.log('마커정보는:', this.markers, res.data.length);
        this.root.cat.carousels = res.data;
        // this.carousels = res.data;
        console.log('카루셀 정보: ', this.carousels);
        return true;
      })
      .catch((err) => console.dir(err));
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
      (position) => {
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
        this.root.cat.getMapInfo();
      },
      (error) => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  onRegionChangeComplete = async (region) => {
    this.currentRegion = { ...region };
    this.currentBoundingBox = {
      NElatitude: region.latitude + region.latitudeDelta / 2, // northLat - max lat
      NElongitude: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      SWlatitude: region.latitude - region.latitudeDelta / 2, // southLat - min lat
      SWlongitude: region.longitude - region.longitudeDelta / 2, // westLng - min lng
    };
    this.root.cat.getMapInfo();
  };

  // {latitude: Number, longitude: Number}
  onDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.addCatBio.location = { latitude, longitude };
  };
}

decorate(MapStore, {
  currentPosition: observable,
  addCatMarker: observable,
  currentRegion: observable,
  currentBoundingBox: observable,
  permissionState: observable,
  getMapInfo: action,
  requestMapPermission: action,
  getCurrentPosition: action,
  onRegionChangeComplete: action,
  onDragEnd: action,
});
export default MapStore;
