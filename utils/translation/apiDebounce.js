const { isBrowser } = require("../configs");

function getGlobalseoApiDebounce(window) {
  if (!window.globalseoApiDebounce) {
    setGlobalseoApiDebounce(window, null);
  }
  return window.globalseoApiDebounce;
}

function setGlobalseoApiDebounce(window, value) {
  window.globalseoApiDebounce = value;
}

const apiDebounce = (window, mainFunction, delay = 2000) => {
  if (!isBrowser()) return mainFunction();

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(getGlobalseoApiDebounce(window));

    // Set a new timer that will execute 'mainFunction' after the specified delay
    setGlobalseoApiDebounce(window, setTimeout(() => {
      mainFunction(...args);
    }, delay));
  };
};

module.exports = {
  apiDebounce,
  getGlobalseoApiDebounce,
  setGlobalseoApiDebounce
}
