const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  var weployScriptTag = document.currentScript;
  document.addEventListener("DOMContentLoaded", function() {
    const apiKey = weployScriptTag.getAttribute("data-weploy-key");
    const disableAutoTranslateAttr = weployScriptTag.getAttribute("data-disable-auto-translate")
    const disableAutoTranslate = disableAutoTranslateAttr == "true";
    getTranslations(apiKey, {disableAutoTranslate});
    createLanguageSelect(apiKey);
  });
}
