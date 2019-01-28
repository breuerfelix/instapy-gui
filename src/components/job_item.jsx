import 'styles/job_item.scss';

import { h, render, Component } from 'preact';
import { connect } from 'store';
import { translate, ConfigService } from 'services';
import classNames from 'classnames';

@connect('actions')
export default class JobItem extends Component {
	state = {
		expanded: false,
		job: null
	}

	componentWillMount() {
		this.setState({ job: this.props.job });
	}

	toggleCard = e => {
		this.setState({ expanded: !this.state.expanded });
	}

	toggleActive = e => {
		const job = this.state.job;
		job.active = !job.active;

		this.setState({ job });
		ConfigService.updateJob(job);
	}

	render({
		actions,
		moveJob,
		deleteJob
	}, { expanded, job }) {
		const action = actions.find(action => action.functionName == job.functionName);
		if (!action) {
			console.error('error finding matching action! ' + job.functionName);
			return;
		}

		const cardClass = classNames(
			'uk-card',
			'uk-card-default',
			'uk-card-hover',
			'uk-width-auto',
			'uk-margin-top',
			'uk-margin-bottom'
		);

		const labelClass = job.active ? 'success' : 'danger';
		const labelText = job.active ? 'jobitem_active' : 'jobitem_inactive';

		return (
			<div class={ cardClass }>
				<div class="uk-card-header">
					<div class="uk-grid-small uk-flex-middle" uk-grid>
						<div className="uk-width-1-2@s">
							<div class="uk-width-expand">
								<h1 class="uk-card-title uk-margin-remove-bottom">
									{ translate(action.functionName) }
								</h1>
							</div>
						</div>
						<div className="uk-width-1-2@s">
							<div class='uk-align-right'>
								<span
									class={`clickable-hover uk-label uk-label-${labelClass}`}
									onClick={ this.toggleActive }
								>
									{ translate(labelText) }
								</span>
								<Icon name='arrow-up' onClick={ e => moveJob(job, -1) } />
								<Icon name='arrow-down' onClick={ e => moveJob(job, 1) } />
								<Icon name='settings' onClick={ this.toggleCard } />
								<Icon name='info' />
								<Icon name='trash' onClick={ e => deleteJob(job) } />
							</div>
						</div>
					</div>
				</div>
				{ expanded &&
					<div class="uk-card-body">
						<p>
							you will be able to configure the job right over here.... just wait a bit !
						</p>
					</div>
				}
			</div>
		);
	}
}

const Icon = ({ name, onClick }) => (
	<a
		uk-icon={ `icon: ${name}; ratio: 1.2;` }
		class='uk-margin-left'
		onClick={ onClick }
	></a>
);
