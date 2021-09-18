import {h} from 'preact'
import React, { Component } from 'react'
import { SocketService } from 'services'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { HashLoader } from 'react-spinners'
import { css } from 'react-emotion'
import Moment from 'moment'

// chart
import ReactChartkick, { LineChart } from 'react-chartkick'
import Chart from 'chart.js'

// emotion lib
const override = css`
    display: block;
    margin: 15px auto;`;

const styles = theme => ({
  wrapper: {
    display: 'grid',
    justifyContent: 'center',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  menuButton: {
    marginLeft: 18,
    textDecoration: 'None',
  },
});

class AccountStatistics extends Component {
  state = {
    userStats: [],
    updatedUserStats: [],
    loading: true
  }

  updateUserStatistics = data => {
    const {userStats} = this.state;

    this.setState({
      userStats: userStats
        .concat(data.data)
        .map((value,index,self) => {
          const second_value = self.find(inner_value => value.day == inner_value.day)
          if (value.created_at > second_value.created_at){
            value.remove = true
          } else if (value.created_at < second_value.created_at){
            second_value.remove = true
          }
          return value
        })
        // Should save the earlier created
        .filter(value => !value.remove)
    })

    this.calculateProgress()
  }

  componentDidMount = () => {
    const { match } = this.props

    SocketService.register('get-user-statistics', this.updateUserStatistics);
    SocketService.send({
      handler: 'get-user-statistics',
      action: 'get',
      username: Buffer.from(match.params.id, 'base64').toString('latin1')
    });
  }

  calculateProgress = () => {
    this.setState(prevState => {
      let tempFollowers = undefined
      let newFollowers = 0
      return {
        updatedUserStats: prevState.userStats.map(stats => {
          if (tempFollowers === undefined) {
            // if first record, there isnt data to compare
            tempFollowers = stats.followers
            return { ...stats, newFollowers: '...' }
          } else {
            // newFollowers = current day followers - previous day followers
            // ex. yesterday: 100 followers, today 200, result: +100
            newFollowers = stats.followers - tempFollowers
            if (newFollowers > 0) {
              newFollowers = `+${newFollowers}`
            } else if (newFollowers < 0) {
              newFollowers = `${newFollowers}`
            }
            tempFollowers = stats.followers
            return {
              ...stats,
              newFollowers: newFollowers,
            }
          }
        })
      }
    })
    // disable loading animation when data available
    this.setState({
      loading: false
    })
  }

  render({}, {updatedUserStats, loading}) {
    const { classes } = this.props
    let rows = []
    if (updatedUserStats.length !== 0) {
      rows = updatedUserStats
    }

    const compareRowsByDateDesc =(a, b) => {
      return Moment(b.day).diff(Moment(a.day))
    }

    ReactChartkick.addAdapter(Chart)
    let followersFollowingChartData = [{name: 'Followers', data: {}}, {name: 'Following', data: {}}]
    let newFollowersChartData = [{name: 'New Followers', data: {}}]
    rows.forEach((item) => {
        followersFollowingChartData[0]['data'][item.day] = item.followers
        followersFollowingChartData[1]['data'][item.day] = item.following
        newFollowersChartData[0]['data'][item.day] = item.newFollowers
      }
    )

    return (
      <div className={classes.wrapper}>
        <h1>User Statistics</h1>
        <Paper>
          <LineChart curve={false} data={followersFollowingChartData} />
          <LineChart curve={false} data={newFollowersChartData} />
        </Paper>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>New Followers</TableCell>
                <TableCell>Followers</TableCell>
                <TableCell>Following</TableCell>
                <TableCell>Total Posts</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.sort(compareRowsByDateDesc).map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.newFollowers}</TableCell>
                    <TableCell>{row.followers}</TableCell>
                    <TableCell>{row.following}</TableCell>
                    <TableCell>{row.total_posts}</TableCell>
                    <TableCell>{row.day}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <HashLoader
            className={override}
            sizeUnit={"px"}
            size={50}
            color={'#3f51b5'}
            loading={loading}
          />

        </Paper>

      </div>

    )
  }
}

AccountStatistics.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountStatistics)