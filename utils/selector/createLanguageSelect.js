const { loadingIconClassName, errorIconClassName, readyIconClassName, getLoadingGlobeIcon, getErrorGlobeIcon, getReadyGlobeIcon } = require("./icons");
require(process.env.CSS_PATH || "../../translation.css")
const cssModule = require(process.env.CSS_PATH_RAW || "../../translation.css?raw");

const { isBrowser, getGlobalseoActiveLang, getGlobalseoOptions } = require("../configs");
const { getLanguageFromLocalStorage } = require("../languages/getSelectedLanguage");
const { fetchLanguageList } = require("../languages/fetchLanguageList");
const { renderSelectorState } = require("./renderSelectorState");
const { getValueDisplays, setValueDisplays } = require("./valueDisplay");
const css = cssModule.default || cssModule;

function addOrReplaceLangParam(url, lang) {
  let urlObj = new URL(url);
  let params = new URLSearchParams(urlObj.search);

  const options = getGlobalseoOptions();
  params.set(options.langParam || 'lang', lang);
  urlObj.search = params.toString();

  return urlObj.toString();
}

async function autoPosition(ul, globalseoSwitcher) {
  // if (e.target != globalseoSwitcher) return;
  if(!ul) return;
  // const ul = e.target.querySelector("ul");
  const dropdownRect = ul.getBoundingClientRect();
  const switcherRect = globalseoSwitcher.getBoundingClientRect(); //Use position of the globalseoSwitcherButton not the dropdown
  // Check if the element is outside the viewport on the right side
  if ((switcherRect.x + dropdownRect.width) >= window.innerWidth) {
    ul.style.right = '0px';
    ul.style.left = 'auto';
  } else {
    ul.style.right = 'auto';
    ul.style.left = '0px';
  }

  // Check if the element is outside the viewport on the bottom side
  if ((switcherRect.y + dropdownRect.height) >= window.innerHeight) {
    ul.style.bottom = '0px';
  } else {
    ul.style.bottom = 'auto';
  }
}

function hideDropDown(element, globalseoSwitcher) {
  element.style.visibility = 'hidden';
  element.style.zIndex = '-1';
  element.style.pointerEvents = 'none';

  if (globalseoSwitcher) {
    globalseoSwitcher.style.overflow = 'hidden';
  }
}

