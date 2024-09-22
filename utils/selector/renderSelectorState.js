const { getGlobalseoActiveLang, getGlobalseoOptions, isBrowser } = require("../configs");
const { getValueDisplays } = require("./valueDisplay");

const selectorStateClasses = {
  globalseo: {
    ready: 'globalseo-lang-selector-ready',
    loading: 'globalseo-lang-selector-loading',
    error: 'globalseo-lang-selector-error',
  },
  weploy: {
    ready: 'weploy-lang-selector-ready',
    loading: 'weploy-lang-selector-loading',
    error: 'weploy-lang-selector-error',
  }
}

async function renderSelectorState(window, opts = { shouldUpdateActiveLang: true, shouldLog: false, delay: 200 }) {
  if (!getValueDisplays(window).length) return;

  const shouldUpdateActiveLang = opts.shouldUpdateActiveLang

  const promised = getValueDisplays(window).map(async (selector) => {
    const weployValue = selector.querySelector('.weploy-lang-selector-value');
    if (weployValue) {
      weployValue.classList.add('globalseo-lang-selector-value');
      weployValue.classList.remove('weploy-lang-selector-value');

      const weployLoadingIcon = selector.querySelector('.weploy-lang-selector-loading-icon');
      if (weployLoadingIcon) {
        weployLoadingIcon.classList.add('globalseo-lang-selector-loading-icon');
        weployLoadingIcon.classList.remove('weploy-lang-selector-loading-icon');
      }
    }

    const value = selector.querySelector('.globalseo-lang-selector-value');
    // const value = globalSeoValue || weployValue
    // const classKey = weployValue ? 'weploy' : 'globalseo';
    const classKey = 'globalseo';

    const loadingClass = selectorStateClasses[classKey].loading;
    const readyClass = selectorStateClasses[classKey].ready;
    const errorClass = selectorStateClasses[classKey].error;

    if (value && shouldUpdateActiveLang) {
      const activeLang = getGlobalseoActiveLang(window) || "";
      const options = getGlobalseoOptions(window);
      value.textContent = (options.customLanguageCode?.[activeLang] || activeLang).toUpperCase();
    }

    if (window.globalseoTranslating) {
      selector.classList.add(loadingClass);
      selector.classList.remove(readyClass, errorClass);
      return;
    }

    if (window.globalseoError) {
      selector.classList.add(errorClass);
      selector.classList.remove(readyClass, loadingClass); 
      const ul = selector.nextElementSibling;

      const existingError = ul.querySelector('.globalseo-errormsg');
      if (existingError) {
        existingError.innerHTML = `ERROR: ${window.globalseoError}`;
        return;
      }
      
      const errorListItem = window.document.createElement('li');
      errorListItem.innerHTML = `<span class="globalseo-errormsg">ERROR: ${window.globalseoError}</span>`
      ul.appendChild(errorListItem);
      return;
    }

    const delay = window.isWorker ? 0 : opts.delay;
    return await new Promise((resolve) => {
      setTimeout(() => {
        selector.classList.add(readyClass);
        selector.classList.remove(errorClass, loadingClass);
        resolve(undefined)
      }, delay)
    })    
  });

  await Promise.all(promised);
}

module.exports = {
  renderSelectorState,
}
