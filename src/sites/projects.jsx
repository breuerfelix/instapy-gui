import { h, render, Component } from 'preact';
import { connect } from 'store';

class Projects extends Component {
	render(props, state) {
		return (
			<div>
				projects
			</div>
		);
	}
}

export default connect()(Projects);
