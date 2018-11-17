import Store from 'react-native-store'

export const DB = {
  'lists': Store.model('lists')
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
