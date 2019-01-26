import createStore from 'unistore';
import { connect as org_connect } from 'unistore/preact';
import actions from './actions';

const initialState = {
	changed: true,
	selectedJobs: [
		{
			position: 0,
			functionName: 'login',
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
			position: 1,
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
		}
	],
	jobs: [
		{
			functionName: 'login',
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
		}
	]
};

const store = createStore(initialState);

const connect = values => org_connect('changed,' + values, actions);

export {
	actions,
	connect
};

export default store;
