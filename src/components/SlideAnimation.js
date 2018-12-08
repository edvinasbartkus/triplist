import React, {Component} from 'react'
import {View, Animated} from 'react-native'

export default class SlideAnimation extends Component {
  state = {
    value: new Animated.Value(200)
  }

  componentDidMount () {
    Animated.spring(this.state.value, {
      toValue: 0,
      velocity: 3,
      tension: 2,
      friction: 8
    }).start()
  }

  render () {
    return (
      <Animated.View style={[ this.props.style, {transform: [{translateY: this.state.value}]} ]}>
        {this.props.children}
      </Animated.View>
    )
  }
}
