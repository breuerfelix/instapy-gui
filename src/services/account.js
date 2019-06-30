import { fetchGet, fetchPost } from 'core';
import config from 'config';
import decode from 'jwt-decode';

class AccountService {
	constructor() {
		this.endpoint = config.configEndpoint;
		this.authEndpoint = config.authEndpoint;
	}

	async signupInstapy(email, username, password) {
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
	async loginInstapy(username, password) {
		const data = {
			username,
			password
		};

		const { token, error, type } = await fetchPost(this.authEndpoint + '/login', data);
		if (error) return { error, type };

		const payload = decode(token);
		return { token, ...payload };
	}

	async setLoginCredentials(username, password) {
		console.log('set login credentials ...');
		const data = {
			username,
			password
		};

		return await fetchPost(this.endpoint + '/login', data);
	}

	async getLoginCredentials() {
		console.log('getting instapy login credentials...');
		return await fetchGet(this.endpoint + '/login');
	}
}

export default new AccountService();
