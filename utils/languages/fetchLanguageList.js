const { decompressArrayBuffer, isCompressionSupported } = require("../compressions");
const { isBrowser, API_URL, getGlobalseoOptions, setGlobalseoActiveLang, setGlobalseoOptions, SPECIAL_API_KEYS } = require("../configs");
const { renderSelectorState } = require("../selector/renderSelectorState");

async function fetchLanguageList(window, apiKey) {
  const options = getGlobalseoOptions(window);
  const langs = options.definedLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;
  if (window.globalseoError) return [];
  if (!SPECIAL_API_KEYS.includes(options.apiKey)) return [];

  const res = {
    "Id": 142,
    "name": "манжерок.рф",
    "language": "ru",
    "allowedLanguages": [
        "en",
        "zh"
    ],
    "flags": [
        "🇷🇺",
        "🇺🇸",
        "🇨🇳"
    ],
    "labels": [
        "Russian",
        "English",
        "Chinese"
    ]
  }

  const languages =  [res.language, ...res.allowedLanguages]
  const languagesWithFlagAndLabel = languages.map((lang, index) => ({
    lang,
    flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
    label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
  }))

  setGlobalseoOptions(window, { definedLanguages: languagesWithFlagAndLabel })
  setGlobalseoActiveLang(window, languagesWithFlagAndLabel[0].lang)
  return languagesWithFlagAndLabel

  // const shouldCompressResponse = isCompressionSupported(window);
  // const headers = {
  //   "X-Api-Key": "cb20c25d-2d15-46ab-aac2-de5aa6b0aeda",
  // }

  // if (shouldCompressResponse) {
  //   headers["Accept"] = "application/octet-stream"; // to receive compressed response
  // }

  // const availableLangs = await window.fetch(API_URL + "/globalseo-projects/by-api-key", {
  //   headers
  // })
  // .then((response) => shouldCompressResponse ? response.arrayBuffer() : response.json())
  // .then(data => shouldCompressResponse ? decompressArrayBuffer(window, data, "gzip") : data)
  // .then(data => shouldCompressResponse ? JSON.parse(data) : data)
  // .then((res) => {
  //   if (res.error) {
  //     throw new Error(res.error?.message || res.error || "Error fetching languages")
  //   }
  //   const languages =  [res.language, ...res.allowedLanguages]
  //   const languagesWithFlagAndLabel = languages.map((lang, index) => ({
  //     lang,
  //     flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
  //     label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
  //   }))
  //   console.log("languagesWithFlagAndLabel", res)
  //   setGlobalseoOptions(window, { definedLanguages: languagesWithFlagAndLabel })
  //   setGlobalseoActiveLang(window, languagesWithFlagAndLabel[0].lang)
  //   return languagesWithFlagAndLabel
  // })
  // .catch((err) => {
  //   console.error(err);
  //   // if (isBrowser()) window.globalseoOptions.definedLanguages = [] // store in global scope
  //   // else globalseoOptions.definedLanguages = [] // for npm package
  //   window.globalseoError = err.message;
  //   renderSelectorState(window, { shouldUpdateActiveLang: false });
  //   return [];
  // })

  // return availableLangs
}

module.exports = {
  fetchLanguageList,
}
