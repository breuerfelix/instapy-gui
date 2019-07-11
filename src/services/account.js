import { fetchGet, fetchPost } from 'core';
import config from 'config';
import decode from 'jwt-decode';

class AccountService {
	constructor() {
		this.endpoint = config.configEndpoint;
		this.authEndpoint = config.authEndpoint;
	}

	async signup(email, username, password) {
		const data = {
			email,
			username,
			password
		};

		const { token, error, type } = await fetchPost(this.authEndpoint + '/signup', data);
		if (error) return { error, type };

		const payload = decode(token);
		return { token, ...payload };
	}
	async login(username, password) {
		const data = {
			username,
			password
		};

		const { token, error, type } = await fetchPost(this.authEndpoint + '/login', data);
		if (error) return { error, type };

		const payload = decode(token);
		return { token, ...payload };
	}
}

export default new AccountService();
