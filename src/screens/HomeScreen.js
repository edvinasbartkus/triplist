import React, {Component} from 'react'
import {View, Text, ActionSheetIOS, SafeAreaView, TouchableOpacity, StyleSheet, Image} from 'react-native'
import {Navigation} from 'react-native-navigation'

import {getLists, deleteList} from './../utils/db'
import {getColor} from './../utils/consts'

const DOTS_IMAGE = require('./../assets/oval.png')

export default class HomeScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'TODO Trip'
        },
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
      lists: []
    }

    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'buttonAdd') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'todotrip.AddList'
        }
      })
    }
  }

  async componentDidAppear () {
    this.load()
  }

  componentWillMount () {
    this.load()
  }

  load() {
    getLists().then(lists => this.setState({lists: lists || []}))
  }

  onPress (list) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'todotrip.Show',
        passProps: {
          list
        },
        options: {
          topBar: {
            title: {
              text: list.name
            },
            backButton: {
              title: 'Back',
              showTitle: false
            }
          },
        }
      }
    })
  }

  onActions (list) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1
    }, async (buttonIndex) => {
      if (buttonIndex === 1) {
        await deleteList(list._id)
        this.load()
      }
    });
  }

  renderList (list, index) {
    return (
      <TouchableOpacity
        key={list.name}
        style={styles.card}
        onPress={() => this.onPress(list)}>
        <View style={[styles.innerCard, {backgroundColor: getColor(index)}]}>
          <TouchableOpacity style={styles.image} onPress={() => this.onActions(list)}>
            <Image source={DOTS_IMAGE} width={17} height={17} />
          </TouchableOpacity>
          <View>
            <Text style={styles.text}>{list.name}</Text>
            <Text style={styles.subline}>{list.items.length} destinations</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const {lists} = this.state
    return (
      <SafeAreaView>
        <View style={styles.cardContainer}>
          {lists.map((list, index) => this.renderList(list, index))}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  card: {
    width: '50%',
    height: 115,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },

  innerCard: {
    height: 100,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#CCC',
    justifyContent: 'space-between'
  },

  text: {
    color: 'white',
    fontSize: 18
  },

  subline: {
    fontSize: 12,
    color: '#F5F5F5'
  },

  image: {
    alignSelf: 'flex-end'
  }
})
