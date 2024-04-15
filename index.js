const CheckIfTranslatable = require('./utility.js');
const cssModule = require('./weploy.css');
const css = cssModule.default || cssModule;

const allWeployLanguages = [
  { "label": "Afar", "lang": "aa" },
  { "label": "Avestan", "lang": "ae" },
  { "label": "Afrikaans", "lang": "af" },
  { "label": "Akan", "lang": "ak" },
  { "label": "Amharic", "lang": "am" },
  { "label": "Arabic", "lang": "ar" },
  { "label": "Azerbaijani", "lang": "az" },
  { "label": "Belarusian", "lang": "be" },
  { "label": "Bulgarian", "lang": "bg" },
  { "label": "Bambara", "lang": "bm" },
  { "label": "Bislama", "lang": "bi" },
  { "label": "Bengali", "lang": "bn" },
  { "label": "Tibetan", "lang": "bo" },
  { "label": "Bosnian", "lang": "bs" },
  { "label": "Czech", "lang": "cs" },
  { "label": "Danish", "lang": "da" },
  { "label": "German", "lang": "de" },
  { "label": "Divehi", "lang": "dv" },
  { "label": "Dzongkha", "lang": "dz" },
  { "label": "Greek", "lang": "el" },
  { "label": "English", "lang": "en" },
  { "label": "Spanish", "lang": "es" },
  { "label": "Estonian", "lang": "et" },
  { "label": "Persian", "lang": "fa" },
  { "label": "Finnish", "lang": "fi" },
  { "label": "Fijian", "lang": "fj" },
  { "label": "Faroese", "lang": "fo" },
  { "label": "French", "lang": "fr" },
  { "label": "Irish", "lang": "ga" },
  { "label": "Guarani", "lang": "gn" },
  { "label": "Hebrew", "lang": "he" },
  { "label": "Hindi", "lang": "hi" },
  { "label": "Hiri Motu", "lang": "ho" },
  { "label": "Croatian", "lang": "hr" },
  { "label": "Haitian", "lang": "ht" },
  { "label": "Hungarian", "lang": "hu" },
  { "label": "Armenian", "lang": "hy" },
  { "label": "Indonesian", "lang": "id" },
  { "label": "Icelandic", "lang": "is" },
  { "label": "Italian", "lang": "it" },
  { "label": "Japanese", "lang": "ja" },
  { "label": "Georgian", "lang": "ka" },
  { "label": "Kongo", "lang": "kg" },
  { "label": "Korean", "lang": "ko" },
  { "label": "Latin", "lang": "la" },
  { "label": "Luxembourgish", "lang": "lb" },
  { "label": "Lao", "lang": "lo" },
  { "label": "Lithuanian", "lang": "lt" },
  { "label": "Latvian", "lang": "lv" },
  { "label": "Malagasy", "lang": "mg" },
  { "label": "Marshallese", "lang": "mh" },
  { "label": "Maori", "lang": "mi" },
  { "label": "Macedonian", "lang": "mk" },
  { "label": "Mongolian", "lang": "mn" },
  { "label": "Malay", "lang": "ms" },
  { "label": "Maltese", "lang": "mt" },
  { "label": "Burmese", "lang": "my" },
  { "label": "Nauru", "lang": "na" },
  { "label": "Nepali", "lang": "ne" },
  { "label": "Dutch", "lang": "nl" },
  { "label": "Norwegian", "lang": "no" },
  { "label": "Polish", "lang": "pl" },
  { "label": "Portuguese", "lang": "pt" },
  { "label": "Romanian", "lang": "ro" },
  { "label": "Russian", "lang": "ru" },
  { "label": "Kinyarwanda", "lang": "rw" },
  { "label": "Sindhi", "lang": "sd" },
  { "label": "Slovak", "lang": "sk" },
  { "label": "Slovenian", "lang": "sl" },
  { "label": "Somali", "lang": "so" },
  { "label": "Albanian", "lang": "sq" },
  { "label": "Serbian", "lang": "sr" },
  { "label": "Swedish", "lang": "sv" },
  { "label": "Swahili", "lang": "sw" },
  { "label": "Tajik", "lang": "tg" },
  { "label": "Thai", "lang": "th" },
  { "label": "Tigrinya", "lang": "ti" },
  { "label": "Turkmen", "lang": "tk" },
  { "label": "Turkish", "lang": "tr" },
  { "label": "Ukrainian", "lang": "uk" },
  { "label": "Uzbek", "lang": "uz" },
  { "label": "Vietnamese", "lang": "vi" },
  { "label": "Chinese", "lang": "zh" },
];

// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'

// var isChangeLocationEventAdded;
var isDomListenerAdded;
var weployOptions;
const API_URL = "https://api.tasksource.io"

