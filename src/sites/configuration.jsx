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
		namespace: {}
	}

	componentWillMount(props) {
		const { namespace } = this.props;

		const actionsProm = ConfigService.fetchActions()
			.then(actions => this.props.setActions(actions));

		const namespaces = ConfigService.fetchNamespaces()
			.then(namespaces => {
				this.setState({ namespaces });
				if (namespace) return;

				const newNamespace = namespaces[0].ident;
				// load the first namespace
				route(`/configuration/${newNamespace}`);
				this.loadJobs(newNamespace);
			});

		if (namespace) this.loadJobs(namespace);
	}

	loadJobs = namespace => {
		this.setState({ namespace });

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

	render(props, { jobs, namespaces }) {
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
				<NamespaceSelection namespaces={ namespaces } />
				<div>
					{ jobsPreview }
				</div>
			</div>
		);
	}
}
