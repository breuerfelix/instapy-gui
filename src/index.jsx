import 'styles/main.scss';

import 'jquery';
import 'popper.js';
import 'bootstrap';

import { h, render, Component } from 'preact';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'unistore/preact';

import store, { connect } from 'store';
import { NavBar, SideBar, Footer } from 'components';
import { Account, Dashboard, Configuration, News } from 'sites';

@connect('showSidebar')
class App extends Component {
	render({ showSidebar }) {
		return (
			<Router>
				<div class='container-fluid'>
					<div className="row no-gutters">

						{ showSidebar &&
							<div id='sidebar' className="col" style='max-width: 230px;'>
								<Route
									path='/'
									component={ SideBar }
								/>
							</div>
						}

						<div className="col">
							<NavBar />
							<Route
								path='/account'
								component={ Account }
							/>
							<Route
								path='/configuration'
								component={ Configuration }
							/>
							<Footer />
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