// Convert hex color to RGB
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}
// Convert named color to RGB
function namedToRgb(color) {
  var dummy = document.createElement("div");
  dummy.style.color = color;
  document.body.appendChild(dummy);
  var cs = window.getComputedStyle(dummy),
      pv = cs.getPropertyValue("color");
  document.body.removeChild(dummy);
  var rgb = pv.split("(")[1].split(")")[0].split(",");
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

// Check if color is light
function isLightColor(r, g, b) {
  // Counting the perceptive luminance - human eye favors green color
  var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return (a < 0.5);
}

// Generate lighter color
function lightenColor(color, percent) {
  var num = parseInt(color,16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  B = (num >> 8 & 0x00FF) + amt,
  G = (num & 0x0000FF) + amt;
  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

// Generate darker color
function darkenColor(color, percent) {
  var num = parseInt(color,16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) - amt,
  B = (num >> 8 & 0x00FF) - amt,
  G = (num & 0x0000FF) - amt;
  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

function getStaticGlobeIcon(strokeColor) {
    // Create a new div element
    var newDiv = document.createElement("div");

    // Set the innerHTML of the div
    newDiv.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.7906 28.9982C19.4502 29.0445 22.0498 28.2061 24.1813 26.6148C26.3128 25.0236 27.8555 22.7694 28.5671 20.2064M16.7906 28.9982C14.131 28.9516 11.5622 28.0231 9.48748 26.3584C7.4128 24.6937 5.94973 22.3871 5.328 19.8007M16.7906 28.9982C20.1034 29.056 22.8834 23.7304 22.9991 17.1047C23.1147 10.4791 20.5222 5.05968 17.2094 5.00185M16.7906 28.9982C13.4777 28.9404 10.8853 23.521 11.0009 16.8953C11.1166 10.2697 13.8966 4.94402 17.2094 5.00185M28.5671 20.2064C28.8305 19.2508 28.9801 18.2466 28.9982 17.2095C29.0375 15.146 28.5415 13.1075 27.5585 11.2928M28.5671 20.2064C24.9775 22.1152 20.9601 23.0764 16.8953 22.9991C12.6799 22.9255 8.73815 21.7699 5.328 19.8007M5.328 19.8007C5.09283 18.8151 4.98323 17.8037 5.00182 16.7906C5.03917 14.6509 5.63417 12.6503 6.64706 10.9277M17.2094 5.00185C19.3374 5.03811 21.4175 5.63986 23.2362 6.74538C25.0548 7.8509 26.5467 9.42037 27.5585 11.2928M17.2094 5.00185C15.0814 4.96382 12.9816 5.49262 11.1255 6.53399C9.26935 7.57536 7.72367 9.09181 6.64706 10.9277M27.5585 11.2928C24.612 13.7563 20.8749 15.0729 17.0349 15.0003C13.0382 14.9306 9.40832 13.4003 6.64706 10.9277" stroke="${strokeColor}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    return newDiv;
}

function getLoadingGlobeIcon(strokeColor = "#241c15") {
    // Check if the stroke color is a named color
    const isNamedColor = isNaN(parseInt(strokeColor, 16));
    const isRgbColor = strokeColor.startsWith('rgb');
    const isRgbaColor = strokeColor.startsWith('rgba');

    let rgbColor;
    if (isNamedColor) {
      rgbColor = namedToRgb(strokeColor);
    } else if (isRgbColor || isRgbaColor) {
      const rgb = strokeColor.split("(")[1].split(")")[0].split(",");
      rgbColor = { r: rgb[0], g: rgb[1], b: rgb[2] };
    } else {
      rgbColor = hexToRgb(strokeColor);
    }

    const spinnerColor = isLightColor(rgbColor.r, rgbColor.g, rgbColor.b) ? darkenColor(strokeColor, 20) : lightenColor(strokeColor, 20);

    // Create a new div element
    const newDiv = document.createElement("div");

    // Set the innerHTML of the div
    newDiv.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.7906 28.9982C14.131 28.9516 11.5622 28.0231 9.48748 26.3584C7.4128 24.6937 5.94973 22.3871 5.328 19.8007M16.7906 28.9982C13.4777 28.9404 10.8853 23.521 11.0009 16.8953C11.1166 10.2697 13.8966 4.94402 17.2094 5.00185M16.7906 28.9982C17.4055 29.0089 18.0021 28.8342 18.5667 28.5M16.7906 28.9982C17.4353 29.0094 17.904 28.9456 18.4338 28.8411M5.328 19.8007C8.73815 21.7699 12.6799 22.9255 16.8953 22.9991C17.5541 23.0116 18.2116 22.9969 18.8663 22.9553M5.328 19.8007C5.09283 18.8151 4.98323 17.8037 5.00182 16.7906C5.03917 14.6509 5.63417 12.6503 6.64706 10.9277M17.2094 5.00185C20.5222 5.05968 23.1147 10.4791 22.9991 17.1047C22.9878 17.7501 22.9513 18.3831 22.8914 19M17.2094 5.00185C19.3374 5.03811 21.4175 5.63986 23.2362 6.74538C25.0548 7.8509 26.5467 9.42037 27.5585 11.2928M17.2094 5.00185C15.0814 4.96382 12.9816 5.49262 11.1255 6.53399C9.26935 7.57536 7.72367 9.09181 6.64706 10.9277M27.5585 11.2928C24.612 13.7563 20.8749 15.0729 17.0349 15.0003C13.0382 14.9306 9.40832 13.4003 6.64706 10.9277M27.5585 11.2928C28.5415 13.1075 29.0375 15.146 28.9982 17.2095C28.9905 17.6459 28.9597 18.0764 28.9068 18.5" stroke="${strokeColor}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    <g style="animation: weployspin 2s linear infinite; transform-origin: 26px 26px;">
      <circle cx="26" cy="26" r="7.125" stroke="${strokeColor}" stroke-width="1.75"></circle>
      <circle cx="26" cy="26" r="7.125" stroke="#${spinnerColor}" stroke-width="1.75" stroke-dasharray="31.42" stroke-dashoffset="10.47"></circle>
    </g>
</svg>
    `;

// newDiv.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M16.7906 28.9982C14.131 28.9516 11.5622 28.0231 9.48748 26.3584C7.4128 24.6937 5.94973 22.3871 5.328 19.8007M16.7906 28.9982C13.4777 28.9404 10.8853 23.521 11.0009 16.8953C11.1166 10.2697 13.8966 4.94402 17.2094 5.00185M16.7906 28.9982C17.4055 29.0089 18.0021 28.8342 18.5667 28.5M16.7906 28.9982C17.4353 29.0094 17.904 28.9456 18.4338 28.8411M5.328 19.8007C8.73815 21.7699 12.6799 22.9255 16.8953 22.9991C17.5541 23.0116 18.2116 22.9969 18.8663 22.9553M5.328 19.8007C5.09283 18.8151 4.98323 17.8037 5.00182 16.7906C5.03917 14.6509 5.63417 12.6503 6.64706 10.9277M17.2094 5.00185C20.5222 5.05968 23.1147 10.4791 22.9991 17.1047C22.9878 17.7501 22.9513 18.3831 22.8914 19M17.2094 5.00185C19.3374 5.03811 21.4175 5.63986 23.2362 6.74538C25.0548 7.8509 26.5467 9.42037 27.5585 11.2928M17.2094 5.00185C15.0814 4.96382 12.9816 5.49262 11.1255 6.53399C9.26935 7.57536 7.72367 9.09181 6.64706 10.9277M27.5585 11.2928C24.612 13.7563 20.8749 15.0729 17.0349 15.0003C13.0382 14.9306 9.40832 13.4003 6.64706 10.9277M27.5585 11.2928C28.5415 13.1075 29.0375 15.146 28.9982 17.2095C28.9905 17.6459 28.9597 18.0764 28.9068 18.5" stroke="${strokeColor}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
//     <circle cx="26" cy="26" fill="none" stroke="${strokeColor || 'currentColor'}" stroke-width="1.75" r="7.125" stroke-dasharray="44.5 14.8">
//     <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 26 26;360 26 26" keyTimes="0;1"></animateTransform>
// </circle>

// </svg>
//     `;
    return newDiv;
}

function getErrorGlobeIcon(strokeColor) {
  // Create a new div element
  var newDiv = document.createElement("div");

  // Set the innerHTML of the div
  newDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
  <path d="M16.7906 28.9982C14.131 28.9516 11.5622 28.0231 9.48748 26.3584C7.4128 24.6937 5.94973 22.3871 5.328 19.8007M16.7906 28.9982C13.4777 28.9404 10.8853 23.521 11.0009 16.8953C11.1166 10.2697 13.8966 4.94402 17.2094 5.00185M16.7906 28.9982C17.4055 29.0089 18.0021 28.8342 18.5667 28.5M16.7906 28.9982C17.4353 29.0094 17.904 28.9456 18.4338 28.8411M5.328 19.8007C8.73815 21.7699 12.6799 22.9255 16.8953 22.9991C17.5541 23.0116 18.2116 22.9969 18.8663 22.9553M5.328 19.8007C5.09283 18.8151 4.98323 17.8037 5.00182 16.7906C5.03917 14.6509 5.63417 12.6503 6.64706 10.9277M17.2094 5.00185C20.5222 5.05968 23.1147 10.4791 22.9991 17.1047C22.9878 17.7501 22.9513 18.3831 22.8914 19M17.2094 5.00185C19.3374 5.03811 21.4175 5.63986 23.2362 6.74538C25.0548 7.8509 26.5467 9.42037 27.5585 11.2928M17.2094 5.00185C15.0814 4.96382 12.9816 5.49262 11.1255 6.53399C9.26935 7.57536 7.72367 9.09181 6.64706 10.9277M27.5585 11.2928C24.612 13.7563 20.8749 15.0729 17.0349 15.0003C13.0382 14.9306 9.40832 13.4003 6.64706 10.9277M27.5585 11.2928C28.5415 13.1075 29.0375 15.146 28.9982 17.2095C28.9905 17.6459 28.9597 18.0764 28.9068 18.5" stroke="${strokeColor}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="26" cy="26" r="7.125" stroke="red" stroke-width="1.75"/>
  <path d="M26 23V25" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M26 29V30" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `;
  return newDiv;
}

function renderWeploySelectorState() {
  if (!window.weployValueDisplays.length) return;

  window.weployValueDisplays.forEach((selector, selectorIndex) => {
    const loadingIcon = window.weployLoadingGlobeIcons[selectorIndex];
    const staticIcon = window.weployStaticGlobeIcons[selectorIndex];
    const errorIcon = window.weployErrorGlobeIcons[selectorIndex];
    const firstChild = selector.firstChild;

    if (!firstChild || !staticIcon || !loadingIcon || !errorIcon) {
      return;
    }

    if (!selector.contains(staticIcon) && !selector.contains(loadingIcon) && !selector.contains(errorIcon)) {
      const whatShouldBeInserted = window.weployTranslating ? loadingIcon : staticIcon;

      if (selector.contains(firstChild)) {
        selector.insertBefore(whatShouldBeInserted, firstChild);
      }
      return;
    }

    if (window.weployTranslating) {
      if (selector.contains(staticIcon)) {
        selector.replaceChild(loadingIcon, staticIcon);
      }
      if (selector.contains(errorIcon)) {
        selector.replaceChild(loadingIcon, errorIcon);
      }
      return;
    }

    if (window.weployError) {
      if (selector.contains(staticIcon)) {
        selector.replaceChild(errorIcon, staticIcon);
      }
      if (selector.contains(loadingIcon)) {
        selector.replaceChild(errorIcon, loadingIcon);
      }
      return;
    }

    selector.replaceChild(staticIcon, loadingIcon);
  });
}

if (isBrowser) {
  window.translationCache = {}
  window.currentPathname = isBrowser ? window.location.pathname : null
  window.weployValueDisplays = [];
  window.weployStaticGlobeIcons = [];
  window.weployLoadingGlobeIcons = [];
  window.weployErrorGlobeIcons = [];
}

// initialize new event "pathnamechange"
if (isBrowser) {
  (() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
        return ret;
    };
  
    window.addEventListener('popstate', () => {
        if (window.location.pathname != currentPathname) {
          window.dispatchEvent(new Event('pathnamechange'));
          window.currentPathname = window.location.pathname
        }
    });
  })();
}


// Declare a variable called 'timer' to store the timer ID
if (isBrowser) {
  window.weployTimer = null;
}

const debounce = (mainFunction, delay = 2000) => {
  if (!isBrowser) return mainFunction(...args);

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(window.weployTimer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    window.weployTimer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

function isURL(str) {
  const pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})"+ // domain name and extension
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*"+ // port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?"+ // query string
      "(\\#[-a-zA-Z\\d_]*)?$", "i"); // fragment locator
  return !!pattern.test(str);
}

function getWeployOptions() {
  if (isBrowser) return window.weployOptions;
  return weployOptions;
}

function hasExcludedParent(node) {
  while (node && node !== document.body) {
      if (node.classList && node.classList.contains('weploy-exclude')) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}

function saveLanguageToLocalStorage(availableLangs = [], useBrowserLang = true) {
  const language = navigator.language || navigator.userLanguage; // Get browser language (usually in this format: en-US)
  const langIsoCode = language && language.length >= 2 ? language.substring(0, 2) : null // Get the language ISO code
  const langInAvailableLangs = availableLangs.find(lang => lang.lang == langIsoCode) //  Check if the language is in the available languages

  // if no available languages, return
  if (!availableLangs.length) {
    return;
  }

  const langInAvailableLangsOrFirst = langInAvailableLangs?.lang || availableLangs[0].lang // If the language is not in the available languages, use the first available language
  const langToSave = useBrowserLang ? langInAvailableLangsOrFirst : availableLangs[0].lang // If useBrowserLang is true, use the language from the browser, otherwise use the first available language
  // Save the language to local storage
  localStorage.setItem("language", langToSave);
}

async function getLanguageFromLocalStorage() {
  const optsArgs = getWeployOptions()
  const apiKey = optsArgs.apiKey

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const paramsLang = params.get('lang');
  const localStorageLang = localStorage.getItem("language");

  if (paramsLang && (paramsLang != localStorageLang)) {
    localStorage.setItem("language", paramsLang);
  }
  let language = paramsLang || localStorageLang;
  
  const availableLangs = await fetchLanguageList(apiKey);
  if (!availableLangs.find(l => l.lang == language)) {
    saveLanguageToLocalStorage(availableLangs, optsArgs.useBrowserLanguage);
  }
  return language; // Get the language from local storage
}

function getTranslationsFromAPI(strings, language, apiKey) {
  const finalPayload = {
    strings: strings,
    language: language,
    url: window.location.pathname,
    // apiKey: apiKey
  };

  return new Promise((resolve) => {
    fetch(API_URL + "/weploy/get-translations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify(finalPayload)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data?.error?.message || data?.error || "Error fetching translations");
        }
        resolve(data);
      })
      .catch((err) => {
        console.error(err);
        if (isBrowser) {
          window.weployError = err.message;
          renderWeploySelectorState();
        }
        resolve([]);
      })
  });
}

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
    // filter out weploy-exclude
    if (
      node &&
      node.className &&
      typeof node.className == "string" &&
      (node.className.includes("weploy-exclude") || window.weployOptions.excludeClasses.length && window.weployOptions.excludeClasses.some(excludeClass => excludeClass && node.className.includes(excludeClass)) )
    ) {
      return;
    }
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

