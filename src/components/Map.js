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
import {getRegionForCoordinates} from '../utils/maps'

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialRegion: props.list.region // getRegionForCoordinates(props.items.map(it => it.location))
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({
        initialRegion: nextProps.list.region
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
    const {lists, listId} = this.props
    const items = lists.getItems(listId)
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
        <Map lists={lists} list={lists.getList(this.props.listId)} {...this.props} />
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