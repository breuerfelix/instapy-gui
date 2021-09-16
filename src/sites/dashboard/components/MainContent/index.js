import {h} from 'preact'
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Statistics from '../Statistics'
import Logger from '../Logger'
import UserStatistics from '../UserStatistics'

export default class MainContent extends Component {
  render({ match }) {
    console.log(match)
    return (
        <Switch>
          <Route path={`${match.url}/`} component={Statistics} />
          <Route path={`${match.url}/logs`} component={Logger} />
          <Route path={`${match.url}/userStatistics/:id`} component={UserStatistics} />
        </Switch>
    )
  }
}