function processTextNodes(textNodes, language = "", apiKey) {
  // dont translate google translate
  if (isBrowser && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) return;
  
  // dont translate original language
  const langs = window.weployOptions.definedLanguages || (weployOptions || {}).definedLanguages;
  if (langs && langs[0] && langs[0].lang == language.substring(0, 2).toLowerCase()) {
    return new Promise((resolve, reject) => {
      console.log("Original language is not translatable")
      reject("Original language is not translatable");
    })
  }
  return new Promise(async (resolve, reject) => {
    // Remove empty strings
    const cleanTextNodes = textNodes.filter(
      (textNode) =>
        typeof textNode.textContent == "string" && !!textNode.textContent.trim()
    );

    // Initialize cache if not exist yet
    if (!window.translationCache) {
      window.translationCache = {}
    }

    // Initialize language cache if not exist yet
    if (!window.translationCache[language]) {
      window.translationCache[language] = {};
    }

    let notInCache = [];

    // Check cache for each textNode
    cleanTextNodes.forEach((node) => {
      const text = node.textContent;
      const cacheValues = Object.values(window.translationCache[language] || {});
      if (
        !window.translationCache[language][text] // check in key
        && !cacheValues.includes(text) // check in value (to handle nodes that already translated)
      ) {
        notInCache.push(text); // If not cached, add to notInCache array
      }
    });

    if (notInCache.length > 0) { 
      // If there are translations not in cache, fetch them from the API
      getTranslationsFromAPI(notInCache, language, apiKey).then(
        (response) => {
          notInCache.forEach((text, index) => {
            // Cache the new translations
            window.translationCache[language][text] = response[index] || text;
          });
          
          // Update textNodes from the cache
          cleanTextNodes.forEach((node) => {
            const text = node.textContent;
            if(window.translationCache[language][text]) {
              // make sure text is still the same before replacing
              if(node.textContent == text) {
                node.textContent = window.translationCache[language][text];
              }
            }
          });
          resolve();
        }
      ).catch(err => {
        console.error(err); // Log the error and resolve the promise without changing textNodes
        resolve();
      });
    } else {
      // If all translations are cached, directly update textNodes from cache
      cleanTextNodes.forEach((node) => {
        const text = node.textContent;
        if(window.translationCache[language][text]) {
          node.textContent = window.translationCache[language][text];
        }
      });
      resolve();
    }
  });
}

