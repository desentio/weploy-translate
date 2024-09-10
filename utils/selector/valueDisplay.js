function getValueDisplays(window) {
  if (!window.valueDisplays) {
    setValueDisplays(window, []);
  }
  return window.valueDisplays;
}

function setValueDisplays(window, value = []) {
  window.valueDisplays = value;
}

module.exports = {
  getValueDisplays,
  setValueDisplays
}
