import { h, Component } from 'preact';
import { translate } from 'services';
import { MenuItem } from 'components';
import { connect } from 'core';

@connect('usernameInstapy')
export default class SideBar extends Component {
	render({ usernameInstapy }) {
		const labelLoginInstapy = usernameInstapy ? usernameInstapy : 'sidebar_login_instapy';

		return (
			<div className='sidebar noselect sticky-top'>
				<div className='header' style={{ marginBottom: '2px' }}>
					<h3>INSTAPY.IO</h3>
				</div>

				<ul className='toplevel-list list-unstyled'>

					<MenuItem
						label='sidebar_home'
						icon='fas fa-home'
						link='/'
						level='top'
						exact
					/>

					<div className='headline'>
						{ translate('sidebar_account') }
					</div>

					<MenuItem
						label={ labelLoginInstapy }
						icon='fas fa-user'
						link='/login'
						level='top'
					/>

					{ usernameInstapy && // links only when logged in
						<div>
							<div className='headline'>
								{ translate('sidebar_features') }
							</div>

							{ /* uncomment to enable dashbaord again
							<MenuItem
								label='sidebar_dashboard'
								icon='fas fa-chart-line'
								link='/dashboard'
								level='top'
							/>
							*/ }

							<MenuItem
								label='sidebar_configuration'
								icon='fas fa-sliders-h'
								level='top'
							>
								<MenuItem
									label='sidebar_settings'
									link='/configuration/settings'
								/>
								<MenuItem
									label='sidebar_namespaces'
									link='/configuration/namespaces'
								/>
							</MenuItem>

							<MenuItem
								label='sidebar_start'
								icon='fas fa-play'
								link='/start'
								level='top'
							/>
						</div>
					}

					<div className='headline'>
						{ translate('sidebar_links') }
					</div>

					<MenuItem
						label='link_donate'
						icon='fas fa-donate'
						link='https://www.patreon.com/scriptworld'
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
