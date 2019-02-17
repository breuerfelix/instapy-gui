import { fetchMock } from 'fetch-mock';
import uuid from 'uuid/v1';

class mocks {
	constructor() {
		this.endpoint = 'http://localhost:3000';
	}

	apply() {
		this.configMocks();
	}

	configMocks() {
		fetchMock.get(this.endpoint + '/namespaces',
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

		fetchMock.get('glob:' + this.endpoint + '/namespaces/*/jobs',
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

		fetchMock.get(this.endpoint + '/actions',
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
				},
				{
					functionName: 'set_by_hashtag',
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
					functionName: 'set_by_username',
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
					functionName: 'interact_by_hashtag',
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
					functionName: 'interact_by_username',
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
			]
		);


		fetchMock.post(`glob:${this.endpoint}/namespaces/*`, {
			// TODO return full list of new namespaces
		});

		fetchMock.post(`${this.endpoint}/namespaces`, {
			// TODO return full list of new namespaces
		});
	}
}

export default new mocks();
