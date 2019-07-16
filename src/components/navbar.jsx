import { h, render, Component } from 'preact';
import { translate } from 'services';
import { Link } from 'react-router-dom';
import { connect } from 'core';
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
			<nav className='header bg-light sticky-top'>

				{ false && // this is the button to hide sidebar
					<form className='form-inline'>
						<button className='btn btn-outline-dark' onClick={ this.toggleSidebar }>
							<i className={ burgerIconClass } />
						</button>
					</form>
				}

				<Location />

			</nav>
		);
	}
}

const NavBarItem = ({ text, link }) => (
	<li
		className='nav-item'
	>
		<Link
			to={ link }
			className='nav-link'
		>
			{ translate(text) }
		</Link>
	</li>
);
