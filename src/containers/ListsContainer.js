import {Container} from 'unstated'
import uuid from 'uuid'
import * as db from '../utils/db'
import {getRegionForCoordinates} from '../utils/maps'

const jsonLists = [
  {name: 'Vilnius', public: true, items: [
    {
      id: uuid(),
      index: 1,
      title: 'Gediminas Castle Tower',
      name: 'Gediminas Castle Tower',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6866631,
        longitude: 25.2884653
      }
    },
    {
      id: uuid(),
      index: 2,
      title: 'Vilnius Cathedral',
      name: 'Vilnius Cathedral',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6858517,
        longitude: 25.2855455
      }
    },
    {
      id: uuid(),
      index: 3,
      title: 'City park',
      name: 'City park',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6874297,
        longitude: 25.2791292
      }
    },
    {
      id: uuid(),
      index: 4,
      title: 'Vokiečių str.',
      name: 'Vokiečių str.',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6791502,
        longitude: 25.2821801
      }
    },
    {
      id: uuid(),
      index: 5,
      title: 'Vilnius Townhall',
      name: 'Vilnius Townhall',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6781798,
        longitude: 25.2847437
      }
    },
    {
      id: uuid(),
      index: 6,
      title: 'Bernardine Park',
      name: 'Bernardine Park',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6844001,
        longitude: 25.2932583
      }
    },
    {
      id: uuid(),
      index: 7,
      title: 'Presidentail Palace',
      name: 'Presidentail Palace',
      completed: false,
      readonly: true,
      mode: 'walking',
      location: {
        latitude: 54.6831548,
        longitude: 25.2838108
      }
    },
  ]}
]

export default class ListsContainer extends Container {
  state = {
    lists: jsonLists
  }

  constructor (props) {
    super(props)
    db.getLists().then(lists => {
      this.setState({lists: this.state.lists.concat(lists || [])})
    })
  }

  // Lists
  async saveList (list) {
    list.region = getRegionForCoordinates(list.items.map(it => it.location))
    this.setState({
      lists: this.state.lists.concat(list)
    })

    await db.saveList(list)
  }

  async updateList (list) {
    list.items = list.items.map((it, index) => ({...it, index: index + 1}))
    list.region = getRegionForCoordinates(list.items.map(it => it.location))

    this.setState({
      lists: this.state.lists.map(it => it._id === list._id ? list : it)
    })

    await db.updateList(list, list._id)
  }

  async deleteList (id) {
    this.setState({
      lists: this.state.lists.filter(it => it._id !== id)
    })

    await db.deleteList(id)
  }

  getList (listId) {
    return this.state.lists.find(it => it._id === listId) || {}
  }

  getPublicLists () {
    return this.state.lists.filter(it => it.public)
  }

  getPrivateLists () {
    return this.state.lists.filter(it => !it.public)
  }

  getItems (listId) {
    return this.getList(listId).items || []
  }

  getItem (listId, itemId) {
    return this.getItems(listId).find(it => it.id === itemId)
  }

  order (listId) {
    return this.getItems(listId).map(it => it.id)
  }

  set (listId) {
    const [set] =  this.getItems(listId).reduce(([set, previous], item) => {
      set[item.id] = item
      set[item.id].previous = previous
      return [set, item]
    }, [{}, null])

    return set
  }

  // Items
  async saveItem (listId, item) {
    const list = this.getList(listId)
    if (!list) {
      return
    }
    
    list.items.push(item)
    await this.updateList(list)
  }

  async updateItem (listId, item) {
    const list = this.getList(listId)
    if (!list) {
      return
    }

    list.items = list.items.map(it => it.id === item.id ? item : it)
    await this.updateList(list)
  }

  async deleteItem (listId, itemId) {
    const list = this.getList(listId)
    if (!list) {
      return
    }

    list.items = list.items.filter(it => it.id !== itemId)
    await this.updateList(list)
  }
}
