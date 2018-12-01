import {Container} from 'unstated'
import {AsyncStorage} from 'react-native'
import _ from 'lodash'
import axios from 'axios'
import {KEY as API_KEY} from '../utils/maps' 

const KEY = 'directions'
const LOADING = 'loading'
const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json'

const getFromCache = () => {
  return new Promise(resolve => {
    AsyncStorage.getItem(KEY, (error, data) => {
      if (data) {
        resolve(JSON.parse(data))
      } else {
        resolve({})
      }
    })
  })
}

const saveToCache = (directions) => {
  return AsyncStorage.setItem(KEY, JSON.stringify(directions))
}

const getKey = (mode, from, to) => {
  return `directions:${mode}_${JSON.stringify(from)}_${JSON.stringify(to)}`
}

// Taken: https://github.com/bramus/react-native-maps-directions/blob/master/src/MapViewDirections.js
function decode (t, e) {
  for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
    a = null, h = 0, i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]);
  }

  return d = d.map(function(t) {
    return {
      latitude: t[0],
      longitude: t[1]
    }
  })
}

const retrieve = (mode, from, to) => {
  return new Promise((resolve, reject) => {
    const destination = `${to.latitude},${to.longitude}`
    const origin = `${from.latitude},${from.longitude}`
    
    const url = BASE_URL + `?origin=${origin}&destination=${destination}&key=${API_KEY}&mode=${mode}`
    axios
      .get(url)
      .then(response => {
        const json = response.data
        if (json.status !== 'OK') {
          reject(json.error_message || 'Unknown error')
        }

        if (json.routes.length) {
          const route = json.routes[0]
          const coordinates = decode(route.overview_polyline.points)
          const result = {
            key: getKey(mode, from, to),
            distance: route.legs.reduce((carry, curr) => {
              return carry + curr.distance.value
            }, 0) / 1000,
            duration: route.legs.reduce((carry, curr) => {
              return carry + curr.duration.value
            }, 0) / 60,
            coordinates,
            fare: route.fare,
            expire: Date.now() + (60 * 60 * 60 * 1000)
          }

          resolve(result)
        }
      })
  })
}

export default class DirectionsContainer extends Container {
  constructor () {
    super()

    this.directions = {}
    this.state = {
      isLoading: true,
      directions: {}
    }

    getFromCache().then(directions => {
      this.setState({directions, isLoading: false})
      this.subscribe(s => saveToCache(this.state.directions))
    })
  }

  get (mode, from, to) {
    if (this.state.isLoading) {
      return null
    }

    const key = getKey(mode, from, to)
    const route = this.state.directions[key]

    if (route) {
      if (route === LOADING) {
        return null
      } else if (route.expire > Date.now()) {
        return route
      }
    }

    
    if (this.directions[key] !== LOADING) {
      this.directions[key] = LOADING
      retrieve(mode, from, to).then(result => this.setState(state => {
        return {
          directions: {
            ...this.directions,
            ...state.directions,
            [key]: result
          }
        }
      })
    )}
   
    return null
  }
}