const express = require('express');
const rateLimit = require('express-rate-limit');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypt = require('bcryptjs');
const cors = require('cors');

const { MONGO_URL, JWT_SECRET, PORT } = process.env;

const app = express();
const port = PORT || 80;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SALT_ROUNDS = 13;
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
let auth, users;

const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 5,
	message: 'Login limit reached for this IP. Try again in 10 minutes.'
});

const signupLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 3,
	message: 'Sigup limit reached for this IP.'
});

app.post('/login', loginLimiter, async (req, res) => {
	const { username, password } = req.body;

	if (!username || username === '') {
		res.send(JSON.stringify({ error: 'Missing username.', type: 'username' }));
		return;
	}

	if (!password || password === '') {
		res.send(JSON.stringify({ error: 'Missing password.', type: 'password' }));
		return;
	}

	const lowerUsername = username.toLowerCase();
	const user = await users.findOne({ username: lowerUsername });

	if (!user) {
		res.send(JSON.stringify({ error: 'Username not found.', type: 'username' }));
		return;
	}

	const {
		password: passwordHash,
		username: dbUsername,
		displayName,
		email
	} = user;

	const match = await crypt.compare(password, passwordHash);

	if (!match) {
		res.send(JSON.stringify({ error: 'Passwords do not match.', type: 'password' }));
		return;
	}

	// TODO add exp date
	const token = jwt.sign({ username: dbUsername, displayName, email }, JWT_SECRET);
	console.log('user logged in:', dbUsername);
	res.send(JSON.stringify({ token }));
});

app.post('/signup', signupLimiter, async (req, res) => {
	const { email, username, password } = req.body;
	console.log('received signup:', req.body);

	if (!email || email === '') {
		res.send(JSON.stringify({ error: 'Email required.', type: 'email' }));
		return;
	}

	if (!username || username === '') {
		res.send(JSON.stringify({ error: 'Username required.', type: 'username' }));
		return;
	}

	if (!password || password === '') {
		res.send(JSON.stringify({ error: 'Password required.', type: 'password' }));
		return;
	}

	const lowerUsername = username.toLowerCase();

	let user = await users.findOne({ email });

	if (user) {
		res.send(JSON.stringify({ error: 'Email already taken.', type: 'email' }));
		return;
	}

	user = await users.findOne({ username: lowerUsername });
	if (user) {
		res.send(JSON.stringify({ error: 'Username already taken.', type:'username' }));
		return;
	}


	const hash = await crypt.hash(password, SALT_ROUNDS);
	await users.insertOne({
		email,
		username: lowerUsername,
		displayName: username,
		password: hash
	});

	// TODO add exp date
	const token = jwt.sign({
		username: lowerUsername,
		displayName: username,
		email
	}, JWT_SECRET);
	console.log('new user sign up:', lowerUsername);
	res.send(JSON.stringify({ token }));
});

client.connect(err => {
	if (err) {
		console.error('error connecting to database', err);
		return;
	}

	process.on('exit', () => client.close());

	auth = client.db('auth');
	users = auth.collection('users');

	app.listen(port, () => console.log(`auth service listening on port ${port}!`));
});