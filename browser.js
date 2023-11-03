const { getTranslations, isBrowser, createLanguageSelect } = require("./index.js");

if (isBrowser) {
  const scriptTag = document.currentScript;
  const apiKey = scriptTag.getAttribute("data-weploy-key");
  const useBaseLangAttr = scriptTag.getAttribute("data-weploy-usebaselang")
  const useBaseLang = useBaseLangAttr == "true";
  getTranslations(apiKey, {useBaseLang});
  createLanguageSelect(apiKey);
}
