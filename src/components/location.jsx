import { h, render, Component } from 'preact';
import { withRouter, Link } from 'react-router-dom';

class Location extends Component {
	render({ location: { pathname } }) {
		let splits = pathname.split('/').slice(1);

		// remove empty string when home
		if (splits[0] == '') splits = splits.slice(1);

		const items = splits.map(split => <BreadItem
			path={ pathname }
			label={ split }
		/>
		);

		return (
			<nav aria-label='breakcrumb align-middle'>
				<ol class="breadcrumb">
					<li class='breadcrumb-item'>
						<Link
							className="fas fa-home"
							to='/'
							style='text-decoration: none;'
						/>
					</li>
					{ items }
				</ol>
			</nav>
		);
	}
}

const BreadItem = ({ path, label }) => {
	const index = path.indexOf(label);
	const newPath = path.substring(0, index + label.length);

	return (
		<li class="breadcrumb-item">
			<Link
				to={ newPath }
			>
				{ label }
			</Link>
		</li>
	);
};

export default withRouter(Location);
