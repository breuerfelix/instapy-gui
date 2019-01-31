import 'styles/main.scss';

import 'jquery';
import 'popper.js';
import 'bootstrap';

import { h, render, Component } from 'preact';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'unistore/preact';

import store, { connect } from 'store';
import { NavBar, SideBar, Footer } from 'components';
import { Dashboard, Configuration, News } from 'sites';

@connect('showSidebar')
class App extends Component {
	render({ showSidebar }) {
		return (
			<Router>
				<div>
					<div className="row no-gutters">

						{ showSidebar &&
							<div id='sidebar' className="col-12 col-md-auto d-none d-md-flex" style='width: 230px;'>
								<Route
									path='/'
									component={ SideBar }
								/>
							</div>
						}

						<div className="col-12 col-md">
							<NavBar />
							<Route
								path='/dashboard'
								component={ Dashboard }
							/>
							<Route
								path='/configuration'
								component={ Configuration }
							/>
							<Route
								path='/news'
								component={ News }
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
