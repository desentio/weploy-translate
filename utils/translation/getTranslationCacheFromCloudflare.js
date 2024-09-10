const { isCompressionSupported } = require("../compressions");
const { isBrowser } = require("../configs");
const getTranslationCacheFromCDN = require("./getTranslationCacheFromCDN");
const getTranslationCacheFromKV = require("./getTranslationCacheFromKV");

async function getTranslationCacheFromCloudflare(window, language, apiKey) {
  if (!isCompressionSupported(window)) return {};
  if (window?.cloudflareCache) return window?.cloudflareCache;

  const isUsingKV = true;
  console.log("cache request from:", isUsingKV ? "KV" : "CDN")
  const cache = !isUsingKV ? 
    await getTranslationCacheFromCDN(window, language, apiKey).catch((err) => {
      console.log("getTranslationCacheFromCDN error", err);
      return {}
    }) :
    await getTranslationCacheFromKV(window, language, apiKey).catch((err) => {
      console.log("getTranslationCacheFromKV error", err);
      return {}
    });

  if (isBrowser()) window.cloudflareCache = cache;
  return cache;
}

module.exports = getTranslationCacheFromCloudflare;
