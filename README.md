![alt text](https://www.weploy.ai/perma-store/logo-black.png)

Translate your website with AI. Visit our website for more information: [Weploy.ai](https://www.weploy.ai).

<br/><br/>

# ✅ Simple setup (recommended)

1. Add the following script before the closing body tag.
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" ></script>
```
if you dont want to your page to be autoamticly translated into other languages add: `data-disable-auto-translate="true"` to you tag.  [See more here.](#user-content-disable-auto-translate-on-first-time-visit)

2. Add the language selector. This is how the user can select a language.
```html
<div id="weploy-select"></div>
```

Or use weploy-select-with-name to show the language name along with the flag 
```html
<div id="weploy-select-with-name"></div>
```

<br/><br/>

## Exclude text from beeing translated
If you want to exclude text from beeing translated, just add "weploy-exclude" as a class to the parent element. 
```html
<div className="weploy-exclude">Don't translate me</div>
```

## Disable auto translate on first time visit

By default, weploy-translate will auto translate your website based on user's browser language on first time visit.

If you want to disable auto translate, you can add `data-disable-auto-translate="true"` attribute to the script tag
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="true"></script>
```

----------------------------------------

# NPM Setup (Expert)
1. Install the npm package
```bash
npm install weploy-translate
```

2. Open the App.js file and import the getTranslations function from the weploy-translate package.
```javascript
import { getTranslations } from 'weploy-translate';
```


3. Now in the App.js call the "getTranslations" function and pass your API KEY as an argument. Please make sure getTranslations is only called once. We recommend to call it in the useEffect hook.

```javascript
  useEffect(() => {
    getTranslations("YOUR_API_KEY");
  }, []);
```

Done! 🚀 The website should now automatically translate to the language set in the clients browser.


### Adding language switcher

1. Import the "switchLanguage" and "getSelectedLanguage" methods.
```javascript
import {switchLanguage, getSelectedLanguage} from 'weploy-translate';
```

2. Here is an example for the switch. However, feel free to build your own you only need to call switchLanguage() to let us know a new language was selected. We will save it to the users localstorage. 
```html
<select
  className="weploy-exclude"
  value={language} 
  onChange={(e)=> switchLanguage(e.target.value)}>
        <option value="de">🇩🇪</option>
        <option value="en">🇺🇸</option>
        <option value="es">🇪🇸</option>
</select>
```

3. We also have to listen to the switch changes and get the correct translations
```javascript
import {switchLanguage, getSelectedLanguage} from 'weploy-translate';

  const [language, setLanguage] = useState(null);
  useEffect(() => {
    getSelectedLanguage().then((lang) => {
      setLanguage(lang)
    })
  }, []);

```

Done. Now you should be able to switch the language manually.

### Add loading indicator

Our package does not include a built-in loading indicator. However, you can easily add one manually by utilizing state. Here’s an example of how you can do it:

```javascript
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTranslations("YOUR_API_KEY").finally(() => setLoading(false));
  }, []);

  return loading ? <div>Loading...</div> : <div>The content</div>
```

### Disable auto translate on first time visit

By default, weploy-translate will auto translate your website based on user's browser language on first time visit.


You can pass `disableAutoTranslate: true` to the second argument of `getTranslations` function.
```javascript
  useEffect(() => {
    getTranslations("YOUR_API_KEY", {
      disableAutoTranslate: true
    });
  }, []);
```


### Custom timeout between route changes 

Website that has route change animation usually needs to wait longer until all dom fully rendered. To handle this case, we need to pass `timeout` to the second argument of `getTranslations` function. If we need different timeout on every pages, then we can use `pathOptions[pathname].timeout`.
```javascript
  useEffect(() => {
    getTranslations("YOUR_API_KEY", {
      timeout: 1500,
      pathOptions: {
        '/about': {
          timeout: 2000
        },
        '/privacy': {
          timeout: 3000
        },
      }
    });
  }, []);
```

Note: 
1. default value of `timeout` is `0`
2. `pathOptions[pathname].timeout` is prioritized, if it's undefined then will fallback to `timeout`
