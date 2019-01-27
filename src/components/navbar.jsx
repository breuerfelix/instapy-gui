import 'styles/navbar.scss';

import { h, render, Component } from 'preact';
import { translate } from 'services';
import { Link } from 'preact-router/match';

export default class NavBar extends Component {
	render() {
		return (
			<div uk-sticky='sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky'>
				<nav class='uk-navbar-container uk-navbar' uk-navbar>
					<div className="uk-navbar-left">
						<ul className="uk-navbar-nav">
							<a
								type='button'
								uk-toggle="target: #sidebar"
								class='uk-navbar-item uk-logo'
							>
								InstaPy
							</a>
							<NavBarItem
								text='DASHBOARD'
								link='/dashboard'
							/>
							<NavBarItem
								text='CONFIG'
								link='/configuration'
							/>
						</ul>
					</div>
					<div className="uk-navbar-right">
						<ul className="uk-navbar-nav">
							<NavBarItem
								text='NEWS'
								link='/news'
							/>
							<NavBarItem
								text='GITHUB'
								link='https://github.com/scriptworld-git/instapy-gui'
							/>
						</ul>
					</div>
				</nav>
			</div>
		);
	}
}

const NavBarItem = ({ text, link }) => (
	<li>
		<Link
			activeClassName='uk-active'
			class='uk-navbar-item'
			href={ link }
		>
			{ translate(text) }
		</Link>
	</li>
);


