import '404.html';
import 'react-tagsinput/react-tagsinput.css';
import 'styles/main.scss';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { h, render, Component } from 'preact';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'unistore/preact';
import ReactGA from 'react-ga';

import { PrivateRoute, NavBar, SideBar, Footer } from 'components';
import {
	Configuration, Start, Dashboard,
	Login, Privacy, Home
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
// TODO disable in dev mode
ReactGA.initialize(config.gaTrackingID);
history.listen(({ pathname, search }) => ReactGA.pageview(pathname + search));

@connect('showSidebar')
class App extends Component {
	state = {
		showInfo: true,
	}

	render({ showSidebar }, { showInfo }) {
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
										<button onClick={ _ => this.setState({ showInfo: false }) } type='button' className='close' data-dismiss='alert' aria-label='Close'>
											<span aria-hidden='true'>&times;</span>
										</button>
										To cover site costs, i would appreciate a monthly donation via <a href='https://www.patreon.com/scriptworld' target='_blank' rel='noopener noreferrer'>Patreon</a>.
										<br/>
										10€+ montly donations can get a permanent link and mention on the front page.
									</div>
								}
								<Route
									exact
									path='/'
									component={ Home }
								/>
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
