import { h } from 'preact';

const IconButton = ({ icon, onclick }) => (
	<button
		className='btn btn-outline-dark'
		type='button'
		style={{ borderWidth: 0 }}
		onClick={ onclick }
	>
		<i className={ icon }>
		</i>
	</button>
);

export default IconButton;