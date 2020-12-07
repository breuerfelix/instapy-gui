import { h, render, Component } from 'preact';
import { InfoCard } from 'components';
import { ConfigService, translate } from 'services';
import { raiseError } from 'core';
import { withRouter } from 'react-router-dom';
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
		const { history } = this.props;
		this.setState({ namespace: e.target.value });

		const { namespace } = this.state;
		history.push(`/configuration/namespaces/${namespace}`);
	}

	deleteNamespace = _ => {
		if (!confirm('Do you really want to delete this template ?')) return;

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
		const res = await ConfigService.editNamespace(namespace);

		if (res.error) raiseError(res.error);

		// update setting
		const { namespaces } = this.state;
		const set = namespaces.find(x => x.ident == namespace.oldIdent);
		set.ident = namespace.ident;
		set.name = namespace.name;
		set.description = namespace.description;
		this.setState({ namespaces: [...namespaces] });

		this.props.history.push(`/configuration/namespaces/${namespace.ident}`);
	}

	editNamespaceOpen = e => {
		e.stopPropagation();
		const { namespace, namespaces } = this.state;
		const name = namespaces.find(x => x.ident == namespace);
		if (!name) raiseError('error finding namespace: ' + namespace, false);
		this.modal.editItem(name);
	}

	copyNamespace = async e => {
		e.stopPropagation();
		const { namespace } = this.state;
		const new_namespace = await ConfigService.copyNamespace(namespace);
		if (new_namespace.error) raiseError(new_namespace.error);

		const { namespaces } = this.state;
		namespaces.push(new_namespace);
		this.setState({ namespaces: [ ...namespaces ] });

		this.props.history.push(`/configuration/namespaces/${new_namespace.ident}`);
	}

	render({ match }, { namespaces, namespace }) {
		const { params } = match;
		if (namespace != params.namespace)
			this.setState({ namespace: params.namespace });

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
									onclick={ this.editNamespaceOpen }
								/>
								<IconButton
									icon='fas fa-copy'
									onclick={ this.copyNamespace }
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
						edit={ this.editNamespace }
						ref={ modal => this.modal = modal }
					/>
				</div>

				<div className='col-padding col-md'>
					<InfoCard>
						Here you can describe in detail what your bot is going to do.
						<br />
						<br />
						If you are having trouble setting up a proper template,
						<br />
						have a look <a href='https://github.com/InstaPy/instapy-quickstart' target='__blank'>here</a> to get some basic examples.
					</InfoCard>
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
