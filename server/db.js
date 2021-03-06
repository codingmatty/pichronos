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

const defaultConfig = {
  brightness: 255,
  theme: { backgroundColor: 'black', color: 'white' }
};

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

// Mutators:
exports.updateBrightness = (brightness) => {
  updateConfig({ brightness });
};
exports.updateTheme = (theme) => {
  updateConfig({ theme });
};

// Getters:
exports.getConfig = () => {
  return db.get('config').value();
};
exports.getBrightness = () => {
  return db.get('config.brightness').value();
};
exports.getTheme = () => {
  return db.get('config.theme').value();
};
exports.getHash = () => {
  return db.get('hash').value();
};
