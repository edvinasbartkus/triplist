import React, {Component} from 'react'
import MapView from 'react-native-maps'

export default class Directions extends Component {
  render () {
    return (
      <MapView.Polyline {...this.props} />
    )
  }
}
