# how to start developing

* `npm install`
* `npm run build`
* `npm run dev` to start all containers
	* all files from the repository will be mounted
	* live reloading inside containers is activated
	* you can start editing files and see the results instantly
* `npm start` to serve local website
* open `localhost:8080` to see live reloading website which connects to docker backend
* open `localhost/grafana` to see the admin grafana dashboard
* open `localhost:8888` to see influxdb admin panel

* `npm run dev:down` to stop all docker containers