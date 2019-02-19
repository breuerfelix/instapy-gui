import { h, render, Component } from 'preact';
import { translate, AccountService } from 'services';
import { MenuItem } from 'components';
import { connect } from 'store';

@connect('username')
export default class SideBar extends Component {
	componentWillMount() {
		// retrieve username from server
		AccountService.getLoginCredentials()
			.then(res => this.props.setUsername(res.username));
	}

	render({ location, username }) {
		const labelLogin = username ? username : 'sidebar_login';

		return (
			<div className="sidebar noselect">
				<div className="header">
					<h3>INSTAPY</h3>
				</div>

				<ul className='toplevel-list list-unstyled'>

					<div className="headline">
						{ translate('sidebar_account') }
					</div>

					<MenuItem
						label={ labelLogin }
						icon='fas fa-user'
						link='/account/login'
						level='top'
					/>

					<div className="headline">
						{ translate('sidebar_features') }
					</div>

					<MenuItem
						label='sidebar_configuration'
						icon='fas fa-sliders-h'
						level='top'
					>
						<MenuItem
							label='sidebar_namespaces'
							link='/configuration/namespaces/id'
						/>

					</MenuItem>

					<div className="headline">
						{ translate('sidebar_links') }
					</div>

					<MenuItem
						label='sidebar_github'
						icon='fab fa-github'
						link='/github'
						level='top'
					/>

				</ul>

			</div>
		);
	}
}
