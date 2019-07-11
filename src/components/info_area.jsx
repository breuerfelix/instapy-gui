import { h, render, Component } from 'preact';
import { translate } from 'services';
import $ from 'jquery';
import Markup from 'preact-markup';

export default class InfoArea extends Component {
	state = {
		expanded: false
	}

	toggleInfo = e => {
		e.preventDefault();
		e.stopPropagation();

		// do nothing if currentlu opening or closing
		if ($(this.body).hasClass('collapsing')) return;

		this.setState({ expanded: !this.state.expanded });
		$(this.body).collapse('toggle');
	}

	render({ description }, { expanded }) {
		const infoText = expanded ? 'job_hide_info' : 'job_show_info';
		// replace newline with br so render html
		// add other conversions here
		const content = description.replace('\n', '<br />');

		return (
			<div style={{ margin: '5px 15px 0 15px' }}>

				<div className='collapse' ref={ body => this.body = body }>
					<div style={{ padding: '10px 0' }}>
						<div className='alert alert-primary' style={{ margin: 0 }}>
							<Markup markup={ content } />
						</div>
					</div>
				</div>

				<div className='row align-items-center' style={{ fontSize: '80%' }}>
					<div className='col'><hr /></div>
					<div className='col-auto'>
						<a onClick={ this.toggleInfo } href='#' style={{ color: 'black' }}>
							{ translate(infoText) }
						</a>
					</div>
					<div className='col'><hr /></div>
				</div>

			</div>
		);
	}
}