import { h, render, Component } from 'preact';
import { ConfigService, translate } from 'services';
import arrayMove from 'array-move';
import JobCard from './job';
import { AddCard } from '../components';
import { ActionsModal } from 'modals';

export default class JobsCard extends Component {
	state = {
		jobs: [],
		activeNamespace: ''
	}

	setJobs = jobs => {
		if (!jobs) return;

		this.setState({ jobs });
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

		// initialize job object
		const job = {
			functionName: action.functionName,
			namespace: activeNamespace,
			active: false,
			params
		};

		let result = ConfigService.addJob({ ...job });

		// set temp id for rendering
		job._id = { $oid: 'tempid' };

		// push new job to state temporarly
		jobs.push(job);
		this.setJobs(jobs);

		// wait for actual result
		// let them override current jobs
		result = await result;
		this.setJobs(result);
	}

	updateJob = async job => {
		const jobs = await ConfigService.updateJob(job);
		this.setJobs(jobs);
	}

	moveJob = async (job, direction) => {
		// TODO only move job if ALL jobs are valid !!
		// TODO otherwise some garbage data might be saved into those variables
		// TODO or make a new endpoint which only moves the job, and does only change the pos

		const { jobs } = this.state;
		const idx = jobs.findIndex(x => x._id.$oid == job._id.$oid);

		if (idx == -1) {
			console.error('could not locate job: ' + job);
			return;
		}

		arrayMove.mut(jobs, idx, idx + direction);
		this.setState({ jobs });

		// update all jobs since positioning changed
		const updated_jobs = await ConfigService.updateJobs(jobs);
		this.setJobs(updated_jobs);
	}

	deleteJob = async job => {
		const { jobs } = this.state;
		const idx = jobs.findIndex(x => x._id.$oid == job._id.$oid);

		if (idx == -1) {
			console.error('could not locate job!');
			return;
		}

		jobs.splice(idx, 1);
		this.setState({ jobs });

		const updated_jobs = await ConfigService.deleteJob(job, jobs);

		this.setJobs(updated_jobs);
	}

	render({ match: { params: { namespace } } }, { jobs }) {
		this.loadJobs(namespace);

		// no job card will be rendered if job is not loaded
		const jobList = jobs.map(job =>
			<JobCard
				key={ job._id.$oid }
				job={ job }
				moveJob={ this.moveJob }
				deleteJob={ this.deleteJob }
				updateJob={ this.updateJob }
			/>
		);

		return (
			<div className='jobs'>
				{ jobList }
				<AddCard target='#actions-modal' />
				<ActionsModal add={ this.addJob } />
			</div>
		);
	}
}
