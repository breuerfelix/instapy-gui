import { fetchGet, fetchPost } from 'core';
import config from 'config';

class AccountService {
	constructor() {
		this.endpoint = config.apiEndpoint;
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
		return await fetchGet(this.endpoint + '/login');
	}
}

export default new AccountService();
