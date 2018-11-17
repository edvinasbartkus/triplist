import React, {Component} from 'react'
import {View, TextInput, Button} from 'react-native'
import {saveList} from './../utils/db'
import {Navigation} from 'react-native-navigation'

export default class AddListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  async onPress () {
    const {name} = this.state
    await saveList({name, items: []})
    Navigation.pop(this.props.componentId)
  }

  render () {
    return (
      <View>
        <TextInput
          value={this.state.name}
          onChangeText={name => this.setState({name})}
        />
        <Button
          onPress={() => this.onPress()}
          title="Save"
          color="#841584"
          accessibilityLabel="Create a new list with your chosen name"
        />
      </View>
    )
  }
}
