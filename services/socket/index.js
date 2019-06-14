const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'wow12this94is234so@$secret', PORT } = process.env;
const wss = new WebSocket.Server({ port: PORT || 4005 });
console.log('socket waiting for conections...');

const USERS = {};
const HANDLERS = {};

const json = (data) => JSON.stringify(data);

wss.on('connection', (ws, req) => {
	console.log('got connection');

	let payload = null;
	try {
		const token = req.headers['authorization'].split(' ')[1];
		payload = jwt.verify(token, JWT_SECRET);
	} catch {
		console.error('error validating jwt');
		ws.send(json({ error: 'Error validating token!' }));
		ws.terminate();
		return;
	}

	const { username } = payload;

	if (!USERS[username]) USERS[username] = { sockets: [] };
	const user = USERS[username];
	const socket = { ws };
	user.sockets.push(socket);

	ws.on('message', data => {
		data = JSON.parse(data);
		if (!HANDLERS[data.handler]) {
			console.error('error validating handler:', data.handler);
			ws.send(json({ error: 'Could not find handler.' }));
			return;
		}

		HANDLERS[data.handler](ws, user, socket, payload, data);
	});

	ws.on('close', () => {
		console.log('connection closed');
		const idx = user.sockets.indexOf(socket);
		if (idx != -1) user.sockets.splice(idx, 1);
	});
});

function register(ws, user, socket, payload, data) {
	socket.type = data.type;
}
HANDLERS['register'] = register;

