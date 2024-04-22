Enhance your website with GPT-4 powered translations. For more details, visit our website: [Weploy.ai](https://www.weploy.ai).

# Simple Setup

#### 1. Insert the Script
Place the following script before the closing body tag of your HTML:
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="false" data-exclude-classes="SOME_CLASSES_TO_BE_IGNORED"></script>
```
To prevent automatic translation of your page into other languages, add: `data-disable-auto-translate="true"` to the script tag. [Learn more here.](#user-content-disable-auto-translate-on-first-time-visit)

#### 2. Add Language Selector
Enable users to select a language by adding:
```html
<div id="weploy-select"></div>
```

## Excluding Text from Translation
⚠️ **Developer Notice:** Use the class "weploy-exclude" to prevent translation of specific content, like chat pop-ups or user-generated text.

**Implementation:**
```html
<!-- Example: Marking text to be excluded from translation -->
<div className="weploy-exclude">Non-translatable content here</div>
```

Or pass **data-exclude-classes** to the script tag:
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-exclude-classes="class1 class2 class3"></script>
```

Note: Inputs and user-generated content are not translated by default.

To exclude specific text from translation, add the class "weploy-exclude" to the parent element. Note that inputs or user-generated content are always excluded by default. 
```html
<div className="weploy-exclude">Don't translate me</div>
```

## Disable Auto Translate on First Visit

Weploy-translate automatically translates your website based on the user's browser language during their first visit.

To disable this feature, add the `data-disable-auto-translate="true"` attribute to the script tag:
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="true"></script>
```

## Directing Users to a Specific Language Version

Direct users to a specific language version by using the /?lang=LANGUAGE_CODE URL parameter. For instance, example.com/?lang=ru will automatically translate the page into Russian.

zu	Zulu
```


