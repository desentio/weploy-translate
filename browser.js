const { getTranslations, isBrowser } = require("./index.js");

if (isBrowser()) {
  window.weployScriptTag = document.currentScript;

  const translationCache = window.localStorage.getItem("translationCachePerPage");
  try {
    const parsedTranslationCache = JSON.parse(translationCache);
    if (parsedTranslationCache && typeof parsedTranslationCache === "object") {
      window.translationCache = parsedTranslationCache;
    }
  } catch (e) {
    console.log("Error parsing translation cache", e)
  }

  const customLanguageCodeAttr = window.weployScriptTag.getAttribute("data-custom-language-code"); // format is "kk=kz, en=us, ru=rs"
  const customLanguageCode = customLanguageCodeAttr ? customLanguageCodeAttr.split(",").reduce((acc, lang) => {
    const [key, value] = lang.trim().split("=");
    if (!key || !value) return acc;

    acc[key] = value;
    return acc;
  }, {}) : {};

  // get options
  const apiKey = window.weployScriptTag.getAttribute("data-weploy-key");

  // defined languages so dont need extra fetch
  const originalLangAttr = window.weployScriptTag.getAttribute("data-original-language") || window.weployScriptTag.getAttribute("data-original-lanugage");
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
    timeout: timeout,
    customLanguageCode
  }

  document.addEventListener("DOMContentLoaded", function() {
    getTranslations(apiKey, options)
  });
}
