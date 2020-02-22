import React from 'react';
import { inject, observer } from 'mobx-react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: { flex: 1, width: '100%' },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  spotTxt: {
    color: '#767577',
    fontSize: 16,
    paddingVertical: 10,
    paddingTop: 5,
  },
});

class AddCatMap extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    currentPosition: {
      latitude: 37,
      latitudeDelta: 0.0015,
      longitude: 127,
      longitudeDelta: 0.005,
    },
    markerData: {
      latitude: 37,
      longitude: 127,
    },
  };

  componentDidMount = async () => {
    await this.getCurrentPosition();
  }

  getCurrentPosition = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { coords } = position;
        const { setAddCatLocation } = this.props;
        const currentPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0005,
        };
        const markerData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({
          currentPosition,
          markerData,
        });
        setAddCatLocation(coords);
      },
      error => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }

  onRegionChangeComplete = region => {
    this.setState({ currentPosition: region });
  };

  onMarkerChange = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.setState({
      markerData: {
        latitude,
        longitude,
      },
    });
    this.props.onMarkerChange(e);
  }

  render() {
    const { currentPosition, markerData } = this.state;
    return (
      <View style={styles.mapView}>
        <Text style={styles.spotTxt}> 고양이를 자주 만나는 장소 선택</Text>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            region={currentPosition}
            onRegionChangeComplete={this.onRegionChangeComplete}
            style={styles.map}
            onPress={(e) => this.onMarkerChange(e)}
          >
            {this.state.markerData && (
              <Marker coordinate={{
                latitude: markerData.latitude,
                longitude: markerData.longitude,
              }}
              />
            )}
          </MapView>
        </View>
      </View>
    );
  }
}

export default inject(({ map, cat }) => ({
  currentPosition: map.currentPosition,
  onMarkerChange: map.onMarkerChange,
  setAddCatLocation: map.setAddCatLocation,
  addCatLocation: cat.addCatLocation,
}))(observer(AddCatMap));
