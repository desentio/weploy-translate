const { setGlobalseoOptions } = require("../configs");
const languagesList = require("../languages/languageList");

function getDefinedLanguages(originalLanguage, allowedLanguages = []) {
  if (originalLanguage && allowedLanguages && allowedLanguages.length) {
    const originalLang = languagesList.find(lang => lang.lang == originalLanguage);
    const allowedLangs = languagesList.filter(lang => allowedLanguages.includes(lang.lang));
    const langOptions= [originalLang, ...allowedLangs]

    if (originalLang) {
      return langOptions
    }
  }
}

function setOptions(window, apiKey, optsArgs) {
  const mappedOpts = {
    ...optsArgs,
    timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
    pathOptions: optsArgs.pathOptions || {},
    apiKey,
    excludeIds: optsArgs.excludeIds || [],
    excludeClasses: optsArgs.excludeClasses || [],
    excludeContents: optsArgs.excludeContents || [],
    definedLanguages: getDefinedLanguages(optsArgs.originalLanguage, optsArgs.allowedLanguages),
  }

  setGlobalseoOptions(window, mappedOpts)
}

module.exports = setOptions;
