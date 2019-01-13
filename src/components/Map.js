import React, {Component} from 'react'
import {AlertIOS, StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {getColor} from '../utils/consts'
import Circle from './Circle'
import uuid from 'uuid'
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';
import DirectionsContainer from '../containers/DirectionsContainer';
import Directions from './Directions'

function getRegionForCoordinates (points) {
  if (!points.length) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  }

  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY

  // init first point
  ((point) => {
    minX = point.latitude
    maxX = point.latitude
    minY = point.longitude
    maxY = point.longitude
  })(points[0])

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude)
    maxX = Math.max(maxX, point.latitude)
    minY = Math.min(minY, point.longitude)
    maxY = Math.max(maxY, point.longitude)
  });

  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  const deltaX = (maxX - minX)
  const deltaY = (maxY - minY)

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX * 1.3,
    longitudeDelta: deltaY * 1.3
  }
}

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialRegion: getRegionForCoordinates(props.items.map(it => it.location))
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({
        initialRegion: getRegionForCoordinates(nextProps.items.map(it => it.location))
      })
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

  mapDirections (container, items) {
    let start = items[0]
    const result = []
    for (let item of items.slice(1)) {
      const route = container.get(item.mode, start.location, item.location)
      if (route) {
        result.push(<Directions
          {...route}
          strokeWidth={3}
          strokeColor={getColor(0)}
        />)
      }

      start = item
    }

    return result
  }

  renderDirections (items) {
    let start = items[0]
    return <Subscribe to={[DirectionsContainer]}>
      {directions => this.mapDirections(directions, items)}
    </Subscribe>
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
    const {lists, items, listId} = this.props
    return (
      <MapView
        style={styles.map}
        onPoiClick={poi => this.onAdd(poi)}
        onLongPress={e => this.onLongPress(e, lists, listId)}
        initialRegion={this.state.initialRegion}
      >
        {items.map((it, index) => this.renderMarker(it, index))}
        {this.renderDirections(items)}
      </MapView>
    )
  }
}

export default class MapContainer extends React.PureComponent {
  render () {
    return <Subscribe to={[ListsContainer]}>
      {lists =>
        <Map lists={lists} items={lists.getItems(this.props.listId)} {...this.props} />
      }
    </Subscribe>
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