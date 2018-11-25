import React, {Component} from 'react'
import {View, Text, AlertIOS, StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {KEY} from './../utils/maps'
import MapViewDirections from 'react-native-maps-directions'
import {getColor} from '../utils/consts'
import Circle from './Circle'
import uuid from 'uuid'
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';

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
        <Circle text={index + 1} completed={place.completed} color={getColor(0)} width={15} />
      </Marker>
    )
  }

  renderDirections (items) {
    const results = []
    let start = items[0]
    for (const item of items.slice(1)) {
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

  async onAdd (poi) {
    alert('POI clicked')
    // TODO: This is not working! :(
    // const {list} = this.props
    // list.items.push({ ...poi, id: uuid(), mode: 'walking', completed: false})

    // await updateList(list, list._id)
    // this.props.reload()
  }

  onLongPress (e, container, listId) {
    const event = e.nativeEvent
    AlertIOS.prompt('Enter the name for the location', null,
      async (text) => {
        if (text && event.coordinate) {
          const item = {
            name: text,
            title: text,
            location: event.coordinate,
            id: uuid(),
            mode: 'walking',
            completed: false
          }

          container.saveItem(listId, item)
        }
      }
    )
  }

  render () {
    const {listId} = this.props
    return (
      <Subscribe to={[ListsContainer]}>
        {lists =>
          <MapView
            ref={map => { this.map = map } }
            style={styles.map}
            onPoiClick={poi => this.onAdd(poi)}
            onLongPress={e => this.onLongPress(e, lists, listId)}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {lists.getItems(listId).map((it, index) => this.renderMarker(it, index))}
            {this.renderDirections(lists.getItems(listId))}
          </MapView>
        }
      </Subscribe>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#666'
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