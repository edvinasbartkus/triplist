import React, {Component} from 'react'
import {View, SafeAreaView, Text, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'

export default class ShowScreen extends Component {
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