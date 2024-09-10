const { shouldTranslateInlineText } = require("../configs");

function getCacheKey(window, node) {
  const cacheKey = shouldTranslateInlineText(window) ? node.cacheKey || node.originalTextContent : node.originalTextContent;
  if (!cacheKey) {
    console.log("No cache key for ", node)
  }
  return cacheKey
}

module.exports = getCacheKey;
