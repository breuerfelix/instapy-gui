const headers = {};

async function fetchGet(url) {
	const res = await fetch(url, { headers });
	const json = await res.json();
	return json;
}

async function fetchPost(url, data) {
	const res = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		headers: {
			'Content-Type': 'application/json',
			... headers
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});

	const json = await res.json();
	return json;
}

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const setToken = () => {
	// set the auth token, only for free local version
	const jwt = require('jsonwebtoken');
	const token = jwt.sign({ database: 'user' }, 'instapysecret');
	headers['Authorization'] = `Bearer ${token}`;
};

export {
	fetchGet,
	fetchPost,
	sleep,
	setToken
};
