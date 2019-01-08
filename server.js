require('isomorphic-fetch');

const express = require('express');
const next = require('next');
const path = require('path');
const bodyParser = require('body-parser');
const { parse } = require('url');
const db = require('./db');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use('/api', registerRoutes());

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    const port = process.env.PORT || 8080;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

function registerRoutes() {
  const router = new express.Router();

  router.use(bodyParser.json());

  router.get('/ping', (req, res) => res.send('pong'));

  router.get('/theme', (req, res) => {
    const theme = db.getTheme();
    res.send({ theme });
  });
  router.post('/theme', (req, res) => {
    db.updateTheme(req.body.theme);
    res.status(200).end();
  });

  return router;
}
