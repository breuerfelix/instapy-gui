const config = {
	socketEndpoint: 'ws://localhost:4005',
	apiEndpoint: 'http://localhost:4002',
	authEndpoint: 'http://localhost:4001'
};

// TODO will be loaded from backend on startup
const PREMIUM = false;

export {
	PREMIUM
};

export default config;
