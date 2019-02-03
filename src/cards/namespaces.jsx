import { h, render, Component } from 'preact';
import { DescriptionCard } from 'cards';
import { ConfigService, translate } from 'services';
import classNames from 'classnames';
import { withRouter, Route } from 'react-router-dom';

class NamespacesCard extends Component {
	state = {
		namespaces: [],
		namespace: ''
	}

	componentWillMount() {
		const namespaces = ConfigService.fetchNamespaces()
			.then(namespaces => this.setState({ namespaces }));
	}

	namespaceChanged = e => {
		const { history, match } = this.props;
		this.setState({ namespace: e.target.value });

		const { namespace } = this.state;
		history.push(`/configuration/namespaces/id/${namespace}`);
	}

	deleteNamespace = _ => {
		const { namespaces, namespace } = this.state;
		if (namespaces.length <= 1) {
			console.error('you need at least one namespace!');
			// TODO throw notification
			return;
		}

		const name = namespaces.find(x => x.ident == namespace);
		const idx = namespaces.indexOf(name);

		if (idx == -1) {
			console.error('could not locate namespace!');
			return;
		}
		
		namespaces.splice(idx, 1);

		this.setState({ namespaces });
		ConfigService.deleteNamespace(namespace);
		this.props.history.push(`/configuration/namespaces/id/${namespaces[0].ident}`);
	}

	addNamespace = async namespace => {
		// await here, so the namespace will be registered once we change the route
		await ConfigService.addNamespace(namespace);

		const { namespaces } = this.state;
		namespaces.push(namespace);
		this.setState({ namespaces });

		this.props.history.push(`/configuration/namespaces/id/${namespace.ident}`);
	}

	editNamespace = async namespace => {
		console.log('edit namespace.... coming soon');
	}

	render({ match, history }, { namespaces, namespace }) {
		const { params } = match;
		if (namespace != params.namespace)
			this.setState({ namespace: params.namespace });

		let namespace_obj = namespaces.find(x => x.ident == namespace);

		const namespaceOptions = namespaces.map(namespace =>
			<option value={ namespace.ident }>{ namespace.name }</option>
		);

		return (
			<div class='row'>
				<div className="col-padding col-md">
					<div class="card" style="height: 200px;">

						<div class="card-header">
							{ translate('namespaces_title') }
						</div>

						<div class="card-body">
							<select
								value={ namespace }
								className="form-control"
								onChange={ this.namespaceChanged }
							>
								{ namespaceOptions }
							</select>

						</div>

						<div className="card-footer">
							<div className="iconnav btn-group" role='group' style='float: right;'>
								<IconButton
									icon='fas fa-plus'
									onclick={ _ => history.push('/configuration/add') }
								/>
								<IconButton
									icon='fas fa-edit'
									onclick={ this.editNamespace }
								/>
								<IconButton
									icon='fas fa-trash'
									onclick={ this.deleteNamespace }
								/>
							</div>
						</div>

					</div>
				</div>

				<div className="col-padding col-md">
					{ namespace_obj &&
						<Route
							path={ '/configuration/namespaces/id/:namespace' }
							render={ (props) => <DescriptionCard
								{ ...props }
								namespace={ namespace_obj }
							/> }
						/>
					}
				</div>

			</div>
		);
	}
}

const IconButton = ({ icon, onclick }) => (
	<button
		class="btn btn-outline-dark"
		type='button'
		style='border-width: 0;'
		onClick={ onclick }
	>
		<i class={ icon }>
		</i>
	</button>
);

export default withRouter(NamespacesCard);
