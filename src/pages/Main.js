import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {},
      errorMsg: null,
      markers: [
        {
          coordinate: {
            latitude: 37.78597,
            longitude: -122.40697,
          },
          title: 'Best Place',
          description: 'This is the best place in Portland',
        },
        {
          coordinate: {
            latitude: 37.78552,
            longitude: -122.40612,
          },
          title: 'Best Place2222',
          description: 'This is the best place in Portland2222',
        },
      ],
    };
  }

  componentDidMount() {
    this._getLocation();
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      console.log('Not granted');
      this.setState({ errorMsg: 'Permission not granted!' });
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 0.8,
          longitudeDelta: 0.00421 * 0.8,
        },
      });
      // console.log(this.state.region);
    }, (error) => {
      alert(JSON.stringify(error));
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  render() {
    if (this.state.region !== null) {
      return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChangeComplete}
            showsUserLocation={true}
          >
            {this.state.markers.map(marker => (
              <Marker
                key={marker.coordinate.latitude}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              >
                <View style={{backgroundColor: 'red', padding: 10}}>
                  <Text>{marker.title}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
          <Text>This is Main Page!</Text>
          <Button
            title="Move to Cat Info"
            onPress={() => this.props.navigation.navigate('CatInfo')}
          />
        </View>
      );
    }
  }
}

export default Main;
