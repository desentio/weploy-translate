const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  window.weployScriptTag = document.currentScript;
  document.addEventListener("DOMContentLoaded", function() {
    const apiKey = window.weployScriptTag.getAttribute("data-weploy-key");
    const disableAutoTranslateAttr = window.weployScriptTag.getAttribute("data-disable-auto-translate")
    const disableAutoTranslate = disableAutoTranslateAttr == "true";
    const createSelector = window.weployScriptTag.getAttribute("data-auto-create-selector") != "false";
    getTranslations(apiKey, {disableAutoTranslate, createSelector: createSelector})
  });
}
