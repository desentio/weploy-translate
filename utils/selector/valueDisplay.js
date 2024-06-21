const { isBrowser } = require("../configs");

function getValueDisplays() {
  if (!isBrowser()) return [];
  if (!window.valueDisplays) {
    setValueDisplays([]);
  }
  return window.valueDisplays;
}

function setValueDisplays(value = []) {
  if (!isBrowser()) return;
  window.valueDisplays = value;
}

module.exports = {
  getValueDisplays,
  setValueDisplays
}
