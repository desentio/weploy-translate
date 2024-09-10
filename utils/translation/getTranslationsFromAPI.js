const { compressToArrayBuffer, decompressArrayBuffer, isCompressionSupported } = require("../compressions");
const { API_URL, setGlobalseoActiveLang, isBrowser } = require("../configs");
const { renderSelectorState } = require("../selector/renderSelectorState");
const { apiDebounce } = require("./apiDebounce");

async function getTranslationsFromAPI(window, strings, language, apiKey) {
  if (!strings || !Array.isArray(strings) || !strings.length) {
    throw new Error("globalseoError: Missing strings");
  }

  if (!language) {
    throw new Error("globalseoError: Missing language");
  }

  if (!apiKey) {
    throw new Error("globalseoError: Missing API Key");
  }

  const finalPayload = {
    strings: strings,
    language: language,
    url: window.location.pathname,
    scriptPrevVersion: window.translationScriptPrevVersion
  };

  const stringifiedPayload = JSON.stringify(finalPayload);

  const shouldCompressPayload = isCompressionSupported(window);
  if (!shouldCompressPayload) console.log("GLOBALSEO: Compression is not supported in this browser, therefore the payload will be sent uncompressed.");

  const compressedPayload = shouldCompressPayload ? await compressToArrayBuffer(window, stringifiedPayload, "gzip") : null;
  const body = shouldCompressPayload ? compressedPayload : stringifiedPayload;

  let isOk = false;

  return await new Promise((resolve) => {
    apiDebounce(window, () => {
      console.log("globalseo payload:", finalPayload);
      window.fetch(API_URL + "/globalseo/get-translations", {
        method: "POST",
        headers: {
          'Content-Type': shouldCompressPayload ? 'application/octet-stream' : "application/json",
          // 'accept-encoding': 'gzip,deflate',
          "apikey": apiKey
        },
        body,
      })
        .then((response) => {
          if (response.ok) {
            isOk = true;
            return shouldCompressPayload ? response.arrayBuffer() : response.json();
          } else {
            isOk = false;
            return response.json();
          }
        })
        .then(data => shouldCompressPayload && isOk ? decompressArrayBuffer(window, data, "gzip") : data)
        .then(data => shouldCompressPayload && isOk ? JSON.parse(data) : data)
        .then((data) => {
          if (data.error) {
            throw new Error(data?.error?.message || data?.error || "Error fetching translations");
          }
          setGlobalseoActiveLang(window, language);

          if (!window.rawTranslations) {
            window.rawTranslations = [];
          }

          window.rawTranslations.push({ ...finalPayload, results: data })
          resolve(data);
        })
        .catch((err) => {
          console.error(err);
          window.globalseoError = err.message;
          renderSelectorState(window);
          console.log("GLOBALSEO ERROR:", err.message);
          resolve([]);
        })
    }, window.isWorker ? 0 : 500)();
  });
}

module.exports = getTranslationsFromAPI;
