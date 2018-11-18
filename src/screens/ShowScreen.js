import React, {Component} from 'react'
import {View, ActionSheetIOS, TouchableOpacity, Text, StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import DraggableFlatList from 'react-native-draggable-flatlist'
import {updateList, findById} from './../utils/db'
import {KEY} from './../utils/maps'
import MapViewDirections from 'react-native-maps-directions'
import {SwipeRow} from 'react-native-swipe-list-view'
import {getColor} from '../utils/consts'

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

  changeMode (item) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Transit', 'Bicycle', 'Driving', 'Walking'],
      cancelButtonIndex: 0,
    }, async (buttonIndex) => {
      let newMode
      switch (buttonIndex) {
        case 1: newMode = 'transit'; break;
        case 2: newMode = 'bicycling'; break;
        case 3: newMode = 'driving'; break;
        case 4: newMode = 'walking'; break;
        default: newMode = item.mode; break;
      }

      const list = this.state.list
      const items = list.items.map(it => {
        return {...it, mode: it.name === item.name ? newMode : item.mode}
      })

      const newList = {...list, items}
      this.setState({list: newList})
      await updateList(newList, list._id)
    });
  }

  async onComplete (item) {
    const list = this.state.list
    const items = list.items.map(it => {
      return {...it, completed: it.name === item.name ? true : item.completed}
    })

    const newList = {...list, items}
    this.setState({list: newList})
    await updateList(newList, list._id)
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

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <SwipeRow leftOpenValue={75} rightOpenValue={-75}>
        <TouchableOpacity onPress={() => this.onComplete(item)} style={styles.complete}>
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemBox}
          onLongPress={move}
          onPressOut={moveEnd}
        >
          <View style={styles.itemContainer}>
            <View style={styles.itemIconContainer}>
              <View style={[styles.itemIcon, {backgroundColor: getColor(0)}]}>
                <Text style={styles.itemIconText}>
                  {index + 1}
                </Text>
              </View>
            </View>
            <View style={styles.textsContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => this.changeMode(item)}>
                  <Text>Mode: {item.mode}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{width: 75}}>
          <Text>Delete</Text>
        </View>
      </SwipeRow>
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
        {this.state.list.items.map((it, index) => this.renderMarker(it, index))}
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
    return (
      <View style={styles.container}>
        <DraggableFlatList
          ListHeaderComponent={() => this.renderHeader()}
          data={this.state.list.items}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.name}`}
          onMoveEnd={async ({ data }) => {
            const list = {...this.state.list, items: data}
            this.setState({list})

            // Keep it last so it doesn't affect the performance
            await updateList(list, this.state.list._id)
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
  },

  itemContainer: {
    flexDirection: 'row'
  },

  itemIconContainer: {
    height: 50,
    width: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemIcon: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemIconText: {
    color: 'white'
  },

  itemBox: {
    backgroundColor: 'white',
    height: 50
  },

  textsContainer: {
    justifyContent: 'center'
  },

  actionsContainer: {
    flexDirection: 'row'
  },

  itemText: { 
    fontSize: 22,
  },

  complete: {
    width: 75,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },

  completeText: {
    color: 'white'
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