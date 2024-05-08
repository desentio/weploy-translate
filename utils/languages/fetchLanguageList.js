const { decompressArrayBuffer } = require("../compressions");
const { isBrowser, API_URL, getWeployOptions, setWeployActiveLang, setWeployOptions, SHOULD_COMPRESS_PAYLOAD } = require("../configs");
const { renderWeploySelectorState } = require("../selector/renderWeploySelectorState");

async function fetchLanguageList(apiKey) {
  const options = getWeployOptions();
  const langs = options.definedLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;
  if (window.weployError) return [];
  return [];

  const shouldCompressResponse = SHOULD_COMPRESS_PAYLOAD;
  const headers = {
    "X-Api-Key": apiKey,
  }

  if (shouldCompressResponse) {
    headers["Accept"] = "application/octet-stream"; // to receive compressed response
  }

  const availableLangs = await fetch(API_URL + "/weploy-projects/by-api-key", {
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
    setWeployOptions({ definedLanguages: languagesWithFlagAndLabel })
    setWeployActiveLang(languagesWithFlagAndLabel[0].lang)
    return languagesWithFlagAndLabel
  })
  .catch((err) => {
    console.error(err);
    // if (isBrowser()) window.weployOptions.definedLanguages = [] // store in global scope
    // else weployOptions.definedLanguages = [] // for npm package
    if (isBrowser()) {
      window.weployError = err.message;
      renderWeploySelectorState({ shouldUpdateActiveLang: false });
    }
    return [];
  })

  return availableLangs
}

module.exports = {
  fetchLanguageList,
}
