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
    if (window.isWorker || (!delay && !window.isTranslationRunOnce)) {
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
      }, delay || 1)(); // must have at least 1 milisecond to prevent browser hanging in super fast rerender condition (rare extreme case)
    }
  })
  
  // window.cacheAlreadyChecked = true;
}

module.exports = startTranslationCycle;
