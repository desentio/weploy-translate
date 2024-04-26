const { getWeployActiveLang } = require("../configs");
const { getWeployValueDisplays } = require("./weployValueDisplays");

const readyClass = 'weploy-lang-selector-ready';
const loadingClass = 'weploy-lang-selector-loading';
const errorClass = 'weploy-lang-selector-error';

function renderWeploySelectorState(opts = { shouldUpdateActiveLang: true }) {
  if (!getWeployValueDisplays().length) return;

  const shouldUpdateActiveLang = opts.shouldUpdateActiveLang

  getWeployValueDisplays().forEach((selector) => {
    const value = selector.querySelector('.weploy-lang-selector-value')
    if (value && shouldUpdateActiveLang) {
      value.innerText = (getWeployActiveLang() || "").toUpperCase();
    }

    if (window.weployTranslating) {
      selector.classList.add(loadingClass);
      selector.classList.remove(readyClass, errorClass);
      return;
    }

    if (window.weployError) {
      selector.classList.add(errorClass);
      selector.classList.remove(readyClass, loadingClass); 
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
  renderWeploySelectorState,
  readyClass,
  loadingClass,
  errorClass
}
