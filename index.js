const CheckIfTranslatable = require('./utility.js');
// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'


// var isChangeLocationEventAdded;
var isDomListenerAdded;
var weployOptions;
const API_URL = "https://api.tasksource.io"

if (isBrowser) {
  window.translationCache = {}
  window.currentPathname = isBrowser ? window.location.pathname : null
}

// initialize new event "pathnamechange"
if (isBrowser) {
  (() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    window.addEventListener('popstate', () => {
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
    });
  })();
}


// Declare a variable called 'timer' to store the timer ID
if (isBrowser) {
  window.weployTimer = null;
}

const debounce = (mainFunction, delay = 2000) => {
  if (!isBrowser) return mainFunction(...args);

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(window.weployTimer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    window.weployTimer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

function isURL(str) {
  const pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})"+ // domain name and extension
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*"+ // port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?"+ // query string
      "(\\#[-a-zA-Z\\d_]*)?$", "i"); // fragment locator
  return !!pattern.test(str);
}

function getWeployOptions() {
  if (isBrowser) return window.weployOptions;
  return weployOptions;
}

function hasExcludedParent(node) {
  while (node && node !== document.body) {
      if (node.classList && node.classList.contains('weploy-exclude')) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}

function saveLanguageToLocalStorage(availableLangs = [], useBrowserLang = true) {
  const language = navigator.language || navigator.userLanguage; // Get browser language (usually in this format: en-US)
  const langIsoCode = language && language.length >= 2 ? language.substring(0, 2) : null // Get the language ISO code
  const langInAvailableLangs = availableLangs.find(lang => lang.lang == langIsoCode) //  Check if the language is in the available languages
  const langInAvailableLangsOrFirst = langInAvailableLangs?.lang || availableLangs[0].lang // If the language is not in the available languages, use the first available language
  const langToSave = useBrowserLang ? langInAvailableLangsOrFirst : availableLangs[0].lang // If useBrowserLang is true, use the language from the browser, otherwise use the first available language
  // Save the language to local storage
  localStorage.setItem("language", langToSave);
}

async function getLanguageFromLocalStorage() {
  const optsArgs = getWeployOptions()
  const apiKey = optsArgs.apiKey

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get('lang');
  const localStorageLang = localStorage.getItem("language");

  if (paramsLang && (paramsLang != localStorageLang)) {
    localStorage.setItem("language", paramsLang);
  }
  let language = paramsLang || localStorageLang;
  
  const availableLangs = await fetchLanguageList(apiKey);
  if (!availableLangs.find(l => l.lang == language)) {
    saveLanguageToLocalStorage(availableLangs, optsArgs.useBrowserLanguage);
  }
  return language; // Get the language from local storage
}

function getTranslationsFromAPI(strings, language, apiKey) {
  const finalPayload = {
    strings: strings,
    language: language,
    url: window.location.pathname,
    // apiKey: apiKey
  };

  return new Promise((resolve) => {
    fetch(API_URL + "/weploy/get-translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify(finalPayload)
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.error(err);
        resolve([]);
      })
  });
}

function extractTextNodes(node, textNodes) {
  if (!node) return;
  if (node.tagName && node.tagName.toUpperCase() == "SCRIPT") return;
  if (node.tagName && node.tagName.toUpperCase() == "SVG") return;
  if (node.tagName && node.tagName.toUpperCase() == "PATH") return;
  if (node.tagName && node.tagName.toUpperCase() == "CIRCLE") return;
  if (node.tagName && node.tagName.toUpperCase() == "TEXTAREA") return;
  if (node.tagName && node.tagName.toUpperCase() == "INPUT") return;
  if (node.tagName && node.tagName.toUpperCase() == "STYLE") return;
  if (node.tagName && node.tagName.toUpperCase() == "NOSCRIPT") return;

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SCRIPT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SVG") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "PATH") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "CIRCLE") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "TEXTAREA") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "INPUT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "STYLE") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "NOSCRIPT") return;
    
    // Check if the text node is a URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '(((a-z\\d*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(urlPattern.test(node.textContent)) return;

    textNodes.push(node);
  } else {
    // filter out weploy-exclude
    if (
      node &&
      node.className &&
      typeof node.className == "string" &&
      (node.className.includes("weploy-exclude") || window.weployExcludeClasses.length && window.weployExcludeClasses.some(excludeClass => excludeClass && node.className.includes(excludeClass)) )
    ) {
      return;
    }
    for (let child of node.childNodes) {
      extractTextNodes(child, textNodes);
    }
  }
}

function filterValidTextNodes(textNodes) {
  return textNodes.filter((textNode) => {
    const textContent = textNode.textContent
    return (
      CheckIfTranslatable(textContent) != "inValid"
    );
  });
}

