import React, {Component} from 'react'
import {View,  SafeAreaView, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'

const BLUE_ICONS = {
  'walking': require('./../assets/walking-blue.png'),
  'driving': require('./../assets/driving-blue.png'),
  'bicycling': require('./../assets/bicycling-blue.png'),
  'transit': require('./../assets/transit-blue.png')
}

const WHITE_ICONS = {
  'walking': require('./../assets/walking-white.png'),
  'driving': require('./../assets/driving-white.png'),
  'bicycling': require('./../assets/bicycling-white.png'),
  'transit': require('./../assets/transit-white.png')
}

export default class ModeButtons extends Component {
  renderButton (mode) {
    return <Button
      mode={mode}
      selected={this.props.item.mode === mode}
      onPress={() => this.props.onUpdate({mode: mode})}
    />
  }

  render () {
    const {mode} = this.props.item
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.innerRow}>
              {this.renderButton('walking')}
              {this.renderButton('driving')}
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.innerRow}>
              {this.renderButton('transit')}
              {this.renderButton('bicycling')}
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

class Button extends Component {
  render () {
    const {selected, mode} = this.props
    const icons = selected ? WHITE_ICONS : BLUE_ICONS
    const icon = icons[mode]
    return (
      <TouchableOpacity {...this.props} style={[styles.button, selected ? styles.buttonSelected : styles.buttonDefault]}>
        <Image source={icon} height={18} />
        <Text style={[selected ? styles.textWhite : styles.textBlue]}>{mode}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    height: 90
  },
  innerRow: {
    width: '95%',
    flexDirection: 'row'
  },
  button: {
    width: '50%',
    height: 80,
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  buttonDefault: {
    backgroundColor: '#E9E8E4'
  },
  buttonSelected: {
    backgroundColor: '#0076FF'
  },
  textWhite: {
    color: '#FFFFFF'
  },
  textBlue: {
    color: '#0076FF'
  }
})