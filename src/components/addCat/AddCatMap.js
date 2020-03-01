import React from 'react';
import { inject, observer } from 'mobx-react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';

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
    textAlign: 'center',
  },
});

class AddCatMap extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    currentPosition: {
      latitude: 37.503597,
      latitudeDelta: 0.0015,
      longitude: 127.049658,
      longitudeDelta: 0.005,
    },
  };

  componentDidMount = async () => {
    await this.getCurrentPosition();
  };

  getCurrentPosition = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;
        const { setAddCatLocation } = this.props;
        const currentPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0005,
        };
        this.setState({
          currentPosition,
        });
        setAddCatLocation(coords);
      },
      (error) => {
        Alert.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  onRegionChangeComplete = (region) => {
    this.setState({ currentPosition: region });
  };

  render() {
    const { currentPosition } = this.state;
    const { addCatLocation, onMarkerChange } = this.props;
    return (
      <View style={styles.mapView}>
        <Text style={styles.spotTxt}> 자주 만나는 장소 선택</Text>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            region={{ ...currentPosition }}
            style={styles.map}
            onRegionChangeComplete={this.onRegionChangeComplete}
            onPress={e => onMarkerChange(e)}
          >
            {addCatLocation && (
              <Marker
                coordinate={{
                  latitude: addCatLocation.latitude,
                  longitude: addCatLocation.longitude,
                }}
                tracksViewChanges={false}
              >
                <Image
                  source={require('../../../catPawMarker.png')}
                  style={{ height: 40, width: 40 }}
                />
              </Marker>
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
