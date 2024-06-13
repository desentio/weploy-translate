const { getTranslations, isBrowser } = require("./index.js");

const excludeContentsRegex = /{{((?:[^}]|\\})*)}}/g;
function getTextInsideBrackets(str) {
  let match;
  let matches = [];

  while ((match = excludeContentsRegex.exec(str)) !== null) {
      // Replace escaped closing brackets with a single closing bracket
      let cleanedMatch = match[1].replace(/\\\\}/g, '}');
      cleanedMatch = cleanedMatch.replace(/\\\\{/g, '{');

      matches.push(cleanedMatch);
  }

  return matches;
}

if (isBrowser()) {
  window.weployScriptTag = document.currentScript;

  // REQUIRED ATTRIBUTES
  const DATA_WEPLOY_KEY = "data-weploy-key";
  const DATA_ORIGINAL_LANG = "data-original-language";
  const DATA_ALLOWED_LANGUAGES = "data-allowed-languages";

  // COMMON OPTIONAL ATTRIBUTES
  const DATA_USE_BROWSER_LANG = "data-use-browser-language"; // default: true
  const DATA_EXCLUDE_CLASSES = "data-exclude-classes";
  const DATA_REPLACE_LINKS = "data-replace-links"; // default: true
  const DATA_AUTO_CREATE_SELECTOR = "data-auto-create-selector"; // default: true
  const DATA_DELAY = "data-timeout"; // default: 0
  const DATA_DYNAMIC_TRANSLATION = "data-dynamic-translation"; // default: true
  const DATA_TRANSLATE_ATTR = "data-translate-attributes"; // default: false

  // ADVANCED OPTIONAL ATTRIBUTES
  const DATA_LANG_PARAMETER = "data-lang-parameter"; // default: "lang"
  const DATA_CUSTOM_LANG_CODE = "data-custom-language-code"; // format: "kk=kz, en=us, ru=rs"
  const DATA_MERGE_INLINE = "data-translate-splitted-text"; // default: false
  const DATA_EXCLUDE_CONTENTS = "data-exclude-contents"; // format: "{{content1}}, {{content2}}"

  const langParam = window.weployScriptTag.getAttribute(DATA_LANG_PARAMETER) || "lang";

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get(langParam);
  const paramsUpdateTranslation = params.get('weploy_update_translation');

  // console.log(process.env.NO_CACHE)
  function replaceLinks(lang) {
    // Select all anchor tags
    let anchors = document.querySelectorAll('a');
  
    // Loop through all anchor tags
    for (let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
  
        // Check if the link is internal
        if (anchor.hostname === window.location.hostname) {
            // Create a new URL object
            let url = new URL(anchor.href);
  
            // Set the search parameter "lang" to lang
            url.searchParams.set(langParam, lang);
  
            // Update the href of the anchor tag
            anchor.href = url.href;
        }
    }
  }

  try {
    // get the current date
    const now = new Date();

    // get the current date timestamp
    const nowTimestamp = now.getTime();

    // get existing expiration timestamp
    const weployExpirationTimestamp = window.localStorage.getItem("weployExpirationTimestamp");
    const expiration = Number(weployExpirationTimestamp);

    if (!isNaN(expiration) && expiration < nowTimestamp) {
      window.localStorage.removeItem("weployExpirationTimestamp");
      window.localStorage.removeItem("translationCachePerPage");
    }
  } catch (e) {
    console.log("Error checking expiration", e)
  }

  const translationCache = window.localStorage.getItem("translationCachePerPage");
  try {
    const parsedTranslationCache = JSON.parse(translationCache);
    if (parsedTranslationCache && typeof parsedTranslationCache === "object") {
      window.translationCache = parsedTranslationCache;
    }
  } catch (e) {
    console.log("Error parsing translation cache", e)
  }

  const customLanguageCodeAttr = window.weployScriptTag.getAttribute(DATA_CUSTOM_LANG_CODE); // format is "kk=kz, en=us, ru=rs"
  const customLanguageCode = customLanguageCodeAttr ? customLanguageCodeAttr.split(",").reduce((acc, lang) => {
    const [key, value] = lang.trim().split("=");
    if (!key || !value) return acc;

    acc[key] = value;
    return acc;
  }, {}) : {};

  // get options
  const apiKey = window.weployScriptTag.getAttribute(DATA_WEPLOY_KEY);

  // defined languages so dont need extra fetch
  const originalLangAttr = window.weployScriptTag.getAttribute(DATA_ORIGINAL_LANG) || window.weployScriptTag.getAttribute("data-original-lanugage");
  const originalLang = (originalLangAttr || "").trim().toLowerCase();

  const activeLang = paramsLang || originalLang;
  if (document.documentElement.lang != activeLang) {
    document.documentElement.lang = activeLang;
  }

  const allowedLangAttr = window.weployScriptTag.getAttribute(DATA_ALLOWED_LANGUAGES);
  const allowedLangs = (allowedLangAttr || "").trim().toLowerCase().split(",").filter(lang => !!lang).map(lang => lang.trim());

  // this is backward compatibility for use browser language
  const disableAutoTranslateAttr = window.weployScriptTag.getAttribute("data-disable-auto-translate");
  const disableAutoTranslate = disableAutoTranslateAttr == "true";
  const useBrowserLanguageAttr = window.weployScriptTag.getAttribute(DATA_USE_BROWSER_LANG);
  const useBrowserLanguage = useBrowserLanguageAttr != "false" && useBrowserLanguageAttr != false;

  // exclude classes
  const excludeClassesAttr = (window.weployScriptTag.getAttribute(DATA_EXCLUDE_CLASSES) || "").trim()
  const excludeClassesByComma = excludeClassesAttr.split(",").filter(className => !!className).map(className => className.trim());
  const excludeClassesBySpace = excludeClassesAttr.split(" ").filter(className => !!className).map(className => className.trim().replaceAll(",", ""));
  const mergedExcludeClasses = [...excludeClassesByComma, ...excludeClassesBySpace];
  const excludeClasses = [...new Set(mergedExcludeClasses)]; // get unique values

  // exclude contents
  const excludeContentsAttr = (window.weployScriptTag.getAttribute(DATA_EXCLUDE_CONTENTS) || "").trim()
  const splittedContents = getTextInsideBrackets(excludeContentsAttr);
  const excludeContents = [...new Set(splittedContents)]; // get unique values

  // timeout
  const timeoutAttr = window.weployScriptTag.getAttribute(DATA_DELAY);
  const timeout = isNaN(Number(timeoutAttr)) ? 0 : Number(timeoutAttr);

  const createSelector = window.weployScriptTag.getAttribute(DATA_AUTO_CREATE_SELECTOR) != "false";

  const translateAttributes = window.weployScriptTag.getAttribute(DATA_TRANSLATE_ATTR) == "true";

  const dynamicTranslation = paramsUpdateTranslation == "true" || (window.weployScriptTag.getAttribute(DATA_DYNAMIC_TRANSLATION) != "false");

  const translateSplittedText = window.weployScriptTag.getAttribute(DATA_MERGE_INLINE) == "true";

  const shouldReplaceLinks = window.weployScriptTag.getAttribute(DATA_REPLACE_LINKS) != "false";

  const options = {
    useBrowserLanguage: !disableAutoTranslate && useBrowserLanguage,
    createSelector: createSelector,
    excludeClasses,
    excludeContents,
    originalLanguage: originalLang,
    allowedLanguages: allowedLangs,
    timeout: timeout,
    customLanguageCode,
    translateAttributes,
    dynamicTranslation,
    translateSplittedText,
    langParam
  }

  function initWeploy() {
    // replace links with lang (for SEO purposes)
    if (shouldReplaceLinks && paramsLang && (paramsLang != originalLang)) {
      replaceLinks(paramsLang);
    }
    getTranslations(apiKey, options)
  }

  // console.log("document.readyState", document.readyState)
  if (document.readyState == 'complete') {
    // DOM is already loaded, run the code
    initWeploy();
  } else {
    // DOM is not loaded yet, wait for it
    document.addEventListener("DOMContentLoaded", function() {
      initWeploy();
    });
  }
}
