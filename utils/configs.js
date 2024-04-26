// check if code runs on server or client
const isBrowser = () => typeof window !== 'undefined'
const API_URL = "https://api.tasksource.io"

/** Translation Options */
var weployOptions;

function getWeployOptions() {
  if (isBrowser()) {
    if (!window.weployOptions) {
      setWeployOptions({})
    }
    return window.weployOptions;
  } else {
    if (!weployOptions) {
      setWeployOptions({})
    }
    return weployOptions;
  }
}

function setWeployOptions(value = {}) {
  if (isBrowser()) {
    window.weployOptions = {
      ...(window.weployOptions || {}),
      ...value
    };
  } else {
    weployOptions = {
      ...(weployOptions || {}),
      ...value
    };
  }
}

/** Active Language */
var weployActiveLang;

function getWeployActiveLang() {
  if (isBrowser()){ 
    if (!window.weployActiveLang) {
      setWeployActiveLang(null)
    }
    return window.weployActiveLang;
  } else {
    if (!weployActiveLang) {
      setWeployActiveLang(null)
    }
    return weployActiveLang;
  }
}

function setWeployActiveLang(language) {
  if (isBrowser()) {
    window.weployActiveLang = language
  } else {
    weployActiveLang = language
  }
}

module.exports = {
  isBrowser,
  getWeployOptions,
  setWeployOptions,
  getWeployActiveLang,
  setWeployActiveLang,
  API_URL,
  weployOptions
}
