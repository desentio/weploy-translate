const { isBrowser, BRAND } = require("./utils/configs");
const detectRobot = require("./utils/detectRobot");

/**
 * Extracts options from a script.
 *
 * @param {any} window - The global window object.
 * @param {Object} optsArgs - Options for extraction.
 * @param {string|null} optsArgs.activeLanguage - The active language (optional).
 * @param {"searchParams"|"subdomain"|"path"} optsArgs.urlMode - The URL mode.
 * @param {"globalseo"|"weploy"} optsArgs.brand - The brand name.
 *   - "searchParams": Extract options from query parameters.
 *   - "subdomain": Extract options from subdomains.
 *   - "pathname": Extract options from the path.
 */
function extractOptionsFromScript(window, optsArgs = {
  activeLanguage: null,
  urlMode: "searchParams",
  brand: "globalseo"
}) {
  if (isBrowser()) {
    if (!window.translationCache) {
      window.translationCache = {};
    }
    window.currentPathname = window.location.pathname
  }

  // REQUIRED ATTRIBUTES
  const DATA_API_KEY = `data-${optsArgs.brand || BRAND}-key`
  const DATA_ORIGINAL_LANG = "data-original-language";
  const DATA_ALLOWED_LANGUAGES = "data-allowed-languages";
  const apiKey = window.translationScriptTag.getAttribute(DATA_API_KEY);

  // COMMON OPTIONAL ATTRIBUTES
  const DATA_USE_BROWSER_LANG = "data-use-browser-language"; // default: true
  const DATA_EXCLUDE_CLASSES = "data-exclude-classes";
  const DATA_EXCLUDE_IDS = "data-exclude-ids";
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
  const DATA_DEBOUNCE = "data-debounce" // format: "2000"
  const DATA_TRANSLATE_FORM_PLACEHOLDER = "data-translate-form-placeholder"
  const DATA_TRANSLATE_SELECT_OPTIONS = "data-translate-select-options"

  // WORKER ATTRIBUTES
  const DATA_PREVENT_INIT_TRANSLATION = "data-prevent-init-translation" // default: false
  const preventInitialTranslation = window.translationScriptTag.getAttribute(DATA_PREVENT_INIT_TRANSLATION) == "true";
  window.preventInitialTranslation = preventInitialTranslation;

  // FEATURE: Prevent Google Translate from translating the page
  // Set the 'translate' attribute of the HTML tag to 'no'
  window.document.documentElement.setAttribute('translate', 'no');

  // Create a new meta element
  const meta = window.document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';

  // Append the meta element to the head of the document
  window.document.head.appendChild(meta);

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
  const paramsLang = optsArgs.activeLanguage || params.get(langParam);
  window.paramsLang = paramsLang;

  const paramsUpdateTranslation = params.get('globalseo_update_translation');

  // defined languages so dont need extra fetch
  const originalLangAttr = window.translationScriptTag.getAttribute(DATA_ORIGINAL_LANG) || window.translationScriptTag.getAttribute("data-original-lanugage");
  const originalLang = (originalLangAttr || "").trim().toLowerCase();

  const allowedLangAttr = window.translationScriptTag.getAttribute(DATA_ALLOWED_LANGUAGES);
  const allowedLangs = (allowedLangAttr || "").trim().toLowerCase().split(",").filter(lang => lang && lang.trim() != originalLang).map(lang => lang.trim());

  const activeLang = window.globalseoActiveLang || paramsLang || originalLang;
  if (window.document.documentElement.lang != activeLang) {
    window.document.documentElement.lang = activeLang;
  }

  function handleLinkTags() {
    // FEATURE: Create a canonical link tag for translated pages
    // e.g. https://example.com/path?lang=es
    // Cleanup the original canonical link tag
    const existingCanonicalLinkTag = window.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalLinkTag) {
      existingCanonicalLinkTag.remove();
    }

    const newCanonicalLinkTag = window.document.createElement('link');
    if (!paramsLang || paramsLang == originalLang) {
      newCanonicalLinkTag.href = window.location.pathname;
    } else {
      newCanonicalLinkTag.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${langParam}=${paramsLang}`;
    }
    newCanonicalLinkTag.setAttribute('rel', 'canonical');
    window.document.head.appendChild(newCanonicalLinkTag);

    // Add alternate link tag for original languages
    const alternateLinkTag = window.document.createElement('link');
    alternateLinkTag.setAttribute('rel', 'alternate');
    alternateLinkTag.setAttribute('hreflang', originalLang);
    alternateLinkTag.href = window.location.pathname;
    window.document.head.appendChild(alternateLinkTag);

    // Add alternate link tags for allowed languages
    for (let lang of allowedLangs) {
      const alternateLinkTag = window.document.createElement('link');
      // Create a new URL object
      let url = new URL(window.location.href);
      // Set the search parameter "lang" to lang
      url.searchParams.set(langParam, lang);
      alternateLinkTag.setAttribute('rel', 'alternate');
      alternateLinkTag.setAttribute('hreflang', lang);
      if (optsArgs.urlMode == "searchParams") {
        alternateLinkTag.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${langParam}=${lang}`;
      }
      if (optsArgs.urlMode == "subdomain") {
        // remove lang param
        url.searchParams.delete(langParam);

        // append the first subdomain with lang
        // google.com -> en.google.com
        let subdomains = url.hostname.split('.');
        subdomains.splice(0, 0, lang);
        url.hostname = subdomains.join('.');
        alternateLinkTag.href = url.href;
      }
      if (optsArgs.urlMode == "path") {
        // remove lang param
        url.searchParams.delete(langParam);
        
        // append the first slash with lang
        // google.com -> google.com/en
        let pathnames = url.pathname.split('/');
        pathnames.splice(1, 0, lang);
        url.pathname = pathnames.join('/');
        alternateLinkTag.href = url.href;
      }
      
      window.document.head.appendChild(alternateLinkTag);
    }
  }

  handleLinkTags();

  // console.log(process.env.NO_CACHE)

  // // check if the page works without the trailing slash
  // checkPage();

  if (isBrowser()) {
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
  
    const userAgent = window.navigator.userAgent;
    const isRobot = detectRobot(userAgent);
    if (!isRobot) {
      const translationCache = window.localStorage.getItem("translationCachePerPage");
      try {
        const parsedTranslationCache = JSON.parse(translationCache);
        if (parsedTranslationCache && typeof parsedTranslationCache === "object") {
          window.translationCache = parsedTranslationCache;
        }
      } catch (e) {
        console.log("Error parsing translation cache", e)
      }
    } else {
      window.translationCache = {};
    }
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

  // exclude ids
  const excludeIdsAttr = (window.translationScriptTag.getAttribute(DATA_EXCLUDE_IDS) || "").trim()
  const excludeIdsByComma = excludeIdsAttr.split(",").filter(id => !!id).map(id => id.trim());
  const excludeIdsBySpace = excludeIdsAttr.split(" ").filter(id => !!id).map(id => id.trim().replaceAll(",", ""));
  const mergedExcludeIds = [...excludeIdsByComma, ...excludeIdsBySpace];
  const excludeIds = [...new Set(mergedExcludeIds)]; // get unique values

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

  const debounceDuration = window.translationScriptTag.getAttribute(DATA_DEBOUNCE);

  const translateFormPlaceholder = window.translationScriptTag.getAttribute(DATA_TRANSLATE_FORM_PLACEHOLDER) == "true";

  const translateSelectOptions = window.translationScriptTag.getAttribute(DATA_TRANSLATE_SELECT_OPTIONS) == "true";

  return {
    useBrowserLanguage: !disableAutoTranslate && useBrowserLanguage,
    createSelector: createSelector,
    excludeClasses,
    excludeIds,
    excludeContents,
    originalLanguage: originalLang,
    allowedLanguages: allowedLangs,
    timeout: timeout,
    customLanguageCode,
    translateAttributes,
    dynamicTranslation,
    translateSplittedText: false,
    langParam,
    debounceDuration,
    translateFormPlaceholder,
    translateSelectOptions,
    shouldReplaceLinks,
    paramsLang,
    apiKey
  }
}

module.exports = extractOptionsFromScript;
