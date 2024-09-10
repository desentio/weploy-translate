const { shouldTranslateInlineText } = require("../configs");

function getTagName(window, node) {
  const translateInline = shouldTranslateInlineText(window)
  if (translateInline) {
    return node.topLevelTagName || node.parentTagName
  } else {
    return node.translationTagName || node.parentTagName;

    // another logic: if it's inline, dont include tagname because <h1>Hello <b>World</b></h1> could result into <h1>Hello</h1> and <b>World</b>
    // if (node.fullTextArray) {
    //   return undefined
    // } else {
    //   return node.parentTagName;
    // }
  }
}

module.exports = getTagName;
