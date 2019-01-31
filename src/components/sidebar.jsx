import { h, render, Component } from 'preact';
import { translate } from 'services';
import { MenuItem } from 'components';

export default class SideBar extends Component {
	render({ location }) {
		return (
			<div class="sidebar noselect">
				<div className="header">
					<h3 >InstaPy GUI</h3>
				</div>

				<ul class='toplevel-list list-unstyled'>

					<div className="headline">
						{ translate('sidebar_account') }
					</div>

					<MenuItem
						label='sidebar_login'
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
							label='namespaces'
							link='/hallo'
						/>
						<MenuItem
							label='list1'
						>
							<MenuItem
								label='entry1'
								link='/hallo'
							/>
						</MenuItem>

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
