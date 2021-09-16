import {h} from 'preact'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
//import api from '../../services/api'

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

// emotion lib
const override = css`
    display: block;
    margin: 15px auto;`

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
  active: {
    backgroundColor: 'yellow',
  }
});

class UserDbData extends Component {

  state = {
    allActivities: [],
    loading: true,
    timeId: null
  }

  componentDidMount() {
    this.getAllActivities()
    // adds 5secs timer to reload database data
    const timeId = setInterval(() => {
      this.getAllActivities()
    }, 5000)
    // update Timer Id
    this.setState({
      timeId
    })
  }

  componentWillUnmount() {
    // clean timer
    clearInterval(this.state.timeId)
  }

  getAllActivities = async () => {
    //const response = await api.get('get_all_activities')
    const response = {
      data:[ { rowid: 4,
        profile_id: 1,
        name: 'friends.clips.forever',
        likes: 5,
        comments: 0,
        follows: 8,
        unfollows: 0,
        server_calls: 97,
        day_filter: '2021-09-16' },
      { rowid: 3,
        profile_id: 1,
        name: 'friends.clips.forever',
        likes: 5,
        comments: 0,
        follows: 4,
        unfollows: 0,
        server_calls: 79,
        day_filter: '2021-09-14' },
      { rowid: 1,
        profile_id: 1,
        name: 'friends.clips.forever',
        likes: 0,
        comments: 0,
        follows: 8,
        unfollows: 0,
        server_calls: 133,
        day_filter: '2021-09-13' } ]
    }
    this.setState({
      allActivities: response.data,
      loading: false
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.wrapper}>
      <h1>Statistics</h1>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>profile</TableCell>
                <TableCell>likes</TableCell>
                <TableCell>comments</TableCell>
                <TableCell>follows</TableCell>
                <TableCell>unfollows</TableCell>
                <TableCell>server calls</TableCell>
                <TableCell>created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.allActivities.map(row => {
                return (
                  <TableRow key={row.rowid}>
                    <TableCell component="th" scope="row">
                      <Link to={`userStatistics/${row.profile_id}`}
                            className={classes.menuButton} >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.likes}</TableCell>
                    <TableCell>{row.comments}</TableCell>
                    <TableCell>{row.follows}</TableCell>
                    <TableCell>{row.unfollows}</TableCell>
                    <TableCell>{row.server_calls}</TableCell>
                    <TableCell>{row.day_filter}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <HashLoader
          className={override}
          sizeUnit={"px"}
          size={50}
          color={'#3f51b5'}
          loading={this.state.loading}
        />
        </Paper>
      </div>
    )
  }
}

UserDbData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDbData)