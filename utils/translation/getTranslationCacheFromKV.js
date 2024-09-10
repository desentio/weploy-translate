const { decompressString } = require("../compressions");
const { KV_URL } = require("../configs");

function getTranslationCacheFromKV(window, language, apiKey) {
  if (!language) {
    throw new Error("globalseoError: Missing language");
  }
  if (!apiKey) {
    console.log("NO API KEY")
    throw new Error("globalseoError: Missing API Key");
  }
  const langIso = language.substr(0, 2);
  const cacheKey = `${apiKey}-/-${langIso}`;

  return new Promise((resolve) => {
    window.fetch(KV_URL, {
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

      return decompressString(window, str, 'gzip')
    })
    .then((res) => {
      return JSON.parse(res || "{}")
    })
    .then(resolve)
    .catch((err) => {
      // console.error(err);
      // window.globalseoError = err.message;
      console.log("No cache found in CDN")
      resolve({});
    })
  });
}

module.exports = getTranslationCacheFromKV;
