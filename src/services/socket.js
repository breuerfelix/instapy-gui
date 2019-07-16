import config from 'config';
import store from 'store';
import { sleep } from 'core';

class SocketService {
	constructor() {
		this.socket = null;
		this.connected = false;
		this.isConnecting = false;
		this.handlers = {};

		store.subscribe(this.open.bind(this));
	}

	ping() {
		this.send({
			handler: 'ping'
		});
	}

	async check() {
		// wait until it is connected, to not open 2 connections at once
		while (this.isConnecting) await sleep(100);

		if (this.connected) return true;

		// try to reconnect
		await this.open();
		return this.connected;
	}

	async open({ token }) {
		if (!token) {
			// user logged out
			this.close();
			return;
		}

		if (this.connected || this.isConnecting) return;

		try {
			this.isConnecting = true;
			const websocket = new WebSocket(config.socketEndpoint + `/${token}`);

			// wait until socket is open
			while (websocket.readyState !== websocket.OPEN) {
				await sleep(50);
			}

			websocket.onmessage = this.receive;
			this.connected = true;
			this.isConnecting = false;
			this.socket = websocket;
			console.log('connected so websocket');

			this.send({ handler: 'register', type: 'app' });

			this.pingInterval = setInterval(this.ping.bind(this), 10000);
		} catch {
			this.connected = false;
			this.isConnecting = false;
			this.socket = null;
			console.error('error connect to websocket!');
		}
	}

	close() {
		try {
			clearInterval(this.pingInterval);
			this.socket.close();
		} finally {
			this.connected = false;
			this.isConnecting = false;
			this.socket = null;
			console.log('closed websocket connection');
		}
	}

	receive = event => {
		const data = JSON.parse(event.data);
		const { handler } = data;
		if (!handler) return;

		const functions = this.handlers[handler];
		if (!functions) return;

		for (const func of functions) func(data);
	}

	async send(data) {
		if (!await this.check()) return;

		this.socket.send(JSON.stringify(data));
	}

	register(handler, func) {
		if (!this.handlers[handler]) this.handlers[handler] = [];
		this.handlers[handler].push(func);
	}

	unregister(handler, func) {
		if (!this.handlers[handler]) return;
		const idx = this.handlers[handler].indexOf(func);
		if (idx == -1) return;
		this.handlers[handler].splice(idx, 1);
	}
}

export default new SocketService();
