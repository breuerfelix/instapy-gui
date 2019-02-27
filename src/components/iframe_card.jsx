import { h, render, Component } from 'preact';
import { translate } from 'services';

export default class IframeCard extends Component {
	render({ link, title }) {
		return (
			<div className="card">
				<div className="card-header">
					{ translate(title) }
				</div>
				<div className="card-body embed-responsive embed-responsive-16by9">
					<iframe
						className="embed-responsive-item"
						src={ link }
						frameborder="0"
						allowfullscreen
					/>
				</div>
			</div>
		);
	}
}
