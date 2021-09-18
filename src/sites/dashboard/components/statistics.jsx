/*
This is a modified version of the file https://github.com/converge/instapy-dashboard/blob/master/src/components/Statistics/index.jsx
*/
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

  compareRowsByDateDesc =(a, b) => {
    return new Date(b) - new Date(a);
  }

  updateActivities = data => {
    const { allActivities } = this.state;

    const new_activities = allActivities.concat(data.data).map((value,index,self) => {
      const i = self.findIndex(inner_value => value.day_filter == inner_value.day_filter && value.name == inner_value.name)
      if (i==index){
        return value;
      } else {
        value.likes += self[i].likes
        value.comments += self[i].comments
        value.follows += self[i].follows
        value.unfollows += self[i].unfollows
        value.server_calls += self[i].server_calls
        self[i].remove = true
        return value
      }
    })
    .filter(value => !value.remove)
    .sort((a, b) => this.compareRowsByDateDesc(a.day_filter,b.day_filter))

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
                      <Link to={`${match.url}/userStatistics/${Buffer.from(row.name).toString('base64')}`}
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
            Getting data from connected clients.<br/>
            You need to connect atleast one client, and it should have data from atleast 1 run.
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