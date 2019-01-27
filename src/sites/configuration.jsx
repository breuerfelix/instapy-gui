import { h, render, Component } from 'preact';
import { connect } from 'store';
import { JobItem, NamespaceSelection } from 'components';
import arrayMove from 'array-move';
import { ConfigService } from 'services';
import { route } from 'preact-router';

@connect()
export default class Config extends Component {
	state = {
		jobs: [],
		namespaces: [],
		activeNamespace: ''
	}

	componentWillMount() {
		const actionsProm = ConfigService.fetchActions()
			.then(actions => this.props.setActions(actions));

		const namespaces = ConfigService.fetchNamespaces()
			.then(namespaces => {
				this.setState({ namespaces });
			});
	}

	loadJobs = namespace => {
		if (this.state.activeNamespace == namespace) return;

		// loading jobs for current selection if there is one
		if (!namespace) {
			this.setState({
				jobs: [],
				activeNamespace: namespace
			});
			return;
		}

		this.setState({ activeNamespace: namespace });

		// only fetch jobs if namespace is given
		const jobsProm = ConfigService.fetchJobs(namespace)
			.then(jobs => this.setState({ jobs }));
	}

	moveJob = (job, direction) => {
		const jobs = this.state.jobs;
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
		const jobs = this.state.jobs;
		const idx = jobs.indexOf(job);

		if (idx == -1) {
			console.error('could not locate job!');
			return;
		}
		
		jobs.splice(idx, 1);

		this.setState({ jobs });
		ConfigService.deleteJob(job);
	}

	render({ namespace }, { jobs, namespaces }) {
		this.loadJobs(namespace);

		const jobsPreview = jobs.map(job =>
			<JobItem
				key={ job.uuid }
				job={ job }
				moveJob={ this.moveJob }
				deleteJob={ this.deleteJob }
			/>
		);

		return (
			<div>
				<NamespaceSelection
					namespace={ namespace }
					namespaces={ namespaces }
				/>
				<div>
					{ jobsPreview }
				</div>
			</div>
		);
	}
}
