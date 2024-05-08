const { decompressString } = require("../compressions");
const { CDN_URL } = require("../configs");

async function getTranslationCacheFromCDN(language, apiKey) {
  if (!language) {
    throw new Error("WeployError: Missing language");
  }

  if (!apiKey) {
    throw new Error("WeployError: Missing API Key");
  }
  const langIso = language.substr(0, 2);
  const cacheKey = `${apiKey}-${encodeURIComponent(window.location.pathname)}-${langIso}`;

  return await new Promise((resolve) => {
    fetch(CDN_URL + `/weploy/get-translation-cache/${cacheKey}.html`, {
      method: "GET",
      headers: {
        "weployskip": "yes"
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const prefix = `<html><head></head><body id="weploy">`;
        const isCacheCorrect = data.startsWith(prefix);
        if (!isCacheCorrect) {
          resolve({});
          return;
        }
        const prefixRemoved = data.replace(prefix, "")
        const suffixRemoved = prefixRemoved.replace(`</body></html>`, "")
        return suffixRemoved
      })
      .then((str) => {
        if (!str) {
          resolve({})
          return;
        }
        return decompressString(str, 'gzip')
      })
      .then(JSON.parse)
      .then(resolve)
      .catch((err) => {
        // console.error(err);
        // window.weployError = err.message;
        resolve({});
      })
  });
}

module.exports = getTranslationCacheFromCDN;