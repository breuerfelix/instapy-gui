import { h, render, Component } from 'preact';
import { connect } from 'store';
import { JobItem } from 'components';

@connect('selectedJobs')
export default class Config extends Component {
	render({ selectedJobs }, state) {
		const jobsPreview = selectedJobs.map(job => <JobItem key={ job.position } job={ job } />);
		return (
			<div>
				{ jobsPreview }
			</div>
		);
	}
}
