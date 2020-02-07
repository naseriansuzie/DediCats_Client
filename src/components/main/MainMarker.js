import React from 'react';
import { Marker } from 'react-native-maps';

export default class MainMarker extends React.Component {
  state = { tracksViewChanges: true, }

  // shouldComponentUpdate(nextProps) {
  //   console.log('nextProps: ', nextProps, '\n---------------');
  //   console.log('this.props: ', this.props, '\n---------------');
  //   return nextProps.marker !== this.props.marker;
  // }

  stopRendering = () => {
    this.setState({ tracksViewChanges: false });
  }

  render() {
    const { marker, index } = this.props;
    return (
      <Marker
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={() => this.props.onMarkerPressed(marker, index)}
        tracksViewChanges={this.state.tracksViewChanges}
        onLoad={this.stopRendering}
      >
        {/* <Callout>
          <Text>{marker.name}</Text>
          <Text>{marker.content}</Text>
        </Callout> */}
        {/* {fadeDuration={0}} */}
      </Marker>
    );
  }
}