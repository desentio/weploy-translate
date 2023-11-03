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

function hasExcludedParent(node) {
  while (node && node !== document.body) {
      if (node.classList && node.classList.contains('weploy-exclude')) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}

function saveLanguageToLocalStorage(availableLangs = [], useBaseLang) {
  const language = navigator.language || navigator.userLanguage; // Get browser language (usually in this format: en-US)
  const langIsoCode = language && language.length >= 2 ? language.substring(0, 2) : null // Get the language ISO code
  const langInAvailableLangs = availableLangs.find(lang => lang.lang == langIsoCode) //  Check if the language is in the available languages
  const langInAvailableLangsOrFirst = langInAvailableLangs || availableLangs[0].lang // If the language is not in the available languages, use the first available language
  const langToSave = useBaseLang ? availableLangs[0].lang : langInAvailableLangsOrFirst // If useBaseLang is true, use the first available language, otherwise use the language from the browser
  // Save the language to local storage
  localStorage.setItem("language", langToSave);
}

function getLanguageFromLocalStorage() {
  const language = localStorage.getItem("language");
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
        resolve("error");
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

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SCRIPT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SVG") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "PATH") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "CIRCLE") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "TEXTAREA") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "INPUT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "STYLE") return;
    textNodes.push(node);
  } else {
    // filter out weploy-exclude
    if (
      node &&
      node.className &&
      typeof node.className == "string" &&
      node.className.includes("weploy-exclude")
    )
      return;
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

function processTextNodes(textNodes, language, apiKey) {
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

async function startTranslationCycle(node, apiKey) {
  await modifyHtmlStrings(node, getLanguageFromLocalStorage(), apiKey);
  // window.cacheAlreadyChecked = true;
}

async function getTranslations(apiKey, optsArgs = {}) {
  try {
    weployOptions = {
      timeout: optsArgs.timeout == null ? 1000 : optsArgs.timeout,
      pathOptions: optsArgs.pathOptions || {}
    }

    const availableLangs = await fetchLanguageList(apiKey)
    if (getLanguageFromLocalStorage() === null) {
      saveLanguageToLocalStorage(availableLangs, optsArgs.useBaseLang);
    }

    await new Promise((resolve, reject) => {
        startTranslationCycle(document.body, apiKey, null).catch(reject);

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

            startTranslationCycle(document.body, apiKey, null).catch(reject)

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

function switchLanguage(language) {
  localStorage.setItem("language", language);
  setTimeout(() => {
    location.reload();
  }, 1000);
}

async function fetchLanguageList(apiKey) {
  const availableLangs = await fetch(API_URL + "/weploy-projects/by-api-key", {
    headers: {
      "X-Api-Key": apiKey
    }
  })
  .then((res) => res.json())
  .then((res) => {
    const languages =  [res.language, ...res.allowedLanguages]
    const languagesWithFlag = languages.map((lang, index) => ({
      lang,
      flag: (res.flags || [])?.[index] || lang // fallback to text if flag unavailable
    }))
    if (isBrowser) window.weployLanguages = languagesWithFlag // store in global scope
    return languagesWithFlag
  })
  .catch(console.error)

  return availableLangs
}

async function createLanguageSelect(apiKey) {
  if (!isBrowser) return;
  if (!apiKey) {
    console.error("Weploy API key is required");
  }

  const availableLangs = window.weployLanguages || await fetchLanguageList(apiKey)
  
  // <div id="weploy-select" />
  const weploySwitcher = document.getElementById("weploy-select");

  if (weploySwitcher && (availableLangs || []).length > 0) {
    // Create the select element
    const selectElem = document.createElement('select');
    selectElem.className = "weploy-exclude";
    selectElem.style = "text-transform: uppercase; border: none; background: transparent; cursor: pointer; outline: none;";
    selectElem.onchange = (e) => switchLanguage(e.target.value)

    // Assuming availableLangs array is available in this scope
    availableLangs.forEach(lang => {
        const langOpts = document.createElement('option');
        langOpts.value = lang.lang;
        langOpts.textContent = lang.flag;
        langOpts.style = "text-transform: uppercase;";
        langOpts.selected = lang.lang == getLanguageFromLocalStorage();

        selectElem.appendChild(langOpts);
    });

    // Append the select element to the weploySwitcher
    weploySwitcher.appendChild(selectElem);
  }
}

function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    let language = localStorage.getItem("language");
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

module.exports.isBrowser = isBrowser;
module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
module.exports.createLanguageSelect = createLanguageSelect;
