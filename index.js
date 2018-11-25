import React from 'react'
import {Navigation} from 'react-native-navigation'
import HomeScreen from './src/screens/HomeScreen'
import ShowScreen from './src/screens/ShowScreen'
import AddItemScreen from './src/screens/AddItemScreen'
import AddListScreen from './src/screens/AddListScreen'
import { Provider, Subscribe, Container } from 'unstated'
import ListsContainer from './src/containers/ListsContainer'

const screens = [
  ['todotrip.Home', HomeScreen],
  ['todotrip.Show', ShowScreen],
  ['todotrip.AddItem', AddItemScreen],
  ['todotrip.AddList', AddListScreen]
]

const listsContainer = new ListsContainer()

for(const [name, Screen] of screens) {
  Navigation.registerComponentWithRedux(name, () => Screen, Provider, {inject: [listsContainer]})
}

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: 'todotrip.Home'
          }
        }]
      }
    }
  })
})
