import { h, render, Component } from 'preact';
import { translate } from 'services';

export default class StartBot extends Component {
	componentWillMount() {
	}

	render() {
		return (
			<div class="card">
				<form>
					<div class="card-header">
						{ translate('startbot_title') }
					</div>
					<div class="card-body">


					</div>
					<div className="card-footer" style='text-align: right;'>
						<button type='submit' onClick={ this.save } class="btn btn-outline-dark">
							{ translate('button_save') }
						</button>
					</div>
				</form>
			</div>
		);
	}
}
