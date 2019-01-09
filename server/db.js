const path = require('path');
const low = require('lowdb');
const merge = require('lodash/merge');
const hash = require('object-hash');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, '..', 'db.json'));
const db = low(adapter);

const defaultConfig = { theme: { backgroundColor: 'black', color: 'white' } };

db.defaults({
  config: defaultConfig,
  hash: hash(defaultConfig)
}).write();

function updateConfig(partialConfig) {
  const currentConfig = db.get('config').value();
  console.log('currentConfig: ', currentConfig);
  const updatedConfig = merge(currentConfig, partialConfig);
  console.log('updatedConfig: ', updatedConfig);
  db.set('config', updatedConfig).write();
  db.set('hash', hash(updatedConfig)).write();
}

function updateTheme(theme) {
  updateConfig({ theme });
}

function getTheme() {
  return db.get('config.theme').value();
}

module.exports = {
  getTheme,
  updateTheme
};
