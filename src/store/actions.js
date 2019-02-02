const actions = store => ({
	setActions: (state, actions) => ({ actions }),
	toggleSidebar: (state, showSidebar) => ({ showSidebar }),
	setUsername: (state, username) => ({ username }),
});

export default actions;
