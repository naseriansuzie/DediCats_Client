import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,

  },
});

class AddCatMap extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    currentPosition: {},
    markerData: {
      latitude: 0,
      longitude: 0,
    },
  };

  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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
      },
      (error) => { Alert.alert(error.code, error.message); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }

  onRegionChangeComplete = (region) => {
    this.setState({ currentPosition: region });
  }

  render() {
    // console.log(this.props.onDragEnd);
    const { currentPosition, markerData } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          // ref={(map) => this._map = map}
          showsUserLocation={true}
          region={currentPosition}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.map}
        >
          <Marker
            draggable
            onDragEnd={this.props.onDragEnd}
            coordinate={{
              latitude: markerData.latitude,
              longitude: markerData.longitude,
            }}
           />
        </MapView>
      </View>
    );
  }
};

export default inject(({ cat }) => ({ onDragEnd: cat.onDragEnd }))(observer(AddCatMap));
