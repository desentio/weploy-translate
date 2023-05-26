const CheckIfTranslatable = require('./utility.js');
// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'


function saveLanguageToLocalStorage() {
  var language = navigator.language || navigator.userLanguage; // Get browser language
  // Save the language to local storage
  localStorage.setItem("language", language);
}

function getLanguageFromLocalStorage() {
  const language = localStorage.getItem("language");
  return language; // Get the language from local storage
}

function getTranslationsFromAPI(strings, language, apiKey) {
  const finalPayload = {
    strings: strings,
    language: language,
    url: window.location.pathname + window.location.search,
    // apiKey: apiKey
  };

  return new Promise((resolve) => {
    fetch("https://api.tasksource.io/get-translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify(finalPayload)
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.error(err);
        resolve("error");
      })
  });
}

function extractTextNodes(node, textNodes) {
  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    // filter out weploy-exclude
    if (
      node &&
      node.className &&
      typeof node.className == "string" &&
      node.className.includes("weploy-exclude")
    )
      return;
    for (let child of node.childNodes) {
      extractTextNodes(child, textNodes);
    }
  }
}

function filterValidTextNodes(textNodes) {
  return textNodes.filter((textNode) => {
    const textContent = textNode.textContent
    return (
      CheckIfTranslatable(textContent) != "inValid"
    );
  });
}

function processTextNodes(textNodes, language, apiKey) {
  return new Promise(async (resolve, reject) => {
    // remove empty string
    const cleanTextNodes = textNodes.filter(
      (textNode) =>
        typeof textNode.textContent == "string" && !!textNode.textContent.trim()
    );

    //get only text nodes textContent in array
    const textNodesTextContent = cleanTextNodes.map(
      (textNode) => textNode.textContent
    );

    console.log("Input textNodesTextContent:", textNodesTextContent);

    //PROBLEM: THE NODES NEED TO COME BACK IN THE SAME ORDER AS THEY WERE SENT!!!!
    getTranslationsFromAPI(textNodesTextContent, language, apiKey).then(
      (response) => {
        // make a for loop to replace textNodes textContent with the response
        response.forEach((chunk, index) => {
          cleanTextNodes[index].textContent = chunk;
        });
        console.log("Responce was received", response);
        resolve();
      }
    ).catch(err => reject(err));
  });
}

function modifyHtmlStrings(rootElement, language, apiKey) {
  return new Promise(async (resolve, reject) => {
    const textNodes = [];
    extractTextNodes(rootElement, textNodes);

    const validTextNodes = filterValidTextNodes(textNodes);
    await processTextNodes(validTextNodes, language, apiKey).catch(reject);

    resolve();
  });
}

async function startTranslationCycle(node, apiKey, observer) {
  console.log("Translation cycle START");
  await modifyHtmlStrings(node, getLanguageFromLocalStorage(), apiKey);
  console.log("Translation cycle END");
}

async function getTranslations(apiKey) {

  try {
    const initalRawHTML = document.getElementById("weploy-translate");

    if (getLanguageFromLocalStorage() === null) {
      saveLanguageToLocalStorage();
    }
    
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        startTranslationCycle(initalRawHTML, apiKey, null).catch(reject);
        resolve();
      }, 500);
    })
  } catch(err) {
    console.error(err)
  }

}

function switchLanguage(language) {
  localStorage.setItem("language", language);
  setTimeout(() => {
    location.reload();
  }, 1000);
}

function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    let language = localStorage.getItem("language");
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
// export default {
//   getTranslations,
//   switchLanguage,
//   getSelectedLanguage
// };
