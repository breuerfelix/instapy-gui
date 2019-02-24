const config = {
	socketEndpoint: '/socket',
	apiEndpoint: '/api'
	//socketEndpoint: 'ws://localhost:3001',
	//apiEndpoint: 'http://localhost:3000'
};

const MOCK_DATA = false;

// TODO will be loaded from backend on startup
const PREMIUM = false;

export {
	MOCK_DATA,
	PREMIUM
};

export default config;
