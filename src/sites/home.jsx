import { h, render, Component } from 'preact';
import { Link } from 'react-router-dom';

const Home = () => (
	<div>
		<p style={{ padding: '10px 3%' }}>
			<h2 align='center'>InstaPy GUI</h2>
			<p align='center'>
				<a rel='noopener noreferrer' href='https://github.com/breuerfelix/instapy-gui' target='_blank'>Open Source</a> Graphical User Interface for <a href='https://github.com/timgrossmann/InstaPy'>InstaPy</a> automation.
				<br/>
				<b>
					Get real followers, likes and comments using free Open Source tools!
				</b>
			</p>
			<hr/>
			<p style={{ padding: '0 7%' }}>
				<br/>
				<h6>How to get started within 10 minutes:</h6>
				<br/>
				<ol>
					<li>Install <a rel='noopener noreferrer' target='_blank' href='https://www.mozilla.org'>Firefox</a></li>
					<li>Create an <Link to='/login'>Account</Link></li>
					<li><a rel='noopener noreferrer' target='_blank' href='https://github.com/breuerfelix/instapy-gui'>Register</a> a Bot</li>
					<li>Create a <Link to='/configuration/namespaces'>Template</Link></li>
					<li>Modify your <Link to='/configuration/settings'>Settings</Link></li>
					<li><Link to='/start'>Start</Link> your automation tool!</li>
				</ol>
				<br/>
			</p>
		</p>
	</div>
);

export default Home;
