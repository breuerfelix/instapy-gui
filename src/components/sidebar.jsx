import { h, render, Component } from 'preact';
import { translate } from 'services';
import { Link } from 'preact-router/match';

export default class SideBar extends Component {
	render() {
		return (
			<div id="sidebar" uk-offcanvas="mode: push; overlay: true;">
				<div class="uk-offcanvas-bar">

					<button class="uk-offcanvas-close" type="button" uk-close></button>

					<h3>Title</h3>

					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

				</div>
			</div>
		);
	}
}
