import { h, render, Component } from 'preact';
import { connect } from 'store';
import { JobItem, NamespaceSelection, AddNamespaceModal } from 'components';
import arrayMove from 'array-move';
import { ConfigService, translate } from 'services';
import { route } from 'preact-router';
import uikit from 'uikit';

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

	deleteNamespace = _ => {
		const { namespaces, activeNamespace } = this.state;
		if (namespaces.length <= 1) {
			console.error('you need at least one namespace!');
			uikit.notification({
				message: translate('notification_error_one_namespace'),
				status: 'danger',
				pos: 'top-center',
				timeout: 5000
			});

			return;
		}

		const name = namespaces.find(x => x.ident == activeNamespace);
		const idx = namespaces.indexOf(name);

		if (idx == -1) {
			console.error('could not locate namespace!');
			return;
		}
		
		namespaces.splice(idx, 1);

		this.setState({ namespaces });
		ConfigService.deleteNamespace(activeNamespace);
		route(`/configuration/${namespaces[0].ident}`);
	}

	addNamespace = async namespace => {
		// await here, so the namespace will be registered once we change the route
		await ConfigService.addNamespace(namespace);

		const { namespaces } = this.state;
		namespaces.push(namespace);
		this.setState({ namespaces });

		route(`/configuration/${namespace.ident}`);
	}

	render({ namespace }, {
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
			<div>
				<NamespaceSelection
					namespace={ namespace }
					namespaces={ namespaces }
					deleteNamespace={ this.deleteNamespace }
				/>
				<AddNamespaceModal
					add={ this.addNamespace }
					namespaces={ namespaces }
				/>
				<div>
					{ jobsPreview }
				</div>
			</div>
		);
	}
}
