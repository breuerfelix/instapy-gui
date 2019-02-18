import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';

const AddJobCard = () => {
	// TODO align this plus sign to the middle SOMEHOW
	return (
		<div class="col-padding col">
			<div class="card">

				<div class="card-body row">
					<a
						class='fas fa-plus fa-3x col-auto align-self-center'
						data-toggle='modal'
						data-target='#actions-modal'
					></a>
				</div>

			</div>
		</div>
	);
};

export default AddJobCard;