function processTextNodes(textNodes, language = "", apiKey) {
  // dont translate google translate
  if (isBrowser && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) return;
  
  // dont translate original language
  if (window.weployLanguages[0] && window.weployLanguages[0].lang == language.substring(0, 2).toLowerCase()) {
    return new Promise((resolve, reject) => {
      console.log("Original language is not translatable")
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
      // If there are translations not in cache, fetch them from the API
      getTranslationsFromAPI(notInCache, language, apiKey).then(
        (response) => {
          notInCache.forEach((text, index) => {
            // Cache the new translations
            window.translationCache[language][text] = response[index];
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
          resolve();
        }
      ).catch(err => {
        console.error(err); // Log the error and resolve the promise without changing textNodes
        resolve();
      });
    } else {
      // If all translations are cached, directly update textNodes from cache
      cleanTextNodes.forEach((node) => {
        const text = node.textContent;
        if(window.translationCache[language][text]) {
          node.textContent = window.translationCache[language][text];
        }
      });
      resolve();
    }
  });
}

function modifyHtmlStrings(rootElement, language, apiKey) {
  return new Promise(async (resolve, reject) => {
    const textNodes = [];
    extractTextNodes(rootElement, textNodes);

    const validTextNodes = filterValidTextNodes(textNodes);
    await processTextNodes(validTextNodes, language, apiKey).catch(reject);

    resolve();
  });
}

async function startTranslationCycle(node, apiKey, delay) {
  const lang = await getLanguageFromLocalStorage();

  return new Promise(async (resolve, reject) => {
    if (!delay) {
      await modifyHtmlStrings(node, lang, apiKey)
      resolve()
    } else {
      debounce(async () => {
        await modifyHtmlStrings(node, lang, apiKey);
        resolve();
      }, delay)();
    }
  })
  
  // window.cacheAlreadyChecked = true;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function getTranslations(apiKey, optsArgs = {}) {
  try {
    if (!isBrowser) {
      weployOptions = {
        timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
        pathOptions: optsArgs.pathOptions || {},
        apiKey
      }
    } else {
      window.weployOptions = {
        timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
        pathOptions: optsArgs.pathOptions || {},
        apiKey
      }
      window.weployExcludeClasses = optsArgs.excludeClasses || [];
    }

    // save language to local storage & delay 1 second to wait google translate
    await Promise.allSettled([
      fetchLanguageList(apiKey),
      delay(1000)
    ]);

    if (optsArgs.createSelector) {
      await createLanguageSelect(apiKey);
    } else {
      // set default value for custom selector
      try {
        // Get elements by class
        const classElements = [
          ...Array.from(document.getElementsByClassName("weploy-select")),
          ...Array.from(document.getElementsByClassName("weploy-select-with-name"))
        ];
        // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
        const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
        // Combine and deduplicate elements
        const weploySwitchers = Array.from(new Set([...classElements, ...idElementsStartsWithClassName]));

        // Populate the select element values based on getLanguageFromLocalStorage
        await Promise.all(weploySwitchers.map(async weploySwitcher => {
          let selectElem = weploySwitcher.querySelector('select.weploy-exclude');
          if (selectElem) {
            const selectedLang = await getLanguageFromLocalStorage();
            if (selectedLang != selectElem.value){
              selectElem.value = selectedLang;
            }
          }
        }));
      } catch(error) {
        console.log("error setting selector default values", error)
      }
    }

    // handle google translate
    if (isBrowser && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) return;

    return await new Promise(async (resolve, reject) => {
        const timeout = getWeployOptions().timeout;
        await startTranslationCycle(document.body, apiKey, timeout).catch(reject);

        if (isBrowser && !isDomListenerAdded) {
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

            // function getTextNodes(rootElement) {
            //   if (hasExcludedParent(rootElement)) {
            //     return [];
            //   }

            //   const textNodes = [];
            //   extractTextNodes(rootElement, textNodes);
            //   const validTextNodes = filterValidTextNodes(textNodes);
            //   return validTextNodes
            // }

            // const textNodes = nodes.map(x => getTextNodes(x)).reduce((acc, c) => {
            //   return [...acc, ...c]
            // }, [])

            // processTextNodes(textNodes, getLanguageFromLocalStorage(), apiKey).catch(reject);
          });

          // Set up observer configuration: what to observe
          const config = { childList: true, subtree: true };

          // Start observing the target node with configured settings
          observer.observe(targetNode, config);

          isDomListenerAdded = true;
        }

        // if (isBrowser && !isChangeLocationEventAdded) {
        //   window.addEventListener("pathnamechange", function () {
        //     console.log("pathnamechange event triggered")
        //     // window.cacheAlreadyChecked = false;
        //     // timeout needed to wait until route fully changed
        //     const thisPathOpts = weployOptions.pathOptions[window.location.pathname]
        //     const timeout = (thisPathOpts && thisPathOpts.timeout) || weployOptions.timeout
        //     setTimeout(() => {
        //       getTranslations(apiKey, optsArgs).catch(reject)
        //     }, timeout);
        //   });
    
        //   isChangeLocationEventAdded = true;
        // }

        resolve();
    })
  } catch(err) {
    console.error(err)
  }

}

