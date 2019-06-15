const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const { JWT_SECRET , PORT } = process.env;
const wss = new WebSocket.Server({ port: PORT || 80 });
console.log('socket waiting for conections...');

const USERS = {};
const HANDLERS = {};

const json = (data) => JSON.stringify(data);

wss.on('connection', (ws, { headers, url }) => {
	console.log('got connection');
	let payload = null;
	let token = null;

	try {
		token = headers['authorization'].split(' ')[1];
	} catch {
		try {
			token = url.split('/')[1];
		} catch {}
	}

	try {
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

	ws.on('ping', () => {
		ws.ping();
	});

	ws.on('pong', () => {});
});

function ping(ws, user, socket, payload, data) {
	ws.send(json({ handler: 'pong' }));
}
HANDLERS['ping'] = ping;

function register(ws, user, socket, payload, data) {
	const { type } = data;
	socket.type = type;

	if (type == 'instapy') {
		const { ident } = data;
		socket.logs = [];
		socket.ident = ident;
	}
}
HANDLERS['register'] = register;

function status(ws, user, socket, payload, data) {
	const { action } = data;
	if (action == 'get') {
		const s = user.sockets
			.find(x => x.ident == data.ident && x.type == 'instapy');

		if (!s) {
			console.error('cant find socket, status / get');
			return;
		}

		s.ws.send(json({
			handler: 'status'
		}));
	} else if (action == 'set') {
		const s = user.sockets
			.filter(x => x.type == 'app');

		const { status } = data;
		for (const so of s) {
			so.ws.send(json({
				handler: 'status',
				status
			}));
		}
	}
}
HANDLERS['status'] = status;

function receiveInstapyLog(ws, user, socket, payload, data) {
	const s = user.sockets.find(x => x.ident == data.ident && x.type == 'instapy');
	s.logs.push(data.message);
}
HANDLERS['instapy_log'] = receiveInstapyLog;

function bots(ws, user, socket, payload, data) {
	const s = user.sockets
		.filter(x => x.type == 'instapy')
		.map(x => x.ident);

	ws.send(json({ handler: 'bots', data: s }));
}
HANDLERS['bots'] = bots;

function bot(ws, user, socket, payload, data) {
	const s = user.sockets
		.find(x => x.type == 'instapy' && x.ident == data.bot);

	// clear logs
	s.logs = [];

	s.ws.send(json({
		handler: data.start ? 'start' : 'stop',
		namespace: data.namespace
	}));
}
HANDLERS['bot'] = bot;