const config = {
	socketEndpoint: process.env.SOCKET_ENDPOINT || 'wss://socket.instapy.io',
	configEndpoint: process.env.CONFIG_ENDPOINT || 'https://config.instapy.io',
	authEndpoint: process.env.AUTH_ENDPOINT || 'https://auth.instapy.io',
	gaTrackingID: 'UA-142315308-1'
};

// TODO will be loaded from backend on startup
const PREMIUM = false;

export {
	PREMIUM
};

export default config;
