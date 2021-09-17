import {h} from 'preact'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
  }

  updateActivities = data => {
    // TODO this can be more efficient
    // TODO for the updata - remove from allActivities - so the new one will remain
    const { allActivities } = this.state;
    data.data = data.data.filter(e => {
      const json_value = JSON.stringify(e)
      return !allActivities.filter(activity => activity.day_filter == e.day_filter).some(activity => json_value == JSON.stringify(activity));
    })
    const new_activities = data.data.concat(allActivities).sort(function(a, b){
      if(a.day_filter < b.day_filter) { return 1; }
      if(a.day_filter > b.day_filter) { return -1; }
      return 0;
    })
    this.setState({
      allActivities: new_activities,
      loading: false
    })
  }

  componentDidMount() {
    SocketService.register('get-activities', this.updateActivities);
    SocketService.send({
      handler: 'get-activities',
      action: 'get'
    });
  }

  componentWillUnmount(){
    SocketService.unregister('get-activities', this.updateActivities);
  }

  render({ match, classes }, { loading, allActivities }) {
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
              {allActivities.map(row => {
                return (
                  <TableRow key={row.rowid}>
                    <TableCell component="th" scope="row">
                      <Link to={`${match.url}/userStatistics/${row.profile_id}`}
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
            loading={loading}
          />
          {
            loading && <div style="text-align: center"
            className={override}>
            Getting data from connected bots.<br/>
            You need to connect atleast one bot, and it should have data from atleast 1 run.
            </div>
          }
        </Paper>
      </div>
    )
  }
}

UserDbData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserDbData)