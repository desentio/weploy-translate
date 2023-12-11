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
