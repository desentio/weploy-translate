const { isBrowser, API_URL, getWeployOptions, setWeployActiveLang, setWeployOptions } = require("../configs");
const { renderWeploySelectorState } = require("../selector/renderWeploySelectorState");

async function fetchLanguageList(apiKey) {
  const options = getWeployOptions();
  const langs = options.definedLanguages;
  if (langs && Array.isArray(langs) && langs.length) return langs;
  if (window.weployError) return [];

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
    setWeployOptions({ definedLanguages: languagesWithFlagAndLabel })
    setWeployActiveLang(languagesWithFlagAndLabel[0].lang)
    return languagesWithFlagAndLabel
  })
  .catch((err) => {
    console.error(err);
    // if (isBrowser()) window.weployOptions.definedLanguages = [] // store in global scope
    // else weployOptions.definedLanguages = [] // for npm package
    if (isBrowser()) {
      window.weployError = err.message;
      renderWeploySelectorState({ shouldUpdateActiveLang: false });
    }
    return [];
  })

  return availableLangs
}

module.exports = {
  fetchLanguageList,
}
