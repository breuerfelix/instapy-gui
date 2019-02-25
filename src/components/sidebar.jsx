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
						label='sidebar_start'
						icon='fas fa-play'
						link='/start'
						level='top'
					/>

					<MenuItem
						label='sidebar_configuration'
						icon='fas fa-sliders-h'
						link='/configuration/namespaces'
						level='top'
					/>

					<div className="headline">
						{ translate('sidebar_links') }
					</div>

					<MenuItem
						label='link_donate'
						icon='fas fa-donate'
						link='https://opencollective.com/instapy'
						level='top'
						external={ true }
					/>

					<MenuItem
						label='sidebar_other'
						icon='fas fa-globe-americas'
						level='top'
					>
						<MenuItem
							label='link_instapy'
							link='http://github.com/timgrossmann/instapy'
							external={ true }
						/>
						<MenuItem
							label='link_instapy_gui'
							link='http://github.com/breuerfelix/instapy-gui'
							external={ true }
						/>
						<MenuItem
							label='link_submit_issue'
							link='http://github.com/breuerfelix/instapy-gui/issues'
							external={ true }
						/>

					</MenuItem>
				</ul>

			</div>
		);
	}
}
