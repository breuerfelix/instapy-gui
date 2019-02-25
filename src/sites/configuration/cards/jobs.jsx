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
			const para = {
				position: param.position,
				name: param.name,
				value: param.defaultValue
			};

			// TODO remove this when we have a proper list view
			// joins default list params togehter
			if (param.type && param.type.startsWith('list')) {
				if (param.defaulValue) {
					para.value = param.defaultValue.join(';');
				}
			}

			params.push(para);
		}

		// initialize job object
		const job = {
			uuid: uuid(),
			functionName: action.functionName,
			position: jobs.length,
			namespace: activeNamespace,
			active: true,
			params
		};

		// push new job to state temporarly
		jobs.push(job);
		this.setJobs(jobs);

		// recieves all jobs and set them as jobs
		const result = await ConfigService.addJob(job);
		this.setJobs(result);
	}

	updateJob = async job => {
		const jobs = await ConfigService.updateJob(job);
		this.setJobs(jobs);
	}

	moveJob = async (job, direction) => {
		// TODO only move job if ALL jobs are valid !!
		// otherwise some garbage data might be saved into those variables
		// TODO or make a new endpoint which only moves the job, and does only change the pos

		const { jobs } = this.state;
		const idx = jobs.findIndex(x => x.uuid == job.uuid);

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
		const idx = jobs.findIndex(x => x.uuid == job.uuid);

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

		// no job card will be rendered if job is not loaded
		const jobList = jobs.map(job =>
			<JobCard
				key={ job.uuid }
				job={ job }
				moveJob={ this.moveJob }
				deleteJob={ this.deleteJob }
				updateJob={ this.updateJob }
			/>
		);

		return (
			<div className='jobs'>
				{ jobList }
				<AddJobCard />
				<ActionsModal add={ this.addJob } />
			</div>
		);
	}
}
