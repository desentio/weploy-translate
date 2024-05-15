const { getWeployOptions, setWeployActiveLang, getIsTranslationInitialized } = require("../configs");
const { fetchLanguageList } = require("./fetchLanguageList");

//@deprecated
function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const paramsLang = params.get('lang');
    const localStorageLang = localStorage.getItem("language");

    if (paramsLang && (paramsLang != localStorageLang)) {
      localStorage.setItem("language", paramsLang);
      setWeployActiveLang(paramsLang);
    }
    
    let language = paramsLang || localStorageLang;
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

async function getLanguageFromLocalStorage() {
  const optsArgs = getWeployOptions()
  const apiKey = optsArgs.apiKey

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get('lang');
  const localStorageLang = localStorage.getItem("language");

  if (paramsLang && (paramsLang != localStorageLang)) {
    if (!getIsTranslationInitialized()) localStorage.setItem("language", paramsLang);
    setWeployActiveLang(paramsLang);
    return paramsLang;
  }

  const availableLangs = await fetchLanguageList(apiKey);
  let language = paramsLang || localStorageLang;

  if (!availableLangs.find(l => l.lang == language)) {
    saveDefaultLanguageToLocalStorage(availableLangs, optsArgs.useBrowserLanguage);
  } else {
    setWeployActiveLang(language);
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
  setWeployActiveLang(langToSave);
}

module.exports = {
  getSelectedLanguage,
  getLanguageFromLocalStorage,
  saveDefaultLanguageToLocalStorage
}
