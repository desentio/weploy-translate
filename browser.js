const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  const scriptTag = document.currentScript;
  const apiKey = scriptTag.getAttribute("data-weploy-key");
  getTranslations(apiKey);
  createLanguageSelect(apiKey);
}
