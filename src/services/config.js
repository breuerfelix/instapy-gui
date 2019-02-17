import { fetchGet, fetchPost } from 'core';

class ConfigService {
	constructor() {
		this.endpoint = 'http://localhost:3000';
	}

	async fetchNamespaces() {
		return await fetchGet(this.endpoint + '/namespaces');
	}

	async deleteNamespace(namespace) {
		console.log('deleting namespace!');
		const data = {
			action: 'delete'
		};

		return await fetchPost(this.endpoint + '/namespaces/' + namespace, data);
	}

	async addNamespace(namespace) {
		console.log('adding namespace!');
		const data = {
			action: 'add',
			namespace
		};

		return await fetchPost(this.endpoint + '/namespaces', data);
	}

	async fetchJobs(namespace) {
		console.log('loading jobs for namespace: ' + namespace);
		return await fetchGet(`${this.endpoint}/namespaces/${namespace}/jobs`);
	}

	async fetchActions() {
		return await fetchGet(`${this.endpoint}/actions`);
	}

	async updateJobs(jobs) {
		console.log('updating jobs...');
		const data = {
			action: 'update',
			jobs
		};

		return await fetchPost(this.endpoint + '/namespaces/' + jobs[0].namespace + '/jobs', data);
	}

	async deleteJob(job) {
		console.log('deleting job...');
		const data = {
			action: 'delete'
		};

		return await fetchPost(`${this.endpoint}/namespaces/${job.namespace}/jobs/${job.uuid}`, data);
	}

	async updateJob(job) {
		console.log('updating job...');
		const data = {
			action: 'update',
			job
		};

		return await fetchPost(`${this.endpoint}/namespaces/${job.namespace}/jobs/${job.uuid}`, data);
	}
}

export default new ConfigService();
