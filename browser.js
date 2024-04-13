const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  window.weployScriptTag = document.currentScript;
  // add loading selector placeholder here


  document.addEventListener("DOMContentLoaded", function() {
    const apiKey = window.weployScriptTag.getAttribute("data-weploy-key");
    
    const disableAutoTranslateAttr = window.weployScriptTag.getAttribute("data-disable-auto-translate");
    const disableAutoTranslate = disableAutoTranslateAttr == "true";

    const useBrowserLanguageAttr = window.weployScriptTag.getAttribute("data-use-browser-language");
    const useBrowserLanguage = useBrowserLanguageAttr != "false" && useBrowserLanguageAttr != false;

    const originalLangAttr = window.weployScriptTag.getAttribute("data-original-language");
    const originalLang = (originalLangAttr || "").trim().toLowerCase();

    const allowedLangAttr = window.weployScriptTag.getAttribute("data-allowed-languages");
    const allowedLangs = (allowedLangAttr || "").trim().toLowerCase().split(",").filter(lang => !!lang);

    const createSelector = window.weployScriptTag.getAttribute("data-auto-create-selector") != "false";
    const excludeClasses = (window.weployScriptTag.getAttribute("data-exclude-classes") || "").trim().split(" ");

    const timeoutAttr = window.weployScriptTag.getAttribute("data-timeout");
    const timeout = isNaN(Number(timeoutAttr)) ? 0 : Number(timeoutAttr);

    getTranslations(apiKey, {
      useBrowserLanguage: !disableAutoTranslate && useBrowserLanguage,
      createSelector: createSelector,
      excludeClasses,
      originalLanguage: originalLang,
      allowedLanguages: allowedLangs,
      timeout: timeout
    })
  });
}
