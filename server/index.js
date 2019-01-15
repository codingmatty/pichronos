require('isomorphic-fetch');

const express = require('express');
const http = require('http');
const next = require('next');
const path = require('path');
const socketIO = require('socket.io');
const { parse } = require('url');
const registerApiRoutes = require('./router');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '..') });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const port = process.env.PORT || 8080;
    const handler = express();
    const server = http.createServer(handler);
    const io = socketIO(server);

    handler.use('/api', registerApiRoutes(io));
    handler.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
