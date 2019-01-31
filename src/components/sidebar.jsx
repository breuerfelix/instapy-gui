import { h, render, Component } from 'preact';
import { translate } from 'services';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export default class SideBar extends Component {
	render({ location }) {
		return (
			<div class="sidebar noselect">
				<div className="header">
					<h3 class='' >InstaPy</h3>
				</div>


				<ul class='toplevel-list list-unstyled'>
				<div className="headline">
					features
				</div>
					<MenuItem
						label='config'
						icon='fa-cube'
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
						settings
					</div>

					<MenuItem
						label='sidebar_link'
						icon='fa-check'
						link='/dashboard'
						level='top'
					/>

				</ul>

			</div>
		);
	}
}

class MenuItem extends Component {
	state = {
		open: false
	}

	toggleDropdown = _ => {
		const { open } = this.state;
		this.setState({ open: !open });
	}

	render({ label, icon = false, link = false, children, level = 'sub' }, { open }) {
		const levelString = level + 'level';
		const levelListString = 'sublevel-list';
		const levelItemString = levelString + '-item';

		const isDropdown = children.length > 0;

		const sublevelListClass = classNames(levelListString, {
			'collapse': !open
		});

		const dropdownIcon = !isDropdown ? false : classNames({
			'fas': true,
			'angle': true,
			'fa-angle-left': !open,
			'fa-angle-down': open,
		});

		const itemClass = classNames(levelItemString, {
			'active': open && level == 'top'
		});

		// TODO check if link is in location and append active to link
		return (
			<li>
				{ link &&
						<Link to={ link }>
							<Item
								label={ label }
								itemClass={ itemClass }
								onClick={ false }
								dropdownIcon= { false }
								icon={ icon }
							/>
						</Link>
				}
				{ !link &&
						<a>
							<Item
								label={ label }
								itemClass={ itemClass }
								onClick={ this.toggleDropdown }
								dropdownIcon= { dropdownIcon }
								icon={ icon }
							/>
						</a>
				}

				{ isDropdown &&
					<ul class={ sublevelListClass }>
						{ children }
					</ul>
				}

			</li>
		);
	}
}

const Item = ({ itemClass, label, icon, onClick, dropdownIcon }) => {
	return (
		<div class={ itemClass } onClick={ onClick }>
			{ icon && <i className={ 'icon fas ' + icon } /> }
			{ translate(label) }
			{ dropdownIcon && <i className={ dropdownIcon } /> }
		</div>
	);
};
