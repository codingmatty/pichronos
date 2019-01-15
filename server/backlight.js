let backlight = {
  setBrightness: () => {},
  getMaxBrightness: () => 255
};

try {
  backlight = require('rpi-backlight');
  const db = require('./db');
  const brightness = db.getBrightness();
  backlight.setBrightness(brightness);
} catch (e) {
  (() => {})();
}

module.exports = backlight;
