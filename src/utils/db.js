import Store from 'react-native-store'

export const DB = {
  'lists': Store.model('lists')
}

export const getLists = () => {
  return DB.lists.find()
}

export const saveList = (list) => {
  return DB.lists.add(list)
}

export const updateList = (list, id) => {
  const {_id, ...nList} = list
  return DB.lists.updateById(nList, id)
}

export const findById = (id) => {
  return DB.lists.findById(id)
}

export const deleteList = (id) => {
  return DB.lists.removeById(id)
}

/*

{
  name: 'Madrid',
  items: [
    {
      name: 'Plaza de Espana',
      location: {
        latitude: '37.3771999',
        longitude: '-5.989087'
      },
      note: 'Must go! Recommended by George.'
    }
  ]
}

*/
