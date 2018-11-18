import React, {Component} from 'react'
import {View, ActionSheetIOS, TouchableOpacity, Text, StyleSheet} from 'react-native'
import {Navigation} from 'react-native-navigation'
import DraggableFlatList from 'react-native-draggable-flatlist'
import {updateList, findById} from './../utils/db'
import {SwipeRow} from 'react-native-swipe-list-view'
import {getColor} from '../utils/consts'
import Map from '../components/Map'

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

    if (this.map) {
      this.map.fitToElements()
    }
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
        return {...it, mode: it.name === item.name ? newMode : it.mode}
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

  _headerComponent = () => <Map ref={map => { this.map = map }} list={this.state.list} />

  render () {
    const {list} = this.state
    return (
      <View style={styles.container}>
        <DraggableFlatList
          ListHeaderComponent={this._headerComponent}
          data={(list || {}).items || []}
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
  }
})