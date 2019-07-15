import { h, render, Component } from 'preact';
import DescriptionCard from './description';
import { ConfigService, translate } from 'services';
import { raiseError } from 'core';
import { withRouter, Route } from 'react-router-dom';
import { AddItemModal } from 'modals';

class NamespacesCard extends Component {
	state = {
		namespaces: [],
		namespace: ''
	}

	componentWillMount() {
		ConfigService.fetchNamespaces()
			.then(namespaces => {
				this.setState({ namespaces });
				if (namespaces.length < 1) {
					this.props.history.replace('/configuration/namespaces');
					return;
				}

				// only redirect if not already on a namespace
				const paths = this.props.location.pathname.split('/');
				if (paths.length > paths.indexOf('namespaces') + 1) return;

				this.props.history.replace(`/configuration/namespaces/${namespaces[0].ident}`);
			});
	}

	namespaceChanged = e => {
		const { history, match } = this.props;
		this.setState({ namespace: e.target.value });

		const { namespace } = this.state;
		history.push(`/configuration/namespaces/${namespace}`);
	}

	deleteNamespace = _ => {
		// TODO show modal to confirm the deletion
		const { namespaces, namespace } = this.state;

		const name = namespaces.find(x => x.ident == namespace);
		const idx = namespaces.indexOf(name);

		if (idx == -1) raiseError('Could not locate namespace!');

		namespaces.splice(idx, 1);

		this.setState({ namespaces });

		// dont await since the result is not relevant
		ConfigService.deleteNamespace(namespace);

		let url = '/configuration/namespaces';
		if (this.state.namespaces.length) url += `/${namespaces[0].ident}`;

		this.props.history.replace(url);
	}

	addNamespace = async namespace => {
		// await here, so the namespace will be registered once we change the route
		namespace = await ConfigService.addNamespace(namespace);

		const { namespaces } = this.state;
		namespaces.push(namespace);
		this.setState({ namespaces });

		this.props.history.push(`/configuration/namespaces/${namespace.ident}`);
	}

	editNamespace = async namespace => {
		raiseError('edit namespace.... coming soon');
	}

	render({ match }, { namespaces, namespace }) {
		const { params } = match;
		if (namespace != params.namespace)
			this.setState({ namespace: params.namespace });

		let namespace_obj = namespaces.find(x => x.ident == namespace);

		const namespaceOptions = namespaces.map(namespace =>
			<option key={ namespace.ident } value={ namespace.ident }>{ namespace.name }</option>
		);

		return (
			<div className='row'>
				<div className="col-padding col-md">
					<div className="card" style={{ height: '200px' }}>

						<div className="card-header">
							{ translate('namespaces_title') }
						</div>

						<div className="card-body">
							<select
								value={ namespace }
								className="form-control"
								onChange={ this.namespaceChanged }
							>
								{ namespaceOptions }
							</select>

						</div>

						<div className="card-footer">
							<div className="iconnav btn-group float-right" role='group'>
								<button
									className="btn btn-outline-dark"
									type='button'
									style={{ borderWidth: '0' }}
									data-toggle='modal'
									data-target='#add-namespace-modal'
								>
									<i className='fas fa-plus'>
									</i>
								</button>
								<IconButton
									icon='fas fa-edit'
									onclick={ this.editNamespace }
									disabled={ true }
								/>
								<IconButton
									icon='fas fa-trash-alt'
									onclick={ this.deleteNamespace }
								/>
							</div>
						</div>

					</div>
					<AddItemModal
						ident='namespace'
						items={ namespaces }
						add={ this.addNamespace }
					/>
				</div>

				<div className="col-padding col-md">
					{ namespace_obj &&
						<Route
							path={ '/configuration/namespaces/:namespace' }
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

const IconButton = ({ icon, onclick, disabled = false }) => (
	<button
		className="btn btn-outline-dark"
		type='button'
		style={{ borderWidth: '0' }}
		onClick={ onclick }
		disabled={ disabled }
	>
		<i className={ icon }>
		</i>
	</button>
);

export default withRouter(NamespacesCard);
