import React, {Component} from 'react'
import {View, ActionSheetIOS, TouchableOpacity, Text, StyleSheet, TouchableHighlight} from 'react-native'
import {Navigation} from 'react-native-navigation'
import DirectionsContainer from '../containers/DirectionsContainer'
import {getColor} from '../utils/consts'
import Map from '../components/Map'
import Circle from '../components/Circle'
import SortableListView from 'react-native-sortable-listview'
import SwipeableRow from 'react-native/Libraries/Experimental/SwipeableRow/SwipeableRow'
import {Subscribe} from 'unstated'
import ListsContainer from '../containers/ListsContainer'
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import ModeButtons from '../components/ModeButtons'

ACTION_SHEET_OPTIONS = [
  'Cancel',
  {
    component: <ModeButtons />,
    height: 160
  }
]

export default class ShowScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: true,
        background: {
          translucent: true,
          blur: true,
        },
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
    Navigation.events().bindComponent(this)
  }

  async componentDidAppear () {
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
            listId: this.props.listId
          }
        }
      })
    }
  }

  // changeMode (container, item) {
  //   ActionSheetIOS.showActionSheetWithOptions({
  //     options: ['Cancel', 'Transit', 'Bicycle', 'Driving', 'Walking'],
  //     cancelButtonIndex: 0,
  //   }, async (buttonIndex) => {
  //     container.updateItem(this.props.listId, {...item, mode: this.mode(buttonIndex) || item.mode})
  //   });
  // }

  mode (buttonIndex) {
    switch (buttonIndex) {
      case 1: return 'transit'
      case 2: return 'bicycling'
      case 3: return 'driving'
      case 4: return 'walking'
      default: null
    }
  }

  async onComplete (container, item) {
    container.updateItem(this.props.listId, {...item, completed: !item.completed})
  }

  async onDelete (container, item) {
    container.deleteItem(this.props.listId, item.id)
  }

  handlePress = index => {}

  _headerComponent = () => <Map
    ref={map => { this.map = map }}
    listId={this.props.listId}
  />

  _getActionSheetRef = ref => (this.actionSheet = ref)

  _showActionSheet = (item) => {
    Navigation.showOverlay({
      component: {
        name: 'todotrip.Control',
        passProps: {
          item,
          listId: this.props.listId
        },
        options: {
          layout: {
            backgroundColor: '#FFFFFF00',
          },
          topBar: {
            visible: false
          },
          overlay: {
            interceptTouchOutside: true
          }
        }
      }
    })
  }

  render () {
    const {listId} = this.props
    return (
      <Subscribe to={[ListsContainer]}>
        {lists =>
          <>
            <SortableListView
                order={lists.order(listId)}
                data={lists.set(listId)}
                contentInset={{top: -50}}
                renderHeader={this._headerComponent}
                style={styles.list}
                onRowMoved={async e => {
                  const list = lists.getList(listId)
                  const items = [...list.items]
                  items.splice(e.to, 0, items.splice(e.from, 1)[0])
                  const newList = {...list, items: items}
                  lists.updateList(newList)
                }}
                renderRow={(item, sectionId, rowId) => {
                  return (
                    <Item 
                      changeMode={item => this._showActionSheet(item)}
                      onComplete={item => this.onComplete(lists, item)}
                      onDelete={item => this.onDelete(lists, item)}
                      {...{item}}
                    />
                  )
                }}
            />
            <ActionSheet
              ref={this._getActionSheetRef}
              title={'How we are going to get there?'}
              options={ACTION_SHEET_OPTIONS}
              cancelButtonIndex={0}
              onPress={this.handlePress}
            />
          </>
        }
      </Subscribe>
    )
  }
}

class Item extends React.Component {
  renderETA (directions, item) {
    if (item.previous) {
      const route = directions.get(item.mode, item.previous.location, item.location)
      if (route) {
        let {distance, duration} = route
        distance = distance > 10 ? Math.round(distance) : Math.round(distance * 10) / 10
        duration = Math.round(duration)
        return (
          <TouchableOpacity onPress={() => this.props.changeMode(item)}>
            <Text style={styles.subline}>
              {distance}km of {item.mode} in {duration} {duration > 1 ? 'minutes' : 'minute'}
            </Text>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity onPress={() => this.props.changeMode(item)}>
            <Text style={styles.subline}>{item.mode}</Text>
          </TouchableOpacity>
        )
      }
    } else {
      return (
        <Text style={styles.subline}>Starting point</Text>
      )
    }
  }

  render () {
    const {item} = this.props

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
                text={item.index}
                color={getColor(0)}
                completed={item.completed} />
            </View>
            <View style={styles.textsContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.actionsContainer}>
                <Subscribe to={[DirectionsContainer]}>{directions => this.renderETA(directions, item)}</Subscribe>
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

  list: {
    flex: 1,
    marginBottom: 0
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