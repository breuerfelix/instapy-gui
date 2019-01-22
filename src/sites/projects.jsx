import { h, render, Component } from 'preact';
import { connect } from 'store';

@connect()
export default class Projects extends Component {
	render(props, state) {
		return (
			<div>
				projects
			</div>
		);
	}
}