async function createLanguageSelect(apiKey, optsArgs = {}) {
  if (!isBrowser()) return;
  if (!apiKey) {
    console.error("Globalseo API key is required");
    return;
  }  

  // Check if the style tag already exists
  if (!document.getElementById(`globalseo-style`)) {
    const style = document.createElement('style');
    style.id = `globalseo-style`;
    style.textContent = css;
    var docBody = document.body || document.getElementsByTagName("body")[0];
    if (docBody) docBody.appendChild(style);
  }

  const availableLangs = optsArgs.isInit ? [] : await fetchLanguageList(apiKey);
  const langInLocalStorage = optsArgs.isInit ? "" : await getLanguageFromLocalStorage();
  const selectedLang = getGlobalseoActiveLang() || langInLocalStorage || availableLangs?.[0]?.lang || optsArgs.originalLanguage || "";
  const selectedLangUppercased = (selectedLang || "").substring(0, 2).toUpperCase();
  const selectedLangLowercased = (selectedLang || "").substring(0, 2).toLowerCase();

  ['weploy-select', 'weploy-select-with-name', 'globalseo-select'].forEach(className => {
    const brandName = className.startsWith("weploy") ? "weploy" : "globalseo";
    const isWithLangLabel = className == `${brandName}-select-with-name`;
    // Get elements by class
    const classElements = document.getElementsByClassName(className);
    // Get elements by ID, assuming IDs are like "globalseo-select-1", "globalseo-select-2", etc.
    const idElementsStartsWithClassName = Array.from(document.querySelectorAll(`[id^="${brandName}-select"]`));
    const idElements = isWithLangLabel ? idElementsStartsWithClassName : idElementsStartsWithClassName.filter(el => !el.id.includes(`${brandName}-select-with-name`)); 
    // Combine and deduplicate elements
    const globalseoSwitchers = Array.from(new Set([...classElements, ...idElements]));

    // replace weploy with globalseo
    if (brandName == 'weploy' && globalseoSwitchers.length > 0) {
      globalseoSwitchers.forEach((el) => {
        el.classList.add('globalseo-select');
        el.classList.remove('weploy-select');
        el.classList.remove('weploy-select-with-name');

        el.classList.add('globalseo-lang-selector-wrapper');
        el.classList.remove('weploy-lang-selector-wrapper')

        el.classList.add('globalseo-exclude');
        el.classList.remove('weploy-exclude');


        ['loading', 'ready', 'error'].forEach((state) => {
          const stateWrapper = el.querySelector(`.weploy-lang-selector-${state}`);
          if (stateWrapper) {
            stateWrapper.classList.add(`globalseo-lang-selector-${state}`);
            stateWrapper.classList.remove(`weploy-lang-selector-${state}`);
          }

          const icon = el.querySelector(`.weploy-lang-selector-${state}-icon`);
          if (icon) {
            icon.classList.add(`globalseo-lang-selector-${state}-icon`);
            icon.classList.remove(`weploy-lang-selector-${state}-icon`);
          }
        })

      });
      return;
    }

    if (globalseoSwitchers.length > 0 && availableLangs) {
      globalseoSwitchers.forEach((globalseoSwitcher) => {
        // Create the select element if not already present
        let selectorCreated = globalseoSwitcher.querySelector(`.${brandName}-lang-selector-element`);
        if (!selectorCreated) {
          const initializedSelectorByUser = globalseoSwitcher.querySelector('details');

          let languages = availableLangs

          globalseoSwitcher.classList.add(`${brandName}-lang-selector-wrapper`)
          globalseoSwitcher.classList.add(`${brandName}-exclude`)
          document.addEventListener('click', function(event) {
            let isClickInside = globalseoSwitcher.contains(event.target);
          
            if (details && !isClickInside) {
              // Check if 'open' attribute is present before trying to remove it
              // if (details.hasAttribute('open')) {
              //   // To close:
              //   details.removeAttribute('open');
              // }
              const childUl = details.querySelector('ul');
              if (childUl) {
                hideDropDown(childUl, globalseoSwitcher);
              }
            }
          });
                    
          let details = initializedSelectorByUser || document.createElement('details');
          // details.dataset.behavior = 'languageSelector-topbar';
          details.role = 'group';
          details.className = `${brandName}-lang-selector-element`
          details.open = true;
          details.onclick = (e) => { 
            e.preventDefault();
            const childUl = details.querySelector('ul');
            if (childUl) {
              if (childUl.style.visibility == 'hidden'){
                globalseoSwitcher.style.overflow = 'unset';
                childUl.removeAttribute('style');
                autoPosition(childUl, globalseoSwitcher);
              } else {
                hideDropDown(childUl, globalseoSwitcher);
              }
            }
          }
          
          const initializedSummaryByUser = initializedSelectorByUser?.querySelector?.('summary')
          let summary = initializedSummaryByUser || document.createElement('summary');
          if (!initializedSummaryByUser) {
            // summary.setAttribute('aria-expanded', 'true');
            // summary.setAttribute('aria-haspopup', 'true');
            summary.role = 'button';      
            details.appendChild(summary); 
          }
          summary.onclick = (e) => { e.preventDefault(); }

          console.log("initializedSummaryByUser", initializedSummaryByUser?.childNodes)
          const initializedLoadingIcon = initializedSummaryByUser?.querySelector?.(`.${loadingIconClassName}`);
          const initializedErrorIcon = initializedSummaryByUser?.querySelector?.(`.${errorIconClassName}`);
          const initializedReadyIcon = initializedSummaryByUser?.querySelector?.(`.${readyIconClassName}`);
          
          // Check for "data-icon-color" attribute and use it for font color
          const iconColor = 
            initializedLoadingIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            initializedErrorIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            initializedReadyIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            globalseoSwitcher.getAttribute('data-icon-color') || 
            "#241c15";
          
          const loadingIcon = initializedLoadingIcon || getLoadingGlobeIcon(iconColor)
          const errorIcon = initializedErrorIcon || getErrorGlobeIcon(iconColor)
          const readyIcon = initializedReadyIcon || getReadyGlobeIcon(iconColor)
          
          getValueDisplays().push(summary);
          if (!initializedLoadingIcon) summary.insertBefore(loadingIcon, summary.firstChild)
          
          loadingIcon.after(errorIcon, readyIcon)

          const initializedSpanInSummaryByUser = initializedSummaryByUser?.querySelector?.(`.${brandName}-lang-selector-value`)
          let spanInSummary = initializedSpanInSummaryByUser || document.createElement('span');
          if (!initializedSpanInSummaryByUser) {
            spanInSummary.setAttribute('aria-hidden', 'true');
            // spanInSummary.textContent = selectedLangUppercased;
            spanInSummary.classList.add(`${brandName}-lang-selector-value`);
            if (iconColor) {
              spanInSummary.style.color = iconColor;
            }
            summary.appendChild(spanInSummary);
          } else {
            // spanInSummary.textContent = selectedLangUppercased;
            if (iconColor && !spanInSummary.style.color) {
              spanInSummary.style.color = iconColor;
            }
          }
           
          // Create a dropdown icon
          const initializedDropdownIconByUser = initializedSummaryByUser?.querySelector?.(`.${brandName}-lang-selector-dropdown`)
          const dropdownIcon = initializedDropdownIconByUser || document.createElement("div");
          if (!initializedDropdownIconByUser) {
            dropdownIcon.style.width = ".25rem";
            dropdownIcon.style.height = ".25rem";
            dropdownIcon.style.backgroundColor = iconColor;
            dropdownIcon.style.webkitClipPath = "polygon(50% 75%,100% 25%,0 25%)";
            dropdownIcon.style.clipPath = "polygon(50% 75%,100% 25%,0 25%)";
            dropdownIcon.classList.add(`${brandName}-lang-selector-dropdown`);
            summary.appendChild(dropdownIcon);
          } else {
            if (!dropdownIcon.style.backgroundColor) {
              dropdownIcon.style.backgroundColor = iconColor;
            }
          }
          
          let ul = document.createElement('ul');
          ul.className = `${brandName}-lang-selector-menu-container`;
          details.appendChild(ul);
          hideDropDown(ul, globalseoSwitcher);
          

          // globalseoSwitcher.onclick = autoPosition

          if (languages.length < 2) {
            let li = document.createElement('li');
            ul.appendChild(li);
            globalseoSwitcher.appendChild(details);

            li.style.cursor = 'auto';

            if (window.globalseoError) {
              let errorTextDiv = document.createElement('div');
              li.appendChild(errorTextDiv);

              errorTextDiv.style.padding = '5px';
              errorTextDiv.textContent = window.globalseoError;
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
                event.stopPropagation();
                if (isSelected) return;
                // Check if 'open' attribute is present before trying to remove it
                if (details.hasAttribute('open')) {
                  // To close:
                  details.removeAttribute('open');
                }

                window.globalseoTranslating = true;
                renderSelectorState();
              });

              a.className = `${brandName}-lang-selector-menu-container-item ${isSelected ? 'selected' : ''}`;

              li.appendChild(a);
          
              const options = getGlobalseoOptions();
              const langCode = options.customLanguageCode?.[language.lang] || language.lang;
              let span = document.createElement('span');
              span.setAttribute('aria-hidden', 'true');
              span.className = `${brandName}-lang-selector-menu-container-item-code`;
              span.textContent = langCode.toUpperCase();
              a.appendChild(span);
          
              let p = document.createElement('div');
              p.lang = language.lang;
              p.className = `${brandName}-lang-selector-menu-container-item-locale`;
              p.textContent = language.label;
              a.appendChild(p);

              if (isSelected) {
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('aria-hidden', 'true');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('class', `${brandName}-lang-selector-menu-container-item-selected`);
                a.appendChild(svg);
        
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('fill-rule', 'evenodd');
                path.setAttribute('clip-rule', 'evenodd');
                path.setAttribute('d', 'M20.7071 7.70712L9.99995 18.4142L4.79285 13.2071L6.20706 11.7929L9.99995 15.5858L19.2928 6.29291L20.7071 7.70712Z');
                svg.appendChild(path);
              }
          });
          
          if (!initializedSelectorByUser) globalseoSwitcher.appendChild(details);
          autoPosition(ul, globalseoSwitcher);
        }
      });
    }
  })
}

module.exports = {
  createLanguageSelect,
  addOrReplaceLangParam,
}
