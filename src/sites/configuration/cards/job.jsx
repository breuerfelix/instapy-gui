import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';
import $ from 'jquery';
import { EditJob } from '../components';

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

	updateJob = e => {
		e.stopPropagation();

		// return if validation is not true
		if (!this.editJob.validate()) {
			// open card if error occured
			$(this.body).collapse('show');
			this.setState({ expanded: true });
			return;
		} else {
			// close card if successful
			$(this.body).collapse('hide');
			this.setState({ expanded: false });
		}

		// TODO maybe make a popover over the save icon which displays 'saved';
		this.props.updateJob(this.state.job);
	}

	toggleCard = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if currentlu opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ moveJob, deleteJob, updateJob }, { action, expanded, job }) {
		if (!action) {
			// TODO send error to elk stack
			console.error('error rendering, no matching actions!');
			return;
		}

		// TODO add button for active / inactive

		// enable popover
		$('[data-toggle="popover"]').popover();

		const headerStyle = expanded ? null : 'border-bottom: 0;';

		return (
			<div className="col-padding col">
				<div className="card">

					<div className="card-header" style={ headerStyle } onClick={ this.toggleCard }>
						<div className="row">
							<div className='col-md align-self-center'>
								{ translate(action.functionName) }
							</div>
							<div style={{ textAlign: 'right' }} className='col-md align-self-center'>
								<div className="iconnav btn-group" role='group'>
									<IconButton
										icon='fas fa-save'
										onclick={ this.updateJob }
									/>
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
									<a
										className='btn btn-outline-dark fas fa-info noselect'
										style={{ borderWidth : 0}}
										tabindex='0'
										data-container='body'
										data-trigger='focus'
										data-toggle='popover'
										data-placement='top'
										data-content={ action.description }
										onClick={ e => e.stopPropagation() }
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
						<div className="card-body">
							<EditJob ref={ edit => this.editJob = edit } job={ job } action={ action } />
						</div>
					</div>

				</div>
			</div>
		);
	}
}

const IconButton = ({ icon, onclick }) => (
	<button
		className="btn btn-outline-dark"
		type='button'
		style={{ borderWidth: 0 }}
		onClick={ onclick }
	>
		<i className={ icon }>
		</i>
	</button>
);
