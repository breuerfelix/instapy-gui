const actions = store => ({
	setActions: (state, actions) => ({ actions }),
	toggleSidebar: (state, showSidebar) => ({ showSidebar }),
	setUsername: (state, username) => ({ username }),
	storeLogoutInstapy: (state) => ({ token: null, usernameInstapy: null }),
	storeLoginInstapy: (state, token, usernameInstapy) => ({ token, usernameInstapy }),
});

export default actions;
