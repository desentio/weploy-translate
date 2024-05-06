const { isBrowser } = require("../configs");
const getTranslationCacheFromCDN = require("./getTranslationCacheFromCDN");
const getTranslationCacheFromKV = require("./getTranslationCacheFromKV");

async function getTranslationCacheFromCloudflare(language, apiKey) {
  if (window?.cloudflareCache) return window?.cloudflareCache;

  const isUsingKV = true;
  const cache = !isUsingKV ? 
    await getTranslationCacheFromCDN(language, apiKey).catch(() => ({})) :
    await getTranslationCacheFromKV(language, apiKey).catch(() => ({}));

  if (isBrowser()) window.cloudflareCache = cache;
  return cache;
}

module.exports = getTranslationCacheFromCloudflare;
