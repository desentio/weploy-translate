Enhance your website with GPT-4 powered translations. For more details, visit our integration guides: [globalseo.ai/integration](https://www.globalseo.ai/integration).

## About the Integration
To set up Globalseo, all you need to do is add a custom code to the start of the body tag and embed a code for the language switcher. Additionally, ensure you have completed the following steps:

- Sign up at https://app.globalseo.ai.
- Create a project and select the languages into which you want to translate your website.
- Copy the generated HTML code.
- Save the project.

# Setup your Integration

#### 1. Insert the Script
Place the following script inside your <head> tag
```html
<link href="https://unpkg.com/weploy-translate/dist/translate.css" rel="stylesheet">
<script
  src="https://unpkg.com/weploy-translate/dist/translate.js"
  data-globalseo-key="YOUR_API_KEY"
  data-use-browser-language="true"
  data-original-language="en"
  data-allowed-languages="de, es, ru, id, hi, zh, ja"
  data-exclude-classes=""
></script>
```

API Key Configuration:

1. **Important:** Replace YOUR_API_KEY with the actual API key obtained from your project. This is crucial for enabling the translation services.
2. Language Settings: data-original-language: Set this attribute to your website's primary language code (e.g., en for English, fr for French).
3. data-allowed-languages: Configure this according to your Globalseo project's requirements. List the language codes (e.g., en, fr, de) that you wish to support on your site.

Common Optional Configuration:
- data-use-browser-language: By default, this is set to automatically translate the website based on the user's browser language. If you prefer to disable this feature, set it to false.
- data-exclude-classes: Specify any CSS class names that should not be translated by the service. This is particularly useful for elements such as chatbots, which may not require translation. List the classes separated by commas (e.g., chatbot, no-translate).
- data-replace-links: By default, this is set to true, which allows the service to replace links with the translated URLs by appending the language code to the URL. If you wish to disable this feature, set it to false.
- data-auto-create-selector: By default, this is set to true, which automatically creates a language selector on your website (if you put the language selector code). If you prefer to create a custom language selector, set this to false.
- data-timeout: Set the delay (in milliseconds) before the translation service is activated. This is useful for ensuring that the page content is fully loaded before translation begins.
- data-dynamic-translation: By default, this is set to true, which enables dynamic translation of new content that is added to the page after the initial load. If you prefer to disable this feature, set it to false. Disabling this feature can prevent malicious actors from translating content that is not intended for translation.
- data-translate-attributes: If enabled, this feature will translate title & alt attributes of images and title attributes of links. This feature is intended to improve SEO and accessibility. By default, this is set to false. To enable this feature, set it to true.

Advanced Optional Configuration:
- data-lang-parameter: Specify the URL parameter that should be used to set the language. By default, this is set to "lang". If you prefer to use a different parameter, you can set it to a custom value. For example if you set this value to "t", then the language selector will append "?t=de" to the URL when the user selects the German language.
- data-custom-language-code: Specify a custom language code that should be shown in the language selector. This is useful for displaying a different language name in the selector than the actual language code. For example, you can set this attribute to "kk=kz" to display "KZ" in the language selector instead of "KK" (because people may have familiarity with the country code "KZ" for Kazakhstan).
- data-translate-splitted-text (BETA) : Merge texts that are split into multiple elements (at least contains 1 inline element, e.g., <span> tags) into a single translation unit. By default, this is set to false. To enable this feature, set it to true. This feature is useful for translating text that is split into multiple elements, such as headings or paragraphs. For example: <h1 <span My</span <span Brand</span </h1  will be translated as a single unit. NOTE: This feature is in BETA and may not work as expected in all cases.
- data-exclude-contents: Specify text content that should not be translated by the service by using regular expressions. This is useful for excluding specific text from translation. The attribute value should be a string of regular expressions wrapped in double curly braces and separated by spaces. Format: "{{regex1}} {{regex2}} {{regex3}}". For example if you want to exclude all text that contains the word "My Brand", you can set this attribute to "{{My Brand}}". Or if you want match exact text, you can use "{{^My Brand$}}".

#### 2. Add the language selector
Enable users to select a language by adding:
```html
<div class="globalseo-select globalseo-lang-selector-wrapper globalseo-exclude">
  <details role="group">
     <summary role="button" class="globalseo-lang-selector-loading">
        <svg class="globalseo-lang-selector-loading-icon" width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M16.7906 28.9982C14.131 28.9516 11.5622 28.0231 9.48748 26.3584C7.4128 24.6937 5.94973 22.3871 5.328 19.8007M16.7906 28.9982C13.4777 28.9404 10.8853 23.521 11.0009 16.8953C11.1166 10.2697 13.8966 4.94402 17.2094 5.00185M16.7906 28.9982C17.4055 29.0089 18.0021 28.8342 18.5667 28.5M16.7906 28.9982C17.4353 29.0094 17.904 28.9456 18.4338 28.8411M5.328 19.8007C8.73815 21.7699 12.6799 22.9255 16.8953 22.9991C17.5541 23.0116 18.2116 22.9969 18.8663 22.9553M5.328 19.8007C5.09283 18.8151 4.98323 17.8037 5.00182 16.7906C5.03917 14.6509 5.63417 12.6503 6.64706 10.9277M17.2094 5.00185C20.5222 5.05968 23.1147 10.4791 22.9991 17.1047C22.9878 17.7501 22.9513 18.3831 22.8914 19M17.2094 5.00185C19.3374 5.03811 21.4175 5.63986 23.2362 6.74538C25.0548 7.8509 26.5467 9.42037 27.5585 11.2928M17.2094 5.00185C15.0814 4.96382 12.9816 5.49262 11.1255 6.53399C9.26935 7.57536 7.72367 9.09181 6.64706 10.9277M27.5585 11.2928C24.612 13.7563 20.8749 15.0729 17.0349 15.0003C13.0382 14.9306 9.40832 13.4003 6.64706 10.9277M27.5585 11.2928C28.5415 13.1075 29.0375 15.146 28.9982 17.2095C28.9905 17.6459 28.9597 18.0764 28.9068 18.5" 
           stroke="#000000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
           <g style="animation: globalseospin 2s linear infinite; transform-origin: 26px 26px;">
             <circle cx="26" cy="26" r="7.125" stroke="#000000" stroke-width="1.75" stroke-dasharray="31.42" stroke-dashoffset="10.47"></circle>
           </g>
       </svg>
     </summary>
  </details>
</div>
```

## Excluding Text from Translation
⚠️ **Developer Notice:** Use the class "globalseo-exclude" to prevent translation of specific content, like chat pop-ups or user-generated text.

Note: Input fields and iframes are ignored by default. 

## Directing Users to a Specific Language Version

Direct users to a specific language version by using the /?lang=LANGUAGE_CODE URL parameter. For instance, example.com/?lang=ru will automatically translate the page into Russian.



