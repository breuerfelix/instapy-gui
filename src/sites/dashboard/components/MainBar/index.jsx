import {h} from 'preact'
import React, { Component } from 'react'
import { Link } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginLeft: 18,
    textDecoration: 'None',
  },
};

class MainBar extends Component {

  state = {
    openDrawerLeft: false
  };

  toggleDrawer = (open) => () => {
    this.setState({
      openDrawerLeft: open,
    });
  };

  render() {
    const { classes } = this.props;
    const sideList = (

      <div className={classes.list}>
        <List>

          <Link to='/' className={classes.menuButton} >
            <ListItem button key='1'>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Statistics' />
            </ListItem>
          </Link>

          <Link to='/logs' className={classes.menuButton} >
            <ListItem button key='2'>
              <ListItemIcon>
                <MailIcon />

              </ListItemIcon>
              <ListItemText primary='Live Logs' />
            </ListItem>
          </Link>
        </List>
      </div >

    );
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.toggleDrawer(true)} className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              InstaPy Dashboard
          </Typography>
          </Toolbar>
          <Drawer open={this.state.openDrawerLeft} onClose={this.toggleDrawer(false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer(false)}
              onKeyDown={this.toggleDrawer(false)}
            >
              {sideList}
            </div>
          </Drawer>
        </AppBar>
      </div>
    )
  }
}

MainBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainBar);