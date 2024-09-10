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

function renderSelectorState(window, opts = { shouldUpdateActiveLang: true }) {
  if (!isBrowser()) return;
  if (!getValueDisplays(window).length) return;

  const shouldUpdateActiveLang = opts.shouldUpdateActiveLang

  getValueDisplays(window).forEach((selector) => {
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
      value.innerText = (options.customLanguageCode?.[activeLang] || activeLang).toUpperCase();
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
      const errorListItem = window.document.createElement('li');
      errorListItem.innerHTML = `<span class="globalseo-errormsg">ERROR: ${window.globalseoError}</span>`
      ul.appendChild(errorListItem);
      return;
    }

    setTimeout(() => {
      selector.classList.add(readyClass);
      selector.classList.remove(errorClass, loadingClass);
    }, 200)
    return;
  });
}

module.exports = {
  renderSelectorState,
}
