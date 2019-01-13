import React, {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Map from '../components/Map'
import SortableListView from 'react-native-sortable-listview'
import {Subscribe} from 'unstated'
import ListsContainer from '../containers/ListsContainer'
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import ModeButtons from '../components/ModeButtons'
import Item from '../components/Item'
import Total from '../components/Total'

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
    Navigation.events().bindComponent(this)
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

  _footerComponent = () => <Total listId={this.props.listId} />

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
                automaticallyAdjustContentInsets={false}
                order={lists.order(listId)}
                data={lists.set(listId)}
                renderHeader={this._headerComponent}
                renderFooter={this._footerComponent}
                style={styles.list}
                onRowMoved={async e => {
                  const list = lists.getList(listId)
                  const items = [...list.items]
                  items.splice(e.to, 0, items.splice(e.from, 1)[0])
                  const newList = {...list, items: items}
                  lists.updateList(newList)
                }}
                renderRow={(item) => {
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

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: 0
  },
})
