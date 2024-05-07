const detectRobot = require("./detectRobot")

// check if code runs on server or client
const isBrowser = () => typeof window !== 'undefined'
const API_URL = "https://api.weploy.ai"
const CDN_URL = ""
const KV_URL = "https://cdn.weploy.ai"
const SHOULD_COMPRESS_PAYLOAD = true

/** Translation Options */
var weployOptions;

function getWeployOptions() {
  if (isBrowser()) {
    if (!window.weployOptions) {
      setWeployOptions({})
    }

    const userAgent = window.navigator.userAgent;
    const isRobot = detectRobot(userAgent);

    if (isRobot) {
      setWeployOptions({
        useBrowserLanguage: false,
        isRobot: true
      })
      return window.weployOptions;
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
      ...value,
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
  CDN_URL,
  KV_URL,
  SHOULD_COMPRESS_PAYLOAD,
  weployOptions
}
