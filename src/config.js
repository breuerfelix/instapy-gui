const config = {
	socketEndpoint: process.env.SOCKET_ENDPOINT || 'wss://socket.instapy.io',
	configEndpoint: process.env.CONFIG_ENDPOINT || 'https://config.instapy.io',
	authEndpoint: process.env.AUTH_ENDPOINT || 'https://auth.instapy.io',
	gaTrackingID: process.env.GA_TRACKING_ID || 'UA-142315308-1'
};

// hardcoded config for instapy constructor
const instapyAction = {
	params: [
		{
			name: 'username',
			defaultValue: null,
			optional: false,
			type: 'str'
		},
		{
			name: 'password',
			defaultValue: null,
			optional: false,
			type: 'secret'
		},
		{
			name: 'page_delay',
			defaultValue: 25,
			optional: true,
			type: 'int'
		},
		{
			name: 'headless_browser',
			defaultValue: false,
			optional: true,
			type: 'bool'
		},
		{
			name: 'proxy_username',
			defaultValue: null,
			optional: true,
			type: 'str'
		},
		{
			name: 'proxy_password',
			defaultValue: null,
			optional: true,
			type: 'str'
		},
		{
			name: 'proxy_address',
			defaultValue: null,
			optional: true,
			type: 'str'
		},
		{
			name: 'proxy_port',
			defaultValue: null,
			optional: true,
			type: 'int'
		},
		{
			name: 'disable_image_load',
			defaultValue: false,
			optional: true,
			type: 'bool'
		},
		{
			name: 'bypass_security_challenge_using',
			defaultValue: 'email',
			optional: true,
			type: 'str'
		},
	]
};

// TODO will be loaded from backend on startup
const PREMIUM = false;

export {
	PREMIUM,
	instapyAction
};

export default config;
