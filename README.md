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

## develop frontend

* `docker-compose up -d`
* `npm start`
* open `localhost:8080`

the frontend will connect to your docker backend.

## develop backend

* run `docker-compose up -d` to start all services
* once you changed one service run
	* run `docker-compose build <service-name>`
	* service names: config, socket, webserver, instapy, grafana
	* instapy service takes long time to build, avoid rebuilding this one
* run `docker-compose up -d` which will reload all new built containers
* test your changes !
