// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'

// initialize new event "locationchange"
if (isBrowser) {
  (() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };
  
    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };
  
    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });
  })();
}

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
      });
  });
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
    const trimmedContent = textNode.textContent.trim();
    return (
      trimmedContent.length > 1 ||
      (trimmedContent !== "." &&
        trimmedContent !== "!" &&
        trimmedContent !== "?")
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

  // for (let textNode of textNodes) {
  //   textNode.textContent = processFunction(textNode.textContent);
  // }
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

// function checkForWeployExcludeClasses(rawHTML) {

//   // Clone the element to not change the original DOM
//   const elementsToExclude = Array.from(rawHTML.getElementsByClassName('weploy-exclude'))
//   console.log("Checking for weploy exclude classes", elementsToExclude)
//   const parentsAndIndexes = elementsToExclude.map((element) => {
//     const parent = element.parentNode;
//     const index = Array.from(parent.children).indexOf(element);
//     console.log("Checking for weploy exclude classes2", { element, parent, index })
//     return { element, parent, index };
//   });

//   elementsToExclude.forEach((element) => {
//     console.log("There was an element to exclude")
//     element.parentNode.removeChild(element);
//   });

//   return { filteredHtml: rawHTML, parentsAndIndexes };
// }

async function startTranslationCycle(node, apiKey, observer) {
  console.log("Translation cycle START");

  // const { filteredHtml, parentsAndIndexes } = checkForWeployExcludeClasses(node)

  await modifyHtmlStrings(node, getLanguageFromLocalStorage(), apiKey);

  // parentsAndIndexes.forEach(({ element, parent, index }) => {
  //   parent.insertBefore(element, parent.children[index]);
  // });
  console.log("Translation cycle END");
}
// function createHandleMutations(apiKey) {
//   return function handleMutations(mutations, observer) {
//   console.log("lol")

//   for (let mutation of mutations) {
//     // If the mutation was the addition of nodes
//     if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//       startTranslationCycle(mutation.addedNodes, apiKey, observer)
//       // for (let node of mutation.addedNodes) {
//       //   // If the node or any of its children are text nodes, log it
//       //   if (hasTextNodes(node)) {
//       //     console.log(node);

//       //   }
//       // }
//     }

//     // If the mutation was a change in text content
//     if (mutation.type === 'characterData') {
//       console.log(mutation.target.parentElement)
//       startTranslationCycle(mutation.target.parentElement, apiKey, observer)
//       // startTranslationCycle(mutation.target.parentElement, apiKey)
//     }
//   }
// }
// }

var isChangeLocationEventAdded;

export async function getTranslations(apiKey) {
  //Remove observer again because of client side h8rt
  // let observerHandler = createHandleMutations(apiKey)
  // let observer = new MutationObserver(observerHandler);

  try {
    const initalRawHTML = document.getElementById("weploy-translate");

    if (getLanguageFromLocalStorage() === null) {
      saveLanguageToLocalStorage();
    }
    
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        startTranslationCycle(initalRawHTML, apiKey, null).catch(reject);
        
        if (isBrowser && !isChangeLocationEventAdded) {
          window.addEventListener("locationchange", function () {
            getTranslations(apiKey).catch(reject)
          });
    
          isChangeLocationEventAdded = true;
        }

        resolve();
      }, 500);
    })
  } catch(err) {
    console.error(err)
  }

}

export function switchLanguage(language) {
  localStorage.setItem("language", language);
  setTimeout(() => {
    location.reload();
  }, 1000);
}

export function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    let language = localStorage.getItem("language");
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

export default {
  getTranslations,
  switchLanguage,
  getSelectedLanguage
};
