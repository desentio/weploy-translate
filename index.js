const CheckIfTranslatable = require('./utility.js');
const cssModule = require('./weploy.css');
const css = cssModule.default || cssModule;

const allWeployLanguages = [
  {
      "label": "Afar",
      "flag": "🇪🇷",
      "lang": "aa"
  },
  {
      "label": "Abkhazian",
      "flag": null,
      "lang": "ab"
  },
  {
      "label": "Avestan",
      "flag": "🇮🇷",
      "lang": "ae"
  },
  {
      "label": "Afrikaans",
      "flag": "🇿🇦",
      "lang": "af"
  },
  {
      "label": "Akan",
      "flag": "🇬🇭",
      "lang": "ak"
  },
  {
      "label": "Amharic",
      "flag": "🇪🇹",
      "lang": "am"
  },
  {
      "label": "Aragonese",
      "flag": null,
      "lang": "an"
  },
  {
      "label": "Arabic",
      "flag": "🇸🇦",
      "lang": "ar"
  },
  {
      "label": "Assamese",
      "flag": null,
      "lang": "as"
  },
  {
      "label": "Avaric",
      "flag": null,
      "lang": "av"
  },
  {
      "label": "Aymara",
      "flag": null,
      "lang": "ay"
  },
  {
      "label": "Azerbaijani",
      "flag": "🇦🇿",
      "lang": "az"
  },
  {
      "label": "Bashkir",
      "flag": null,
      "lang": "ba"
  },
  {
      "label": "Belarusian",
      "flag": "🇧🇾",
      "lang": "be"
  },
  {
      "label": "Bulgarian",
      "flag": "🇧🇬",
      "lang": "bg"
  },
  {
      "label": "Bihari languages",
      "flag": null,
      "lang": "bh"
  },
  {
      "label": "Bambara",
      "flag": "🇲🇱",
      "lang": "bm"
  },
  {
      "label": "Bislama",
      "flag": "🇻🇺",
      "lang": "bi"
  },
  {
      "label": "Bengali",
      "flag": "🇧🇩",
      "lang": "bn"
  },
  {
      "label": "Tibetan",
      "flag": "🇧🇹",
      "lang": "bo"
  },
  {
      "label": "Breton",
      "flag": null,
      "lang": "br"
  },
  {
      "label": "Bosnian",
      "flag": "🇧🇦",
      "lang": "bs"
  },
  {
      "label": "Catalan; Valencian",
      "flag": null,
      "lang": "ca"
  },
  {
      "label": "Chechen",
      "flag": null,
      "lang": "ce"
  },
  {
      "label": "Chamorro",
      "flag": "🇬🇺",
      "lang": "ch"
  },
  {
      "label": "Corsican",
      "flag": null,
      "lang": "co"
  },
  {
      "label": "Cree",
      "flag": null,
      "lang": "cr"
  },
  {
      "label": "Czech",
      "flag": "🇨🇿",
      "lang": "cs"
  },
  {
      "label": "Chuvash",
      "flag": "",
      "lang": "cv"
  },
  {
      "label": "Welsh",
      "flag": "",
      "lang": "cy"
  },
  {
      "label": "Danish",
      "flag": "🇩🇰",
      "lang": "da"
  },
  {
      "label": "German",
      "flag": "🇩🇪",
      "lang": "de"
  },
  {
      "label": "Divehi",
      "flag": "🇲🇻",
      "lang": "dv"
  },
  {
      "label": "Dzongkha",
      "flag": "🇧🇹",
      "lang": "dz"
  },
  {
      "label": "Ewe",
      "flag": "🇬🇭",
      "lang": "ee"
  },
  {
      "label": "Greek",
      "flag": "🇬🇷",
      "lang": "el"
  },
  {
      "label": "English",
      "flag": "🇺🇸",
      "lang": "en"
  },
  {
      "label": "Esperanto",
      "flag": null,
      "lang": "eo"
  },
  {
      "label": "Spanish",
      "flag": "🇪🇸",
      "lang": "es"
  },
  {
      "label": "Estonian",
      "flag": "🇪🇪",
      "lang": "et"
  },
  {
      "label": "Basque",
      "flag": null,
      "lang": "eu"
  },
  {
      "label": "Persian",
      "flag": "🇮🇷",
      "lang": "fa"
  },
  {
      "label": "Fulah",
      "flag": null,
      "lang": "ff"
  },
  {
      "label": "Finnish",
      "flag": "🇫🇮",
      "lang": "fi"
  },
  {
      "label": "Fijian",
      "flag": "🇫🇯",
      "lang": "fj"
  },
  {
      "label": "Faroese",
      "flag": "🇫🇴",
      "lang": "fo"
  },
  {
      "label": "French",
      "flag": "🇫🇷",
      "lang": "fr"
  },
  {
      "label": "Western Frisian",
      "flag": null,
      "lang": "fy"
  },
  {
      "label": "Irish",
      "flag": "🇮🇪",
      "lang": "ga"
  },
  {
      "label": "Gaelic; Scottish Gaelic",
      "flag": null,
      "lang": "gd"
  },
  {
      "label": "Galician",
      "flag": null,
      "lang": "gl"
  },
  {
      "label": "Guarani",
      "flag": "🇵🇾",
      "lang": "gn"
  },
  {
      "label": "Gujarati",
      "flag": null,
      "lang": "gu"
  },
  {
      "label": "Manx",
      "flag": "🇮🇲",
      "lang": "gv"
  },
  {
      "label": "Hausa",
      "flag": "🇳🇬",
      "lang": "ha"
  },
  {
      "label": "Hebrew",
      "flag": "🇮🇱",
      "lang": "he"
  },
  {
      "label": "Hindi",
      "flag": "🇮🇳",
      "lang": "hi"
  },
  {
      "label": "Hiri Motu",
      "flag": "🇵🇬",
      "lang": "ho"
  },
  {
      "label": "Croatian",
      "flag": "🇭🇷",
      "lang": "hr"
  },
  {
      "label": "Haitian",
      "flag": "🇭🇹",
      "lang": "ht"
  },
  {
      "label": "Hungarian",
      "flag": "🇭🇺",
      "lang": "hu"
  },
  {
      "label": "Armenian",
      "flag": "🇦🇲",
      "lang": "hy"
  },
  {
      "label": "Herero",
      "flag": "🇳🇦",
      "lang": "hz"
  },
  {
      "label": "Interlingua",
      "flag": null,
      "lang": "ia"
  },
  {
      "label": "Indonesian",
      "flag": "🇮🇩",
      "lang": "id"
  },
  {
      "label": "Interlingue",
      "flag": null,
      "lang": "ie"
  },
  {
      "label": "Igbo",
      "flag": "🇳🇬",
      "lang": "ig"
  },
  {
      "label": "Sichuan Yi",
      "flag": "🇨🇳",
      "lang": "ii"
  },
  {
      "label": "Inupiaq",
      "flag": null,
      "lang": "ik"
  },
  {
      "label": "Ido",
      "flag": null,
      "lang": "io"
  },
  {
      "label": "Icelandic",
      "flag": "🇮🇸",
      "lang": "is"
  },
  {
      "label": "Italian",
      "flag": "🇮🇹",
      "lang": "it"
  },
  {
      "label": "Inuktitut",
      "flag": null,
      "lang": "iu"
  },
  {
      "label": "Japanese",
      "flag": "🇯🇵",
      "lang": "ja"
  },
  {
      "label": "Javanese",
      "flag": null,
      "lang": "jv"
  },
  {
      "label": "Georgian",
      "flag": "🇬🇪",
      "lang": "ka"
  },
  {
      "label": "Kongo",
      "flag": "🇨🇬",
      "lang": "kg"
  },
  {
      "label": "Kikuyu; Gikuyu",
      "flag": null,
      "lang": "ki"
  },
  {
      "label": "Kuanyama; Kwanyama",
      "flag": "🇦🇴",
      "lang": "kj"
  },
  {
      "label": "Kazakh",
      "flag": "🇰🇿",
      "lang": "kk"
  },
  {
      "label": "Kalaallisut; Greenlandic",
      "flag": "🇬🇱",
      "lang": "kl"
  },
  {
      "label": "Central Khmer",
      "flag": "🇰🇭",
      "lang": "km"
  },
  {
      "label": "Kannada",
      "flag": null,
      "lang": "kn"
  },
  {
      "label": "Korean",
      "flag": "🇰🇷",
      "lang": "ko"
  },
  {
      "label": "Kanuri",
      "flag": null,
      "lang": "kr"
  },
  {
      "label": "Kashmiri",
      "flag": null,
      "lang": "ks"
  },
  {
      "label": "Kurdish",
      "flag": null,
      "lang": "ku"
  },
  {
      "label": "Komi",
      "flag": null,
      "lang": "kv"
  },
  {
      "label": "Cornish",
      "flag": null,
      "lang": "kw"
  },
  {
      "label": "Kirghiz; Kyrgyz",
      "flag": "🇰🇬",
      "lang": "ky"
  },
  {
      "label": "Latin",
      "flag": "🇻🇦",
      "lang": "la"
  },
  {
      "label": "Luxembourgish; Letzeburgesch",
      "flag": "🇱🇺",
      "lang": "lb"
  },
  {
      "label": "Ganda",
      "flag": "🇺🇬",
      "lang": "lg"
  },
  {
      "label": "Limburgan; Limburger; Limburgish",
      "flag": null,
      "lang": "li"
  },
  {
      "label": "Lingala",
      "flag": "🇨🇬",
      "lang": "ln"
  },
  {
      "label": "Lao",
      "flag": "🇱🇦",
      "lang": "lo"
  },
  {
      "label": "Lithuanian",
      "flag": "🇱🇹",
      "lang": "lt"
  },
  {
      "label": "Luba-Katanga",
      "flag": null,
      "lang": "lu"
  },
  {
      "label": "Latvian",
      "flag": "🇱🇻",
      "lang": "lv"
  },
  {
      "label": "Malagasy",
      "flag": "🇲🇬",
      "lang": "mg"
  },
  {
      "label": "Marshallese",
      "flag": "🇲🇭",
      "lang": "mh"
  },
  {
      "label": "Maori",
      "flag": "🇳🇿",
      "lang": "mi"
  },
  {
      "label": "Macedonian",
      "flag": "🇲🇰",
      "lang": "mk"
  },
  {
      "label": "Malayalam",
      "flag": "",
      "lang": "ml"
  },
  {
      "label": "Mongolian",
      "flag": "🇲🇳",
      "lang": "mn"
  },
  {
      "label": "Marathi",
      "flag": null,
      "lang": "mr"
  },
  {
      "label": "Malay",
      "flag": "🇲🇾",
      "lang": "ms"
  },
  {
      "label": "Maltese",
      "flag": "🇲🇹",
      "lang": "mt"
  },
  {
      "label": "Burmese",
      "flag": "🇲🇲",
      "lang": "my"
  },
  {
      "label": "Nauru",
      "flag": "🇳🇷",
      "lang": "na"
  },
  {
      "label": "Bokmål, Norwegian; Norwegian Bokmål",
      "flag": "",
      "lang": "nb"
  },
  {
      "label": "Ndebele, North; North Ndebele",
      "flag": null,
      "lang": "nd"
  },
  {
      "label": "Nepali",
      "flag": "🇳🇵",
      "lang": "ne"
  },
  {
      "label": "Ndonga",
      "flag": "🇳🇦",
      "lang": "ng"
  },
  {
      "label": "Dutch",
      "flag": "🇳🇱",
      "lang": "nl"
  },
  {
      "label": "Norwegian Nynorsk; Nynorsk, Norwegian",
      "flag": null,
      "lang": "nn"
  },
  {
      "label": "Norwegian",
      "flag": "🇳🇴",
      "lang": "no"
  },
  {
      "label": "Ndebele, South; South Ndebele",
      "flag": null,
      "lang": "nr"
  },
  {
      "label": "Navajo; Navaho",
      "flag": null,
      "lang": "nv"
  },
  {
      "label": "Chichewa; Chewa; Nyanja",
      "flag": "🇲🇼",
      "lang": "ny"
  },
  {
      "label": "Occitan (post 1500)",
      "flag": null,
      "lang": "oc"
  },
  {
      "label": "Ojibwa",
      "flag": null,
      "lang": "oj"
  },
  {
      "label": "Oromo",
      "flag": "🇪🇹",
      "lang": "om"
  },
  {
      "label": "Oriya",
      "flag": null,
      "lang": "or"
  },
  {
      "label": "Ossetian; Ossetic",
      "flag": null,
      "lang": "os"
  },
  {
      "label": "Panjabi; Punjabi",
      "flag": null,
      "lang": "pa"
  },
  {
      "label": "Pali",
      "flag": null,
      "lang": "pi"
  },
  {
      "label": "Polish",
      "flag": "🇵🇱",
      "lang": "pl"
  },
  {
      "label": "Pushto; Pashto",
      "flag": null,
      "lang": "ps"
  },
  {
      "label": "Portuguese",
      "flag": "🇵🇹",
      "lang": "pt"
  },
  {
      "label": "Quechua",
      "flag": "🇵🇪",
      "lang": "qu"
  },
  {
      "label": "Romansh",
      "flag": "🇨🇭",
      "lang": "rm"
  },
  {
      "label": "Rundi",
      "flag": "🇧🇮",
      "lang": "rn"
  },
  {
      "label": "Romanian",
      "flag": "🇷🇴",
      "lang": "ro"
  },
  {
      "label": "Russian",
      "flag": "🇷🇺",
      "lang": "ru"
  },
  {
      "label": "Kinyarwanda",
      "flag": "🇷🇼",
      "lang": "rw"
  },
  {
      "label": "Sanskrit",
      "flag": null,
      "lang": "sa"
  },
  {
      "label": "Sardinian",
      "flag": null,
      "lang": "sc"
  },
  {
      "label": "Sindhi",
      "flag": "🇵🇰",
      "lang": "sd"
  },
  {
      "label": "Northern Sami",
      "flag": null,
      "lang": "se"
  },
  {
      "label": "Sango",
      "flag": "🇨🇫",
      "lang": "sg"
  },
  {
      "label": "Sinhala; Sinhalese",
      "flag": "🇱🇰",
      "lang": "si"
  },
  {
      "label": "Slovak",
      "flag": "🇸🇰",
      "lang": "sk"
  },
  {
      "label": "Slovenian",
      "flag": "🇸🇮",
      "lang": "sl"
  },
  {
      "label": "Samoan",
      "flag": null,
      "lang": "sm"
  },
  {
      "label": "Shona",
      "flag": "🇿🇼",
      "lang": "sn"
  },
  {
      "label": "Somali",
      "flag": "🇸🇴",
      "lang": "so"
  },
  {
      "label": "Albanian",
      "flag": "🇦🇱",
      "lang": "sq"
  },
  {
      "label": "Serbian",
      "flag": "🇷🇸",
      "lang": "sr"
  },
  {
      "label": "Swati",
      "flag": "🇸🇿",
      "lang": "ss"
  },
  {
      "label": "Sotho, Southern",
      "flag": null,
      "lang": "st"
  },
  {
      "label": "Sundanese",
      "flag": null,
      "lang": "su"
  },
  {
      "label": "Swedish",
      "flag": "🇸🇪",
      "lang": "sv"
  },
  {
      "label": "Swahili",
      "flag": "🇰🇪",
      "lang": "sw"
  },
  {
      "label": "Tamil",
      "flag": null,
      "lang": "ta"
  },
  {
      "label": "Telugu",
      "flag": null,
      "lang": "te"
  },
  {
      "label": "Tajik",
      "flag": "🇹🇯",
      "lang": "tg"
  },
  {
      "label": "Thai",
      "flag": "🇹🇭",
      "lang": "th"
  },
  {
      "label": "Tigrinya",
      "flag": "🇪🇷",
      "lang": "ti"
  },
  {
      "label": "Turkmen",
      "flag": "🇹🇲",
      "lang": "tk"
  },
  {
      "label": "Tagalog",
      "flag": "🇵🇭",
      "lang": "tl"
  },
  {
      "label": "Tswana",
      "flag": "🇧🇼",
      "lang": "tn"
  },
  {
      "label": "Tonga",
      "flag": null,
      "lang": "to"
  },
  {
      "label": "Turkish",
      "flag": "🇹🇷",
      "lang": "tr"
  },
  {
      "label": "Tsonga",
      "flag": null,
      "lang": "ts"
  },
  {
      "label": "Tatar",
      "flag": "",
      "lang": "tt"
  },
  {
      "label": "Twi",
      "flag": "🇬🇭",
      "lang": "tw"
  },
  {
      "label": "Tahitian",
      "flag": "🇵🇫",
      "lang": "ty"
  },
  {
      "label": "Uighur; Uyghur",
      "flag": null,
      "lang": "ug"
  },
  {
      "label": "Ukrainian",
      "flag": "🇺🇦",
      "lang": "uk"
  },
  {
      "label": "Urdu",
      "flag": null,
      "lang": "ur"
  },
  {
      "label": "Uzbek",
      "flag": "🇺🇿",
      "lang": "uz"
  },
  {
      "label": "Venda",
      "flag": null,
      "lang": "ve"
  },
  {
      "label": "Vietnamese",
      "flag": "🇻🇳",
      "lang": "vi"
  },
  {
      "label": "Volapük",
      "flag": null,
      "lang": "vo"
  },
  {
      "label": "Walloon",
      "flag": "🇧🇪",
      "lang": "wa"
  },
  {
      "label": "Wolof",
      "flag": "🇸🇳",
      "lang": "wo"
  },
  {
      "label": "Xhosa",
      "flag": null,
      "lang": "xh"
  },
  {
      "label": "Yiddish",
      "flag": null,
      "lang": "yi"
  },
  {
      "label": "Yoruba",
      "flag": "🇳🇬",
      "lang": "yo"
  },
  {
      "label": "Zhuang; Chuang",
      "flag": null,
      "lang": "za"
  },
  {
      "label": "Chinese",
      "flag": "🇨🇳",
      "lang": "zh"
  },
  {
      "label": "Zulu",
      "flag": "",
      "lang": "zu"
  }
]

