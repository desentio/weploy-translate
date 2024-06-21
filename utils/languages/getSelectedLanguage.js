const { getGlobalseoOptions, setGlobalseoActiveLang, getIsTranslationInitialized } = require("../configs");
const { fetchLanguageList } = require("./fetchLanguageList");

async function getLanguageFromLocalStorage() {
  const optsArgs = getGlobalseoOptions()
  const apiKey = optsArgs.apiKey

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get(optsArgs.langParam || 'lang');
  const localStorageLang = localStorage.getItem("language");

  if (paramsLang && (paramsLang != localStorageLang)) {
    if (!getIsTranslationInitialized()) localStorage.setItem("language", paramsLang);
    setGlobalseoActiveLang(paramsLang);
    return paramsLang;
  }

  const availableLangs = await fetchLanguageList(apiKey);
  let language = paramsLang || localStorageLang;

  if (!availableLangs.find(l => l.lang == language)) {
    saveDefaultLanguageToLocalStorage(availableLangs, optsArgs.useBrowserLanguage);
  } else {
    setGlobalseoActiveLang(language);
  }

  return language; // Get the language from local storage
}

// this only for the first time when the user visits the site and the language is not set
function saveDefaultLanguageToLocalStorage(availableLangs = [], useBrowserLang = true) {
  const language = window.navigator.language; // Get browser language (usually in this format: en-US)
  const langIsoCode = language && language.length >= 2 ? language.substring(0, 2) : null // Get the language ISO code
  const langInAvailableLangs = availableLangs.find(lang => lang.lang == langIsoCode) //  Check if the language is in the available languages

  // if no available languages, return
  if (!availableLangs.length) {
    return;
  }

  const langInAvailableLangsOrFirst = langInAvailableLangs?.lang || availableLangs[0].lang // If the language is not in the available languages, use the first available language
  const langToSave = useBrowserLang ? langInAvailableLangsOrFirst : availableLangs[0].lang // If useBrowserLang is true, use the language from the browser, otherwise use the first available language
  // Save the language to local storage
  if (!getIsTranslationInitialized()) localStorage.setItem("language", langToSave);
  setGlobalseoActiveLang(langToSave);
}

module.exports = {
  getLanguageFromLocalStorage,
  saveDefaultLanguageToLocalStorage
}
