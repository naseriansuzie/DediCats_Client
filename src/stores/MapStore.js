import { observable, action, decorate } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';

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

  isShowingBriefCat = false;

  markers = [];

  selectedMarker = null;

  // actions
  getMapInfo = async navigation => {
    const currentBound = this.currentBoundingBox;
    await axios
      .post(`${SERVER_URL}/map`, { location: currentBound }, defaultCredential)
      .then(res => {
        this.markers = res.data;
        return true;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
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

  getCurrentPosition = navigation => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        this.currentPosition = {
          latitude,
          latitudeDelta: 0.0015,
          longitude,
          longitudeDelta: 0.0005,
        };
        this.onRegionChangeComplete(
          {
            latitude,
            latitudeDelta: 0.005,
            longitude,
            longitudeDelta: 0.005,
          },
          navigation,
        );
      },
      error => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  onRegionChangeComplete = async (region, navigation) => {
    this.currentRegion = { ...region };
    this.currentBoundingBox = {
      NElatitude: region.latitude + region.latitudeDelta / 2, // northLat - max lat
      NElongitude: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      SWlatitude: region.latitude - region.latitudeDelta / 2, // southLat - min lat
      SWlongitude: region.longitude - region.longitudeDelta / 2, // westLng - min lng
    };
    await this.getMapInfo(navigation);
  };

  // {latitude: Number, longitude: Number}
  setAddCatLocation = (coords) => {
    this.root.cat.addCatLocation = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  }

  onMarkerChange = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.root.cat.addCatLocation = { latitude, longitude };
    this.root.cat.onDragstate = true;
  };

  hideBriefCat = () => {
    this.isShowingBriefCat = false;
  };

  setSelectedMarker = (item, callback) => {
    this.selectedMarker = item;
    this.isShowingBriefCat = true;
    callback();
  };
}

decorate(MapStore, {
  currentPosition: observable,
  currentRegion: observable,
  currentBoundingBox: observable,
  permissionState: observable,
  isShowingBriefCat: observable,
  markers: observable,
  selectedMarker: observable,
  getMapInfo: action,
  requestMapPermission: action,
  getCurrentPosition: action,
  onRegionChangeComplete: action,
  setAddCatLocation: action,
  onMarkerChange: action,
  hideBriefCat: action,
  setSelectedMarker: action,
});
export default MapStore;
