const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

db.defaults({
  config: { theme: { backgroundColor: 'black', color: 'white' } }
}).write();

function getTheme() {
  return db.get('config.theme').value();
}

function updateTheme(theme) {
  const dbTheme = getTheme();
  db.set('config.theme', { ...dbTheme, ...theme }).write();
}

module.exports = {
  getTheme,
  updateTheme
};
