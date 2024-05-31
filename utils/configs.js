const detectRobot = require("./detectRobot")

// check if code runs on server or client
const isBrowser = () => typeof window !== 'undefined'
const API_URL = process.env.NO_CACHE ? "http://localhost:8081" : "https://api.weploy.ai";
const CDN_URL = "";
const KV_URL = "https://cdn.weploy.ai";
const USE_WEPLOY_MERGE = false;

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

/** Is Translation Initialized */
var isTranslationInitialized;

function getIsTranslationInitialized() {
  if (isBrowser()){ 
    if (!window.isTranslationInitialized) {
      setIsTranslationInitialized(null)
    }
    return window.isTranslationInitialized;
  } else {
    if (!isTranslationInitialized) {
      setIsTranslationInitialized(null)
    }
    return isTranslationInitialized;
  }
}

function setIsTranslationInitialized(value) {
  if (isBrowser()) {
    window.isTranslationInitialized = value
  } else {
    isTranslationInitialized = value
  }
}

function shouldTranslateInlineText() {
  if (isBrowser()) {
    const options = getWeployOptions();
    const shouldtranslateSplittedText = options?.translateSplittedText || USE_WEPLOY_MERGE;
    return shouldtranslateSplittedText;
  } else {
    return false;
  }
}

module.exports = {
  isBrowser,
  getWeployOptions,
  setWeployOptions,
  getWeployActiveLang,
  setWeployActiveLang,
  getIsTranslationInitialized,
  setIsTranslationInitialized,
  shouldTranslateInlineText,
  API_URL,
  CDN_URL,
  KV_URL,
  USE_WEPLOY_MERGE,
  weployOptions
}
