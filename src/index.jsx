import 'uikit';
import 'styles/main.scss';

import { h, render, Component } from 'preact';
import Router from 'preact-router';
import { Provider } from 'unistore/preact';

import store from 'store';
import { NavBar } from 'core';
import { Home, About, Projects } from 'sites';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<Router>
					<Home default path='/' />
					<About
						path='/about'
					/>
					<Projects
						path='/projects'
					/>
				</Router>
				<div>
					footer
				</div>
			</div>
		);
	}
}

render(
	<Provider store={store}>
		<App />
	</Provider>, document.body);
