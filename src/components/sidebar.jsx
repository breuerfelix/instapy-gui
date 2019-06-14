import { h, render, Component } from 'preact';
import { translate, AccountService } from 'services';
import { MenuItem } from 'components';
import { connect } from 'store';

@connect('username,usernameInstapy')
export default class SideBar extends Component {
	componentWillMount() {
		const { setUsername } = this.props;
		// retrieve username from server
		AccountService.getLoginCredentials()
			.then(res => setUsername(res.username || ''));
	}

	render({ location, username, usernameInstapy }) {
		const labelLoginInstagram = username ? username : 'sidebar_login_instagram';
		const labelLoginInstapy = usernameInstapy ? usernameInstapy : 'sidebar_login_instapy';

		return (
			<div className='sidebar noselect sticky-top'>
				<div className='header'>
					<h3>INSTAPY</h3>
				</div>

				<ul className='toplevel-list list-unstyled'>

					<div className='headline'>
						{ translate('sidebar_account') }
					</div>

					<MenuItem
						label={ labelLoginInstapy }
						icon='fas fa-user'
						link='/login'
						level='top'
					/>

					<MenuItem
						label={ labelLoginInstagram }
						icon='fas fa-user'
						link='/account/login'
						level='top'
					/>

					<div className='headline'>
						{ translate('sidebar_features') }
					</div>

					<MenuItem
						label='sidebar_dashboard'
						icon='fas fa-chart-line'
						link='/dashboard'
						level='top'
					/>

					<MenuItem
						label='sidebar_configuration'
						icon='fas fa-sliders-h'
						level='top'
					>
						<MenuItem
							label='sidebar_namespaces'
							link='/configuration/namespaces'
						/>
						<MenuItem
							label='sidebar_proxy'
							link='/configuration/proxy'
						/>
					</MenuItem>

					<MenuItem
						label='sidebar_start'
						icon='fas fa-play'
						link='/start'
						level='top'
					/>

					<div className='headline'>
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
						<MenuItem
							label='link_need_help'
							link='https://discord.gg/FDETsht'
							external={ true }
						/>
					</MenuItem>
				</ul>

			</div>
		);
	}
}
