import { h, render, Component } from 'preact';
import { translate, ConfigService } from 'services';
import { connect } from 'store';
import $ from 'jquery';
import { InfoArea, IconButton } from 'components';
import { EditJob } from '../components';
import classNames from 'classnames';

@connect('actions')
export default class JobCard extends Component {
	state = {
		expanded: false,
		action: null,
		job: null
	}

	componentWillMount() {
		const { job } = this.props;
		this.setState({ job, expanded: false });
		$(this.body).collapse('hide');
	}

	setAction = () => {
		// return true if the action is already set
		const { action } = this.state;
		if (action) return true;

		const { actions } = this.props;
		if (!actions) return false;

		const { job } = this.state;
		const newAction = actions.find(act => act.functionName == job.functionName);

		if (!newAction) return false;

		this.setState({ action: newAction });

		// return false so it rerenders cause of setState and return true afterwards
		return false;
	}

	updateJob = e => {
		e.stopPropagation();

		// in the validate function all params get set !
		// never forget calling this, otherwise params wont be updated

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

		// do nothing if opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	toggleActive = async e => {
		e.preventDefault();
		e.stopPropagation();

		const { job } = this.state;
		job.active = !job.active;
		this.setState({ job });

		const response = await ConfigService.updateJob(job);
		const updatedJob = response.find(j => j._id.$oid == job._id.$oid);
		this.setState({ job: updatedJob });
	}

	render({ moveJob, deleteJob }, { action, expanded, job }) {
		// dont render if the action is not loaded yet
		if (!this.setAction()) return;

		const headerStyle = expanded ? null : { borderBottom: 0 };
		const badgeClass = classNames({
			'badge': true,
			'badge-success': job.active,
			'badge-secondary': !job.active
		});
		const badgeString = job.active ? 'badge_enabled' : 'badge_disabled';

		return (
			<div className="col-padding col">
				<div className="card">

					<div className="card-header" style={ headerStyle } onClick={ this.toggleCard }>
						<div className="row">
							<div className='col-md align-self-center'>
								{ translate(action.functionName) }
							</div>
							<div style={{ textAlign: 'right' }} className='col-md align-self-center'>
								<a href="#" onClick={ this.toggleActive } className={ badgeClass } style={{ marginRight: '10px' }}>
									{ translate(badgeString) }
								</a>
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
									<IconButton
										icon='fas fa-trash-alt'
										onclick={ e => { e.stopPropagation(); deleteJob(job); } }
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="collapse" ref={ body => this.body = body }>
						<div className='card-body' style={{ padding: '5px' }}>
							{ action.description &&
								<InfoArea description={ action.description } />
							}
							<EditJob ref={ edit => this.editJob = edit } job={ job } action={ action } />
							<button
								style={{ float: 'right', margin: '0 15px 15px 0' }}
								onClick={ this.updateJob }
								type='button'
								className='btn btn-success'
							>
								{ translate('button_save_changes') }
							</button>
						</div>
					</div>

				</div>
			</div>
		);
	}
}