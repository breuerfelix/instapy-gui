import { h, render, Component } from 'preact';
import { translate } from 'services';
import { connect } from 'store';

const AddJobCard = () => {
	// TODO align this plus sign to the middle SOMEHOW
	return (
		<div className="col-padding col">
			<div className="card">

				<div className="card-body" style={{ textAlign: 'center' }}>
					<a
						className='fas fa-plus fa-3x'
						data-toggle='modal'
						data-target='#actions-modal'
					/>
				</div>

			</div>
		</div>
	);
};

export default AddJobCard;
