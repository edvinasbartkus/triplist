import React, {PureComponent} from 'react'
import {TouchableOpacity, Text} from 'react-native'

const container = {
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center'
}

export default class Circle extends PureComponent {
  render () {
    const {text, completed, color, width} = this.props
    const w = width || 25

    const [containerStyle, textStyle] = completed ? [
        {backgroundColor: color, borderWidth: 2, borderColor: color, width: w, height: w, borderRadius: w, ...container},
        {color: 'white', fontWeight: '500'}
      ] : [
        {backgroundColor: 'white', borderWidth: 2, borderColor: color, width: w, height: w, borderRadius: w, ...container},
        {color: color, fontWeight: '500'}
      ]

    return (
      <TouchableOpacity onPress={() => this.props.onPress()} style={containerStyle}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    )
  }
}