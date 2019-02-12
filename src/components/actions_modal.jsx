import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import $ from 'jquery';
import { connect } from 'store';

@connect('actions')
export default class ActionsModal extends Component {
	state = {
		inputSearch: null
	}

	addAction = e => {
		e.preventDefault();

		$(this.modal).modal('hide');
	}

	render({ actions }, { inputSearch }) {
		const setActions = actions.filter(action => action.functionName.startsWith('set'));
		const followActions = actions.filter(action => action.functionName.startsWith('follow'));
		const interactActions = actions.filter(action => action.functionName.startsWith('interact'));

		return (
			<div
				ref={ modal => this.modal = modal }
				id="actions-modal"
				class='modal fade'
				tabindex='-1'
				role='dialog'
				aria-hidden='true'
				arial-labelledby='actions-modal-title'
			>
				<div class='modal-dialog' role='document'>
					<div className="modal-content">
						<div class="modal-header">
							<h5 id='actions-modal-title' class="modal-title">{ translate('actions_title') }</h5>
							<button className="close" type='button' data-dismiss='modal' aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div class="form-group">
								<div className="input-group">
									<input
										class='form-control'
										type='text'
										placeholder={ translate('input_search_placeholder') }
										value={ inputSearch }
										onInput={ linkState(this, 'inputSearch') }
										disabled
									/>
								</div>
							</div>

							<ul class="nav nav-tabs nav-justified" id="actions-tab" role="tablist">
								<li class="nav-item">
									<a
										class="nav-link active"
										id="set-tab"
										data-toggle="tab"
										href="#set"
										role="tab"
										aria-controls="set"
										aria-selected="true"
									>
										{ translate('actions_tab_set') }
									</a>
								</li>
								<li class="nav-item">
									<a
										class="nav-link"
										id="follow-tab"
										data-toggle="tab"
										href="#follow"
										role="tab"
										aria-controls="follow"
										aria-selected="false"
									>
										{ translate('actions_tab_follow') }
									</a>
								</li>
								<li class="nav-item">
									<a
										class="nav-link"
										id="interact-tab"
										data-toggle="tab"
										href="#interact"
										role="tab"
										aria-controls="interact"
										aria-selected="false"
									>
										{ translate('actions_tab_interact') }
									</a>
								</li>
							</ul>
							<div class="tab-content">
								<div
									class="tab-pane fade show active"
									id="set"
									role="tabpanel"
									aria-labelledby="set-tab"
								>
									<ActionTable actions={ setActions } />
								</div>
								<div
									class="tab-pane fade"
									id="follow"
									role="tabpanel"
									aria-labelledby="follow-tab"
								>
									<ActionTable actions={ followActions } />
								</div>
								<div
									class="tab-pane fade"
									id="interact"
									role="tabpanel"
									aria-labelledby="interact-tab"
								>
									<ActionTable actions={ interactActions } />
								</div>
							</div>

						</div>

						<div class="modal-footer">
							<button
								class="btn btn-outline-dark"
								data-dismiss='modal'
								type="button"
							>
								{ translate('button_cancel') }
							</button>
							<button
								class="btn btn-outline-dark"
								onClick={ this.addAction }
								type="button"
							>
								{ translate('button_add') }
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const ActionTable = ({ actions, add }) => {
	const css = {
		cursor: 'pointer',
		color: 'black',
		outline: 0,
		border: 'none'
	};

	const rows = actions.map(action =>
		<tr>
			<td>{ action.functionName }</td>
			<td>
				<a
					tabindex='0'
					style={ css }
					class='fas fa-info noselect'
					data-container='body'
					data-trigger='focus'
					data-toggle='popover'
					data-placement='top'
					data-content={ action.description }
				/>
			</td>
			<td><a class='fas fa-plus' onClick={ add } style='cursor: pointer;'></a></td>
		</tr>
	);

	// enable popover
	$('[data-toggle="popover"]').popover();

	return (
		<table class="table table-hover">
			<tbody>
				{ rows }
			</tbody>
		</table>
	);
};
