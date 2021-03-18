import { h } from 'preact';
import { Link } from 'react-router-dom';

const Home = () => (
	<div>
		<p style={{ padding: '10px 3%' }}>
			<h2 align='center'>InstaPy GUI</h2>
			<p align='center'>
				<a rel='noopener noreferrer' href='https://github.com/breuerfelix/instapy-gui' target='_blank'>Open Source</a> Graphical User Interface for <a href='https://github.com/timgrossmann/InstaPy'>InstaPy</a> automation.
				<br />
				<b>
					Get real followers, likes and comments using free Open Source tools!
				</b>
			</p>
			<hr />
			<p style={{ padding: '0 7%' }}>
				<br />
				<h3>How to get started within 10 minutes:</h3>
				(You need to be logged in to follow the links)
				<br />
				<br />
				<ol>
					<li>Install <a rel='noopener noreferrer' target='_blank' href='https://www.mozilla.org'>Firefox</a></li>
					<li>Create an <Link to='/login'>Account</Link></li>
					<li><a rel='noopener noreferrer' target='_blank' href='https://github.com/breuerfelix/instapy-gui'>Register</a> a Bot</li>
					<li>Create a <Link to='/configuration/namespaces'>Template</Link></li>
					<li>Modify your <Link to='/configuration/settings'>Settings</Link></li>
					<li><Link to='/start'>Start</Link> your automation tool!</li>
				</ol>
				<br />
				<div>
					<h3>No more Scripting, everything in the Browser</h3>
					<br />
					<img src='/templates.png' alt='templates example' />
					<br />
					<br />
					<h3>Watch your InstaPy Logs Online</h3>
					<br />
					<img src='/start.png' alt='start example' />
				</div>
			</p>
		</p>
	</div>
);

export default Home;
