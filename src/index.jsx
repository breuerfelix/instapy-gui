import 'styles/main.scss';

import 'jquery';
import 'popper.js';
import 'bootstrap';

import { h, render, Component } from 'preact';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'unistore/preact';

import store, { connect } from 'store';
import { NavBar, SideBar, Footer } from 'components';
import { Account, Configuration, Start } from 'sites';

import { MOCK_DATA } from 'config';

if (MOCK_DATA) {
	const mocks = require('mocks').default;
	mocks.apply();
}

@connect('showSidebar')
class App extends Component {
	render({ showSidebar }) {
		return (
			<Router>
				<div className='container-fluid'>
					<div className="row no-gutters">

						{ showSidebar &&
              <div id='sidebar' className='col' style={{ maxWidth: '230px' }}>
								<Route
									path='/'
									component={ SideBar }
								/>
							</div>
						}

						<div className='col'>
							<NavBar />
							<div style={{ padding: '15px 15px 0 15px' }}>
								<Route exact path='/' render={() => <Redirect to='/start' /> } />
								<Route
									path='/account'
									component={ Account }
								/>
								<Route
									path='/configuration'
									component={ Configuration }
								/>
								<Route
									path='/start'
									component={ Start }
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
	<Provider store={store}>
		<App />
	</Provider>, document.body);
