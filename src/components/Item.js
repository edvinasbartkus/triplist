import React, {Component} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, TouchableHighlight} from 'react-native'
import SwipeableRow from 'react-native/Libraries/Experimental/SwipeableRow/SwipeableRow'
import {Subscribe} from 'unstated'
import DirectionsContainer from '../containers/DirectionsContainer'
import Circle from './Circle'
import {getColor} from '../utils/consts'
import Round from './Round'

export default class Item extends Component {
  renderETA (directions, item) {
    if (item.previous) {
      const route = directions.get(item.mode, item.previous.location, item.location)
      if (route) {
        return (
          <TouchableOpacity onPress={() => this.props.changeMode(item)}>
            <Text style={styles.subline}>
              <Round value={route.distance} /> of <Text style={styles.underline}>{item.mode}</Text> in <Round isTime value={route.duration} />
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
        shouldBounceOnMount={false}
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  subline: {
    fontSize: 12,
    color: '#666'
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

  textsContainer: {
    justifyContent: 'center'
  },

  itemText: { 
    fontSize: 22,
  },

  actionsContainer: {
    flexDirection: 'row'
  },

  underline: {
    color: '#007aff'
  }
})
