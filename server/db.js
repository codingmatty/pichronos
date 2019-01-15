const path = require('path');
const low = require('lowdb');
const merge = require('lodash/merge');
const hash = require('object-hash');
const FileSync = require('lowdb/adapters/FileSync');

const dbFilePath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(dbFilePath);
const db = low(adapter);

const defaultConfig = { theme: { backgroundColor: 'black', color: 'white' } };

db.defaults({
  config: defaultConfig,
  hash: hash(defaultConfig)
}).write();

function updateConfig(partialConfig) {
  const currentConfig = db.get('config').value();
  const updatedConfig = merge(currentConfig, partialConfig);
  db.set('config', updatedConfig).write();
  db.set('hash', hash(updatedConfig)).write();
}

exports.updateTheme = (theme) => {
  updateConfig({ theme });
};

exports.getConfig = () => {
  return db.get('config').value();
};

exports.getTheme = () => {
  return db.get('config.theme').value();
};

exports.getHash = () => {
  return db.get('hash').value();
};
