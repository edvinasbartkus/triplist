import React, {Component} from 'react'
import {View, Text, NativeModules, StyleSheet, Button, FlatList} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {updateList} from './../utils/db'
import uuid from 'uuid'
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';

export default class AddItemScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: true,
        visible: true,
        searchBar: true,
        searchBarHiddenWhenScrolling: false
      }
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      results: [],
      search: '',
      isFocused: false
    }

    Navigation.events().bindComponent(this)
  }

  searchBarUpdated({ text, isFocused }) {
    const oldSearch = this.state.search
    this.setState({search: text, isFocused})

    if (text === oldSearch) {
      return
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.search(text)
    }, 1000)
  }

  search (text) {
    if (text) {
      NativeModules.RNLocalSearch.searchForLocations(text, {}, (err, response) => this.setState({results: response}))
    }
  }

  async onPress (container, location) {
    await container.saveItem(this.props.listId, {
      ...location,
      id: uuid(),
      mode: 'walking',
      completed: false
    })
    Navigation.pop(this.props.componentId)
  }

  renderResult (container, location) {
    /*
      {
        location: {
          lattitude: 37.12,
          longitude: -122.44,
        },
        phoneNumber: '+1 (415) 831-550',
        title: 'Address',
        name: 'Buena Vista',
      }
    */
    return (
      <View key={location.name} style={styles.row}>
        <View style={styles.texts}>
          <Text style={styles.name}>{location.name}</Text>
          <Text style={styles.title}>{location.title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title='Add'
            onPress={() => this.onPress(container, location)}
          />
        </View>
      </View>
    )
  }

  render () {
    const {results, isFocused} = this.state
    return (
      <Subscribe to={[ListsContainer]}>
        {lists =>
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.name}
            renderItem={({item}) => this.renderResult(lists, item)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.separator} />}
          />
        }
      </Subscribe>
    )
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
  },

  title: {
    color: '#666'
  },
  
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  
  texts: {
    flexDirection: 'column',
    width: '80%'
  },

  buttonContainer: {
    width: '20%',
    alignItems: 'flex-end'
  },

  separator: {
    borderTopWidth: 1,
    borderTopColor: '#666'
  }
})
