import React, {Component} from 'react'
import {View, Text, NativeModules, StyleSheet, Button, FlatList} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {updateList} from './../utils/db'

export default class AddItemScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        drawBehind: false,
        visible: true,
        searchBar: true
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
      // Geocoder.from(text).then(json => this.setState({results: json.results || []}))

      const region = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }

      NativeModules.RNLocalSearch.searchForLocations(text, region, (err, response) => this.setState({results: response}))
    }
  }

  async onPress (location) {
    const {list} = this.props
    list.items = [ location, ...list.items ]

    await updateList(list, list._id)
    Navigation.pop(this.props.componentId)
  }

  renderResult (location) {
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
            onPress={() => this.onPress(location)}
          />
        </View>
      </View>
    )
  }

  render () {
    const {results, isFocused} = this.state
    return (
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.name}
        renderItem={({item}) => this.renderResult(item)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => <View style={styles.separator} />}
      />
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#666'
  }
})
