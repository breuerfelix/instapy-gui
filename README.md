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

## backend

* `cd services`
* `pip3 install -r req_config.txt`
* `pip3 install -r req_instapy.txt`
* run `python3 get_actions.py`
* run `python3 config_service.py`
* open another terminal tab
* `cd services/service_socket`
* run `npm install`
* run `node index.js`

## frontend

* `npm start`
* open `localhost:8080`
