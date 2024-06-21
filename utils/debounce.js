const { isBrowser } = require("./configs");

function getGlobalseoTimer() {
  if (!isBrowser()) return null;
  if (!window.globalseoTimer) {
    setGlobalseoTimer(null);
  }
  return window.globalseoTimer;
}

function setGlobalseoTimer(value) {
  if (!isBrowser()) return null;
  window.globalseoTimer = value;
}

const debounce = (mainFunction, delay = 2000) => {
  if (!isBrowser()) return mainFunction();

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(getGlobalseoTimer());

    // Set a new timer that will execute 'mainFunction' after the specified delay
    setGlobalseoTimer(setTimeout(() => {
      mainFunction(...args);
    }, delay));
  };
};

module.exports = {
  debounce,
  getGlobalseoTimer,
  setGlobalseoTimer
}
