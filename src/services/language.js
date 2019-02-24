// TODO import from store

class Language {
	_table = null;

	constructor() {
		this._table = this.getTable('en');
	}

	translate = token => {
		const rv = this._table[token];
		if (rv) return rv;
		return token;
	}

	getTable = language => {
		try {
			// TODO make GET request to get new language table
			throw 'no valid response';
		} catch (err) {
			return this.defaultTable;
		}
	}

	defaultTable = {
		sidebar_configuration: 'Configuration',
		sidebar_namespaces: 'Templates',
		sidebar_github: 'GitHub',
		sidebar_login: 'Login',
		sidebar_account: 'ACCOUNT',
		sidebar_features: 'FEATURES',
		sidebar_links: 'LINKS',
		sidebar_start: 'Start',

		button_save: 'save',
		button_cancel: 'cancel',
		button_add: 'add',
		button_start: 'start',
		button_stop: 'stop',

		status: 'Status',
		status_loading: 'loading',
		status_running: 'running',
		status_stopped: 'stopped',
		status_done: 'done',
		status_error: 'error',

		login_username: 'username',
		login_password: 'password',
		login_title: 'Login to Instagram',

		namespaces_title: 'Templates',
		namespaces_description: 'Description',

		new_namespace_title: 'Add Template',
		namespace_name_label: 'Name',
		namespace_name_placeholder: 'Following by hashtag #sport',
		namespace_description_label: 'Description',
		namespace_description_placeholder: 'i need to buy milk',

		actions_title: 'Add Action',
		input_search_placeholder: 'search ...',
		actions_tab_set: 'set',
		actions_tab_follow: 'follow',
		actions_tab_interact: 'interact',

		startbot_title: 'Start InstaPy',
		startbot_select_namespace: 'Select template',

		console_title: 'Console'
	};
}

export default new Language().translate;
