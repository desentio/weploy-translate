const detectRobot = require("./detectRobot")

// check if code runs on server or client
const isBrowser = () => typeof window !== 'undefined'
const API_URL = process.env.NO_CACHE ? "http://localhost:8081" : "https://api.globalseo.ai";
const CDN_URL = "";
const KV_URL = "https://cdn.globalseo.ai";
const USE_MERGE = false;
const CONTEXT_LIMIT = 3;
const MAX_WORDS_LENGTH_FOR_CONTEXT = 3;
const OLD_EXCLUDE_CLASS = "weploy-exclude";
const DEFAULT_UNTRANSLATED_VALUE = "weploy-untranslated";
const MERGE_PREFIX = "weploy-merge";
const BRAND  = process.env.BRAND || "globalseo";
const PREV_SCRIPT_VERSION = process.env.PREV_SCRIPT_VERSION || "0.0.0";
const SPECIAL_API_KEYS = ["cb20c25d-2d15-46ab-aac2-de5aa6b0aeda"]

/** Translation Options */
var globalseoOptions;

function getGlobalseoOptions() {
  if (isBrowser()) {
    if (!window.globalseoOptions) {
      setGlobalseoOptions({})
    }

    const userAgent = window.navigator.userAgent;
    const isRobot = detectRobot(userAgent);

    if (isRobot) {
      setGlobalseoOptions({
        useBrowserLanguage: false,
        isRobot: true
      })
      return window.globalseoOptions;
    }

    return window.globalseoOptions;
  } else {
    if (!globalseoOptions) {
      setGlobalseoOptions({})
    }
    return globalseoOptions;
  }
}

function setGlobalseoOptions(value = {}) {
  if (isBrowser()) {
    window.globalseoOptions = {
      ...(window.globalseoOptions || {}),
      ...value,
    };
    
  } else {
    globalseoOptions = {
      ...(globalseoOptions || {}),
      ...value
    };
  }
}

/** Active Language */
var globalseoActiveLang;

function getGlobalseoActiveLang() {
  if (isBrowser()){
    if (window.paramsLang) {
      return window.paramsLang;
    } 
    if (!window.globalseoActiveLang) {
      setGlobalseoActiveLang(null)
    }
    return window.globalseoActiveLang;
  } else {
    if (!globalseoActiveLang) {
      setGlobalseoActiveLang(null)
    }
    return globalseoActiveLang;
  }
}

function setGlobalseoActiveLang(language) {
  if (isBrowser()) {
    window.globalseoActiveLang = language
  } else {
    globalseoActiveLang = language
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
    const options = getGlobalseoOptions();
    const shouldtranslateSplittedText = options?.translateSplittedText || USE_MERGE;
    return shouldtranslateSplittedText;
  } else {
    return false;
  }
}

module.exports = {
  isBrowser,
  getGlobalseoOptions,
  setGlobalseoOptions,
  getGlobalseoActiveLang,
  setGlobalseoActiveLang,
  getIsTranslationInitialized,
  setIsTranslationInitialized,
  shouldTranslateInlineText,
  API_URL,
  CDN_URL,
  KV_URL,
  USE_MERGE,
  CONTEXT_LIMIT,
  MAX_WORDS_LENGTH_FOR_CONTEXT,
  globalseoOptions,
  OLD_EXCLUDE_CLASS,
  DEFAULT_UNTRANSLATED_VALUE,
  MERGE_PREFIX,
  BRAND,
  PREV_SCRIPT_VERSION,
  SPECIAL_API_KEYS
}