function modifyHtmlStrings(rootElement, language, apiKey) {
  return new Promise(async (resolve, reject) => {
    const textNodes = [];
    extractTextNodes(rootElement, textNodes);

    const validTextNodes = filterValidTextNodes(textNodes);

    window.weployError = false;
    window.weployTranslating = true;
    renderWeploySelectorState();
    await processTextNodes(validTextNodes, language, apiKey).catch(reject).finally(() => {
      window.weployTranslating = false;
      renderWeploySelectorState();
    });

    resolve();
  });
}

async function startTranslationCycle(node, apiKey, delay) {
  const lang = await getLanguageFromLocalStorage();

  return new Promise(async (resolve, reject) => {
    if (!delay) {
      await modifyHtmlStrings(node, lang, apiKey)
      resolve()
    } else {
      debounce(async () => {
        await modifyHtmlStrings(node, lang, apiKey);
        resolve();
      }, delay)();
    }
  })
  
  // window.cacheAlreadyChecked = true;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function getDefinedLanguages(originalLanguage, allowedLanguages = []) {
  if (originalLanguage && allowedLanguages && allowedLanguages.length) {
    const originalLang = allWeployLanguages.find(lang => lang.lang == originalLanguage);
    const allowedLangs = allWeployLanguages.filter(lang => allowedLanguages.includes(lang.lang));
    const langOptions= [originalLang, ...allowedLangs]

    if (originalLang) {
      return langOptions
    }
  }
}

