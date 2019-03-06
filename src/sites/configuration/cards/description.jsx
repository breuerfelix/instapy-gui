import { h } from 'preact';
import { translate } from 'services';
import Markup from 'preact-markup';

const DescriptionCard = ({ namespace, height = '200px' }) => (
	<div className='card' style={{ height }}>

		<div className='card-header'>
			{ translate('namespaces_description') }
		</div>

		<div className='card-body'>
			<Markup markup={ namespace.description } />
		</div>

	</div>
);

export default DescriptionCard;
