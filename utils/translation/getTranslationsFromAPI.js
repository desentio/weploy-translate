const { compressToArrayBuffer, decompressArrayBuffer } = require("../compressions");
const { API_URL, setWeployActiveLang, isBrowser, SHOULD_COMPRESS_PAYLOAD } = require("../configs");
const { renderWeploySelectorState } = require("../selector/renderWeploySelectorState");

async function getTranslationsFromAPI(strings, language, apiKey) {
  if (!strings || !Array.isArray(strings) || !strings.length) {
    throw new Error("WeployError: Missing strings");
  }

  if (!language) {
    throw new Error("WeployError: Missing language");
  }

  if (!apiKey) {
    throw new Error("WeployError: Missing API Key");
  }

  const finalPayload = {
    strings: strings,
    language: language,
    url: window.location.pathname,
  };

  const stringifiedPayload = JSON.stringify(finalPayload);

  const shouldCompressPayload = SHOULD_COMPRESS_PAYLOAD;
  const compressedPayload = shouldCompressPayload ?  await compressToArrayBuffer(stringifiedPayload, "gzip") : null;

  return await new Promise((resolve) => {
    fetch(API_URL + "/weploy/get-translations", {
      method: "POST",
      headers: {
        'Content-Type': shouldCompressPayload ? 'application/octet-stream' : "application/json",
        // 'accept-encoding': 'gzip,deflate',
        "apikey": apiKey
      },
      body: shouldCompressPayload ? compressedPayload : stringifiedPayload
    })
      .then((response) => shouldCompressPayload ? response.arrayBuffer() : response.json())
      .then(data => shouldCompressPayload ? decompressArrayBuffer(data, "gzip") : data)
      .then(data => shouldCompressPayload ? JSON.parse(data) : data)
      .then((data) => {
        if (data.error) {
          throw new Error(data?.error?.message || data?.error || "Error fetching translations");
        }
        setWeployActiveLang(language);
        resolve(data);
      })
      .catch((err) => {
        // console.error(err);
        if (isBrowser()) {
          window.weployError = err.message;
          renderWeploySelectorState();
        }
        resolve([]);
      })
  });
}

module.exports = getTranslationsFromAPI;