function setOptions(apiKey, optsArgs) {
  const mappedOpts = {
    timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
    pathOptions: optsArgs.pathOptions || {},
    apiKey,
    excludeClasses: optsArgs.excludeClasses || [],
    definedLanguages: getDefinedLanguages(optsArgs.originalLanguage, optsArgs.allowedLanguages),
  }

  if (!isBrowser) {
    weployOptions = mappedOpts
  } else {
    window.weployOptions = mappedOpts
  }
}

async function getTranslations(apiKey, optsArgs = {}) {
  try {
    setOptions(apiKey, optsArgs)
    // if (!isBrowser) {
    //   weployOptions = {
    //     timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
    //     pathOptions: optsArgs.pathOptions || {},
    //     apiKey
    //   }
    // } else {
    //   window.weployOptions = {
    //     timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
    //     pathOptions: optsArgs.pathOptions || {},
    //     apiKey
    //   }
    // }

    // save language to local storage & delay 1 second to wait google translate
    await Promise.allSettled([
      fetchLanguageList(apiKey),
      delay(1000)
    ]);

    if (optsArgs.createSelector) {
      await createLanguageSelect(apiKey);
    } else {
      // set default value for custom selector
      try {
        // Get elements by class
        const classElements = [
          ...Array.from(document.getElementsByClassName("weploy-select")),
          ...Array.from(document.getElementsByClassName("weploy-select-with-name"))
        ];
        // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
        const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
        // Combine and deduplicate elements
        const weploySwitchers = Array.from(new Set([...classElements, ...idElementsStartsWithClassName]));

        // Populate the select element values based on getLanguageFromLocalStorage
        await Promise.all(weploySwitchers.map(async weploySwitcher => {
          let selectElem = weploySwitcher.querySelector('select.weploy-exclude');
          if (selectElem) {
            const selectedLang = await getLanguageFromLocalStorage();
            if (selectedLang != selectElem.value){
              selectElem.value = selectedLang;
            }
          }
        }));
      } catch(error) {
        console.log("error setting selector default values", error)
      }
    }

    // handle google translate
    if (isBrowser && (document.querySelector('html.translated-ltr') || document.querySelector('html.translated-rtl'))) return;

    return await new Promise(async (resolve, reject) => {
        const timeout = getWeployOptions().timeout;
        await startTranslationCycle(document.body, apiKey, timeout).catch(reject);

        if (isBrowser && !isDomListenerAdded) {
          // Select the target node
          const targetNode = document.body;

          // Create an observer instance with a callback to handle mutations
          const observer = new MutationObserver(function(mutationsList) {
            let nodes = [];
            for(let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                // Handling added nodes
                for(let addedNode of mutation.addedNodes) {
                  nodes.push(addedNode)
                }
              }
            }

            startTranslationCycle(document.body, apiKey, 2000).catch(reject)

            // function getTextNodes(rootElement) {
            //   if (hasExcludedParent(rootElement)) {
            //     return [];
            //   }

            //   const textNodes = [];
            //   extractTextNodes(rootElement, textNodes);
            //   const validTextNodes = filterValidTextNodes(textNodes);
            //   return validTextNodes
            // }

            // const textNodes = nodes.map(x => getTextNodes(x)).reduce((acc, c) => {
            //   return [...acc, ...c]
            // }, [])

            // processTextNodes(textNodes, getLanguageFromLocalStorage(), apiKey).catch(reject);
          });

          // Set up observer configuration: what to observe
          const config = { childList: true, subtree: true };

          // Start observing the target node with configured settings
          observer.observe(targetNode, config);

          isDomListenerAdded = true;
        }

        // if (isBrowser && !isChangeLocationEventAdded) {
        //   window.addEventListener("pathnamechange", function () {
        //     console.log("pathnamechange event triggered")
        //     // window.cacheAlreadyChecked = false;
        //     // timeout needed to wait until route fully changed
        //     const thisPathOpts = weployOptions.pathOptions[window.location.pathname]
        //     const timeout = (thisPathOpts && thisPathOpts.timeout) || weployOptions.timeout
        //     setTimeout(() => {
        //       getTranslations(apiKey, optsArgs).catch(reject)
        //     }, timeout);
        //   });
    
        //   isChangeLocationEventAdded = true;
        // }

        resolve();
    })
  } catch(err) {
    console.error(err)
  }

}

