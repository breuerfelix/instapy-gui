import { h, render, Component } from 'preact';
import { ConfigService, translate } from 'services';
import arrayMove from 'array-move';
import { JobCard, AddJobCard } from 'cards';
import { ActionsModal } from 'components';

export default class JobsCard extends Component {
	state = {
		jobs: [],
		activeNamespace: ''
	}

	addJob = _ => {
		console.log('test');
	}

	loadJobs = namespace => {
		if (this.state.activeNamespace == namespace) return;
		this.setState({ activeNamespace: namespace });

		// only fetch jobs if namespace is given
		const jobsProm = ConfigService.fetchJobs(namespace)
			.then(jobs => this.setState({ jobs }));
	}

	moveJob = (job, direction) => {
		const { jobs } = this.state;
		const idx = jobs.indexOf(job);

		if (idx == -1) {
			console.error('could not locate job: ' + job);
			return;
		}

		arrayMove.mut(jobs, idx, idx + direction);

		this.setState({ jobs });
		// update all jobs since positioning changed
		ConfigService.updateJobs(jobs);
	}

	deleteJob = job => {
		const { jobs } = this.state;
		const idx = jobs.indexOf(job);

		if (idx == -1) {
			console.error('could not locate job!');
			return;
		}

		jobs.splice(idx, 1);

		this.setState({ jobs });
		ConfigService.deleteJob(job);
	}

	render({ match: { params: { namespace } } }, { jobs }) {
		this.loadJobs(namespace);

		const jobList = jobs.map(job =>
			<JobCard
				key={ job.uuid }
				job={ job }
				moveJob={ this.moveJob }
				deleteJob={ this.deleteJob }
			/>
		);

		return (
			<div>
				{ jobList }
				<AddJobCard clicked={ this.addJob }/>
				<ActionsModal />
			</div>
		);
	}
}
