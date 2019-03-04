import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';
import $ from 'jquery';
import { EditJob } from '../components';
import Markup from 'preact-markup';

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
		// return false so it rerenders cause of set State and return true afterwards
		return false;
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
		// dont render if the action is not loaded yet
		if (!this.setAction()) return;

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
									{ false && // popover info icon for the description
										<a
											className='btn btn-outline-dark fas fa-info noselect'
											style={{ borderWidth : 0 }}
											tabindex='0'
											data-container='body'
											data-trigger='focus'
											data-toggle='popover'
											data-placement='top'
											data-content={ action.description }
											onClick={ e => e.stopPropagation() }
										/>
									}
									<IconButton
										icon='fas fa-trash-alt'
										onclick={ e => { e.stopPropagation(); deleteJob(job); } }
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="collapse" ref={ body => this.body = body }>
						<div className='card-body' style={{ padding: '5px 5px 5px 5px' }}>
							{ action.description &&
								<InfoArea action={ action } />
							}
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
		className='btn btn-outline-dark'
		type='button'
		style={{ borderWidth: 0 }}
		onClick={ onclick }
	>
		<i className={ icon }>
		</i>
	</button>
);

class InfoArea extends Component {
	state = {
		expanded: false
	}

	toggleInfo = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if currentlu opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ action }, { expanded }) {
		const infoText = expanded ? 'job_hide_info' : 'job_show_info';
		// replace newline with br so render html
		// add other conversions here
		const content = action.description.replace('\n', '<br />');

		return (
			<div style={{ margin: '5px 15px 0 15px' }}>

				<div className='collapse' ref={ body => this.body = body }>
					<div style={{ padding: '10px 0' }}>
						<div className='alert alert-primary' style={{ margin: 0 }}>
							<Markup markup={ content } />
						</div>
					</div>
				</div>

				<div className='row align-items-center' style={{ fontSize: '80%' }}>
					<div class='col'><hr /></div>
					<div class='col-auto'>
						<a onClick={ this.toggleInfo } href='#' style={{ color: 'black' }}>
							{ translate(infoText) }
						</a>
					</div>
					<div class='col'><hr /></div>
				</div>

			</div>
		);
	}
}
