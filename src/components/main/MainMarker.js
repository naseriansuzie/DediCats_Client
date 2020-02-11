import React from 'react';
import { Marker } from 'react-native-maps';
import { View } from 'react-native';

export default class MainMarker extends React.Component {
  state = { tracksViewChanges: true, }

  stopRendering = () => {
    this.setState({ tracksViewChanges: false });
  }

  render() {
    const { marker, index, currentRegion } = this.props;
    // 1. latitudeDelta보다 큰 값에서는 GET 과 Render 둘 다 막는다.
    // 2. latitudeDelta보다 작으면 마커들을 렌더하고, 슬라이드를 해서 범위(Bound)가 변경되었을 시에 GET을 보낸다.
    if (currentRegion.latitudeDelta < 0.01 || currentRegion.longitudeDelta < 0.01) {
      return (
        <Marker
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          onPress={() => this.props.onMarkerPressed(marker, index)}
          tracksViewChanges={this.state.tracksViewChanges}
          onLoad={this.stopRendering}
        />
      );
    } else {
      return <View></View>;
    }
  }
}