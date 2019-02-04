import uuid from 'uuid/v1';

class ConfigService {
	async fetchNamespaces() {
		return new Promise((resolve, reject) => {
			resolve(
				[
					{
						ident: 'startbla',
						name: 'bla blub',
						description: 'this is a description the user is able to write down.'
					},
					{
						ident: 'starter',
						name: 'hallu',
						description: 'very very detailed description of this template over here'
					}
				]
			);
		});
	}

	async deleteNamespace(namespace) {
		console.log('deleting namespace!');
	}

	async addNamespace(namespace) {
		console.log('adding namespace!');
	}

	async fetchJobs(namespace) {
		console.log('loading jobs for namespace: ' + namespace);

		return new Promise((resolve, reject) => {
			resolve(
				[
					{
						uuid: uuid(),
						namespace: 'starter',
						functionName: 'follow_set_something',
						active: true,
						params: [
							{
								position: 0,
								name: 'username',
								value: 'felix',
							},
							{
								position: 1,
								name: 'password',
								value: 'bla',
							}
						]
					},
					{
						uuid: uuid(),
						namespace: 'starter',
						functionName: 'follow_by_hashtag',
						active: false,
						params: [
							{
								position: 0,
								name: 'hashtag',
								value: [
									'bla',
									'sports',
									'programming'
								],
							}
						]
					},
					{
						uuid: uuid(),
						namespace: 'starter',
						functionName: 'follow_by_username',
						active: true,
						params: [
							{
								position: 0,
								name: 'username',
								value: 'barack_obama'
							}
						]
					}
				]
			);
		});
	}

	async fetchActions() {
		return new Promise((resolve, reject) => {
			resolve(
				[
					{
						functionName: 'follow_set_something',
						description: 'this performs the login',
						params: [
							{
								position: 0,
								name: 'username',
								defaultValue: null,
								optional: false,
								type: 'string',
								description: 'login username'
							}
						]
					},
					{
						functionName: 'follow_by_hashtag',
						description: 'follow people by a given hashtag',
						params: [
							{
								position: 0,
								name: 'hashtags',
								defaultValue: null,
								optional: false,
								type: 'list:string',
								description: 'hashtag list'
							}
						]
					},
					{
						functionName: 'follow_by_username',
						description: 'follow people by a given username',
						params: [
							{
								position: 0,
								name: 'username',
								defaultValue: null,
								optional: false,
								type: 'string',
								description: 'username of account'
							}
						]
					}
				]
			);
		});
	}

	async updateJobs(jobs) {
		// TODO update all jobs from a given namespace
		console.log('updating jobs...');
		return null;
	}

	async deleteJob(job) {
		// TODO delete a specific job based on uuid and namespace
		console.log('deleting job...');
		return null;
	}

	async updateJob(job) {
		// TODO update a specific job based on uuid and namespace
		console.log('updating job...');
		return null;
	}
}

export default new ConfigService();
