const actions = store => ({
	setActions: (state, actions) => ({ actions }),
	toggleSidebar: (state, showSidebar) => ({ showSidebar }),
});

export default actions;
