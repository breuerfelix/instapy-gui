import { h, render, Component } from 'preact';
import SignupCard from './signup_card';

export default class Account extends Component {
	render() {
		return (
			<div className='row'>

				<div className='col-padding col-md'>
					<SignupCard />
				</div>

				<div className='col-padding col-md'>
				</div>

			</div>
		);
	}
}