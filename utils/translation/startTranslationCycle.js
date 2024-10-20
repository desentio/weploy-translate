const { getGlobalseoActiveLang, getGlobalseoOptions } = require("../configs");
const { getLanguageFromLocalStorage } = require("../languages/getSelectedLanguage");
const modifyHtmlStrings = require("./modifyHtmlStrings");
const { debounce } = require("../debounce");

async function startTranslationCycle(window, node, apiKey, delay, shouldOptimizeSEO = false) {
  if (window.preventInitialTranslation) {
    window.preventInitialTranslation = false;
    return;
  };
  const options = getGlobalseoOptions(window);

  // replace src because nextjs will replace the whole html on rerender
  if (options.translationMode == "subdomain" && !window.isWorker && window.activeSubdomain) {
    // get all elements with src attribute

    ["src", "srcset"].forEach(attr => {
      const elements = window.document.querySelectorAll(`[${attr}]`);

      const elementsWithRelativeSrc = Array.from(elements).filter(el => {
        const srcAttribute = el.getAttribute(attr);
        return !srcAttribute.startsWith("http")
      });

      // get the original website (based on current subdomain url but without the subdomain)
      const originalWebsite = window.location.origin.replace(window.activeSubdomain + ".", "");
      const originalWebsiteHostname = new URL(originalWebsite).hostname;

      // replace the hostname of the src with the original hostname
      elementsWithRelativeSrc.forEach(el => {
        // use URL class
        const url = new URL(el[attr]);
        url.hostname = originalWebsiteHostname;
        el[attr] = url.href;
      })
    })
  }

  const lang = options?.translationMode == "subdomain" && !window.isWorker ? getGlobalseoActiveLang(window) : (window.paramsLang || getGlobalseoActiveLang(window) || await getLanguageFromLocalStorage(window));
  const originalLang = options?.originalLanguage;

  if (!window.langHistory) {
    window.langHistory = [] // example: [["en", "de"], ["de", "de"], ["de", "id"]]
  }

  if (!window.langHistory.length) {
    window.langHistory.push([originalLang, lang])
  } else {
    const latestLang = window.langHistory[window.langHistory.length - 1][1];
    window.langHistory.push([latestLang, lang])
    // if (latestLang != lang) {
    //   window.langHistory.push([latestLang, lang])
    // }
  }

  // console.log("startTranslationCycle getGlobalseoActiveLang", getGlobalseoActiveLang(window), isBrowser())
  // console.log("startTranslationCycle", "globalseo start translation", delay)

  return await new Promise((resolve) => {
    // execute the first translation attempt immediately
    if (window.isWorker || (!delay && !window.isTranslationRunOnce) || (window.activeSubdomain && window.translationCache?.[window.location.pathname]?.[window.activeSubdomain])) {
      // console.log("RUN FIRST")
      window.isTranslationRunOnce = true;
      modifyHtmlStrings(window, node, lang, apiKey, shouldOptimizeSEO).catch(console.log).finally(() => {
        // console.log("FINALLY")
        resolve(undefined)
      })
    } else {
      debounce(window, async () => {
        modifyHtmlStrings(window, node, lang, apiKey, shouldOptimizeSEO).catch(console.log).finally(() => { 
          // console.log("FINALLY 2")
          resolve(undefined)
        });
        // disable debounce if cache found
      }, (delay || 1))(); // must have at least 1 milisecond to prevent browser hanging in super fast rerender condition (rare extreme case)
    }
  })
  
  // window.cacheAlreadyChecked = true;
}

module.exports = startTranslationCycle;
