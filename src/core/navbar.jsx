import 'styles/navbar.scss';

import { h, render, Component } from 'preact';

export default class NavBar extends Component {
	render() {
		return (
			<div class='navbar'>
				<a href='/'>home</a>
				<a href='/projects'>projects</a>
				<a href='/about'>about</a>
			</div>
		);
	}
}
