# reactjs-nodejs-fullstack-demo
A demonstration of full stack development using ract.js and node.js

## Online Demonstration

The temporary URLs - [https://149.28.173.176](https://149.28.173.176) .

I generated a self-signed SSl Certificate, so you  may run into the ERR_CERT_AUTHORITY_INVALID. Accept it, please.



## Development

### MongoDB

Import data:

```bash
mongoimport --db development_db --collection users --file node-server/users.json --jsonArray
```



### Environment Variables

Refer to node-server/config/custom-environment-variables.json:

```json
{
  "session": {
    "secret": "NODE_CONFIG_SESSION_SECRET"
  },
  "db": {
    "uri": "NODE_CONFIG_DB_URI"
  },
  "email": {
    "service": "NODE_CONFIG_EMAIL_SERVICE",
    "auth": {
      "user": "NODE_CONFIG_EMAIL_AUTH_USER",
      "pass": "NODE_CONFIG_EMAIL_AUTH_PASS"
    }
  }
}

```

For example:

```bash
export NODE_CONFIG_SESSION_SECRET="do not in code"
export NODE_CONFIG_DB_URI=mongodb://127.0.0.1/development_db
```



### SSL Certificates

node-server/server.cert and node-server/server.key could be replaced with your own SSl Certificates.



### Configuration

Modify the domain or IP address of node-server. For example, if your node-server is working on https://149.28.173.176:8443, and your react is working on https://149.28.173.176. Then:

node-server/config/default.json:

```json
{
  ...
  "server": {
    "domain": "https://192.168.1.18:8443/",
  ...
}

```

material-ui/src/config/domains.js:

```javascript
const domains = {
  api: 'https://192.168.1.18:8443/v0/',
};
```

testing/cypress.json:

```
{
  ...
  "baseUrl": "https://149.28.173.176",
  ...
}
```



### Start Up

node-server:

```bash
node-server$ node ./bin/www
```

material-ui:

```bash
material-ui$ npm start
```

testing:

```bash
testing$ npm run cypress:run

testing$ npm run cypress:open
```

