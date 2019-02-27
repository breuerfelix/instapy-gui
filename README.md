# instapy-gui

# start

* `docker-compose -d up` in current directory
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

# docker

* `docker-compose -d up` in current directory
* open `http://localhost` to view the gui
