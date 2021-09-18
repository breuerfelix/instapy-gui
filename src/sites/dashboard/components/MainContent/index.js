import {h} from 'preact'
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Statistics from '../Statistics'
import UserStatistics from '../UserStatistics'

export default class MainContent extends Component {
  render({ match }) {
    return (
        <Switch>
          <Route path={`${match.url}/`} exact component={Statistics} />
          <Route path={`${match.url}/userStatistics/:id`} component={UserStatistics} />
        </Switch>
    )
  }
}
