import 'react-tagsinput/react-tagsinput.css';
import 'styles/main.scss';

import { h, render, Component } from 'preact';
import { Router, Route, Redirect } from 'react-router-dom';
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

@connect('showSidebar,token')
class App extends Component {
	render({ showSidebar, token }) {
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
