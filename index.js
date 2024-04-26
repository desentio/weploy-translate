const { isBrowser, getWeployOptions, setWeployOptions, setWeployActiveLang } = require('./utils/configs.js');
const checkIfTranslatable = require('./utils/translation/checkIfTranslatable.js');
const allWeployLanguagesList = require('./utils/languages/allWeployLanguagesList.js');
const { fetchLanguageList } = require('./utils/languages/fetchLanguageList.js');
const { createLanguageSelect, addOrReplaceLangParam } = require('./utils/selector/createLanguageSelect.js');
const { getLanguageFromLocalStorage, getSelectedLanguage } = require('./utils/languages/getSelectedLanguage.js');
const delay = require('./utils/delay.js');
const { debounce } = require('./utils/debounce.js');
const extractTextNodes = require('./utils/translation/extractTextNodes.js');
const getTranslationsFromAPI = require('./utils/translation/getTranslationsFromAPI.js');
const { renderWeploySelectorState } = require('./utils/selector/renderWeploySelectorState.js');

var isDomListenerAdded;

if (isBrowser()) {
  window.translationCache = {}
  window.currentPathname = window.location.pathname
}

// initialize new event "pathnamechange"
if (isBrowser()) {
  (() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        if (window.location.pathname != window.currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        if (window.location.pathname != window.currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    window.addEventListener('popstate', () => {
        if (window.location.pathname != window.currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
    });
  })();
}

function filterValidTextNodes(textNodes) {
  return textNodes.filter((textNode) => {
    const textContent = textNode.textContent
    return (
      checkIfTranslatable(textContent) != "inValid"
    );
  });
}

function processTextNodes(textNodes = [], language = "", apiKey = "") {
  // dont translate google translate
  if (isBrowser() && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) {
    return new Promise((resolve, reject) => {
      reject("Google translate is already translating")
    })
  };
  
  // dont translate original language
  const options = getWeployOptions()
  const langs = options.definedLanguages;
  if (langs && langs[0] && langs[0].lang == language.substring(0, 2).toLowerCase()) {
    return new Promise((resolve, reject) => {
      reject("Original language is not translatable");
    })
  }
  return new Promise(async (resolve, reject) => {
    // Remove empty strings
    const cleanTextNodes = textNodes.filter(
      (textNode) =>
        typeof textNode.textContent == "string" && !!textNode.textContent.trim()
    );

    // Initialize cache if not exist yet
    if (!window.translationCache) {
      window.translationCache = {}
    }

    // Initialize language cache if not exist yet
    if (!window.translationCache[language]) {
      window.translationCache[language] = {};
    }

    let notInCache = [];

    // Check cache for each textNode
    cleanTextNodes.forEach((node) => {
      const text = node.textContent;
      const cacheValues = Object.values(window.translationCache[language] || {});
      if (
        !window.translationCache[language][text] // check in key
        && !cacheValues.includes(text) // check in value (to handle nodes that already translated)
      ) {
        notInCache.push(text); // If not cached, add to notInCache array
      }
    });

    if (notInCache.length > 0) { 
      window.weployError = false;
      window.weployTranslating = true;
      renderWeploySelectorState({ shouldUpdateActiveLang: false });
      
      // If there are translations not in cache, fetch them from the API
      getTranslationsFromAPI(notInCache, language, apiKey).then(
        (response) => {
          notInCache.forEach((text, index) => {
            // Cache the new translations
            window.translationCache[language][text] = response[index] || text;
          });
          
          // Update textNodes from the cache
          cleanTextNodes.forEach((node) => {
            const text = node.textContent;
            if(window.translationCache[language][text]) {
              // make sure text is still the same before replacing
              if(node.textContent == text) {
                node.textContent = window.translationCache[language][text];
              }
            }
          });
          resolve(undefined);
        }
      ).catch(err => {
        // console.error(err); // Log the error and resolve the promise without changing textNodes
        resolve(undefined);
      });
    } else {
      // If all translations are cached, directly update textNodes from cache
      cleanTextNodes.forEach((node) => {
        const text = node.textContent;
        if(window.translationCache[language][text]) {
          node.textContent = window.translationCache[language][text];
        }
      });
      resolve(undefined);
    }
  });
}

function modifyHtmlStrings(rootElement, language, apiKey) {
  return new Promise(async (resolve, reject) => {
    const textNodes = [];
    extractTextNodes(rootElement, textNodes);

    const validTextNodes = filterValidTextNodes(textNodes) || [];

    await processTextNodes(validTextNodes, language, apiKey).catch(reject).finally(() => {
      window.weployTranslating = false;
      renderWeploySelectorState();
    });

    resolve(undefined);
  });
}

async function startTranslationCycle(node, apiKey, delay) {
  const lang = await getLanguageFromLocalStorage();

  return new Promise(async (resolve, reject) => {
    if (!delay) {
      await modifyHtmlStrings(node, lang, apiKey).catch(console.log)
      resolve(undefined)
    } else {
      debounce(async () => {
        await modifyHtmlStrings(node, lang, apiKey).catch(console.log);
        resolve(undefined);
      }, delay)();
    }
  })
  
  // window.cacheAlreadyChecked = true;
}

function getDefinedLanguages(originalLanguage, allowedLanguages = []) {
  if (originalLanguage && allowedLanguages && allowedLanguages.length) {
    const originalLang = allWeployLanguagesList.find(lang => lang.lang == originalLanguage);
    const allowedLangs = allWeployLanguagesList.filter(lang => allowedLanguages.includes(lang.lang));
    const langOptions= [originalLang, ...allowedLangs]

    if (originalLang) {
      return langOptions
    }
  }
}

function setOptions(apiKey, optsArgs) {
  const mappedOpts = {
    timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
    pathOptions: optsArgs.pathOptions || {},
    apiKey,
    excludeClasses: optsArgs.excludeClasses || [],
    definedLanguages: getDefinedLanguages(optsArgs.originalLanguage, optsArgs.allowedLanguages),
  }

  setWeployOptions(mappedOpts)
  setWeployActiveLang(mappedOpts?.definedLanguages?.[0]?.lang)
}

async function getTranslations(apiKey, optsArgs = {}) {

  try {
    setOptions(apiKey, optsArgs)

    // save language to local storage & delay 1 second to wait google translate
    await Promise.allSettled([
      fetchLanguageList(apiKey),
      delay(1000)
    ]);

    if (optsArgs.createSelector) {
      await createLanguageSelect(apiKey, optsArgs);
    }


    // handle google translate
    if (isBrowser() && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) return;

    return await new Promise(async (resolve, reject) => {
      try {
        const timeout = getWeployOptions().timeout;
        await startTranslationCycle(document.body, apiKey, timeout).catch(reject);

        if (isBrowser() && !isDomListenerAdded) {
          // Select the target node
          const targetNode = document.body;

          // Create an observer instance with a callback to handle mutations
          const observer = new MutationObserver(function(mutationsList) {
            let nodes = [];
            for(let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                // Handling added nodes
                for(let addedNode of mutation.addedNodes) {
                  nodes.push(addedNode)
                }
              }
            }

            startTranslationCycle(document.body, apiKey, 2000).catch(reject)
          });

          // Set up observer configuration: what to observe
          const config = { childList: true, subtree: true };

          // Start observing the target node with configured settings
          observer.observe(targetNode, config);

          isDomListenerAdded = true;
        }

        resolve(undefined);
      } catch(err) {
        console.log("getTranslations error", err)
        resolve(undefined);
      }
    })
  } catch(err) {
    console.log("getTranslations error 2", err)
  }
}

//@deprecated
function switchLanguage(language) {
  localStorage.setItem("language", language);
  const updatedUrl = addOrReplaceLangParam(window.location.href, language);
  setTimeout(() => {
    window.location.href = updatedUrl;
    // location.reload();
  }, 1000);
}


//@deprecated
function handleChangeCustomSelect(target){
  // Get elements by class
  const classElements = Array.from(document.getElementsByClassName("weploy-select"));
  // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
  const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
  const isWithLangLabel = Array.from(target.classList).includes("weploy-select-with-name")
  const idElements = isWithLangLabel ? idElementsStartsWithClassName : idElementsStartsWithClassName.filter(el => !el.id.includes("weploy-select-with-name")); 
  // Combine and deduplicate elements
  const weploySwitchers = Array.from(new Set([...classElements, ...idElements]));

  const newValue = target.value;
  // Update only the select elements within weploySwitchers
  weploySwitchers.forEach(sw => { 
    const selects = sw.querySelector('select.weploy-exclude');
    if (selects && selects !== target) {
      selects.value = newValue;
    }
  });
  switchLanguage(newValue);
}

if (isBrowser()) {
  if (!window.weployUtils) {
     window.weployUtils = {}
  }
  window.weployUtils.isBrowser = isBrowser;
  window.weployUtils.getTranslations = getTranslations;
  window.weployUtils.switchLanguage = switchLanguage;
  window.weployUtils.getSelectedLanguage = getSelectedLanguage;
  window.weployUtils.createLanguageSelect = createLanguageSelect;
  window.weployUtils.handleChangeCustomSelect = handleChangeCustomSelect;
  window.weployUtils.getLanguageFromLocalStorage = getLanguageFromLocalStorage;
  window.weployUtils.setOptions = setOptions
}

module.exports.isBrowser = isBrowser;
module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
module.exports.createLanguageSelect = createLanguageSelect;
module.exports.getLanguageFromLocalStorage = getLanguageFromLocalStorage;
module.exports.setOptions = setOptions;