function addOrReplaceLangParam(url, lang) {
  let urlObj = new URL(url);
  let params = new URLSearchParams(urlObj.search);

  params.set('lang', lang);
  urlObj.search = params.toString();

  return urlObj.toString();
}

function switchLanguage(language) {
  localStorage.setItem("language", language);
  const updatedUrl = addOrReplaceLangParam(window.location.href, language);
  setTimeout(() => {
    window.location.href = updatedUrl;
    // location.reload();
  }, 1000);
}

async function fetchLanguageList(apiKey) {
  const langs = window.weployOptions.definedLanguages || (weployOptions || {}).definedLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;

  const availableLangs = await fetch(API_URL + "/weploy-projects/by-api-key", {
    headers: {
      "X-Api-Key": apiKey
    }
  })
  .then((res) => res.json())
  .then((res) => {
    if (res.error) {
      throw new Error(res.error?.message || res.error || "Error fetching languages")
    }
    const languages =  [res.language, ...res.allowedLanguages]
    const languagesWithFlagAndLabel = languages.map((lang, index) => ({
      lang,
      flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
      label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
    }))
    if (isBrowser) window.weployOptions.definedLanguages = languagesWithFlagAndLabel // store in global scope
    else weployOptions.definedLanguages = languagesWithFlagAndLabel // for npm package
    return languagesWithFlagAndLabel
  })
  .catch((err) => {
    console.error(err);
    // if (isBrowser) window.weployOptions.definedLanguages = [] // store in global scope
    // else weployOptions.definedLanguages = [] // for npm package
    if (isBrowser) {
      window.weployError = err.message;
      renderWeploySelectorState();
    }
    return [];
  })

  return availableLangs
}

