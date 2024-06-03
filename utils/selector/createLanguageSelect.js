const { loadingIconClassName, errorIconClassName, readyIconClassName, getLoadingGlobeIcon, getErrorGlobeIcon, getReadyGlobeIcon } = require("./icons");
require('../../weploy.css');

const cssModule = require('../../weploy.css?raw');
const { isBrowser, getWeployActiveLang, getWeployOptions } = require("../configs");
const { getLanguageFromLocalStorage } = require("../languages/getSelectedLanguage");
const { fetchLanguageList } = require("../languages/fetchLanguageList");
const { renderWeploySelectorState } = require("./renderWeploySelectorState");
const { getWeployValueDisplays, setWeployValueDisplays } = require("./weployValueDisplays");

const css = cssModule.default || cssModule;

function addOrReplaceLangParam(url, lang) {
  let urlObj = new URL(url);
  let params = new URLSearchParams(urlObj.search);

  const options = getWeployOptions();
  params.set(options.langParam || 'lang', lang);
  urlObj.search = params.toString();

  return urlObj.toString();
}

function hideDropDown(element) {
  element.style.visibility = 'hidden';
  element.style.zIndex = '-1';
  element.style.pointerEvents = 'none';
}

async function createLanguageSelect(apiKey, optsArgs = {}) {
  if (!isBrowser()) return;
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
    if (docBody) docBody.appendChild(style);
  }

  const availableLangs = optsArgs.isInit ? [] : await fetchLanguageList(apiKey);
  const langInLocalStorage = optsArgs.isInit ? "" : await getLanguageFromLocalStorage();
  const selectedLang = getWeployActiveLang() || langInLocalStorage || availableLangs?.[0]?.lang || optsArgs.originalLanguage || "";
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
        let selectorCreated = weploySwitcher.querySelector('.weploy-lang-selector-element');
        if (!selectorCreated) {
          const initializedSelectorByUser = weploySwitcher.querySelector('details');

          let languages = availableLangs

          weploySwitcher.classList.add('weploy-lang-selector-wrapper')
          weploySwitcher.classList.add('weploy-exclude')
          document.addEventListener('click', function(event) {
            let isClickInside = weploySwitcher.contains(event.target);
          
            if (details && !isClickInside) {
              // Check if 'open' attribute is present before trying to remove it
              // if (details.hasAttribute('open')) {
              //   // To close:
              //   details.removeAttribute('open');
              // }
              const childUl = details.querySelector('ul');
              if (childUl) {
                hideDropDown(childUl);
              }
            }
          });
          
          // let div = document.createElement('div');
          // div.className = 'weploy-lang-selector-nav';
          
          let details = initializedSelectorByUser || document.createElement('details');
          // details.dataset.behavior = 'languageSelector-topbar';
          details.role = 'group';
          details.className = "weploy-lang-selector-element"
          details.open = true;
          details.onclick = (e) => { 
            e.preventDefault();
            const childUl = details.querySelector('ul');
            if (childUl) {
              if (childUl.style.visibility == 'hidden'){
                childUl.removeAttribute('style');
              } else {
                hideDropDown(childUl);
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

          const initializedLoadingIcon = initializedSummaryByUser?.querySelector?.(`.${loadingIconClassName}`);
          const initializedErrorIcon = initializedSummaryByUser?.querySelector?.(`.${errorIconClassName}`);
          const initializedReadyIcon = initializedSummaryByUser?.querySelector?.(`.${readyIconClassName}`);
          
          // Check for "data-icon-color" attribute and use it for font color
          const iconColor = 
            initializedLoadingIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            initializedErrorIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            initializedReadyIcon?.querySelector?.('path')?.getAttribute('stroke') || 
            weploySwitcher.getAttribute('data-icon-color') || 
            "#241c15";
          
          const loadingIcon = initializedLoadingIcon || getLoadingGlobeIcon(iconColor)
          const errorIcon = initializedErrorIcon || getErrorGlobeIcon(iconColor)
          const readyIcon = initializedReadyIcon || getReadyGlobeIcon(iconColor)
          
          getWeployValueDisplays().push(summary);
          if (!initializedLoadingIcon) summary.insertBefore(loadingIcon, summary.firstChild)
          
          loadingIcon.after(errorIcon, readyIcon)

          const initializedSpanInSummaryByUser = initializedSummaryByUser?.querySelector?.('.weploy-lang-selector-value')
          let spanInSummary = initializedSpanInSummaryByUser || document.createElement('span');
          if (!initializedSpanInSummaryByUser) {
            spanInSummary.setAttribute('aria-hidden', 'true');
            // spanInSummary.textContent = selectedLangUppercased;
            spanInSummary.classList.add('weploy-lang-selector-value');
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
          const initializedDropdownIconByUser = initializedSummaryByUser?.querySelector?.('.weploy-lang-selector-dropdown')
          const dropdownIcon = initializedDropdownIconByUser || document.createElement("div");
          if (!initializedDropdownIconByUser) {
            dropdownIcon.style.width = ".25rem";
            dropdownIcon.style.height = ".25rem";
            dropdownIcon.style.backgroundColor = iconColor;
            dropdownIcon.style.webkitClipPath = "polygon(50% 75%,100% 25%,0 25%)";
            dropdownIcon.style.clipPath = "polygon(50% 75%,100% 25%,0 25%)";
            dropdownIcon.classList.add('weploy-lang-selector-dropdown');
            summary.appendChild(dropdownIcon);
          } else {
            if (!dropdownIcon.style.backgroundColor) {
              dropdownIcon.style.backgroundColor = iconColor;
            }
          }
          
          let ul = document.createElement('ul');
          ul.className = 'weploy-lang-selector-menu-container';
          details.appendChild(ul);
          hideDropDown(ul);

          async function autoPosition(e) {
            // if (e.target != weploySwitcher) return;
            if(!ul) return;
            // const ul = e.target.querySelector("ul");
            const dropdownRect = ul.getBoundingClientRect();
            const switcherRect = weploySwitcher.getBoundingClientRect(); //Use position of the weploySwitcherButton not the dropdown
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

          weploySwitcher.onclick = autoPosition

          if (languages.length < 2) {
            let li = document.createElement('li');
            ul.appendChild(li);
            weploySwitcher.appendChild(details);

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
                event.stopPropagation();
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
          
              const options = getWeployOptions();
              const langCode = options.customLanguageCode?.[language.lang] || language.lang;
              let span = document.createElement('span');
              span.setAttribute('aria-hidden', 'true');
              span.className = 'weploy-lang-selector-menu-container-item-code';
              span.textContent = langCode.toUpperCase();
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
          
          if (!initializedSelectorByUser) weploySwitcher.appendChild(details);
          autoPosition();
        }
      });
    }
  })
}

module.exports = {
  createLanguageSelect,
  addOrReplaceLangParam,
}
