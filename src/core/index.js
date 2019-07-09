import decode from 'jwt-decode';
import store from 'store';

const headers = {};

async function fetchGet(url) {
	const res = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers
	});
	const json = await res.json();
	return json;
}

async function fetchPost(url, data) {
	const res = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors',
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

const readToken = () => {
	const token = localStorage.getItem('token');
	if (!token) return;

	const { displayName } = decode(token);
	store.setState({ token, usernameInstapy: displayName });
	headers['Authorization'] = `Bearer ${token}`;
};

const setToken = (token = null) => {
	if (!token) {
		delete headers['Authorization'];
		return;
	}

	headers['Authorization'] = `Bearer ${token}`;
};

const raiseError = (error, display = true) => {
	if (display) alert(error);
	// console.error(error);
	throw error;
};

export {
	fetchGet,
	fetchPost,
	sleep,
	readToken,
	setToken,
	raiseError
};
