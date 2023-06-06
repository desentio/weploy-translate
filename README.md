![alt text](https://www.weploy.ai/perma-store/logo-black.png)

Visit our website for more information: [Weploy.ai](https://www.weploy.ai) Website.

### Installation (React & Next.js)

```bash
npm install weploy-translate
```

Open the App.js file and import the getTranslations function from the weploy-translate package.
```javascript
import { getTranslations } from 'weploy-translate';
```


Now you just need to call the getTranslations function and pass your API KEY as an argument. Please make sure getTranslations is only called once. We recommend to call it in the useEffect hook.

```javascript
  useEffect(() => {
    getTranslations("YOUR_API_KEY");
  }, []);
```



Now add "weploy-translate" to the pages or elements you want to translate. Do not nest them. This can result in unexpected behaviour.
```javascript
function HomePage() {
  return (
    <div id="weploy-translate">
      <h1>Translate this text please</h1>
    </div>
  );
}
```


Done! 🚀 The website should now automatically translate to the language set in the clients browser.

### Exclude specific components
If you want to exclude some DOM from translations, just add "weploy-exclude" className
```html
<div className="weploy-exclude">Don't translate me</div>
```

### Switching languages manually

If you want to add a language selector to your website you need to add the following html wherever you want the language selector to appear.
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

also you need to add the following js code:
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


### Translate Dynamic Dom Elements

If you want to translate dynamic dom elements you need to add the following code to the element you want to translate.


Coming soon...


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
1. default value of `timeout` is `1000`
2. `pathOptions[pathname].timeout` is prioritized, if it's undefined then will fallback to `timeout`

### Available languages
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