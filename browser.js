const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  window.weployScriptTag = document.currentScript;
  document.addEventListener("DOMContentLoaded", function() {
    const apiKey = window.weployScriptTag.getAttribute("data-weploy-key");
    
    const disableAutoTranslateAttr = window.weployScriptTag.getAttribute("data-disable-auto-translate");
    const disableAutoTranslate = disableAutoTranslateAttr == "true";

    const useBrowserLanguageAttr = window.weployScriptTag.getAttribute("data-use-browser-language");
    const useBrowserLanguage = useBrowserLanguageAttr != "false" && useBrowserLanguageAttr != false;

    const createSelector = window.weployScriptTag.getAttribute("data-auto-create-selector") != "false";
    const excludeClasses = (window.weployScriptTag.getAttribute("data-exclude-classes") || "").trim().split(" ");
    getTranslations(apiKey, {useBrowserLanguage: !disableAutoTranslate && useBrowserLanguage, createSelector: createSelector, excludeClasses})
  });
}
