# how to start developing

## only frontend

* `npm install`
* `npm start`

* cloud backend will be used

## with local backend

* create a file named `.env` with the following content

```env
MONGO_URL=mongodb://mongo:27017
JWT_SECRET=jwtsecret
CIPHER_SECRET=ciphersecret <-- needs to be a 32-byte key
SOCKET_ENDPOINT=ws://localhost:4005
CONFIG_ENDPOINT=http://localhost:4002
AUTH_ENDPOINT=http://localhost:4001
```

* create a folder named `./dev/mongo`
* `docker-compose up mongo` - wait for it to start
* If this is the first time running this mongo db, run `docker-compose up actions`
* `docker-compose up auth config socket`
  * your local files will be mounted inside the docker images
  * file watch and auto restart on changes is enabled
* `npm run start:local`

[click here](https://cryptography.io/en/latest/fernet/) to learn how to generate a 32-byte key.

### installing new packages

* insert dependency into `package.json` or `requirements.txt`
* run `docker-compose build <service>`
  * services are `socket`, `auth` or `config`
* stop the service `docker-compose stop <service>`
* start the service `docker-compose up <service>`
