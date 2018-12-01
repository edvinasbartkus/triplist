import {Container} from 'unstated'
import * as db from '../utils/db'

export default class ListsContainer extends Container {
  state = {
    lists: []
  }

  constructor (props) {
    super(props)
    db.getLists().then(lists => this.setState({lists}))
  }

  // Lists
  async saveList (list) {
    this.setState({
      lists: this.state.lists.concat(list)
    })

    await saveList(list)
  }

  async updateList (list) {
    list.items = list.items.map((it, index) => ({...it, index: index + 1}))
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

  getItems (listId) {
    return this.getList(listId).items || []
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
