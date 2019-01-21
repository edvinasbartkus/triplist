import React, {Component} from 'react'
import {View, Text, NativeModules, StyleSheet, Button, FlatList} from 'react-native'
import {Navigation} from 'react-native-navigation'
import uuid from 'uuid'
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';
import {distance} from '../utils/maps';
import Round from '../components/Round'

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
    if (this.state.isFocused && !isFocused) {
      this.setState({search: text, isFocused})
      this.search(text)
      return
    }

    this.setState({search: text, isFocused})

    if (text === oldSearch) {
      return
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.search(text)
    }, 50)
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

  lastPosition (container) {
    const items = container.getItems(this.props.listId)
    if (items.length) {
      return items[items.length - 1].location
    } else {
      return container.getList(this.props.listId).region
    }
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
          <Text style={styles.title}>
            <Round value={distance(location.location, this.lastPosition(container))} />
            <Text> away · </Text>
            {location.title}
          </Text>
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
    const {results} = this.state
    return (
      <Subscribe to={[ListsContainer]}>
        {lists =>
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.name}
            renderItem={({item}) => this.renderResult(lists, item)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <Footer results={this.state.results} />}
          />
        }
      </Subscribe>
    )
  }
}

class Footer extends React.PureComponent {
  render () {
    return (
      <View>
        <View style={styles.separator} />
        {this.props.results.length ?
          <View style={styles.footer}>
            <Text style={styles.footerText}>The distance is calculated between the last item in the list and the search result item.</Text>
          </View>
          : undefined}
      </View>
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
    borderTopColor: '#D0D1D0'
  },

  footer: {
    padding: 20
  },

  footerText: {
    color: '#D0D1D0',
    fontSize: 12
  }
})
