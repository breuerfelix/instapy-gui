const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { createWebSocketStream } = require('ws');

const { JWT_SECRET , PORT } = process.env;
const wss = new WebSocket.Server({ port: PORT || 80 });
console.log('socket waiting for conections...');

const USERS = {};
const HANDLERS = {};

const json = (data) => JSON.stringify(data);

wss.on('connection', (ws, { headers, url }) => {
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

		try {
			HANDLERS[data.handler](ws, user, socket, payload, data);
		} catch (e) {
			console.error('exception executing handler:', e);
			ws.send(json({ error: 'Exception in handler.' }));
		}
	});

	ws.on('close', () => {
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
	console.log('register new client:', type);
	socket.type = type;

	if (type == 'instapy') {
		const { ident } = data;
		socket.logs = [];
		socket.ident = ident;
	} else if (type == 'app') {
		socket.uuid = uuid.v4()
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

		const { status, namespace, setting } = data;
		for (const so of s) {
			so.ws.send(json({
				handler: 'status',
				status,
				namespace,
				setting
			}));
		}
	}
}
HANDLERS['status'] = status;

function receiveInstapyLog(ws, user, socket, payload, data) {
	const s = user.sockets.find(x => x.ident == data.ident && x.type == 'instapy');
	s.logs.push(data.message);

	const apps = user.sockets.filter(x => x.type && x.type == 'app');
	for (const app of apps) {
		app.ws.send(json({
			handler: 'logs',
			action: 'single',
			bot: s.ident,
			message: data.message
		}));
	}
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

	const { start, namespace, setting } = data;

	// clear logs on start
	if (start) s.logs = [];

	s.ws.send(json({
		handler: start ? 'start' : 'stop',
		namespace,
		setting
	}));
}
HANDLERS['bot'] = bot;

function logs(ws, user, socket, payload, data) {
	const { action, bot } = data;
	if (action == 'get') {
		const s = user.sockets
			.find(x => x.type == 'instapy' && x.ident == bot);

		ws.send(json({
			handler: 'logs',
			action: 'set',
			bot,
			logs: [ ...s.logs ]
		}));
	}
}
HANDLERS['logs'] = logs;


function getAllActivities(ws, user, socket, payload, data) {
	if (socket.type == 'instapy') {
		if (data.uuid){
			const app = user.sockets.find(x => x.type && x.type == 'app' && x.uuid == data.uuid);
			app.ws.send(json({
				handler: 'get-activities',
				action: 'update',
				data: data.data
			}));
		} else {
			const apps = user.sockets.filter(x => x.type && x.type == 'app');
			for (const app of apps) {
				app.ws.send(json({
					handler: 'get-activities',
					action: 'update',
					data: data.data
				}));
			}
		}
	} else {
		const s = user.sockets.filter(x => x.type == 'instapy');
		s.forEach(bot => {
			bot.ws.send(json({
				handler:'get-activities',
				uuid: socket.uuid,
			}))
		});
	}
}
HANDLERS['get-activities'] = getAllActivities;
