const { getWeployOptions } = require("../configs");

function collectAllTextContentInsideNode(node) {
  const textNodes = [];
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      textNodes.push(child);
    } 
    
    if (child.nodeType !== Node.TEXT_NODE) {
      textNodes.push(...collectAllTextContentInsideNode(child));
    }
  });
  return textNodes;
}

function assignFullTextToTextNodes(node, textNodes) {
  const fullTextArray = textNodes.map((textNode) => textNode.textContent);

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      // if (child.textContent.trim()) {
        child.fullTextArray = fullTextArray;
        child.fullTextIndex = textNodes.findIndex((textNode) => textNode === child);
        child.fullText = `weploy-merge-${JSON.stringify(fullTextArray.filter(x => x && x.trim()))}`; // get rid of empty string
      // }
    } else {
      assignFullTextToTextNodes(child, textNodes);
    }
  });
}

function extractTextNodes(node, textNodes) {
  if (!node) return;
  if (node.tagName && ["SCRIPT", "SVG", "PATH", "CIRCLE", "TEXTAREA", "INPUT", "STYLE", "NOSCRIPT"].includes(node.tagName.toUpperCase())) return;

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode.tagName && ["SCRIPT", "SVG", "PATH", "CIRCLE", "TEXTAREA", "INPUT", "STYLE", "NOSCRIPT"].includes(node.parentNode.tagName.toUpperCase())) return;

    // Check if the text node is a URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(urlPattern.test(node.textContent)) return;

    // Check if the text node is empty
    if (!node.textContent.trim()) return;

    // fullTextArray assignment
    // 1. must be a text node (example: "im")
    // 2. must be a child of an inline element (example: <span>im</span>)
    // 3. minimum has 1 parent sibling (not including itself) (<div><span>im</span><span>portant</span></div>)
    // 4. all parent siblings are inline elements OR not inline BUT all of its children are inline
    // 5. all parent siblings are NOT links or buttons (it means they were navigations)
    if (
      !node.fullText && 
      // 2. must be a child of an inline element
      node.parentNode instanceof Element && window.getComputedStyle(node.parentNode).display === 'inline'
    ) {
      const parentSiblings = [];
      
      (node.parentNode.parentNode.childNodes || []).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent.trim()) {
            parentSiblings.push(child);
          }
        } else {
          parentSiblings.push(child);
        }
      });

      const parentSiblingsValidity = parentSiblings.map((child) => {
        // if text node
        if (child.nodeType === Node.TEXT_NODE) {
          return true;
        }

        // // if not text node but contains a tag or button
        // if (child instanceof Element && (child.tagName === 'A' || child.tagName === 'BUTTON')) {
        //   return false;
        // }

        // if not text node and not a tag or button BUT has children that are a tags or buttons
        if (child instanceof Element) {
          const hasTagsOrButtons = Array.from(child.childNodes).some((grandChild) => {
            return grandChild instanceof Element && (grandChild.tagName === 'A' || grandChild.tagName === 'BUTTON');
          });

          return !hasTagsOrButtons;
        }

        // if not text node but inline
        if (child instanceof Element && window.getComputedStyle(child).display === 'inline') {
          return true;
        }

        // if not text node and not inline but all of its children are inline
        if (child instanceof Element && window.getComputedStyle(child).display !== 'inline') {
          const inlineChildren = [];
          const childrenTags = [];

          (child.childNodes || []).forEach((grandChild) => {
            if (grandChild instanceof Element && window.getComputedStyle(grandChild).display === 'inline') {
              inlineChildren.push(grandChild);
              if (grandChild.tagName === 'A' || grandChild.tagName === 'BUTTON') {
                childrenTags.push(grandChild);
              }
            }

            if (grandChild.nodeType === Node.TEXT_NODE) {
              inlineChildren.push(grandChild);
            }
          });

          // if all children are a tag or button, return false
          if (childrenTags.length === child.childNodes.length) {
            return false;
          }

          return inlineChildren.length === child.childNodes.length;
        }

        return false;
      });

      const shouldAssignFullText = parentSiblingsValidity.every((validity) => validity);    
      
      // check if all parent siblings are links or buttons
      const isAllParentSiblingsAreLinksOrButtons = parentSiblings.every((child) => {
        return child instanceof Element && (child.tagName === 'A' || child.tagName === 'BUTTON');
      });

      if (parentSiblings.length > 1 && shouldAssignFullText && !isAllParentSiblingsAreLinksOrButtons) {
        // console.log('node', node, parentSiblings);
        const textNodes = collectAllTextContentInsideNode(node.parentNode.parentNode);

        if (textNodes.length > 1) {
          assignFullTextToTextNodes(node.parentNode.parentNode, textNodes);
        };
      }
    } 
    
    // else {
    //   for (let sibling of node.parentNode.childNodes) {
    //     if (sibling.nodeType !== Node.TEXT_NODE && sibling instanceof Element && window.getComputedStyle(sibling).display === 'inline') {
    //       const { fullTextArray, fullText } = collectInlineTextNodes(node);
    //       if (fullTextArray.length > 1) {
    //         node.fullText = fullText;
    //         node.fullTextArray = fullTextArray;
    //       }
    //     }
    //   }
    // }

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