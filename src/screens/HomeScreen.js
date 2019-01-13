import React, {Component} from 'react'
import {View, Text, ActionSheetIOS, SafeAreaView, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native'
import {Navigation} from 'react-native-navigation'

import uuid from 'uuid'
import {getColor} from './../utils/consts'
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';

const DOTS_IMAGE = require('./../assets/oval.png')

const jsonLists = [
  {name: 'Vilnius', public: true, items: [
    {
      id: uuid(),
      title: 'Gediminas Castle Tower',
      name: 'Gediminas Castle Tower',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6866631,
        longitude: 25.2884653
      }
    },
    {
      id: uuid(),
      title: 'Vilnius Cathedral',
      name: 'Vilnius Cathedral',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6858517,
        longitude: 25.2855455
      }
    },
    {
      id: uuid(),
      title: 'City park',
      name: 'City park',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6874297,
        longitude: 25.2791292
      }
    },
    {
      id: uuid(),
      title: 'Vokiečių str.',
      name: 'Vokiečių str.',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6791502,
        longitude: 25.2821801
      }
    },
    {
      id: uuid(),
      title: 'Vilnius Townhall',
      name: 'Vilnius Townhall',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6781798,
        longitude: 25.2847437
      }
    },
    {
      id: uuid(),
      title: 'Bernardine Park',
      name: 'Bernardine Park',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6844001,
        longitude: 25.2932583
      }
    },
    {
      id: uuid(),
      title: 'Presidentail Palace',
      name: 'Presidentail Palace',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6831548,
        longitude: 25.2838108
      }
    },
  ]}
]

export default class HomeScreen extends Component {
  static options() {
    return {
      topBar: {
        title: {
          text: 'Triplist'
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
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'buttonAdd') {
      this.newList()
    }
  }

  newList () {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'todotrip.AddList',
        options: {
          topBar: {
            title: {
              text: 'New list'
            },
            backButton: {
              title: 'Back'
            }
          },
        }
      }
    })
  }

  onPress (list, index) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'todotrip.Show',
        passProps: {
          listId: list._id
        },
        options: {
          topBar: {
            title: {
              text: list.name,
              color: 'white'
            },
            background: {
              color: getColor(index),
              translucent: false,
              blur: false
            },
            backButton: {
              title: 'Back',
              showTitle: false,
              color: 'white'
            }
          },
        }
      }
    })
  }

  onActions (container, list) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1
    }, async (buttonIndex) => {
      if (buttonIndex === 1) {
        container.deleteList(list._id)
      }
    });
  }

  renderDone (items) {
    const length = items.filter(it => it.completed).length
    if (length > 0) {
      return `${Math.round(length / items.length * 100)}% completed.`
    }
  }

  renderList (container, list, index) {
    return (
      <TouchableOpacity
        key={list.name}
        style={styles.card}
        onPress={() => this.onPress(list, index)}>
        <View style={[styles.innerCard, {backgroundColor: getColor(index)}]}>
          {!list.public ?
            <TouchableOpacity style={styles.image} onPress={() => this.onActions(container, list)}>
              <Image source={DOTS_IMAGE} width={17} height={17} />
            </TouchableOpacity>
            : null}
          <View>
            <Text numberOfLines={2} style={styles.text}>{list.name}</Text>
            <Text style={styles.subline}>{list.items.length} places. {this.renderDone(list.items)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <Subscribe to={[ListsContainer]}>
        {container =>
          <ScrollView style={styles.container}>
            <View style={[styles.cardContainer, {flex: 2}]}>
              <Text style={styles.h1}>Your lists</Text>
              {container.getPrivateLists().map((list, index) => this.renderList(container, list, index))}
              {container.getPrivateLists().length === 0 ? <NewList onPress={() => this.newList()} /> : null}
              <Text style={styles.h1}>Inspiration</Text>
              {container.getPublicLists().map((list, index) => this.renderList(container, list, index))}
            </View>
          </ScrollView>
        }
      </Subscribe>
    )
  }
}

class NewList extends Component {
  render () {
    return (
      <TouchableOpacity testID='NewListButton' onPress={() => this.props.onPress()} style={styles.newContainer}>
        <View style={styles.newInnerContainer}>
          <Text style={styles.newContainerText}>Create new travel list</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexBasis: 10,
    flexDirection: 'column',
    padding: 5
  },

  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
    width: '50%',
    height: 130,
    paddingLeft: 5,
    paddingRight: 5
  },

  innerCard: {
    height: 120,
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#CCC',
    justifyContent: 'space-between'
  },

  text: {
    color: 'white',
    fontSize: 18
  },

  subline: {
    fontSize: 12,
    color: '#F5F5F5',
    marginTop: 5
  },

  image: {
    alignSelf: 'flex-end'
  },

  newContainer: {
    width: '50%',
    height: 115,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },

  newInnerContainer: {
    height: 100,
    borderRadius: 5,
    padding: 10,
    borderColor: getColor(0),
    borderWidth: 2,
    justifyContent: 'flex-end'
  },

  newContainerText: {
    color: getColor(0)
  },

  h1: {
    width: '100%',
    paddingLeft: 5,
    paddingTop: 30,
    height: 65,
    fontSize: 24,
    fontWeight: '600'
  }
})
