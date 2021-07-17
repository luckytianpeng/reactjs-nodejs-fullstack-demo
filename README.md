# reactjs-nodejs-fullstack-demo
A demonstration of full stack development using ract.js and node.js. Seems like a simple Google Drive.
  
  
## Online Demonstration

The temporary demo URLs - [https://149.28.173.176](https://149.28.173.176).(A vultr cloud computer: 1 CPU, 1GB RAM)  
Email: test@test.com  
Password: test  

You may run into the NET::ERR_CERT_AUTHORITY_INVALID error because of my self-signed certificate. Accept it, please.  


https://user-images.githubusercontent.com/6571028/126020805-5c77a56f-c1f0-49b8-bdde-3dfb04f80499.mp4
  
  
## Introduction
### Requirements
- Web: adapt to any device
- Resposive design: desktop, tablet and phone
- Authentication
- Multi-Language Support
### Tech Stack
- Node.js
- React
- MongoDB (SQL vs NoSQL - the natural shape of your dataset)
### Design
- prototyping:  

  mobile view:  
  ![mobile view](https://user-images.githubusercontent.com/6571028/126050478-b8e51937-a6a2-494f-a5c5-57a9d7d05222.png)
  
  pc view:  
  ![pc view](https://user-images.githubusercontent.com/6571028/126050481-3cc41334-0303-4c7d-b5dc-2406a2fa099f.png)

- [Materal Design](https://material.io/)
- API - OpenAPI 3:
  Swagger:  
  ![enb-v0 _ 0 0 0 _](https://user-images.githubusercontent.com/6571028/126050520-db51f75f-5324-4cc2-ba9f-6df57d0d89d3.png)
  Postman:  
  ![postman](https://user-images.githubusercontent.com/6571028/126050526-a31eb84c-0fd9-4029-be4d-51ad18c066d0.png) 

- Development
  + Frontend: React, MobX, Material-UI ...
  + Backend: Node.js, Express.js ...

- Testing
  + React Testing Library
  + Cypress

- Deployment
  + Debian
  + Nginx

- Maintenance
  + PM2:  
    ![postman](https://user-images.githubusercontent.com/6571028/126050760-63bdf7f3-45ba-4d26-8c75-91180d065b2c.png)
  
  
## Usage

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

Enjoy it!
