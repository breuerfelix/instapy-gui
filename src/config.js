const config = {
	socketEndpoint: process.env.SOCKET_ENDPOINT || 'ws://socket.instapy.io',
	apiEndpoint: process.env.API_ENDPOINT || 'http://api.instapy.io',
	authEndpoint: process.env.AUTH_ENDPOINT || 'http://auth.instapy.io'
};

// TODO will be loaded from backend on startup
const PREMIUM = false;

export {
	PREMIUM
};

export default config;
