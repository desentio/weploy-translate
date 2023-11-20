const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  document.addEventListener("DOMContentLoaded", function() {
    const scriptTag = document.currentScript;
    const apiKey = scriptTag.getAttribute("data-weploy-key");
    const disableAutoTranslateAttr = scriptTag.getAttribute("data-disable-auto-translate")
    const disableAutoTranslate = disableAutoTranslateAttr == "true";
    getTranslations(apiKey, {disableAutoTranslate});
    createLanguageSelect(apiKey);
  });
}
