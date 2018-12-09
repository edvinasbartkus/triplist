import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'

export default class Note extends Component {
  render () {
    const {text} = this.props
    if (text) {
      return (
        <View style={styles.container}>
          <Text style={styles.bold}>Note</Text>
          <Text>{text}</Text>
        </View>
      )
    } else {
      return <View />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },

  bold: {
    fontWeight: '600'
  }
})