function addOrReplaceLangParam(url, lang) {
  let urlObj = new URL(url);
  let params = new URLSearchParams(urlObj.search);

  params.set('lang', lang);
  urlObj.search = params.toString();

  return urlObj.toString();
}

function switchLanguage(language) {
  localStorage.setItem("language", language);
  const updatedUrl = addOrReplaceLangParam(window.location.href, language);
  setTimeout(() => {
    window.location.href = updatedUrl;
    // location.reload();
  }, 1000);
}

async function fetchLanguageList(apiKey) {
  if (window.weployLanguages && Array.isArray(window.weployLanguages) && window.weployLanguages.length) return window.weployLanguages;

  const availableLangs = await fetch(API_URL + "/weploy-projects/by-api-key", {
    headers: {
      "X-Api-Key": apiKey
    }
  })
  .then((res) => res.json())
  .then((res) => {
    const languages =  [res.language, ...res.allowedLanguages]
    const languagesWithFlagAndLabel = languages.map((lang, index) => ({
      lang,
      flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
      label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
    }))
    if (isBrowser) window.weployLanguages = languagesWithFlagAndLabel // store in global scope
    return languagesWithFlagAndLabel
  })
  .catch(console.error)

  return availableLangs
}

async function createLanguageSelect(apiKey) {
  if (!isBrowser) return;
  if (!apiKey) {
    console.error("Weploy API key is required");
    return;
  }

  const availableLangs = await fetchLanguageList(apiKey);

  ['weploy-select', 'weploy-select-with-name'].forEach(className => {
    const isWithLangLabel = className == "weploy-select-with-name";
    // Get elements by class
    const classElements = document.getElementsByClassName(className);
    // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
    const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
    const idElements = isWithLangLabel ? idElementsStartsWithClassName : idElementsStartsWithClassName.filter(el => !el.id.includes("weploy-select-with-name")); 
    // Combine and deduplicate elements
    const weploySwitchers = Array.from(new Set([...classElements, ...idElements]));

    if (weploySwitchers.length > 0 && availableLangs && availableLangs.length > 0) {
      weploySwitchers.forEach(weploySwitcher => {
        // Create the select element if not already present
        let selectElem = weploySwitcher.querySelector('select.weploy-exclude');
        if (!selectElem) {
          selectElem = document.createElement('select');
          selectElem.className = "weploy-exclude";
          selectElem.style = "border: none; background-color: transparent; cursor: pointer; outline: none;";
          selectElem.onchange = (e) => {
            const newValue = e.target.value;
            // Update only the select elements within weploySwitchers
            weploySwitchers.forEach(sw => {
              const selects = sw.querySelector('select.weploy-exclude');
              if (selects && selects !== e.target) {
                selects.value = newValue;
              }
            });
            switchLanguage(newValue);
          };

          // Populate the select element with options
          availableLangs.forEach(async lang => {
            const langOpts = document.createElement('option');
            langOpts.value = lang.lang;
            langOpts.textContent = isWithLangLabel ? `${lang.flag} ${lang.label}` : lang.flag;
            // langOpts.style = "text-transform: uppercase;";
            langOpts.selected = lang.lang === await getLanguageFromLocalStorage();

            selectElem.appendChild(langOpts);
          });

          // Check for "data-icon-color" attribute and use it for font color
          const iconColor = weploySwitcher.getAttribute('data-icon-color');
          if (iconColor) {
            selectElem.style.color = iconColor;
          }

          // Append the select element to each weploySwitcher
          weploySwitcher.appendChild(selectElem);
        }
      });
    }
  })
  
}

function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const paramsLang = params.get('lang');
    const localStorageLang = localStorage.getItem("language");

    if (paramsLang && (paramsLang != localStorageLang)) {
      localStorage.setItem("language", paramsLang);
    }
    
    let language = paramsLang || localStorageLang;
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

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

if (isBrowser) {
  if (!window.weployUtils) {
     window.weployUtils = {}
  }
  window.weployUtils.isBrowser = isBrowser;
  window.weployUtils.getTranslations = getTranslations;
  window.weployUtils.switchLanguage = switchLanguage;
  window.weployUtils.getSelectedLanguage = getSelectedLanguage;
  window.weployUtils.createLanguageSelect = createLanguageSelect;
  window.weployUtils.handleChangeCustomSelect = handleChangeCustomSelect;
  window.weployUtils.getLanguageFromLocalStorage = getLanguageFromLocalStorage
}

module.exports.isBrowser = isBrowser;
module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
module.exports.createLanguageSelect = createLanguageSelect;
module.exports.getLanguageFromLocalStorage = getLanguageFromLocalStorage;
