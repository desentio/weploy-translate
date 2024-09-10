const { getGlobalseoOptions } = require("../configs");

function getActiveLang(window) {
  if (window.globalseoActiveLang) return window.globalseoActiveLang;

  if (window.urlMode == "subdomain") {
    const subdomain = window.location.hostname.split('.')[0];
    return subdomain;    
  }

  if (window.urlMode == "path") {
    const path = window.location.pathname.split('/');
    return path[1];
  }

  const options = getGlobalseoOptions(window);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const activeLang = params.get(options.langParam || 'lang');
  if (!activeLang) return true;
}

function isStillSameLang(window, language) {
  const activeLang = getActiveLang(window);
  if (activeLang != language) {
    return false;
  } else {
    return true;
  }
}

module.exports = isStillSameLang;
