import arrayMove from 'array-move';

const actions = store => ({
	toggleJobActive: (state, job) => {
		state.changed = !state.changed;

		for (let j of state.selectedJobs) {
			if (j.position != job.position) continue;
			j.active = !j.active;
			break;
		}

		// TODO send new config to server
		return { ...state };
	},
	moveJob: (state, job, direction) => {
		state.changed = !state.changed;
		const jobs = state.selectedJobs;
		const idx = jobs.indexOf(job);

		if (idx != -1) {
			arrayMove.mut(jobs, idx, idx + direction); // The second parameter is the number of elements to remove.
		} else {
			console.error('couldn\'t locate job: ' + job);
		}

		// TODO send new config to server
		return { ...state };
	}

});

export default actions;
