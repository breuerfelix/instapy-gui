import createStore from 'unistore';
import { connect as org_connect } from 'unistore/preact';
import actions from './actions';

const initialState = {
	actions: [
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

const connect = values => org_connect(values, actions);

export {
	actions,
	connect
};

export default store;
