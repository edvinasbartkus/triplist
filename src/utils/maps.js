import {GOOGLE_API_KEY} from 'react-native-dotenv'

export const KEY = GOOGLE_API_KEY

export const getRegionForCoordinates = function getRegionForCoordinates (points) {
  if (!points.length) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  }

  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY

  // init first point
  ((point) => {
    minX = point.latitude
    maxX = point.latitude
    minY = point.longitude
    maxY = point.longitude
  })(points[0])

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude)
    maxX = Math.max(maxX, point.latitude)
    minY = Math.min(minY, point.longitude)
    maxY = Math.max(maxY, point.longitude)
  });

  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  const deltaX = (maxX - minX)
  const deltaY = (maxY - minY)

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX * 1.3,
    longitudeDelta: deltaY * 1.3
  }
}

// Returns distance in KM
export const distance = (pointA, pointB) => {
  const lat1 = pointA.latitude
  const lon1 = pointA.longitude
  const lat2 = pointB.latitude
  const lon2 = pointB.longitude

  var R = 6371
  var dLat = deg2rad(lat2-lat1)
  var dLon = deg2rad(lon2-lon1)
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  var d = R * c
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}