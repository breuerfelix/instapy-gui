import { h, render, Component } from 'preact';
import { translate } from 'services';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
	render() {
		return (
			<nav class='navbar bg-light'>
				<ul className="nav">
					<a
						class='navbar-brand'
					>
						InstaPy
					</a>
					<NavBarItem
						text='navbar_dashboard'
						link='/dashboard'
					/>
					<NavBarItem
						text='navbar_configuration'
						link='/configuration'
					/>
				</ul>
			</nav>
		);
	}
}

const NavBarItem = ({ text, link }) => (
	<li
		class='nav-item'
	>
		<Link
			to={ link }
			class='nav-link'
		>
			{ translate(text) }
		</Link>
	</li>
);
