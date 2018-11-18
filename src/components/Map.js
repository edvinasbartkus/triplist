import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {KEY} from './../utils/maps'
import MapViewDirections from 'react-native-maps-directions'
import {getColor} from '../utils/consts'

export default class Map extends Component {
  constructor (props) {
    super(props)
  }

  fitToElements () {
    if (this.map) {
      this.map.fitToElements(true)
    }
  }

  renderMarker (place, index) {
    return (
      <Marker 
        key={place.name}
        coordinate={place.location}
        title={place.name}
      >
        <View style={[styles.marker, {backgroundColor: place.completed ? 'green' : getColor(0)}]}>
          <Text style={styles.markerText}>{index + 1}</Text>
        </View>
      </Marker>
    )
  }

  renderDirections () {
    const {list} = this.props

    const results = []
    let start = list.items[0]
    for (const item of list.items.slice(1)) {
      results.push(
        <MapViewDirections
          key={`${start.name}_${item.name}_${item.mode}`}
          origin={start.location}
          destination={item.location}
          apikey={KEY}
          mode={item.mode || 'walking'}
          strokeWidth={3}
          strokeColor={getColor(0)}
        />
      )

      start = item
    }

    return results
  }

  render () {
    const {list} = this.props
    return (
      <MapView
        ref={map => { this.map = map } }
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {list.items.map((it, index) => this.renderMarker(it, index))}
        {this.renderDirections()}
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300
  },

  marker: {
    width: 15,
    height: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  markerText: {
    color: 'white',
    fontSize: 10
  }
})