import React, {Component} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native'
import {Navigation} from 'react-native-navigation'

import {getLists} from './../utils/db'

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

  renderList (list) {
    return (
      <TouchableOpacity
        key={list.name}
        style={styles.card}
        onPress={() => this.onPress(list)}>
        <View style={styles.innerCard}>
          <Text>{list.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const {lists} = this.state
    return (
      <SafeAreaView>
        <View style={styles.cardContainer}>
          {lists.map(list => this.renderList(list))}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
    width: '50%',
    height: 85,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  innerCard: {
    height: 70,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#CCC',
    justifyContent: 'flex-end'
  }
})
