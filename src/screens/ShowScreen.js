import React, {Component} from 'react'
import {View, SafeAreaView, Text, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'
import {Navigation} from 'react-native-navigation'

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
          name: 'todotrip.AddItem'
        }
      })
    }
  }

  render () {
    return (
      <SafeAreaView>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View>
          <Text>This is show screen {JSON.stringify(this.props)}</Text>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300
  }
})