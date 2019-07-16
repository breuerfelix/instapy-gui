import 'react-tagsinput/react-tagsinput.css';
import 'styles/main.scss';

import 'jquery';
import 'popper.js';
import 'bootstrap';

import { h, render, Component } from 'preact';
import { Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'unistore/preact';
import ReactGA from 'react-ga';

import { PrivateRoute, NavBar, SideBar, Footer } from 'components';
import {
	Configuration,
	Start,
	Dashboard,
	Login,
	Privacy
} from 'sites';
import {
	readToken, store, connect,
	handler, setToken
} from 'core';
import config from 'config';

const history = createBrowserHistory();
readToken();

handler.onError = (json) => {
	if ((json.type && json.type == 'auth') || json.error.includes('token')) {
		// logout
		store.setState({ token: null, usernameInstapy: null });
		localStorage.removeItem('token');
		setToken();
		throw 'auth error';
	}
};

// track location change to google analytics
ReactGA.initialize(config.gaTrackingID);
history.listen(({ pathname, search }) => ReactGA.pageview(pathname + search));

@connect('showSidebar,token')
class App extends Component {
	state = {
		showInfo: true
	}

	render({ showSidebar, token }, { showInfo }) {
		return (
			<Router history={ history }>
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
								{ showInfo &&
									<div className='alert alert-info' role='alert'>
										<button onClick={ e => this.setState({ showInfo: false }) } type='button' className='close' data-dismiss='alert' aria-label='Close'>
											<span aria-hidden='true'>&times;</span>
										</button>
										If you are having issues selecting your bot, please restart the bot.
										<br/>
										Also we had to clear all Settings (not Templates). We are really sorry for this. The issue is fixed and will not occur again in the future.
										<br/>
										This info will be removed on 18.07.19.
									</div>
								}
								<Route exact path='/' render={
									() => <Redirect to={ token ? '/configuration/namespaces' : '/login' } />
								} />
								<Route
									exact
									path='/login'
									component={ Login }
								/>
								<Route
									exact
									path='/login/privacy'
									component={ Privacy }
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
