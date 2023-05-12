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
  //get only text nodes textContent in array
  const textNodesTextContent = textNodes.map((textNode) => textNode.textContent)
  console.log("textNodesTextContent:", textNodesTextContent)

  //PROBLEM: THE NODES NEED TO COME BACK IN THE SAME ORDER AS THEY WERE SENT!!!!
  getTranslationsFromAPI(textNodesTextContent, language, apiKey).then((response) => {
    console.log("response:", response)
    // make a for loop to replace textNodes textContent with the response
    response.forEach((chunk, index) => {
      console.log("chunk:", chunk, index, textNodes[index].textContent)
      textNodes[index].textContent = chunk
    })
  })



  // for (let textNode of textNodes) {
  //   textNode.textContent = processFunction(textNode.textContent);
  // }
}

async function modifyHtmlStrings(rootElement, language, apiKey) {
  const textNodes = [];
  extractTextNodes(rootElement, textNodes);
  console.log("textNodes:", textNodes)
  const validTextNodes = filterValidTextNodes(textNodes);
  console.log("textNodes:", validTextNodes)
  processTextNodes(validTextNodes, language, apiKey);
}


function getTranslations(rawHTML, language, apiKey) {
  //TODO check if language is set in localstorage 
  //If no lang set check browser setting and use that 


  console.log("rawHTML:", rawHTML)
  const modifiedHtmlString = modifyHtmlStrings(rawHTML, language, apiKey)
  console.log("modifiedHtmlString:", modifiedHtmlString)
  // return modifiedHtmlString
}



// function getTranslations() {
//   return "hello NPM"
// }

module.exports = getTranslations