async function createLanguageSelect(apiKey, optsArgs = {}) {
  if (!isBrowser) return;
  if (!apiKey) {
    console.error("Weploy API key is required");
    return;
  }  

  // Check if the style tag already exists
  if (!document.getElementById('weploy-style')) {
    const style = document.createElement('style');
    style.id = 'weploy-style';
    style.textContent = css;
    var docBody = document.body || document.getElementsByTagName("body")[0];
    docBody.appendChild(style);
  }

  const availableLangs = optsArgs.isInit ? [] : await fetchLanguageList(apiKey);
  const selectedLang = await getLanguageFromLocalStorage();
  const selectedLangUppercased = (selectedLang || "").substring(0, 2).toUpperCase();
  const selectedLangLowercased = (selectedLang || "").substring(0, 2).toLowerCase();

  ['weploy-select', 'weploy-select-with-name'].forEach(className => {
    const isWithLangLabel = className == "weploy-select-with-name";
    // Get elements by class
    const classElements = document.getElementsByClassName(className);
    // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
    const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
    const idElements = isWithLangLabel ? idElementsStartsWithClassName : idElementsStartsWithClassName.filter(el => !el.id.includes("weploy-select-with-name")); 
    // Combine and deduplicate elements
    const weploySwitchers = Array.from(new Set([...classElements, ...idElements]));

    if (weploySwitchers.length > 0 && availableLangs) {
      weploySwitchers.forEach((weploySwitcher) => {
        // Create the select element if not already present
        let selectElem = weploySwitcher.querySelector('.weploy-lang-selector-element');
        if (!selectElem) {
          let languages = availableLangs

          weploySwitcher.classList.add('weploy-lang-selector-wrapper')
          weploySwitcher.classList.add('weploy-exclude')
          document.addEventListener('click', function(event) {
            let isClickInside = weploySwitcher.contains(event.target);
          
            if (!isClickInside) {
              // Check if 'open' attribute is present before trying to remove it
              if (details.hasAttribute('open')) {
                // To close:
                details.removeAttribute('open');
              }
            }
          });
          
          let div = document.createElement('div');
          div.className = 'weploy-lang-selector-nav';
          
          let details = document.createElement('details');
          details.dataset.behavior = 'languageSelector-topbar';
          details.role = 'group';
          details.className = "weploy-lang-selector-element"
          div.appendChild(details);
          
          let summary = document.createElement('summary');
          summary.setAttribute('aria-expanded', 'true');
          summary.setAttribute('aria-haspopup', 'true');
          summary.role = 'button';          
          details.appendChild(summary);


          // Check for "data-icon-color" attribute and use it for font color
          const iconColor = weploySwitcher.getAttribute('data-icon-color') || "#241c15";

          // let iconSvgInSummary = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          // iconSvgInSummary.setAttribute("fill", iconColor || "#241c15");
          // iconSvgInSummary.setAttribute("height", "24");
          // iconSvgInSummary.setAttribute("viewBox", "0 0 24 24");
          // iconSvgInSummary.setAttribute("width", "24");

          // let iconPathInSummary = document.createElementNS("http://www.w3.org/2000/svg", "path");
          // iconPathInSummary.setAttribute("clip-rule", "evenodd");
          // iconPathInSummary.setAttribute("d", "m7.10319 18.721c1.44393.8125 3.11001 1.2768 4.88431 1.279-.2692 0-.4875.2183-.4875.4875v.5125c0 .5523-.4477 1-1 1h-3c-.27614 0-.5.2239-.5.5s.22386.5.50001.5h8.99999c.2761 0 .5-.2239.5-.5s-.2239-.5-.5-.5h-3c-.5523 0-1-.4477-1-1v-.5125c0-.2692-.2183-.4875-.4875-.4875 5.5171-.0068 9.9875-4.4813 9.9875-10.00001 0-3.6579-1.964-6.85708-4.895-8.60058-.231-.13742-.5264-.05181-.6608.18098-.1417.24537-.0501.55823.1926.70441 2.6145 1.57468 4.3632 4.44072 4.3632 7.71519 0 4.97061-4.0294 9.00001-9 9.00001-1.5829 0-3.07031-.4086-4.36257-1.1262-.248-.1377-.56522-.0607-.70705.1849-.13422.2325-.06112.5307.17281.6623zm4.89681-.721c4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8zm0-1c2.4116 0 4.5384-1.2195 5.7973-3.0756l-1.7255-.9962c-1.248 1.9812-2.9042 3.4124-4.5242 4.0574.1496.0096.3004.0144.4524.0144zm6.002-3.3957c.0436-.0724.0859-.1458.1269-.2199zm-1.4302-1.5421 1.7263.9967c.4496-.9242.7019-1.9621.7019-3.0589 0-1.43763-.4334-2.77403-1.1766-3.8857.2517 1.72562-.1596 3.87609-1.2516 5.9479zm-.6659-7.8275c1.4232 1.29546 1.3536 4.36603-.2005 7.3273l-3.0224-1.745zm-.866-.5-3.2229 5.5823-3.02242-1.74497c1.78752-2.8265 4.41182-4.4221 6.24532-3.83733zm-3.7229 6.4483-3.02242-1.74495c-1.55404 2.96125-1.62368 6.03175-.20051 7.32725zm1.1353-7.16862c-1.6199.64499-3.27617 2.07624-4.52413 4.05743l-1.72548-.99621c1.25887-1.85604 3.38567-3.0756 5.79731-3.0756.152 0 .3028.00484.4523.01438zm-6.5821 3.60277c.04159-.07519.08451-.14953.12875-.22299zm1.55798 1.32068-1.72627-.99665c-.44966.92412-.70191 1.96201-.70191 3.05882 0 1.4376.43339 2.774 1.17664 3.8857-.25177-1.7256.15954-3.8761 1.25154-5.94787zm7.77722 4.49017-3.0224-1.745-3.22291 5.5823c1.83351.5847 4.45781-1.0108 6.24531-3.8373z");
          // if (iconColor) iconPathInSummary.setAttribute("fill", iconColor);
          // iconPathInSummary.setAttribute("fill-rule", "evenodd");
          // iconSvgInSummary.appendChild(iconPathInSummary);
          
          window.weployValueDisplays.push(summary);
          window.weployLoadingGlobeIcons.push(getLoadingGlobeIcon(iconColor));
          window.weployErrorGlobeIcons.push(getErrorGlobeIcon(iconColor));
          window.weployStaticGlobeIcons.push(getStaticGlobeIcon(iconColor));

          renderWeploySelectorState();

          let spanInSummary = document.createElement('span');
          spanInSummary.setAttribute('aria-hidden', 'true');
          spanInSummary.textContent = selectedLangUppercased;
          spanInSummary.classList.add('weploy-lang-selector-value')
          if (iconColor) {
            spanInSummary.style.color = iconColor;
          }
          summary.appendChild(spanInSummary);

          // Create a dropdown icon
          const dropdownIcon = document.createElement("div");
          dropdownIcon.style.width = ".25rem";
          dropdownIcon.style.height = ".25rem";
          dropdownIcon.style.backgroundColor = iconColor || "#241c15";
          dropdownIcon.style.webkitClipPath = "polygon(50% 75%,100% 25%,0 25%)";
          dropdownIcon.style.clipPath = "polygon(50% 75%,100% 25%,0 25%)";
          summary.appendChild(dropdownIcon);

          // if (!languages.length) {
          //   languages = [{ lang: '!', flag: '🇺🇸', label: 'Error' }];
          //   weploySwitcher.appendChild(div);
          // }
          
          let ul = document.createElement('ul');
          ul.className = 'weploy-lang-selector-menu-container';
          details.appendChild(ul);

          function autoPosition() {
            const rect = ul.getBoundingClientRect();            
            // Check if the element is outside the viewport on the right side
            if ((rect.x + rect.width) >= window.innerWidth) {
              ul.style.right = '0px';
              ul.style.left = 'auto';
            } else {
              ul.style.right = 'auto';
              ul.style.left = '0px';
            }

            // Check if the element is outside the viewport on the bottom side
            if ((rect.y + rect.height) >= window.innerHeight) {
              ul.style.bottom = '0px';
            } else {
              ul.style.bottom = 'auto';
            }
          }

          if (languages.length < 2) {
            let li = document.createElement('li');
            ul.appendChild(li);
            weploySwitcher.appendChild(div);

            li.style.cursor = 'auto';

            if (window.weployError) {
              let errorTextDiv = document.createElement('div');
              li.appendChild(errorTextDiv);

              errorTextDiv.style.padding = '5px';
              errorTextDiv.textContent = window.weployError;
            }
            
          }
          
          languages.forEach((language, index) => {
              const isSelected = language.lang == selectedLangLowercased;

              let li = document.createElement('li');
              ul.appendChild(li);

              let a = document.createElement('a');
              const url = isSelected ? "#" : addOrReplaceLangParam(window.location.href, language.lang);

              a.href = url;
              a.hreflang = language.lang;
              a.dataset.locale = language.lang;
              a.dataset.index = index;

              a.addEventListener('click', function(event) {
                if (isSelected) return;
                // Check if 'open' attribute is present before trying to remove it
                if (details.hasAttribute('open')) {
                  // To close:
                  details.removeAttribute('open');
                }

                window.weployTranslating = true;
                renderWeploySelectorState();
              });

              a.className = `weploy-lang-selector-menu-container-item ${isSelected ? 'selected' : ''}`;

              li.appendChild(a);
          
              let span = document.createElement('span');
              span.setAttribute('aria-hidden', 'true');
              span.className = 'weploy-lang-selector-menu-container-item-code';
              span.textContent = language.lang.toUpperCase();
              a.appendChild(span);
          
              let p = document.createElement('div');
              p.lang = language.lang;
              p.className = 'weploy-lang-selector-menu-container-item-locale';
              p.textContent = language.label;
              a.appendChild(p);

              if (isSelected) {
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('aria-hidden', 'true');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('class', 'weploy-lang-selector-menu-container-item-selected');
                a.appendChild(svg);
        
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('clip-rule', 'evenodd');
                path.setAttribute('d', 'M20.7071 7.70712L9.99995 18.4142L4.79285 13.2071L6.20706 11.7929L9.99995 15.5858L19.2928 6.29291L20.7071 7.70712Z');
                svg.appendChild(path);
              }
          });
          
          weploySwitcher.appendChild(div);
          autoPosition();
        }
      });
    }
  })
  
}

