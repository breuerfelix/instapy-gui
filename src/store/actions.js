const actions = store => ({
	setActions: (state, actions) => ({ actions }),
	toggleSidebar: (state, showSidebar) => ({ showSidebar }),
	storeLogoutInstapy: (state) => ({ token: null, usernameInstapy: null }),
	storeLoginInstapy: (state, token, usernameInstapy) => ({ token, usernameInstapy }),
});

export default actions;
