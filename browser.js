const { getTranslations, isBrowser } = require("./index.js");
const { BRAND, PREV_SCRIPT_VERSION } = require("./utils/configs.js");
// const { checkPage } = require("./utils/translation/checkPage.js");

if (isBrowser()) {
  window.translationScriptTag = document.currentScript;
  window.translationScriptPrevVersion = PREV_SCRIPT_VERSION // called prev version because it will bumped after published to npm

  // REQUIRED ATTRIBUTES
  const DATA_API_KEY = `data-${BRAND}-key`
  const DATA_ORIGINAL_LANG = "data-original-language";
  const DATA_ALLOWED_LANGUAGES = "data-allowed-languages";
  const apiKey = window.translationScriptTag.getAttribute(DATA_API_KEY);

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

  // FEATURE: Prevent Google Translate from translating the page
  // Set the 'translate' attribute of the HTML tag to 'no'
  document.documentElement.setAttribute('translate', 'no');

  // Create a new meta element
  const meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';

  // Append the meta element to the head of the document
  document.head.appendChild(meta);

  // FEATURE: Get text inside brackets
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


  const langParam = window.translationScriptTag.getAttribute(DATA_LANG_PARAMETER) || "lang";

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get(langParam);
  window.paramsLang = paramsLang;

  const paramsUpdateTranslation = params.get('globalseo_update_translation');

  // defined languages so dont need extra fetch
  const originalLangAttr = window.translationScriptTag.getAttribute(DATA_ORIGINAL_LANG) || window.translationScriptTag.getAttribute("data-original-lanugage");
  const originalLang = (originalLangAttr || "").trim().toLowerCase();

  const allowedLangAttr = window.translationScriptTag.getAttribute(DATA_ALLOWED_LANGUAGES);
  const allowedLangs = (allowedLangAttr || "").trim().toLowerCase().split(",").filter(lang => lang && lang.trim() != originalLang).map(lang => lang.trim());

  const activeLang = window.globalseoActiveLang || paramsLang || originalLang;
  if (document.documentElement.lang != activeLang) {
    document.documentElement.lang = activeLang;
  }

  function handleLinkTags() {
    // FEATURE: Create a canonical link tag for translated pages
    // e.g. https://example.com/path?lang=es
    // Cleanup the original canonical link tag
    const existingCanonicalLinkTag = document.querySelector('link[rel="canonical"]');
    if (existingCanonicalLinkTag) {
      existingCanonicalLinkTag.remove();
    }

    const newCanonicalLinkTag = document.createElement('link');
    if (!paramsLang || paramsLang == originalLang) {
      newCanonicalLinkTag.href = window.location.pathname;
    } else {
      newCanonicalLinkTag.href = `${window.location.pathname}?${langParam}=${paramsLang}`;
    }
    newCanonicalLinkTag.setAttribute('rel', 'canonical');
    document.head.appendChild(newCanonicalLinkTag);

    // Add alternate link tag for original languages
    const alternateLinkTag = document.createElement('link');
    alternateLinkTag.setAttribute('rel', 'alternate');
    alternateLinkTag.setAttribute('hreflang', originalLang);
    alternateLinkTag.href = window.location.pathname;
    document.head.appendChild(alternateLinkTag);

    // Add alternate link tags for allowed languages
    for (let lang of allowedLangs) {
      const alternateLinkTag = document.createElement('link');
      // Create a new URL object
      let url = new URL(window.location.href);
      // Set the search parameter "lang" to lang
      url.searchParams.set(langParam, lang);
      alternateLinkTag.setAttribute('rel', 'alternate');
      alternateLinkTag.setAttribute('hreflang', lang);
      alternateLinkTag.href = `${window.location.pathname}?${langParam}=${lang}`;
      document.head.appendChild(alternateLinkTag);
    }
  }

  handleLinkTags();

  // console.log(process.env.NO_CACHE)
  function replaceLinks(lang) {
    // Select all anchor tags
    let anchors = document.querySelectorAll('a');
  
    // Loop through all anchor tags
    for (let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
  
      // Check if the link is internal and does not contain a hash
      if ((anchor.hostname === window.location.hostname) && anchor.href !== `${window.location.href}#`) {
            // Create a new URL object
            let url = new URL(anchor.href);
  
            // Set the search parameter "lang" to lang
            url.searchParams.set(langParam, lang);
  
            // Update the href of the anchor tag
            anchor.href = url.href;
        }
    }
  }

  // // check if the page works without the trailing slash
  // checkPage();

  try {
    // get the current date
    const now = new Date();

    // get the current date timestamp
    const nowTimestamp = now.getTime();

    // get existing expiration timestamp
    const globalseoExpirationTimestamp = window.localStorage.getItem("globalseoExpirationTimestamp");
    const expiration = Number(globalseoExpirationTimestamp);

    if (!isNaN(expiration) && expiration < nowTimestamp) {
      window.localStorage.removeItem("globalseoExpirationTimestamp");
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

  const customLanguageCodeAttr = window.translationScriptTag.getAttribute(DATA_CUSTOM_LANG_CODE); // format is "kk=kz, en=us, ru=rs"
  const customLanguageCode = customLanguageCodeAttr ? customLanguageCodeAttr.split(",").reduce((acc, lang) => {
    const [key, value] = lang.trim().split("=");
    if (!key || !value) return acc;

    acc[key] = value;
    return acc;
  }, {}) : {};

  // this is backward compatibility for use browser language
  const disableAutoTranslateAttr = window.translationScriptTag.getAttribute("data-disable-auto-translate");
  const disableAutoTranslate = disableAutoTranslateAttr == "true";
  const useBrowserLanguageAttr = window.translationScriptTag.getAttribute(DATA_USE_BROWSER_LANG);
  const useBrowserLanguage = useBrowserLanguageAttr != "false" && useBrowserLanguageAttr != false;

  // exclude classes
  const excludeClassesAttr = (window.translationScriptTag.getAttribute(DATA_EXCLUDE_CLASSES) || "").trim()
  const excludeClassesByComma = excludeClassesAttr.split(",").filter(className => !!className).map(className => className.trim());
  const excludeClassesBySpace = excludeClassesAttr.split(" ").filter(className => !!className).map(className => className.trim().replaceAll(",", ""));
  const mergedExcludeClasses = [...excludeClassesByComma, ...excludeClassesBySpace];
  const excludeClasses = [...new Set(mergedExcludeClasses)]; // get unique values

  // exclude contents
  const excludeContentsAttr = (window.translationScriptTag.getAttribute(DATA_EXCLUDE_CONTENTS) || "").trim()
  const splittedContents = getTextInsideBrackets(excludeContentsAttr);
  const excludeContents = [...new Set(splittedContents)]; // get unique values

  // timeout
  const timeoutAttr = window.translationScriptTag.getAttribute(DATA_DELAY);
  const timeout = isNaN(Number(timeoutAttr)) ? 0 : Number(timeoutAttr);

  const createSelector = window.translationScriptTag.getAttribute(DATA_AUTO_CREATE_SELECTOR) != "false";

  const translateAttributes = window.translationScriptTag.getAttribute(DATA_TRANSLATE_ATTR) == "true";

  const dynamicTranslation = paramsUpdateTranslation == "true" || (window.translationScriptTag.getAttribute(DATA_DYNAMIC_TRANSLATION) != "false");

  const translateSplittedText = window.translationScriptTag.getAttribute(DATA_MERGE_INLINE) == "true";

  const shouldReplaceLinks = window.translationScriptTag.getAttribute(DATA_REPLACE_LINKS) != "false";

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
    translateSplittedText: false,
    langParam
  }

  function initTranslation() {
    // replace links with lang (for SEO purposes)
    if (shouldReplaceLinks && paramsLang && (paramsLang != originalLang)) {
      replaceLinks(paramsLang);
    }
    getTranslations(apiKey, options)
  }

  // console.log("document.readyState", document.readyState)
  if (document.readyState == 'complete') {
    // DOM is already loaded, run the code
    initTranslation();
  } else {
    // DOM is not loaded yet, wait for it
    document.addEventListener("DOMContentLoaded", function() {
      initTranslation();
    });
  }
}
