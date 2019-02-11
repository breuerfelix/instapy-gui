import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';

const AddJobCard = ({ clicked }) => {
	return (
		<div class="col-padding col">
			<div class="card">

				<div class="card-body row">
					<a
						onClick={ clicked }
						class='fas fa-plus fa-3x col-auto'
						data-toggle='modal'
						data-target='#actions-modal'
					></a>
				</div>

			</div>
		</div>
	);
};

export default AddJobCard;
