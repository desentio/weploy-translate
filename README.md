![alt text](https://www.weploy.ai/perma-store/logo-black.png)

Translate your website with GPT-4. Visit our website for more information: [Weploy.ai](https://www.weploy.ai).

<br/><br/>

# Simple setup (recommended)

#### 1. Add the following script before the closing body tag.
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="false"></script>
```
if you dont want to your page to be autoamticly translated into other languages add: `data-disable-auto-translate="true"` to you tag.  [See more here.](#user-content-disable-auto-translate-on-first-time-visit)

#### 2. Add the language selector. This is how the user can select a language.
```html
<div id="weploy-select"></div>
```

Or use weploy-select-with-name to show the language name along with the flag 
```html
<div id="weploy-select-with-name"></div>
```

<br/><br/>

## Exclude text from beeing translated
If you want to exclude text from beeing translated, just add "weploy-exclude" as a class to the parent element. Inputs or user generated content will always be excluded. 
```html
<div className="weploy-exclude">Don't translate me</div>
```

## Disable auto translate on first time visit

By default, weploy-translate will auto translate your website based on user's browser language on first time visit.

If you want to disable auto translate, you can add `data-disable-auto-translate="true"` attribute to the script tag
```html
<script src="https://unpkg.com/weploy-translate/dist/weploy-translate.js" data-weploy-key="YOUR_PROJECT_KEY" data-disable-auto-translate="true"></script>
```


<br/><br/>
<br/><br/>


# Npm setup 
Our codebase and backend is being optimized daily. There might be unavoidable breaking changes in the future. We will send an email to your account about these changes. 

#### 1. Install the npm package
```bash
npm install weploy-translate
```

#### 2. Open the App.js file and import the getTranslations function from the weploy-translate package.
```javascript
import { getTranslations } from 'weploy-translate';
```


#### 3. Now in the App.js call the "getTranslations" function and pass your API KEY as an argument. Please make sure getTranslations is only called once. We recommend to call it in the useEffect hook.

```javascript
  useEffect(() => {
    getTranslations("YOUR_PROJECT_KEY", { 
      timeout: 0, // All text on the website should be visible before you get the translations. (Default is 0)
      disableAutoTranslate: false // This will disable auto translation on the first load (Default is false)
    });
  }, []);
```

Done! 🚀 The website should now automatically translate to the language set in the clients browser.


### Adding language switcher

#### 1. Import the "switchLanguage" and "getSelectedLanguage" methods.
```javascript
import {switchLanguage, getSelectedLanguage} from 'weploy-translate';
```

#### 2. Call switchLanguage()
This is just an example code, feel free to build your own you only need to call switchLanguage(ISO639_Code) to let us know a new language was selected. We will save it to the users localstorage. Make sure you pass the ISO 639 Language code (See list below).
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

#### 3. We also have to listen to the switch changes and get the correct translations
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

### Optional: Add loading indicator

Our package does not include a built-in loading indicator. However, you can easily add one manually by utilizing state. Here’s an example of how you can do it:

```javascript
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    getTranslations("YOUR_API_KEY").finally(() => setLoading(false));
  }, []);

  return loading ? <div>Loading...</div> : <div>The content</div>
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


