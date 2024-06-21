![alt text](https://www.globalseo.ai/perma-store/logo-black.png)

Enhance your website with GPT-4 powered translations. For more details, visit our website: [Globalseo.ai](https://www.globalseo.ai).

WARNING: We advise against using our npm package in your project due to potential unhandled bugs and missing features. Opt for the CDN version for seamless bug fixes without any action required on your end.

# NPM Setup
Our codebase and backend are continuously optimized. Future breaking changes are possible, and we will notify you about these via email.

#### 1. Install the NPM Package
```bash
npm install weploy-translate
```

#### 2. Modify the App.js File
Import the `getTranslations` function from the weploy-translate package:
```javascript
import { getTranslations } from 'weploy-translate';
```

#### 3. Use the `getTranslations` Function
In App.js, call `getTranslations` with your API key. Ensure this function is called only once, preferably within the `useEffect` hook:
```javascript
  useEffect(() => {
    getTranslations("YOUR_PROJECT_KEY", { 
      timeout: 0, // Wait until all text on the website is visible before loading translations (default is 0).
      disableAutoTranslate: false // Disable auto translation on the initial load (default is false).
    });
  }, []);
```
Done! 🚀 Your website will now automatically translate to the language preferred by the user's browser.

### Adding a Language Switcher

#### 1. Import Methods
Import the `switchLanguage` and `getSelectedLanguage` methods:
```javascript
import { switchLanguage, getSelectedLanguage } from 'weploy-translate';
```

#### 2. Implement switchLanguage()
Below is an example code for a language switcher. Customize as needed, but remember to call `switchLanguage(ISO639_Code)` to indicate a language change. This will be saved in the user's local storage. Use the appropriate ISO 639 Language code:
```html
<select
  className="globalseo-exclude"
  value={language} 
  onChange={(e) => switchLanguage(e.target.value)}>
        <option value="de">🇩🇪</option>
        <option value="en">🇺🇸</option>
        <option value="es">🇪🇸</option>
</select>
```

#### 3. Handle Language Switch Events
```javascript
import { switchLanguage, getSelectedLanguage } from 'weploy-translate';

  const [language, setLanguage] = useState(null);
  useEffect(() => {
    getSelectedLanguage().then((lang) => {
      setLanguage(lang);
    });
  }, []);
```
Now, users can manually switch languages as desired.

### Optional: Add a Loading Indicator

Our package does not include a built-in loading indicator, but you can add one using state management. Here's an example:
```javascript
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTranslations("YOUR_API_KEY").finally(() => setLoading(false));
  }, []);

  return loading ? <div>Loading</div> : <div>Your content here</div>
```