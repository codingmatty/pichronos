const express = require('express');
const db = require('./db');
const { CONFIG_CHANGED } = require('../common/socket-events.json');

function registerApiRoutes(io) {
  const router = new express.Router();

  router.use(express.json());

  router.get('/ping', (req, res) => res.send('pong'));

  router.get('/hash', (req, res) => {
    const hash = db.getHash();
    res.send({ hash });
  });

  router.get('/theme', (req, res) => {
    const theme = db.getTheme();
    res.send({ theme });
  });

  router.post('/theme', (req, res) => {
    db.updateTheme(req.body.theme);

    // Push config through socket
    const config = db.getConfig();
    io.emit(CONFIG_CHANGED, config);

    res.status(200).end();
  });

  return router;
}

module.exports = registerApiRoutes;