Enhance your website with GPT-4 powered translations. For more details, visit our website: [Weploy.ai](https://www.weploy.ai).

# Simple Setup (Recommended)

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


