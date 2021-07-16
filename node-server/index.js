const express = require('express')
const fs = require('fs')
const https = require('https')
const app = express()
const port = 443

app.get('/', (req, res) => {
  res.send('Hello World!')
})

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
