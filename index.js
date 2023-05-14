// function splitString(inputString) {
//   const chunkSize = 4000;

//   const stringChunks = [];
//   for (let i = 0; i < inputString.length; i += chunkSize) {
//     const currentStringChunk = inputString.slice(i, i + chunkSize);
//     const cleanStringChunk = currentStringChunk.replace(/"/g, "'")
//     stringChunks.push(cleanStringChunk);
//   }

//   return stringChunks;
// }

function saveLanguageToLocalStorage() {
  var language = navigator.language || navigator.userLanguage; // Get browser language
  // var language = (navigator.language || navigator.userLanguage).substr(0, 2); // Get browser language
  console.log("language in local storage:", language);
  // Save the language to local storage
  localStorage.setItem("language", language);
}

function getLanguageFromLocalStorage() {
  const language = localStorage.getItem("language");
  console.log("language in local storage:", language);
  return language; // Get the language from local storage
}

function getTranslationsFromAPI(strings, language, apiKey) {
  const finalPayload = {
    strings: strings,
    language: language,
    apiKey: apiKey,
  }

  return new Promise((resolve) => {
    fetch("http://localhost:8080/get-translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    }).then((response) => response.json())
      .then((data) => { resolve(data) });
  })
}

function hasTextNodes(node) {
  for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
          return true;
      }

      if (child.nodeType === Node.ELEMENT_NODE && hasTextNodes(child)) {
          return true;
      }
  }

  return false;
}


// function getTranslation(payloadChunks, language) {

//   let resultChunks = []

//   return new Promise((resolve) => {
//     console.log("payload:", {
//       chunkInputSize: payloadChunks.length,
//       language: language,
//       payload: payloadChunks,
//     })

//     payloadChunks.forEach(async (chunk) => {
//       const result = await getTranslationsFromAPI(chunk, language)
//       resultChunks.push(result)
//       console.log("Chunk resived:", {
//         inputChunkSize: resultChunks.length,
//         resultChunkSize: result.length,
//         language: language,
//         result: resultChunks,
//       })
//       if (resultChunks.length === payloadChunks.length) {
//         resolve(resultChunks)
//       }
//     })
//   })
// }

function extractTextNodes(node, textNodes) {
  console.log("node:", node)
  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    for (let child of node.childNodes) {
      extractTextNodes(child, textNodes);
    }
  }
}

function filterValidTextNodes(textNodes) {
  return textNodes.filter(textNode => {
    const trimmedContent = textNode.textContent.trim();
    return trimmedContent.length > 1 || (trimmedContent !== '.' && trimmedContent !== '!' && trimmedContent !== '?');
  });
}

function processTextNodes(textNodes, language, apiKey) {
  // remove empty string
  const cleanTextNodes = textNodes.filter(
    (textNode) =>
      typeof textNode.textContent == "string" && !!textNode.textContent.trim()
  );

  //get only text nodes textContent in array
  const textNodesTextContent = cleanTextNodes.map(
    (textNode) => textNode.textContent
  );
  console.log("textNodesTextContent:", textNodesTextContent);

  //PROBLEM: THE NODES NEED TO COME BACK IN THE SAME ORDER AS THEY WERE SENT!!!!
  getTranslationsFromAPI(textNodesTextContent, language, apiKey).then(
    (response) => {
      console.log("response:", response);
      // make a for loop to replace textNodes textContent with the response
      response.forEach((chunk, index) => {
        console.log("chunk:", chunk, index, cleanTextNodes[index].textContent);
        cleanTextNodes[index].textContent = chunk;
      });
    }
  );

  // for (let textNode of textNodes) {
  //   textNode.textContent = processFunction(textNode.textContent);
  // }
}

async function modifyHtmlStrings(rootElement, language, apiKey) {
  console.log("rootElement:", rootElement)
  const textNodes = [];
  extractTextNodes(rootElement, textNodes);
  console.log("textNodes:", textNodes)
  const validTextNodes = filterValidTextNodes(textNodes);
  console.log("textNodes:", validTextNodes)
  processTextNodes(validTextNodes, language, apiKey);
}

function checkForWeployExcludeClasses(rawHTML) {
  // Clone the element to not change the original DOM
  const elementsToExclude = rawHTML.querySelectorAll('.weploy-exclude')
  
  elementsToExclude.forEach((element) => {
      element.parentNode.removeChild(element);
  });
  
  // Convert the element back to a string
  const filteredHtml = rawHTML;
  console.log("filteredHtml:", filteredHtml)
  return filteredHtml;
}


function getTranslations(apiKey) {
  //TODO check if language is set in localstorage 
  const observer = new MutationObserver(mutations => {
    // Iterate over all mutations that just occured
    for(let mutation of mutations) {
        // If the mutation was the addition of nodes
        if(mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for(let node of mutation.addedNodes) {
                // If the node or any of its children are text nodes, log it
                if (hasTextNodes(node)) {
                    modifyHtmlStrings(checkForWeployExcludeClasses(node), getLanguageFromLocalStorage(), apiKey)
                    console.log(node.outerHTML);
                }
            }
        }
    }
  });
  
  //If no lang set check browser setting and use that 
  const observerConfig = { childList: true, subtree: true };
  initalRawHTML = document.getElementById('weploy-translate');

  observer.observe(initalRawHTML, observerConfig);
  const pageHtml = checkForWeployExcludeClasses(initalRawHTML)
  console.log("getLanguageFromLocalStorage()", pageHtml)
  if (getLanguageFromLocalStorage() === null) {
    saveLanguageToLocalStorage()
  }

  modifyHtmlStrings(pageHtml, getLanguageFromLocalStorage(), apiKey)
}


function switchLanguage(language) {
  //set new language in local storage
  localStorage.setItem('language', language)
  setTimeout(() => {
    location.reload()
  }, 1000)

  //reload page
}


function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    let language = localStorage.getItem('language');
    if (language) {
      console.log('Language found in local storage:', language);
      resolve(language); // Resolve the promise
    } else {
      console.log('Language not found in local storage.');
    }
  })
}

module.exports = {
  getTranslations,
  switchLanguage,
  getSelectedLanguage
}
