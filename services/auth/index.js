const express = require('express');
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

const SALT_ROUNDS = 10;
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
let auth, users;

app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	if (!username || username === '') {
		res.send(JSON.stringify({ error: 'Missing username.' }));
		return;
	}

	if (!password || password === '') {
		res.send(JSON.stringify({ error: 'Missing password.' }));
		return;
	}

	const lowerUsername = username.toLowerCase();
	const user = await users.findOne({ username: lowerUsername });

	if (!user) {
		res.send(JSON.stringify({ error: 'User not found.' }));
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
		res.send(JSON.stringify({ error: 'Passwords do not match.' }));
		return;
	}

	const token = jwt.sign({ username: dbUsername, displayName, email }, JWT_SECRET);
	console.log('user logged in:', dbUsername);
	res.send(JSON.stringify({ token }));
});

app.post('/signup', async (req, res) => {
	const { email, username, password } = req.body;

	if (!email || email === '') {
		res.send(JSON.stringify({ error: 'Missing email.' }));
		return;
	}

	if (!username || username === '') {
		res.send(JSON.stringify({ error: 'Missing username.' }));
		return;
	}

	if (!password || password === '') {
		res.send(JSON.stringify({ error: 'Missing password.' }));
		return;
	}

	const lowerUsername = username.toLowerCase();

	let user = await users.findOne({ email });

	if (user) {
		res.send(JSON.stringify({ error: 'Email already taken.' }));
		return;
	}

	user = await users.findOne({ username: lowerUsername });
	if (user) {
		res.send(JSON.stringify({ error: 'Username already taken.' }));
		return;
	}


	const hash = await crypt.hash(password, SALT_ROUNDS);
	await users.insertOne({
		email,
		username: lowerUsername,
		displayName: username,
		password: hash
	});

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