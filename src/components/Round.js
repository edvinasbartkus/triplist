import React, {PureComponent} from 'react'
import {Text} from 'react-native'

export default class Round extends PureComponent {
  render () {
    const {isTime, value} = this.props
    if (isTime) {
      if (value >= 60) {
        const output = []
        const hours = Math.floor(value / 60)
        const minutes = value % 60
        output.push(hours > 1 ? `${hours} horus` : `${hours} hour`)
        if (minutes > 0) {
          output.push(minutes > 1 ? `${Math.round(minutes)} minutes` : `${Math.round(minutes)} minute`)
        }

        return <Text>{output.join(' ')}</Text>
      } else {
        return <Text>{value > 1 ? `${Math.round(value)} minutes` : `${Math.round(value)} minute`}</Text>
      }
    } else {
      return <Text>
        {value > 10 ? Math.round(value) : Math.round(value * 10) / 10} km
      </Text>
    }
  }
}
