import { h, render, Component } from 'preact';
import uuid from 'uuid/v1';
import { ConfigService, translate } from 'services';
import arrayMove from 'array-move';
import JobCard from './job';
import AddJobCard from './add_job';
import { ActionsModal } from 'modals';

export default class JobsCard extends Component {
	state = {
		jobs: [],
		activeNamespace: ''
	}

	setJobs = jobs => {
		if (!jobs) return;

		// sort array and set as jobs
		this.setState({
			jobs: jobs.sort((a, b) => Number(a.position) - Number(b.position))
		});
	}

	loadJobs = namespace => {
		if (this.state.activeNamespace == namespace) return;
		this.setState({ activeNamespace: namespace });

		// only fetch jobs if namespace is given
		ConfigService.fetchJobs(namespace)
			// sort array ascending order
			.then(jobs => this.setJobs(jobs));
	}

	addJob = async action => {
		const { jobs, activeNamespace } = this.state;

		// initialize param list
		const params = [];
		for (let param of action.params) {
			params.push({
				position: param.position,
				name: param.name,
				value: param.defaultValue
			});
		}

		// initialize job object
		const job = {
			type: 'job',
			uuid: uuid(),
			functionName: action.functionName,
			position: jobs.length,
			namespace: activeNamespace,
			active: false,
			params
		};

		// push new job to state temporarly
		jobs.push(job);
		this.setJobs(jobs);

		// recieves all jobs and set them as jobs
		const result = await ConfigService.addJob(job);
		this.setJobs(result);
	}

	moveJob = async (job, direction) => {
		const { jobs } = this.state;
		const idx = jobs.indexOf(job);

		if (idx == -1) {
			console.error('could not locate job: ' + job);
			return;
		}

		arrayMove.mut(jobs, idx, idx + direction);

		// set new position according to order
		for (const [i, value] of jobs.entries())
			value.position = i;

		this.setState({ jobs });

		// update all jobs since positioning changed
		const updated_jobs = await ConfigService.updateJobs(jobs);
		this.setJobs(updated_jobs);
	}

	deleteJob = async job => {
		const { jobs } = this.state;
		const idx = jobs.indexOf(job);

		if (idx == -1) {
			console.error('could not locate job!');
			return;
		}

		jobs.splice(idx, 1);

		// set new position according to order
		for (const [i, value] of jobs.entries())
			value.position = i;

		this.setState({ jobs });

		const updated_jobs = await ConfigService.deleteJob(job, jobs);

		this.setJobs(updated_jobs);
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
			<div class='jobs'>
				{ jobList }
				<AddJobCard />
				<ActionsModal add={ this.addJob } />
			</div>
		);
	}
}
