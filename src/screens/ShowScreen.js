import React, {Component} from 'react'
import {View, ActionSheetIOS, ScrollView, TouchableOpacity, Text, StyleSheet, TouchableHighlight} from 'react-native'
import {Navigation} from 'react-native-navigation'
import DraggableFlatList from 'react-native-draggable-flatlist'
import {updateList, findById} from './../utils/db'
import {SwipeRow} from 'react-native-swipe-list-view'
import {getColor} from '../utils/consts'
import Map from '../components/Map'
import Circle from '../components/Circle'
import SortableListView from 'react-native-sortable-listview'
import SwipeableRow from 'react-native/Libraries/Experimental/SwipeableRow/SwipeableRow'

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
    if (list) {
      this.setState({list})
    }

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

  update (list) {
    this.setState({list}, async () => {
      await updateList(list, list._id)
    })
  }

  async onComplete (item) {
    const list = this.state.list
    const items = list.items.map(it => {
      return {...it, completed: it.id === item.id ? !it.completed : it.completed}
    })

    this.update({...list, items})
  }

  async onDelete (item) {
    const list = this.state.list
    const items = list.items.filter(it => it.id !== item.id)
    this.update({...list, items})
  }

  _headerComponent = () => <Map ref={map => { this.map = map }} list={this.state.list} />

  render () {
    const {list} = this.state

    const data = {}
    const order = []

    const items = (list.items || {}) || []
    for (const item of items) {
      data[item.id] = item
      order.push(item.id)
    }

    return (
      <SortableListView
          renderHeader={this._headerComponent}
          style={{flex: 1, marginBottom: 0}}
          data={data}
          order={Object.keys(data)}
          onRowMoved={async e => {
            const {list} = this.state
            const items = [...list.items]
            items.splice(e.to, 0, items.splice(e.from, 1)[0])
            const newList = {...list, items}
            this.setState({list: newList})
            this.forceUpdate()
            await updateList(newList, list._id)
          }}
          renderRow={(item, sectionId, rowId) => {
            const index = order.indexOf(rowId)
            return (
              <Item 
                changeMode={item => this.changeMode(item)}
                onComplete={item => this.onComplete(item)}
                onDelete={item => this.onDelete(item)}
                {...{item, index}}
              />
            )
          }}
      />
    )
  }
}

class Item extends React.Component {
  render () {
    const {index, item} = this.props

    return (
      <SwipeableRow
        isOpen={false}
        shouldBounceOnMount={true}
        maxSwipeDistance={75}
        preventSwipeRight={true}
        slideoutView={
          <View style={styles.rowBack}>
            <View style={styles.complete} />
            <TouchableOpacity onPress={() => this.props.onDelete(item)} style={styles.delete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <TouchableHighlight underlayColor={'#F5F5F5'} {...this.props.sortHandlers}>
          <View style={styles.itemContainer}>
            <View style={styles.itemIconContainer}>
              <Circle
                onPress={() => this.props.onComplete(item)}
                text={index + 1}
                color={getColor(0)}
                completed={item.completed} />
            </View>
            <View style={styles.textsContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.actionsContainer}>
                {index > 0 ?
                  <TouchableOpacity onPress={() => this.props.changeMode(item)}>
                    <Text style={styles.subline}>{item.mode}</Text>
                  </TouchableOpacity>
                  : <Text style={styles.subline}>Starting point</Text>}
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </SwipeableRow>
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
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },

  itemIconContainer: {
    height: 50,
    width: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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

  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  complete: {
    width: 75,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },

  delete: {
    width: 75,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },

  deleteText: {
    color: 'white'
  },

  completeText: {
    color: 'white'
  },

  subline: {
    fontSize: 12,
    color: '#666'
  }
})