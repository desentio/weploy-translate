const { getWeployOptions } = require("../configs");

function extractTextNodes(node, textNodes) {
  if (!node) return;
  if (node.tagName && node.tagName.toUpperCase() == "SCRIPT") return;
  if (node.tagName && node.tagName.toUpperCase() == "SVG") return;
  if (node.tagName && node.tagName.toUpperCase() == "PATH") return;
  if (node.tagName && node.tagName.toUpperCase() == "CIRCLE") return;
  if (node.tagName && node.tagName.toUpperCase() == "TEXTAREA") return;
  if (node.tagName && node.tagName.toUpperCase() == "INPUT") return;
  if (node.tagName && node.tagName.toUpperCase() == "STYLE") return;
  if (node.tagName && node.tagName.toUpperCase() == "NOSCRIPT") return;

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SCRIPT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "SVG") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "PATH") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "CIRCLE") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "TEXTAREA") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "INPUT") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "STYLE") return;
    if (node.parentNode.tagName && node.parentNode.tagName.toUpperCase() == "NOSCRIPT") return;
    
    // Check if the text node is a URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '(((a-z\\d*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(urlPattern.test(node.textContent)) return;

    textNodes.push(node);
  } else {
    const weployOptions = getWeployOptions();
    // filter out weploy-exclude
    if (
      node &&
      node.className &&
      typeof node.className == "string" &&
      (node.className.includes("weploy-exclude") || weployOptions.excludeClasses.length && weployOptions.excludeClasses.some(excludeClass => excludeClass && node.className.includes(excludeClass)) )
    ) {
      return;
    }
    for (let child of node.childNodes) {
      extractTextNodes(child, textNodes);
    }
  }
}

module.exports = extractTextNodes;
