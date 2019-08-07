const MongoClient = require('mongodb').MongoClient;

const sleep = sec => new Promise(res => setTimeout(res, sec * 1000));

class scheduler {
	constructor() {
		const { MONGO_URL } = process.env;
		this.client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
		this.client.connect(err => {
			if (err) {
				console.error('error connecting to database', err);
				process.exit();
			}

			process.on('exit', () => {
				this.loop = false;
				this.client.close();
			});

			this.configuration = this.client.db('configuration');
			this.schedules = this.configuration.collection('schedules');

			this.loop = true;
			this.start();
		});
	}

	async start() {
		while (this.loop) {

		}
	}

	onStart(func) {
		this.onStartHandler = func;
	}
}

const inst = new scheduler();
module.exports = inst;