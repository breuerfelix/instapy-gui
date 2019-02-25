import { h, render, Component } from 'preact';
import { translate } from 'services';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import $ from 'jquery';

class MenuItem extends Component {
	state = {
		open: false
	}

	toggleDropdown = _ => {
		// dont open if item is currentlu closing or opening
		if ($(this.list).hasClass('collapsing')) return;

		const { open } = this.state;
		this.setState({ open: !open });
	}

	checkLocation() {
		const { location: { pathname }, link, linkMatch } = this.props;

		// TODO linkMatch also have to get matched, maybe handle opening and closing also on our own ?

		return pathname.startsWith(link);
	}

	render({ label, icon = false, link = false, children, level = 'sub' }, { open }) {
		const levelString = level + 'level';
		const levelListString = 'sublevel-list';
		const levelItemString = levelString + '-item';

		const isDropdown = children.length > 0;
		if (this.checkLocation()) open = true;

		const sublevelListClass = classNames(levelListString, {
			'collapse': true,
			'collapse-target': true
		});

		const dropdownIcon = !isDropdown ? false : classNames({
			'fas': true,
			'angle': true,
			'fa-angle-left': !open,
			'fa-angle-down': open,
		});

		const itemClass = classNames(levelItemString, {
			'active': open
		});

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
						<a
							data-toggle='collapse'
							data-target='.collapse-target'
							aria-expanded='false'
							aria-controls={ label }
						>
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
					<ul
						className={ sublevelListClass }
						id={ label }
						ref={ list => this.list = list }
					>
						{ children }
					</ul>
				}

			</li>
		);
	}
}

const Item = ({ itemClass, label, icon, onClick, dropdownIcon }) => {
	return (
		<div className={ itemClass } onClick={ onClick }>
			{ icon && <i className={ 'icon ' + icon } /> }
			{ translate(label) }
			{ dropdownIcon && <i className={ dropdownIcon } /> }
		</div>
	);
};

export default withRouter(MenuItem);
