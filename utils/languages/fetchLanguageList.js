const { decompressArrayBuffer, isCompressionSupported } = require("../compressions");
const { isBrowser, API_URL, getGlobalseoOptions, setGlobalseoActiveLang, setGlobalseoOptions } = require("../configs");
const { renderSelectorState } = require("../selector/renderSelectorState");

async function fetchLanguageList(apiKey) {
  const options = getGlobalseoOptions();
  const langs = options.definedLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;
  if (window.globalseoError) return [];
  return [];

  const shouldCompressResponse = isCompressionSupported();
  const headers = {
    "X-Api-Key": apiKey,
  }

  if (shouldCompressResponse) {
    headers["Accept"] = "application/octet-stream"; // to receive compressed response
  }

  const availableLangs = await fetch(API_URL + "/globalseo-projects/by-api-key", {
    headers
  })
  .then((response) => shouldCompressResponse ? response.arrayBuffer() : response.json())
  .then(data => shouldCompressResponse ? decompressArrayBuffer(data, "gzip") : data)
  .then(data => shouldCompressResponse ? JSON.parse(data) : data)
  .then((res) => {
    if (res.error) {
      throw new Error(res.error?.message || res.error || "Error fetching languages")
    }
    const languages =  [res.language, ...res.allowedLanguages]
    const languagesWithFlagAndLabel = languages.map((lang, index) => ({
      lang,
      flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
      label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
    }))
    setGlobalseoOptions({ definedLanguages: languagesWithFlagAndLabel })
    setGlobalseoActiveLang(languagesWithFlagAndLabel[0].lang)
    return languagesWithFlagAndLabel
  })
  .catch((err) => {
    console.error(err);
    // if (isBrowser()) window.globalseoOptions.definedLanguages = [] // store in global scope
    // else globalseoOptions.definedLanguages = [] // for npm package
    if (isBrowser()) {
      window.globalseoError = err.message;
      renderSelectorState({ shouldUpdateActiveLang: false });
    }
    return [];
  })

  return availableLangs
}

module.exports = {
  fetchLanguageList,
}
