const actions = store => ({
	increment: state => {
		return { count: state.count + 1 };
	}

});

export default actions;
