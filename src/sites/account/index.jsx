import { h, render, Component } from 'preact';
import { Route } from 'react-router-dom';
import LoginCard from './login_card';

export default class Account extends Component {
	render({ match }) {
		return (
			<div className='row'>

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
