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
		sidebar_login_instapy: 'Login InstaPy',
		sidebar_account: 'ACCOUNT',
		sidebar_features: 'FEATURES',
		sidebar_links: 'LINKS',
		sidebar_start: 'Start',
		sidebar_other: 'Other',
		sidebar_dashboard: 'Dashboard',
		sidebar_settings: 'Settings',

		link_donate: 'Donate',
		link_instapy: 'InstaPy',
		link_instapy_gui: 'InstaPy-GUI',
		link_submit_issue: 'Found a bug ?',
		link_need_help: 'Need help ?',

		button_save: 'save',
		button_cancel: 'cancel',
		button_add: 'add',
		button_start: 'start',
		button_stop: 'stop',
		button_login: 'login',
		button_signup: 'register',
		button_logout: 'logout',
		button_reset: 'reset',
		button_save_changes: 'save changes',

		badge_enabled: 'enabled',
		badge_disabled: 'disabled',

		status: 'Status',
		status_loading: 'loading',
		status_running: 'running',
		status_stopped: 'stopped',
		status_done: 'done',
		status_error: 'error',
		status_exited: 'exited',

		login_username: 'username',
		login_email: 'email (only for register)',
		login_password: 'password',
		login_title: 'Login to Instagram',

		signup_title: 'Login / Register for InstaPy',

		namespaces_title: 'Templates',
		namespaces_description: 'Description',

		new_namespace_title: 'Add Template',
		namespace_name_label: 'Name',
		namespace_name_placeholder: 'Following by hashtag #sport',
		namespace_description_label: 'Description',
		namespace_description_placeholder: 'i need to buy milk (optional)',

		new_settings_title: 'Add Setting',
		settings_name_label: 'Name',
		settings_name_placeholder: 'Ultra default settings',
		settings_description_label: 'Description',
		settings_description_placeholder: 'headless, bypass mobile, i hate instagram (optional)',

		job_show_info: 'click here to show info',
		job_hide_info: 'click here to hide info',

		actions_title: 'Add Action',
		input_search_placeholder: 'search ...',
		actions_tab_set: 'set',
		actions_tab_follow: 'follow',
		actions_tab_misc: 'misc',
		actions_tab_like: 'like',
		actions_tab_interact: 'interact',

		startbot_title: 'Start InstaPy',
		startbot_select_namespace: 'Select Template',
		startbot_select_bot: 'Select Bot',
		startbot_select_setting: 'Select Setting',

		console_title: 'Console'
	};
}

export default new Language().translate;
