import config from 'config';
import { sleep } from 'core';

class SocketService {
	constructor() {
		this.socket = null;
		this.connected = false;
		this.isConnecting = false;
		this.idCounter = 0;
		this.handler = {};
		this.keyIdent = 'custom_socket_id';

		this.open();
	}

	async check() {
		// wait until it is connected, to not open 2 connections at once
		while (this.isConnecting) await sleep(100);

		if (this.connected) return true;

		// try to reconnect
		await this.open();
		return this.connected;
	}

	async open() {
		try {
			this.isConnecting = true;
			const websocket = new WebSocket(`ws://${location.host}${config.socketEndpoint}`);

			// wait until socket is open
			while (websocket.readyState !== websocket.OPEN) {
				await sleep(100);
			}

			websocket.onmessage = this.recieve;
			this.connected = true;
			this.isConnecting = false;
			this.socket = websocket;
			console.log('connected so websocket');
		} catch {
			this.connected = false;
			this.socket = null;
			console.error('error connect to websocket!');
		}
	}

	close() {
		if (!this.connected) return;

		try {
			this.socket.close();
		} finally {
			this.connected = false;
			this.socket = null;
		}
	}

	recieve = event => {
		const data = JSON.parse(event.data);

		for (let key of Object.keys(this.handler)) {
			for (let func of this.handler[key]) {
				func(data);
			}
		}
	}

	async send(data) {
		if (!await this.check()) return;

		this.socket.send(JSON.stringify(data));
	}

	register(obj, func) {
		// instantiate new list if there is none
		if (!(this.keyIdent in obj)) {
			obj[this.keyIdent] = this.idCounter;
			this.handler[this.idCounter] = [];
			this.idCounter++;
		}

		this.handler[obj[this.keyIdent]].push(func);
	}

	unregister(obj) {
		delete this.handler[obj[this.keyIdent]];
	}
}

export default new SocketService();
