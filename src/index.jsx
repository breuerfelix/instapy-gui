import 'uikit/dist/css/uikit.min.css';
import 'styles/main.scss';

import uikit from 'uikit';
import icons from 'uikit/dist/js/uikit-icons'; 
uikit.use(icons);

import { h, render, Component } from 'preact';
import Router from 'preact-router';
import { Provider } from 'unistore/preact';

import store from 'store';
import { NavBar, SideBar, Footer } from 'components';
import { Dashboard, Configuration, News } from 'sites';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<SideBar />
				<div class='uk-container'>
					<Router>
						<Dashboard
							default path='/dashboard'
						/>
						<Configuration
							path='/configuration/:namespace?'
						/>
						<News
							path='/news'
						/>
					</Router>
				</div>
				<Footer />
			</div>
		);
	}
}

render(
	<Provider store={store}>
		<App />
	</Provider>, document.body);
