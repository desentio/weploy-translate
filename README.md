![alt text](https://www.weploy.ai/perma-store/logo-black.png)

Enhance your website with GPT-4 powered translations. For more details, visit our website: [Weploy.ai](https://www.weploy.ai).

# Simple Setup (Recommended)

#### 1. Insert the Script
Place the following script before the closing body tag of your HTML:
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="false"></script>
```
To prevent automatic translation of your page into other languages, add: `data-disable-auto-translate="true"` to the script tag. [Learn more here.](#user-content-disable-auto-translate-on-first-time-visit)

#### 2. Add Language Selector
Enable users to select a language by adding:
```html
<div id="weploy-select"></div>
```
Alternatively, to display language names alongside flags, use:
```html
<div id="weploy-select-with-name"></div>
```

## Excluding Text from Translation
⚠️ You should put this class on **chat popups like crisp chat** any other user generated content that should not be translated!

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


---

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
  className="weploy-exclude"
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

  return loading ? <div>Loading

...</div> : <div>Your content here</div>
```


### Available ISO639 Codes
```
aa	Afar
ab	Abkhazian
ae	Avestan
af	Afrikaans
ak	Akan
am	Amharic
an	Aragonese
ar	Arabic
as	Assamese
av	Avaric
ay	Aymara
az	Azerbaijani
ba	Bashkir
be	Belarusian
bg	Bulgarian
bh	Bihari languages
bm	Bambara
bi	Bislama
bn	Bengali
bo	Tibetan
br	Breton
bs	Bosnian
ca	Catalan; Valencian
ce	Chechen
ch	Chamorro
co	Corsican
cr	Cree
cs	Czech
cu	Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic
cv	Chuvash
cy	Welsh
da	Danish
de	German
dv	Divehi; Dhivehi; Maldivian
dz	Dzongkha
ee	Ewe
el	Greek, Modern (1453-)
en	English
eo	Esperanto
es	Spanish; Castilian
et	Estonian
eu	Basque
fa	Persian
ff	Fulah
fi	Finnish
fj	Fijian
fo	Faroese
fr	French
fy	Western Frisian
ga	Irish
gd	Gaelic; Scottish Gaelic
gl	Galician
gn	Guarani
gu	Gujarati
gv	Manx
ha	Hausa
he	Hebrew
hi	Hindi
ho	Hiri Motu
hr	Croatian
ht	Haitian; Haitian Creole
hu	Hungarian
hy	Armenian
hz	Herero
ia	Interlingua (International Auxiliary Language Association)
id	Indonesian
ie	Interlingue; Occidental
ig	Igbo
ii	Sichuan Yi; Nuosu
ik	Inupiaq
io	Ido
is	Icelandic
it	Italian
iu	Inuktitut
ja	Japanese
jv	Javanese
ka	Georgian
kg	Kongo
ki	Kikuyu; Gikuyu
kj	Kuanyama; Kwanyama
kk	Kazakh
kl	Kalaallisut; Greenlandic
km	Central Khmer
kn	Kannada
ko	Korean
kr	Kanuri
ks	Kashmiri
ku	Kurdish
kv	Komi
kw	Cornish
ky	Kirghiz; Kyrgyz
la	Latin
lb	Luxembourgish; Letzeburgesch
lg	Ganda
li	Limburgan; Limburger; Limburgish
ln	Lingala
lo	Lao
lt	Lithuanian
lu	Luba-Katanga
lv	Latvian
mg	Malagasy
mh	Marshallese
mi	Maori
mk	Macedonian
ml	Malayalam
mn	Mongolian
mr	Marathi
ms	Malay
mt	Maltese
my	Burmese
na	Nauru
nb	Bokmål, Norwegian; Norwegian Bokmål
nd	Ndebele, North; North Ndebele
ne	Nepali
ng	Ndonga
nl	Dutch; Flemish
nn	Norwegian Nynorsk; Nynorsk, Norwegian
no	Norwegian
nr	Ndebele, South; South Ndebele
nv	Navajo; Navaho
ny	Chichewa; Chewa; Nyanja
oc	Occitan (post 1500)
oj	Ojibwa
om	Oromo
or	Oriya
os	Ossetian; Ossetic
pa	Panjabi; Punjabi
pi	Pali
pl	Polish
ps	Pushto; Pashto
pt	Portuguese
qu	Quechua
rm	Romansh
rn	Rundi
ro	Romanian; Moldavian; Moldovan
ru	Russian
rw	Kinyarwanda
sa	Sanskrit
sc	Sardinian
sd	Sindhi
se	Northern Sami
sg	Sango
si	Sinhala; Sinhalese
sk	Slovak
sl	Slovenian
sm	Samoan
sn	Shona
so	Somali
sq	Albanian
sr	Serbian
ss	Swati
st	Sotho, Southern
su	Sundanese
sv	Swedish
sw	Swahili
ta	Tamil
te	Telugu
tg	Tajik
th	Thai
ti	Tigrinya
tk	Turkmen
tl	Tagalog
tn	Tswana
to	Tonga (Tonga Islands)
tr	Turkish
ts	Tsonga
tt	Tatar
tw	Twi
ty	Tahitian
ug	Uighur; Uyghur
uk	Ukrainian
ur	Urdu
uz	Uzbek
ve	Venda
vi	Vietnamese
vo	Volapük
wa	Walloon
wo	Wolof
xh	Xhosa
yi	Yiddish
yo	Yoruba
za	Zhuang; Chuang
zh	Chinese
zu	Zulu
```


