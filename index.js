const CheckIfTranslatable = require('./utility.js');
// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'

var isChangeLocationEventAdded;
var weployOptions;

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


function saveLanguageToLocalStorage() {
  var language = navigator.language || navigator.userLanguage; // Get browser language
  // Save the language to local storage
  localStorage.setItem("language", language);
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
    fetch("https://api.tasksource.io/get-translations", {
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
  if (node.tagName == "SCRIPT") return;
  if (node.tagName == "SVG") return;
  if (node.tagName == "PATH") return;
  if (node.tagName == "CIRCLE") return;
  if (node.tagName == "TEXTAREA") return;
  if (node.tagName == "INPUT") return;
  if (node.tagName == "STYLE") return;
  
  if (node.nodeType === Node.TEXT_NODE) {
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
    // remove empty string
    const cleanTextNodes = textNodes.filter(
      (textNode) =>
        typeof textNode.textContent == "string" && !!textNode.textContent.trim()
    );

    //get only text nodes textContent in array
    const textNodesTextContent = cleanTextNodes.map(
      (textNode) => textNode.textContent
    );

    if (!window.translationCache[window.location.pathname]) {
      window.translationCache[window.location.pathname] = {}
    }

    // cache the initial texts if not exist yet
    if (!window.translationCache[window.location.pathname].initial) {
      window.translationCache[window.location.pathname].initial = textNodesTextContent
    }
    
    // this will prevent english -> german -> spanish problem
    // in other words this will make sure (english -> german) -> (english -> spanish)
    // needed if the lang picker is not reloading the page
    // react developer usually will prevent any rerender to improve performance
    // so high chance they will call the getTranslation again on lang change
    let initialTexts = window.translationCache[window.location.pathname].initial

    let shouldUseCache = true;

    // try get the cache first
    const cache = window.translationCache[window.location.pathname][language]
    if (shouldUseCache && cache) {
      cache.forEach((chunk, index) => {
        const relatedNode = cleanTextNodes.find(n => n.textContent == initialTexts[index])
        if (relatedNode) {
          relatedNode.textContent = chunk;
        }
        // cleanTextNodes[index].textContent = chunk;
      });
      resolve();
      return;
    }

    //PROBLEM: THE NODES NEED TO COME BACK IN THE SAME ORDER AS THEY WERE SENT!!!!
    getTranslationsFromAPI(initialTexts, language, apiKey).then(
      (response) => {
        // make a for loop to replace textNodes textContent with the response
        response.forEach((chunk, index) => {
          cleanTextNodes[index].textContent = chunk;
        });

        // cache result
        window.translationCache[window.location.pathname][language] = response

        resolve();
      }
    ).catch(err => reject(err));
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

async function startTranslationCycle(node, apiKey, observer) {
  await modifyHtmlStrings(node, getLanguageFromLocalStorage(), apiKey);
  // window.cacheAlreadyChecked = true;
}

async function getTranslations(apiKey, optsArgs = {}) {

  try {
    weployOptions = {
      timeout: optsArgs.timeout == null ? 1000 : optsArgs.timeout,
      pathOptions: optsArgs.pathOptions || {}
    }

    if (getLanguageFromLocalStorage() === null) {
      saveLanguageToLocalStorage();
    }
    
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        startTranslationCycle(document.body, apiKey, null).catch(reject);

        if (isBrowser && !isChangeLocationEventAdded) {
          window.addEventListener("pathnamechange", function () {
            // window.cacheAlreadyChecked = false;
            // timeout needed to wait until route fully changed
            const thisPathOpts = weployOptions.pathOptions[window.location.pathname]
            const timeout = (thisPathOpts && thisPathOpts.timeout) || weployOptions.timeout
            setTimeout(() => {
              getTranslations(apiKey, optsArgs).catch(reject)
            }, timeout);
          });
    
          isChangeLocationEventAdded = true;
        }

        resolve();
      }, 500);
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

async function createLanguageSelect(apiKey) {
  if (!isBrowser) return;
  if (!apiKey) {
    console.error("Weploy API key is required");
  }

  const availableLangs = await fetch("https://api.tasksource.io/weploy-projects/by-api-key", {
    headers: {
      "X-Api-Key": apiKey
    }
  })
  .then((res) => res.json())
  .then((res) => ([res.language, ...res.allowedLanguages]))
  .catch(console.error)

  // <div id="weploy-select" />
  const weploySwitcher = document.getElementById("weploy-select");

  if (weploySwitcher && (availableLangs || []).length > 0) {
    // Create the select element
    const selectElem = document.createElement('select');
    selectElem.className = "weploy-exclude";
    selectElem.style = "border-radius: 9999px; border: none; background: transparent; color: #808080; cursor: pointer;";
    selectElem.onchange = (e) => switchLanguage(e.target.value)

    // Assuming availableLangs array is available in this scope
    availableLangs.forEach(lang => {
        const langOpts = document.createElement('option');
        langOpts.value = lang;
        langOpts.textContent = lang;
        langOpts.style = "text-transform: uppercase;";

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

// export default {
//   getTranslations,
//   switchLanguage,
//   getSelectedLanguage
// };
