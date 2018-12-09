import React, {Component} from 'react'
import {
  AlertIOS,
  ActionSheetIOS,
  Image,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Linking
} from 'react-native'
import lodash from 'lodash'
import Note from './Note'

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

const ICONS = {
  directions: require('./../assets/directions.png'),
  note: require('./../assets/note.png')
}

export default class ModeButtons extends Component {
  getModeForDirections (mode) {
    switch (mode) {
      case 'walking': return 'w'
      case 'driving': return 'd'
      case 'bicycling': return 'b'
      case 'transit': return 'r'
      default:
        break;
    }
  }

  getDirections = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Apple Maps', 'Google Maps'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      const {item} = this.props
      const {mode, location} = item
      const {latitude, longitude} = location
      const loc = `${latitude},${longitude}`
      let url

      if (buttonIndex === 1) {
        url = `http://maps.apple.com/?daddr=${loc}`
      } else if (buttonIndex === 2) {
        url = `https://www.google.com/maps/dir/?api=1&destination=${loc}&travelmode=${mode}`
      }

      if (url) {
        Linking
          .openURL(url)
          .catch(err => console.error('An error occurred', err))
      }
    })
  }

  setNote = () => {
    const item = this.props.item
    AlertIOS.prompt(
      'Leave a note',
      item.note || null,
      text => this.props.onUpdate({note: text})
    )
  }

  renderButton (mode) {
    return <Button
      mode={mode}
      selected={this.props.item.mode === mode}
      onPress={() => this.props.onUpdate({mode: mode})}
    />
  }

  separator = () => <View style={styles.actionButtonSeparator} />

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
          <Note text={this.props.item.note} />
          <FlatList
            data={[
              {id: 'directions', text: 'Get directions', onPress: this.getDirections, icon: ICONS.directions},
              {id: 'note', text: 'Leave a note', onPress: this.setNote, icon: ICONS.note}
            ]}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ActionButton {...item} />}
            ListHeaderComponent={this.separator}
            ListFooterComponent={this.separator}
            ItemSeparatorComponent={this.separator}
            contentContainerStyle={styles.actionButtonsContainer}
          />
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
        <Text style={[selected ? styles.textWhite : styles.textBlue]}>{lodash.camelCase(mode)}</Text>
      </TouchableOpacity>
    )
  }
}

class ActionButton extends Component {
  render () {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.actionButton}>
        <Text style={styles.actionButtonText}>{this.props.text}</Text>
        <Image source={this.props.icon} style={{width: 28, height: 28}} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 5,
    color: '#FFFFFF'
  },
  textBlue: {
    marginTop: 5,
    color: '#0076FF'
  },
  actionButtonsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 60,
  },
  actionButton: {
    paddingTop: 17,
    paddingBottom: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    fontSize: 18
  },
  actionButtonSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDF'
  }
})