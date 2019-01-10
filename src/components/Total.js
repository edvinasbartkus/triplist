import React, {PureComponent} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Subscribe} from 'unstated'
import Round from './Round'
import ListsContainer from '../containers/ListsContainer'
import DirectionsContainer from '../containers/DirectionsContainer'

function getDistanceAndTime (directions, items) {
  let sumDuration = 0
  let sumDistance = 0
  for (let item of items) {
    if (item.previous) {
      const route = directions.get(item.mode, item.previous.location, item.location)
      if (route) {
        let {distance, duration} = route
        sumDistance += distance
        sumDuration += duration
      }
    }
  }

  return {distance: sumDistance, duration: sumDuration}
}

export default class Total extends PureComponent {
  render () {
    return <Subscribe to={[ListsContainer, DirectionsContainer]}>
      {(lists, directions) => {
        const {distance, duration} = getDistanceAndTime(directions, lists.getItems(this.props.listId))
        return <View style={styles.container}>
          <Text style={styles.text}>Total distance <Round value={distance} /></Text>
          <Text style={styles.text}>Total travel time <Round value={duration} isTime /></Text>
        </View>
      }}
    </Subscribe>
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  text: {
    fontSize: 12,
    color: '#666'
  }
})