function getSelectedLanguage() {
  return new Promise((resolve, reject) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const paramsLang = params.get('lang');
    const localStorageLang = localStorage.getItem("language");

    if (paramsLang && (paramsLang != localStorageLang)) {
      localStorage.setItem("language", paramsLang);
    }
    
    let language = paramsLang || localStorageLang;
    if (language) {
      resolve(language); // Resolve the promise
    }
  });
}

function handleChangeCustomSelect(target){
  // Get elements by class
  const classElements = Array.from(document.getElementsByClassName("weploy-select"));
  // Get elements by ID, assuming IDs are like "weploy-select-1", "weploy-select-2", etc.
  const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="weploy-select"]`));
  const isWithLangLabel = Array.from(target.classList).includes("weploy-select-with-name")
  const idElements = isWithLangLabel ? idElementsStartsWithClassName : idElementsStartsWithClassName.filter(el => !el.id.includes("weploy-select-with-name")); 
  // Combine and deduplicate elements
  const weploySwitchers = Array.from(new Set([...classElements, ...idElements]));

  const newValue = target.value;
  // Update only the select elements within weploySwitchers
  weploySwitchers.forEach(sw => { 
    const selects = sw.querySelector('select.weploy-exclude');
    if (selects && selects !== target) {
      selects.value = newValue;
    }
  });
  switchLanguage(newValue);
}

if (isBrowser) {
  if (!window.weployUtils) {
     window.weployUtils = {}
  }
  window.weployUtils.isBrowser = isBrowser;
  window.weployUtils.getTranslations = getTranslations;
  window.weployUtils.switchLanguage = switchLanguage;
  window.weployUtils.getSelectedLanguage = getSelectedLanguage;
  window.weployUtils.createLanguageSelect = createLanguageSelect;
  window.weployUtils.handleChangeCustomSelect = handleChangeCustomSelect;
  window.weployUtils.getLanguageFromLocalStorage = getLanguageFromLocalStorage
  window.weployUtils.setOptions = setOptions
}

module.exports.isBrowser = isBrowser;
module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
module.exports.createLanguageSelect = createLanguageSelect;
module.exports.getLanguageFromLocalStorage = getLanguageFromLocalStorage;
module.exports.setOptions = setOptions;
