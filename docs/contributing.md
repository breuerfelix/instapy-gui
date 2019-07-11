# how to start developing

## only frontend

* `npm install`
* `npm start`

* cloud backend will be used

## with local backend

* create a folder named `./dev/mongo`
* create a file named `.env`

```env
MONGO_URL=mongodb://mongo:27017
JWT_SECRET=jwtsecret
CIPHER_SECRET=ciphersecret
SOCKET_ENDPOINT=ws://localhost:4005
CONFIG_ENDPOINT=http://localhost:4002
AUTH_ENDPOINT=http://localhost:4001
```

* `docker-compose up mongo` - wait for it to start
* `docker-compose up auth config socket`
* `npm run start:local`
