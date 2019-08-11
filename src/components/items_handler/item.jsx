import { h, render, Component } from 'preact';
import { translate } from 'services';
import $ from 'jquery';
import InfoArea from '../info_area';
import IconButton from '../icon_button';
import { EditJob } from '../edit_job';

export default class ItemCard extends Component {
	state = { expanded: false }

	componentWillMount() {
		this.setState({ expanded: false });
		$(this.body).collapse('hide');
	}

	updateItem = e => {
		e.stopPropagation();

		// return if validation is not true
		if (!this.editJob.validate()) {
			// open card if error occured
			$(this.body).collapse('show');
			this.setState({ expanded: true });
			return;
		}

		// close card if successful
		$(this.body).collapse('hide');
		this.setState({ expanded: false });

		// TODO maybe make a popover over the save icon which displays 'saved';
		const { updateItem, item } = this.props;
		updateItem(item);
	}

	editItem = e => {
		e.stopPropagation();
		const { modal, item } = this.props;
		modal.editItem(item);
	}

	deleteItem = e => {
		e.stopPropagation();

		$(this.body).collapse('hide');
		this.setState({ expanded: false });

		const { deleteItem, item } = this.props;
		deleteItem(item);
	}

	toggleCard = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ item, action, editComponent }, { expanded }) {
		const headerStyle = expanded ? null : { borderBottom: 0 };
		this.editJob = h(
			editComponent || EditJob,
			{
				job: item,
				action,
			}
		);

		return (
			<div className='col-padding col'>
				<div className='card'>

					<div className="card-header" style={ headerStyle } onClick={ this.toggleCard }>
						<div className="row">
							<div className='col-md align-self-center'>
								{ item.name }
							</div>
							<div style={{ textAlign: 'right' }} className='col-md align-self-center'>
								<div className="iconnav btn-group" role='group'>
									<IconButton
										icon='fas fa-save'
										onclick={ this.updateItem }
									/>
									<IconButton
										icon='fas fa-cog'
										onclick={ this.toggleCard }
									/>
									<IconButton
										icon='fas fa-edit'
										onclick={ this.editItem }
									/>
									<IconButton
										icon='fas fa-trash-alt'
										onclick={ this.deleteItem }
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="collapse" ref={ body => this.body = body }>
						<div className='card-body' style={{ padding: '5px' }}>
							{ item.description &&
								<InfoArea description={ item.description } />
							}
							{ this.editJob }
							<button
								style={{ float: 'right', margin: '0 15px 15px 0' }}
								onClick={ this.updateItem }
								type='button'
								className='btn btn-success'
							>
								{ translate('button_save_changes') }
							</button>
						</div>
					</div>

				</div>
			</div>
		);
	}
}