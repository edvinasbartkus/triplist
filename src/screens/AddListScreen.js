import React, {Component} from 'react'
import {View, TextInput, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {Subscribe} from 'unstated'
import ListsContainer from '../containers/ListsContainer'
import {COLORS} from '../utils/consts'

export default class AddListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      location: ''
    }
  }

  async onPress (container) {
    const {name} = this.state
    container.saveList({name, items: []})
    Navigation.pop(this.props.componentId)
  }

  render () {
    return (
      <Subscribe to={[ListsContainer]}>
      {lists => <View>
        <TextInput
          value={this.state.name}
          onChangeText={name => this.setState({name})}
          style={styles.input}
          placeholder={'Name of your list'}
          autoFocus={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onPress(lists)}
            accessibilityLabel="Create a new list with your chosen name">
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>}
      </Subscribe>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    fontSize: 18,
    margin: 10,
    padding: 5,
    borderRadius: 4
  },
  button: {
    borderRadius: 4,
    backgroundColor: COLORS[0],
    textAlign: 'center',
    padding: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer: {
    paddingHorizontal: 10
  }
})