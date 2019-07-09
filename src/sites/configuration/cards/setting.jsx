import { h, render, Component } from 'preact';
import { translate, ConfigService } from 'services';
import $ from 'jquery';
import { InfoArea, IconButton } from 'components';
import { EditJob } from '../components';
import { instapyAction } from 'config';


export default class SettingCard extends Component {
	state = {
		expanded: false
	}

	componentWillMount() {
		this.setState({ expanded: false });
		$(this.body).collapse('hide');
	}

	updateSetting = e => {
		e.stopPropagation();

		// in the validate function all params get set !
		// never forget calling this, otherwise params wont be updated

		// return if validation is not true
		if (!this.editJob.validate()) {
			// open card if error occured
			$(this.body).collapse('show');
			this.setState({ expanded: true });
			return;
		} else {
			// close card if successful
			$(this.body).collapse('hide');
			this.setState({ expanded: false });
		}

		// TODO maybe make a popover over the save icon which displays 'saved';
		this.props.updateSetting(this.props.setting);
	}

	toggleCard = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ setting, deleteSetting }, { expanded }) {
		const headerStyle = expanded ? null : { borderBottom: 0 };

		return (
			<div className="col-padding col">
				<div className="card">

					<div className="card-header" style={ headerStyle } onClick={ this.toggleCard }>
						<div className="row">
							<div className='col-md align-self-center'>
								{ setting.name }
							</div>
							<div style={{ textAlign: 'right' }} className='col-md align-self-center'>
								<div className="iconnav btn-group" role='group'>
									<IconButton
										icon='fas fa-save'
										onclick={ this.updateSetting }
									/>
									<IconButton
										icon='fas fa-cog'
										onclick={ this.toggleCard }
									/>
									<IconButton
										icon='fas fa-trash-alt'
										onclick={ e => { e.stopPropagation(); deleteSetting(setting); } }
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="collapse" ref={ body => this.body = body }>
						<div className='card-body' style={{ padding: '5px' }}>
							{ setting.description &&
								<InfoArea description={ setting.description } />
							}
							<EditJob ref={ edit => this.editJob = edit } job={ setting } action={ instapyAction } />
							<button
								style={{ float: 'right', margin: '0 15px 15px 0' }}
								onClick={ this.updateSetting }
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