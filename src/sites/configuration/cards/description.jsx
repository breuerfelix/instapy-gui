import { h } from 'preact';
import { translate } from 'services';

const DescriptionCard = ({ namespace }) => (
	<div className="card" style='height: 200px;'>

		<div className="card-header">
			{ translate('namespaces_description') }
		</div>

		<div className="card-body">
			{ namespace.description }
		</div>

	</div>
);

export default DescriptionCard;
