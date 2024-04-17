const { getTranslations, isBrowser, createLanguageSelect, setOptions } = require("./index.js");

if (isBrowser) {
  window.weployScriptTag = document.currentScript;

  // get options
  const apiKey = window.weployScriptTag.getAttribute("data-weploy-key");

  // defined languages so dont need extra fetch
  const originalLangAttr = window.weployScriptTag.getAttribute("data-original-language");
  const originalLang = (originalLangAttr || "").trim().toLowerCase();
  const allowedLangAttr = window.weployScriptTag.getAttribute("data-allowed-languages");
  const allowedLangs = (allowedLangAttr || "").trim().toLowerCase().split(",").filter(lang => !!lang).map(lang => lang.trim());

  // this is backward compatibility for use browser language
  const disableAutoTranslateAttr = window.weployScriptTag.getAttribute("data-disable-auto-translate");
  const disableAutoTranslate = disableAutoTranslateAttr == "true";
  const useBrowserLanguageAttr = window.weployScriptTag.getAttribute("data-use-browser-language");
  const useBrowserLanguage = useBrowserLanguageAttr != "false" && useBrowserLanguageAttr != false;

  // exclude classes
  const excludeClassesAttr = (window.weployScriptTag.getAttribute("data-exclude-classes") || "").trim()
  const excludeClassesByComma = excludeClassesAttr.split(",").filter(className => !!className).map(className => className.trim());
  const excludeClassesBySpace = excludeClassesAttr.split(" ").filter(className => !!className).map(className => className.trim().replaceAll(",", ""));
  const mergedExcludeClasses = [...excludeClassesByComma, ...excludeClassesBySpace];
  const excludeClasses = [...new Set(mergedExcludeClasses)]; // get unique values

  // timeout
  const timeoutAttr = window.weployScriptTag.getAttribute("data-timeout");
  const timeout = isNaN(Number(timeoutAttr)) ? 0 : Number(timeoutAttr);

  const createSelector = window.weployScriptTag.getAttribute("data-auto-create-selector") != "false";

  const options = {
    useBrowserLanguage: !disableAutoTranslate && useBrowserLanguage,
    createSelector: createSelector,
    excludeClasses,
    originalLanguage: originalLang,
    allowedLanguages: allowedLangs,
    timeout: timeout
  }

  // create language selector first
  // if (createSelector) {
  //   setOptions(apiKey, options);
  //   createLanguageSelect(apiKey, { isInit : true });
  // }

  document.addEventListener("DOMContentLoaded", function() {
    getTranslations(apiKey, options)
  });
}
