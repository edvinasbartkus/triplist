import {Navigation} from 'react-native-navigation'
import HomeScreen from './src/screens/HomeScreen'
import ShowScreen from './src/screens/ShowScreen'
import AddItemScreen from './src/screens/AddItemScreen'
import AddListScreen from './src/screens/AddListScreen'

Navigation.registerComponent('todotrip.Home', () => HomeScreen)
Navigation.registerComponent('todotrip.Show', () => ShowScreen)
Navigation.registerComponent('todotrip.AddItem', () => AddItemScreen)
Navigation.registerComponent('todotrip.AddList', () => AddListScreen)
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
