import React, {Component} from 'react'
import {View, SafeAreaView, TouchableOpacity, Text, StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import DraggableFlatList from 'react-native-draggable-flatlist'
import {updateList, findById} from './../utils/db'
import {KEY} from './../utils/maps'
import MapViewDirections from 'react-native-maps-directions'

export default class ShowScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: false,
        visible: true,
        rightButtons: [
          {
            id: 'buttonAdd',
            icon: require('./../assets/add.png')
          }
        ]
      }
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      list: props.list
    }

    Navigation.events().bindComponent(this)
  }

  async componentDidAppear () {
    const list = await findById(this.state.list._id)
    this.setState({list})
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'buttonAdd') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'todotrip.AddItem',
          passProps: {
            list: this.state.list
          }
        }
      })
    }
  }

  renderMarker (place) {
    return (
      <Marker 
        key={place.name}
        coordinate={place.location}
        title={place.name}
      />
    )
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onLongPress={move}
        onPressOut={moveEnd}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderHeader () {
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {this.state.list.items.map(it => this.renderMarker(it))}
        {this.renderDirections()}
      </MapView>
    )
  }

  renderDirections () {
    const results = []
    let start = this.state.list.items[0]
    for (const item of this.state.list.items.slice(1)) {
      results.push(
        <MapViewDirections
          key={`${start.name}_${item.name}`}
          origin={start.location}
          destination={item.location}
          apikey={KEY}
          mode='walking'
          strokeWidth={3}
          strokeColor="hotpink"
        />
      )

      start = item
    }

    return results
  }

  render () {
    return (
      <View style={styles.container}>
        <DraggableFlatList
          ListHeaderComponent={() => this.renderHeader()}
          data={this.state.list.items}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.name}`}
          onMoveEnd={async ({ data }) => {
            const list = {...this.state.list, items: data}
            await updateList(list, this.state.list._id)
            this.setState({list})
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300
  },

  container: {
    flex: 1,
  },

  item: {
    padding: 10
  }
})