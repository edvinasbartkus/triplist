import React, {Component} from 'react'
import {View, TextInput, Button, StyleSheet} from 'react-native'
import {Navigation} from 'react-native-navigation'

import AutoComplete from 'react-native-autocomplete'
import Countries from '../assets/countries.json'
import {Subscribe} from 'unstated'
import ListsContainer from '../containers/ListsContainer'

export default class AddListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      location: '',
      data: []
    }

    this.onTyping = this.onTyping.bind(this)
  }

  async onPress (container) {
    const {name} = this.state
    container.saveList({name, items: []})
    Navigation.pop(this.props.componentId)
  }

  onTyping (text) {
    const countries = Countries.filter(country => 
      country.name.toLowerCase().startsWith(text.toLowerCase())
    ).map(country => country.name)

    this.setState({ data: countries })
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
        <AutoComplete
          style={styles.autocomplete}
          suggestions={this.state.data}
          onTyping={this.onTyping}
          onSelect={this.onSelect}
          placeholder="Search for a country"
          clearButtonMode="always"
          returnKeyType="go"
          textAlign="center"
          clearTextOnFocus
          autoCompleteTableTopOffset={10}
          autoCompleteTableLeftOffset={20}
          autoCompleteTableSizeOffset={-40}
          autoCompleteTableBorderColor="lightblue"
          autoCompleteTableBackgroundColor="azure"
          autoCompleteTableCornerRadius={8}
          autoCompleteTableBorderWidth={1}
          autoCompleteFontSize={15}
          autoCompleteRegularFontName="Helvetica Neue"
          autoCompleteBoldFontName="Helvetica Bold"
          autoCompleteTableCellTextColor={"dimgray"}
          autoCompleteRowHeight={40}
          autoCompleteFetchRequestDelay={100}
          maximumNumberOfAutoCompleteRows={6}
        />
        <Button
          onPress={() => this.onPress(lists)}
          title="Save"
          accessibilityLabel="Create a new list with your chosen name"
        />
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
  }
})