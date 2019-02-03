import { h, render, Component } from 'preact';
import { Route } from 'react-router-dom';
import { LoginCard } from 'cards';

export default class Account extends Component {
	render({ match }) {
		return (
			<div class='row'>

				<div className="col-padding col-md">
					<Route
						path={ `${ match.url }/login` }
						component={ LoginCard }
					/>
				</div>

				<div className="col-padding col-md">
				</div>

			</div>
		);
	}
}
