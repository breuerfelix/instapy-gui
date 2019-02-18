import { fetchGet, fetchPost } from 'core';

class AccountService {
	constructor() {
		this.endpoint = 'http://localhost:3000';
	}

	async setLoginCredentials(username, password) {
		console.log('logging in ...');
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
