import { h, render, Component } from 'preact';
import { NamespacesCard } from 'cards';
import { connect } from 'store';
import { Route } from 'react-router-dom';


import { JobItem, NamespaceSelection, AddNamespaceModal } from 'components';
import arrayMove from 'array-move';
import { ConfigService, translate } from 'services';

@connect()
export default class Configuration extends Component {
	state = {
		jobs: [],
		namespaces: [],
		activeNamespace: ''
	}

	componentWillMount() {
		const actionsProm = ConfigService.fetchActions()
			.then(actions => this.props.setActions(actions));
	}

	loadJobs = namespace => {
		if (this.state.activeNamespace == namespace) return;
		this.setState({ activeNamespace: namespace });

		// loading jobs for current selection if there is one
		if (!namespace) {
			this.setState({
				jobs: []
			});
			return;
		}

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


	render({ match, namespace }, {
		jobs,
		namespaces
	}) {

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
			<div class='row'>

				<div className="col-padding col-md">
					<Route
						path={ `${match.url}/id/:namespace?` }
						component={ NamespacesCard }
					/>
				</div>

				<div className="col-padding col-md">
					test
				</div>

			</div>
		);
	}
}
