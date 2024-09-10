const checkIfTranslatable = require("./checkIfTranslatable");

function filterValidTextNodes(textNodes) {
  return textNodes.filter((textNode) => {
    const textContent = textNode.textContent
    const isTextContentTranslatable = Array.isArray(textNode.fullTextArray) && textNode.fullTextArray.length ? true : checkIfTranslatable(textContent) != "inValid"

    // node that has no fullTextArray will always return true
    const isFullTextArrayTranslatable = Array.isArray(textNode.fullTextArray) && textNode.fullTextArray.length ? !textNode.fullTextArray.every(singleText => checkIfTranslatable(singleText) == "inValid") : true;
    // console.log("textContent", textContent, isTextContentTranslatable, isFullTextArrayTranslatable, Array.isArray(textNode.fullTextArray) && textNode.fullTextArray.length)

    return isTextContentTranslatable && isFullTextArrayTranslatable;
  });
}

module.exports = filterValidTextNodes;
