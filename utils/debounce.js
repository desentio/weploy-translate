const { isBrowser } = require("./configs");

function getWeployTimer() {
  if (!isBrowser()) return null;
  if (!window.weployTimer) {
    setWeployTimer(null);
  }
  return window.weployTimer;
}

function setWeployTimer(value) {
  if (!isBrowser()) return null;
  window.weployTimer = value;
}

const debounce = (mainFunction, delay = 2000) => {
  if (!isBrowser()) return mainFunction();

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(getWeployTimer());

    // Set a new timer that will execute 'mainFunction' after the specified delay
    setWeployTimer(setTimeout(() => {
      mainFunction(...args);
    }, delay));
  };
};

module.exports = {
  debounce,
  getWeployTimer,
  setWeployTimer
}
