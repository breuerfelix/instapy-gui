async function fetchGet(url) {
	const res = await fetch(url);
	const json = await res.json();
	return json;
}

async function fetchPost(url, data) {
	const res = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		headers: {
			'Content-Type': 'application/json',
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});

	const json = await res.json();
	return json;
}

export {
	fetchGet,
	fetchPost
};
