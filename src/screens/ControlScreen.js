import React, {Component} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {BlurView, VibrancyView} from 'react-native-blur'
import ModeButtons from '../components/ModeButtons';
import {Navigation} from 'react-native-navigation'
import SlideAnimation from '../components/SlideAnimation';
import { Subscribe } from 'unstated';
import ListsContainer from '../containers/ListsContainer';

export default class ControlScreen extends Component {
  dismiss = () => {
    Navigation.dismissOverlay(this.props.componentId)
  }

  async onUpdate (container, value) {
    const {listId, item} = this.props
    await container.updateItem(listId, {
      ...item,
      ...value
    })
  }

  render () {
    const {listId, item} = this.props
    return (
      <TouchableWithoutFeedback onPress={this.dismiss}>
        <BlurView style={styles.container} blurType='dark' blurAmount={1}>
          <View style={styles.innerContainer}>
            <SlideAnimation style={styles.actionsContainer}>
              <Subscribe to={[ListsContainer]}>
              {lists => <ModeButtons item={lists.getItem(listId, item.id)} onUpdate={value => this.onUpdate(lists, value)} />}
              </Subscribe>
            </SlideAnimation>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },

  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },

  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },


})