// check if code runs on server or client
const isBrowser = typeof window !== 'undefined'

// var isChangeLocationEventAdded;
var isDomListenerAdded;
var weployOptions;
var weployLanguages = [];
const API_URL = "https://api.tasksource.io"


function getLoadingGlobeIcon(strokeColor) {
    // Create a new div element
    var newDiv = document.createElement("div");

    // Set the innerHTML of the div
    newDiv.innerHTML = `<svg style="width:24px;height:24px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <circle cx="50" cy="50" fill="none" stroke="${strokeColor || 'currentColor'}" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
                                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
                            </circle>
                        </svg>`;
    return newDiv;
}

function renderWeployLoadingState() {
  if (!window.weployValueDisplays.length) return;

  window.weployValueDisplays.forEach((selector, selectorIndex) => {
    const loadingIcon = window.weployLoadingGlobeIcons[selectorIndex];
    const staticIcon = window.weployStaticGlobeIcons[selectorIndex];
    const firstChild = selector.firstChild;

    if (!firstChild || !staticIcon || !loadingIcon) {
      return;
    }

    if (!selector.contains(staticIcon) && !selector.contains(loadingIcon)) {
      const whatShouldBeInserted = window.weployTranslating ? loadingIcon : staticIcon;
      selector.insertBefore(whatShouldBeInserted, firstChild);
      return;
    }

    if (window.weployTranslating) {
      selector.replaceChild(loadingIcon, staticIcon);
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
        resolve(data);
      })
      .catch((err) => {
        console.error(err);
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
      (node.className.includes("weploy-exclude") || window.weployExcludeClasses.length && window.weployExcludeClasses.some(excludeClass => excludeClass && node.className.includes(excludeClass)) )
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
  const langs = window.weployLanguages || weployLanguages;
  if (langs[0] && langs[0].lang == language.substring(0, 2).toLowerCase()) {
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

    window.weployTranslating = true;
    renderWeployLoadingState();
    await processTextNodes(validTextNodes, language, apiKey).catch(reject).finally(() => {
      window.weployTranslating = false;
      renderWeployLoadingState();
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

async function getTranslations(apiKey, optsArgs = {}) {
  try {
    if (!isBrowser) {
      weployOptions = {
        timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
        pathOptions: optsArgs.pathOptions || {},
        apiKey
      }
      if (optsArgs.originalLanguage && optsArgs.allowedLanguages && optsArgs.allowedLanguages.length) {
        const originalLang = allWeployLanguages.find(lang => lang.lang == optsArgs.originalLanguage);

        if (originalLang) {
          const allowedLangs = allWeployLanguages.filter(lang => optsArgs.allowedLanguages.includes(lang.lang));
          weployLanguages = [originalLang, ...allowedLangs]
        }
      }
    } else {
      window.weployOptions = {
        timeout: optsArgs.timeout == null ? 0 : optsArgs.timeout,
        pathOptions: optsArgs.pathOptions || {},
        apiKey
      }
      window.weployExcludeClasses = optsArgs.excludeClasses || [];
      if (optsArgs.originalLanguage && optsArgs.allowedLanguages && optsArgs.allowedLanguages.length) {
        const originalLang = allWeployLanguages.find(lang => lang.lang == optsArgs.originalLanguage);

        if (originalLang) {
          const allowedLangs = allWeployLanguages.filter(lang => optsArgs.allowedLanguages.includes(lang.lang));
          window.weployLanguages = [originalLang, ...allowedLangs]
        }
      }
    }

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
  const langs = window.weployLanguages || weployLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;

  const availableLangs = await fetch(API_URL + "/weploy-projects/by-api-key", {
    headers: {
      "X-Api-Key": apiKey
    }
  })
  .then((res) => res.json())
  .then((res) => {
    const languages =  [res.language, ...res.allowedLanguages]
    const languagesWithFlagAndLabel = languages.map((lang, index) => ({
      lang,
      flag: (res.flags || [])?.[index] || lang, // fallback to text if flag unavailable
      label: (res.labels || [])?.[index] || lang // fallback to text if flag unavailable
    }))
    if (isBrowser) window.weployLanguages = languagesWithFlagAndLabel // store in global scope
    weployLanguages = languagesWithFlagAndLabel // for npm package
    return languagesWithFlagAndLabel
  })
  .catch(console.error)

  return availableLangs
}

async function createLanguageSelect(apiKey) {
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
    document.body.appendChild(style);
  }

  const availableLangs = await fetchLanguageList(apiKey);
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

    if (weploySwitchers.length > 0 && availableLangs && availableLangs.length > 0) {
      weploySwitchers.forEach((weploySwitcher) => {
        // Create the select element if not already present
        let selectElem = weploySwitcher.querySelector('.weploy-lang-selector-element');
        if (!selectElem) {
          let languages = availableLangs
          
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
          const iconColor = weploySwitcher.getAttribute('data-icon-color');

          let iconSvgInSummary = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          iconSvgInSummary.setAttribute("fill", iconColor || "#241c15");
          iconSvgInSummary.setAttribute("height", "24");
          iconSvgInSummary.setAttribute("viewBox", "0 0 24 24");
          iconSvgInSummary.setAttribute("width", "24");

          let iconPathInSummary = document.createElementNS("http://www.w3.org/2000/svg", "path");
          iconPathInSummary.setAttribute("clip-rule", "evenodd");
          iconPathInSummary.setAttribute("d", "m7.10319 18.721c1.44393.8125 3.11001 1.2768 4.88431 1.279-.2692 0-.4875.2183-.4875.4875v.5125c0 .5523-.4477 1-1 1h-3c-.27614 0-.5.2239-.5.5s.22386.5.50001.5h8.99999c.2761 0 .5-.2239.5-.5s-.2239-.5-.5-.5h-3c-.5523 0-1-.4477-1-1v-.5125c0-.2692-.2183-.4875-.4875-.4875 5.5171-.0068 9.9875-4.4813 9.9875-10.00001 0-3.6579-1.964-6.85708-4.895-8.60058-.231-.13742-.5264-.05181-.6608.18098-.1417.24537-.0501.55823.1926.70441 2.6145 1.57468 4.3632 4.44072 4.3632 7.71519 0 4.97061-4.0294 9.00001-9 9.00001-1.5829 0-3.07031-.4086-4.36257-1.1262-.248-.1377-.56522-.0607-.70705.1849-.13422.2325-.06112.5307.17281.6623zm4.89681-.721c4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8zm0-1c2.4116 0 4.5384-1.2195 5.7973-3.0756l-1.7255-.9962c-1.248 1.9812-2.9042 3.4124-4.5242 4.0574.1496.0096.3004.0144.4524.0144zm6.002-3.3957c.0436-.0724.0859-.1458.1269-.2199zm-1.4302-1.5421 1.7263.9967c.4496-.9242.7019-1.9621.7019-3.0589 0-1.43763-.4334-2.77403-1.1766-3.8857.2517 1.72562-.1596 3.87609-1.2516 5.9479zm-.6659-7.8275c1.4232 1.29546 1.3536 4.36603-.2005 7.3273l-3.0224-1.745zm-.866-.5-3.2229 5.5823-3.02242-1.74497c1.78752-2.8265 4.41182-4.4221 6.24532-3.83733zm-3.7229 6.4483-3.02242-1.74495c-1.55404 2.96125-1.62368 6.03175-.20051 7.32725zm1.1353-7.16862c-1.6199.64499-3.27617 2.07624-4.52413 4.05743l-1.72548-.99621c1.25887-1.85604 3.38567-3.0756 5.79731-3.0756.152 0 .3028.00484.4523.01438zm-6.5821 3.60277c.04159-.07519.08451-.14953.12875-.22299zm1.55798 1.32068-1.72627-.99665c-.44966.92412-.70191 1.96201-.70191 3.05882 0 1.4376.43339 2.774 1.17664 3.8857-.25177-1.7256.15954-3.8761 1.25154-5.94787zm7.77722 4.49017-3.0224-1.745-3.22291 5.5823c1.83351.5847 4.45781-1.0108 6.24531-3.8373z");
          if (iconColor) iconPathInSummary.setAttribute("fill", iconColor);
          iconPathInSummary.setAttribute("fill-rule", "evenodd");
          iconSvgInSummary.appendChild(iconPathInSummary);
          
          window.weployValueDisplays.push(summary);
          window.weployLoadingGlobeIcons.push(getLoadingGlobeIcon(iconColor));
          window.weployStaticGlobeIcons.push(iconSvgInSummary);

          renderWeployLoadingState();

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

              a.className = `weploy-lang-selector-menu-container-item ${isSelected ? 'selected' : ''}`;

              li.appendChild(a);
          
              let span = document.createElement('span');
              span.setAttribute('aria-hidden', 'true');
              span.className = 'weploy-lang-selector-menu-container-item-code';
              span.textContent = language.lang.toUpperCase();
              a.appendChild(span);
          
              let p = document.createElement('p');
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
          weploySwitcher.classList.add('weploy-lang-selector-wrapper')
          weploySwitcher.classList.add('weploy-exclude')
          autoPosition();
          // window.addEventListener('resize', autoPosition);

          //////////
          // selectElem = document.createElement('select');
          // selectElem.className = "weploy-exclude";
          // selectElem.style = "border: none; background-color: transparent; cursor: pointer; outline: none;";
          // selectElem.onchange = (e) => {
          //   const newValue = e.target.value;
          //   // Update only the select elements within weploySwitchers
          //   weploySwitchers.forEach(sw => {
          //     const selects = sw.querySelector('select.weploy-exclude');
          //     if (selects && selects !== e.target) {
          //       selects.value = newValue;
          //     }
          //   });
          //   switchLanguage(newValue);
          // };

          // // Populate the select element with options
          // availableLangs.forEach(async lang => {
          //   const langOpts = document.createElement('option');
          //   langOpts.value = lang.lang;
          //   langOpts.textContent = isWithLangLabel ? `${lang.flag} ${lang.label}` : lang.flag;
          //   // langOpts.style = "text-transform: uppercase;";
          //   langOpts.selected = lang.lang === await getLanguageFromLocalStorage();

          //   selectElem.appendChild(langOpts);
          // });

          // // Check for "data-icon-color" attribute and use it for font color
          // const iconColor = weploySwitcher.getAttribute('data-icon-color');
          // if (iconColor) {
          //   selectElem.style.color = iconColor;
          // }

          // // Append the select element to each weploySwitcher
          // weploySwitcher.appendChild(selectElem);
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
}

module.exports.isBrowser = isBrowser;
module.exports.getTranslations = getTranslations;
module.exports.switchLanguage = switchLanguage;
module.exports.getSelectedLanguage = getSelectedLanguage;
module.exports.createLanguageSelect = createLanguageSelect;
module.exports.getLanguageFromLocalStorage = getLanguageFromLocalStorage;
