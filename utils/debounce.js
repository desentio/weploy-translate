const { isBrowser } = require("./configs");

function getGlobalseoTimer(window) {
  // if (!isBrowser()) return null;
  if (!window.globalseoTimer) {
    setGlobalseoTimer(window, null);
  }
  return window.globalseoTimer;
}

function setGlobalseoTimer(window, value) {
  window.globalseoTimer = value;
}

const debounce = (window, mainFunction, delay = 2000) => {
  if (!isBrowser()) return mainFunction();

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(getGlobalseoTimer(window));

    // Set a new timer that will execute 'mainFunction' after the specified delay
    setGlobalseoTimer(window, setTimeout(() => {
      mainFunction(...args);
    }, delay));
  };
};

module.exports = {
  debounce,
  getGlobalseoTimer,
  setGlobalseoTimer
}
