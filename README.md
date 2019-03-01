# instapy-gui

# start

## requirements

* install [docker](https://www.docker.com/get-started)
* install [docker-compose](https://docs.docker.com/compose/install)

## run instapy-gui

* download [docker-compose file](https://github.com/breuerfelix/instapy-gui/blob/master/docker-compose.yml) from this repository
* navigate in your console to the downloaded file
* run `docker-compose -d up`
* open `http://localhost` to view the gui

__note__:  change environment varibales in `docker-compose.yml` if needed

# how to start developing

* `npm install`
* `npm run dev` to start all containers
	* all files from the repository will be mounted
	* live reloading inside containers is activated
	* you can start editing files and see the results instantly
* `npm start`
* open `localhost:8080` to see live reloading website which connects to docker backend
* open `localhost/grafana` to see the admin grafana dashboard
* open `localhost:8888` to see influxdb admin panel

* `docker-compose down` to stop all docker containers

