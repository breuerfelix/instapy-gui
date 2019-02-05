import { h, render, Component } from 'preact';
import { translate } from 'services';
import { Link } from 'react-router-dom';
import { connect } from 'store';
import classNames from 'classnames';
import { Location } from 'components';

@connect('showSidebar')
export default class NavBar extends Component {
	toggleSidebar = e => {
		e.preventDefault();
		this.props.toggleSidebar(!this.props.showSidebar);
	}

	render({ showSidebar }) {
		const burgerIconClass = classNames({
			'fas': true,
			'fa-bars': !showSidebar,
			'fa-times': showSidebar
		});
		
		return (
			<nav class='navbar bg-light'>

				<form class='form-inline'>
					<button className="btn btn-outline-dark" onClick={ this.toggleSidebar }>
						<i class={ burgerIconClass } />
					</button>
				</form>

				<Location />

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
