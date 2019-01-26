import 'styles/job_item.scss';

import { h, render, Component } from 'preact';
import { connect } from 'store';
import { translate } from 'services';
import classNames from 'classnames';

@connect('jobs')
export default class JobItem extends Component {
	state = {
		expanded: false
	}

	toggleCard = e => {
		this.setState({ expanded: !this.state.expanded });
	}

	toggleActive = e => {
		console.log('toggle active');
	}

	delete = e => {
		console.log('delete me !');
	}

	render({
		job,
		jobs,
		toggleJobActive,
		moveJob
	}, { expanded }) {
		const configJob = jobs.find(x => x.functionName == job.functionName);

		const cardClass = classNames(
			'uk-card',
			'uk-card-default',
			'uk-card-hover',
			'uk-width-auto',
			'uk-margin-top',
			'uk-margin-bottom',
			'uk-margin-right',
			'uk-margin-left'
		);


		const labelClass = job.active ? 'success' : 'danger';
		const labelText = job.active ? 'active' : 'inactive';

		return (
			<div class={ cardClass }>
				<div class="uk-card-header">
					<div class="uk-grid-small uk-flex-middle" uk-grid>
						<div class="uk-width-expand">
							<h1 class="uk-card-title uk-margin-remove-bottom">
								{ translate(configJob.functionName) }
							</h1>
						</div>
						<div>
							<span
								class={`clickable-hover uk-label uk-label-${labelClass}`}
								onClick={ e => toggleJobActive(job) }
							>
								{ labelText }
							</span>
							<Icon name='arrow-up' onClick={ e => moveJob(job, -1) } />
							<Icon name='arrow-down' onClick={ e=> moveJob(job, 1) } />
							<Icon name='settings' onClick={ this.toggleCard } />
							<Icon name='info' />
							<Icon name='trash' onClick={ this.delete } />
						</div>
					</div>
				</div>
				{ expanded &&
					<div class="uk-card-body">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
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
