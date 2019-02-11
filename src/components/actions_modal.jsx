import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import $ from 'jquery';

export default class ActionsModal extends Component {
	state = {
		inputSearch: null
	}

	addAction = e => {
		e.preventDefault();

		$(this.modal).modal('hide');
	}

	render(props, { inputSearch }) {
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
									aria-labelledby="home-tab"
								>
									tab set
								</div>
								<div
									class="tab-pane fade"
									id="follow"
									role="tabpanel"
									aria-labelledby="profile-tab"
								>
									tab follow
								</div>
								<div
									class="tab-pane fade"
									id="interact"
									role="tabpanel"
									aria-labelledby="contact-tab"
								>
									tab interact
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
