import { h } from 'preact';
import { translate } from 'services';

const InfoCard = ({ children, height = '200px' }) => (
	<div className='card' style={{ height }}>

		<div className='card-header'>
			{ translate('title_info') }
		</div>

		<div className='card-body'>
			{ children }
		</div>

	</div>
);

export default InfoCard;
