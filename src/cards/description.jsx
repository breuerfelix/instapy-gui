import { h } from 'preact';
import { translate } from 'services';

const DescriptionCard = ({ namespace }) => (
	<div class="card" style='height: 200px;'>

		<div class="card-header">
			{ translate('namespaces_description') }
		</div>

		<div class="card-body">
			{ namespace.description }
		</div>

	</div>
);

export default DescriptionCard;
