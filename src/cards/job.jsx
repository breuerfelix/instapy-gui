import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';
import $ from 'jquery';

@connect('actions')
export default class JobCard extends Component {
	state = {
		expanded: false,
		action: null,
		job: null
	}

	componentWillMount() {
		const { actions, job } = this.props;

		const action = actions.find(action => action.functionName == job.functionName);
		if (!action) {
			console.error('error finding matching action! ' + job.functionName);
			return;
		}

		this.setState({ action, job });
		$(this.body).collapse('hide');
	}

	toggleCard = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if currentlu opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ moveJob, deleteJob }, { action, expanded, job }) {
		if (!action) {
			// TODO send error to elk stack
			console.error('error rendering, no matching actions!');
			return;
		}

		const headerStyle = expanded ? null : 'border-bottom: 0;';

		return (
			<div class="col-padding col">
				<div class="card">

					<div class="card-header" style={ headerStyle } onClick={ this.toggleCard }>
						<div className="row">
							<div class='col-md align-self-center'>
								{ translate(action.functionName) }
							</div>
							<div style='text-align: right;' class='col-md align-self-center'>
								<div className="iconnav btn-group" role='group'>
									<IconButton
										icon='fas fa-arrow-up'
										onclick={ e => { e.stopPropagation(); moveJob(job, -1); } }
									/>
									<IconButton
										icon='fas fa-arrow-down'
										onclick={ e => { e.stopPropagation(); moveJob(job, 1); } }
									/>
									<IconButton
										icon='fas fa-cog'
										onclick={ this.toggleCard }
									/>
									<IconButton
										icon='fas fa-trash-alt'
										onclick={ e => { e.stopPropagation(); deleteJob(job); } }
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="collapse" ref={ body => this.body = body }>
						<div class="card-body">
							configuration will be here soon!
						</div>
					</div>

				</div>
			</div>
		);
	}
}

const IconButton = ({ icon, onclick }) => (
	<button
		class="btn btn-outline-dark"
		type='button'
		style='border-width: 0;'
		onClick={ onclick }
	>
		<i class={ icon }>
		</i>
	</button>
);
