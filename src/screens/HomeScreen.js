import React, {Component} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import {Navigation} from 'react-native-navigation'

export default class HomeScreen extends Component {
  onPress () {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'todotrip.Show'
      }
    })
  }

  render () {
    return (
      <SafeAreaView>
        <View>
          <Text>Home screen</Text>
        </View>
        <TouchableOpacity onPress={() => this.onPress()}>
          <Text>Open show</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
