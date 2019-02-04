import { h, render, Component } from 'preact';
import { NamespacesCard, JobsCard } from 'cards';
import { connect } from 'store';
import { Route } from 'react-router-dom';
import { ConfigService, translate } from 'services';

@connect()
export default class Configuration extends Component {
	componentWillMount() {
		const actionsProm = ConfigService.fetchActions()
			.then(actions => this.props.setActions(actions));
	}

	render({ match }) {
		return (
			<div>
				<Route
					path={ `${match.url}/namespaces/id/:namespace?` }
					component={ NamespacesCard }
				/>
				<Route
					path={ `${match.url}/namespaces/id/:namespace` }
					component={ JobsCard }
				/>
			</div>
		);
	}
}
