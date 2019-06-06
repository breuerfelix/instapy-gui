import 'styles/main.scss';

import 'jquery';
import 'popper.js';
import 'bootstrap';

import { h, render, Component } from 'preact';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'unistore/preact';

import store, { connect } from 'store';
import { PrivateRoute, NavBar, SideBar, Footer } from 'components';
import { Account, Configuration, Start, Dashboard, Login } from 'sites';
import { readToken } from 'core';

readToken();

@connect('showSidebar,token')
class App extends Component {
	render({ showSidebar, token }) {
		return (
			<Router>
				<div className='container-fluid'>
					<div className='row no-gutters'>

						{ showSidebar &&
							<div id='sidebar' className='col'>
								<Route
									path='/'
									component={ SideBar }
								/>
							</div>
						}

						<div className='col'>
							<NavBar />
							<div style={{ padding: '15px 15px 0 15px' }}>
								<Route exact path='/' render={
									() => <Redirect to={ token ? '/dashboard' : '/login' } />
								} />
								<Route
									path='/login'
									component={ Login }
								/>
								<PrivateRoute
									path='/account'
									component={ Account }
								/>
								<PrivateRoute
									path='/configuration'
									component={ Configuration }
								/>
								<PrivateRoute
									path='/start'
									component={ Start }
								/>
								<PrivateRoute
									path='/dashboard'
									component={ Dashboard }
								/>
								<Footer />
							</div>
						</div>

					</div>
				</div>
			</Router>
		);
	}
}

render(
	<Provider store={ store }>
		<App />
	</Provider>, document.body);
