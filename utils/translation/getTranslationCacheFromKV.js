const { decompressString } = require("../compressions");
const { KV_URL } = require("../configs");

async function getTranslationCacheFromKV(language, apiKey) {
  if (!language) {
    throw new Error("globalseoError: Missing language");
  }

  if (!apiKey) {
    throw new Error("globalseoError: Missing API Key");
  }
  const langIso = language.substr(0, 2);
  const cacheKey = `${apiKey}-${window.location.pathname}-${langIso}`;

  return await new Promise((resolve) => {
    fetch(KV_URL, {
      method: "GET",
      headers: {
        "cachekey": cacheKey,
        "globalseoskip": "yes"
      },
    })
    .then((r) => r.text())
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
      // window.globalseoError = err.message;
      resolve({});
    })
  });
}

module.exports = getTranslationCacheFromKV;
