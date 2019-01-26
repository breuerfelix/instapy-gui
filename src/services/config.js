import uuid from 'uuid/v1';

class ConfigService {
	async fetchJobs() {
		return new Promise((resolve, reject) => {
			resolve(
				[
					{
						uuid: uuid(),
						namespace: 'starter',
						functionName: 'login',
						active: true,
						params: [
							{
								position: 0,
								name: 'username',
								value: 'felix',
							},
							{
								position: 1,
								name: 'password',
								value: 'bla',
							}
						]
					},
					{
						uuid: uuid(),
						namespace: 'starter',
						functionName: 'follow_by_hashtag',
						active: false,
						params: [
							{
								position: 0,
								name: 'hashtag',
								value: [
									'bla',
									'sports',
									'programming'
								],
							}
						]
					}
				]
			);
		});
	}

	async updateJobs(jobs) {
		// TODO update all jobs from a given namespace
		console.log('updating jobs...');
		return null;
	}

	async deleteJob(job) {
		// TODO delete a specific job based on uuid and namespace
		console.log('deleting job...');
		return null;
	}

	async updateJob(job) {
		// TODO update a specific job based on uuid and namespace
		console.log('updating job...');
		return null;
	}
}

export default new ConfigService();
