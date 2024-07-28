const { isBrowser } = require("../configs");

function getGlobalseoApiDebounce() {
  if (!isBrowser()) return null;
  if (!window.globalseoApiDebounce) {
    setGlobalseoApiDebounce(null);
  }
  return window.globalseoApiDebounce;
}

function setGlobalseoApiDebounce(value) {
  if (!isBrowser()) return null;
  window.globalseoApiDebounce = value;
}

const apiDebounce = (mainFunction, delay = 2000) => {
  if (!isBrowser()) return mainFunction();

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(getGlobalseoApiDebounce());

    // Set a new timer that will execute 'mainFunction' after the specified delay
    setGlobalseoApiDebounce(setTimeout(() => {
      mainFunction(...args);
    }, delay));
  };
};

module.exports = {
  apiDebounce,
  getGlobalseoApiDebounce,
  setGlobalseoApiDebounce
}
