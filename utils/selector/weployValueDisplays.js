const { isBrowser } = require("../configs");

function getWeployValueDisplays() {
  if (!isBrowser()) return [];
  if (!window.weployValueDisplays) {
    setWeployValueDisplays([]);
  }
  return window.weployValueDisplays;
}

function setWeployValueDisplays(value = []) {
  if (!isBrowser()) return;
  window.weployValueDisplays = value;
}

module.exports = {
  getWeployValueDisplays,
  setWeployValueDisplays
}
