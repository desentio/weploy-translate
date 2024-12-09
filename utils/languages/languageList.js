
const languagesList = [
  { "label": "Qafar", "lang": "aa" },
  { "label": "Avesta", "lang": "ae" },
  { "label": "Afrikaans", "lang": "af" },
  { "label": "Akan", "lang": "ak" },
  { "label": "\u12a0\u121b\u122d\u129b", "lang": "am" }, // Amharic
  { "label": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "lang": "ar" }, // Arabic
  { "label": "Az\u0259rbaycanca", "lang": "az" },
  { "label": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f", "lang": "be" }, // Belarusian
  { "label": "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438", "lang": "bg" }, // Bulgarian
  { "label": "Bamanankan", "lang": "bm" },
  { "label": "\u049a\u0430\u0437\u0430\u049b\u0448\u0430", "lang": "kk" }, // Kazakh
  { "label": "Bislama", "lang": "bi" },
  { "label": "\u09ac\u09be\u0982\u09b2\u09be", "lang": "bn" }, // Bengali
  { "label": "\u0f56\u0f7c\u0f51\u0f0b\u0f66\u0f90\u0f51\u0f0d", "lang": "bo" }, // Tibetan
  { "label": "Bosanski", "lang": "bs" },
  { "label": "\u010ce\u0161tina", "lang": "cs" }, // Czech
  { "label": "Dansk", "lang": "da" },
  { "label": "Deutsch", "lang": "de" },
  { "label": "\u078b\u07a8\u0790\u07b0\u0788\u07ac\u0780\u07a8", "lang": "dv" }, // Divehi
  { "label": "\u0f62\u0fab\u0f7c\u0f44\u0f0b\u0f41\u0f0b", "lang": "dz" }, // Dzongkha
  { "label": "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac", "lang": "el" }, // Greek
  { "label": "English", "lang": "en" },
  { "label": "Espa\u00f1ol", "lang": "es" },
  { "label": "Espa\u00f1ol (M\u00e9xico)", "lang": "es-mx" },
  { "label": "Eesti", "lang": "et" }, // Estonian
  { "label": "\u0641\u0627\u0631\u0633\u06cc", "lang": "fa" }, // Persian
  { "label": "Suomi", "lang": "fi" }, // Finnish
  { "label": "Vosa Vakaviti", "lang": "fj" },
  { "label": "F\u00f8royskt", "lang": "fo" },
  { "label": "Fran\u00e7ais", "lang": "fr" },
  { "label": "Gaeilge", "lang": "ga" }, // Irish
  { "label": "Ava\u00f1e\u02c6", "lang": "gn" },
  { "label": "\u05e2\u05d1\u05e8\u05d9\u05ea", "lang": "he" }, // Hebrew
  { "label": "\u0939\u093f\u0928\u094d\u0926\u0940", "lang": "hi" }, // Hindi
  { "label": "Hiri Motu", "lang": "ho" },
  { "label": "Hrvatski", "lang": "hr" }, // Croatian
  { "label": "Krey\u00f2l Ayisyen", "lang": "ht" },
  { "label": "Magyar", "lang": "hu" }, // Hungarian
  { "label": "\u0540\u0561\u0575\u0565\u0580\u0565\u0576", "lang": "hy" }, // Armenian
  { "label": "Bahasa Indonesia", "lang": "id" }, // Indonesian
  { "label": "\u00cdslenska", "lang": "is" }, // Icelandic
  { "label": "Italiano", "lang": "it" },
  { "label": "\u65e5\u672c\u8a9e", "lang": "ja" }, // Japanese
  { "label": "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8", "lang": "ka" }, // Georgian
  { "label": "Kikongo", "lang": "kg" },
  { "label": "\ud55c\uad6d\uc5b4", "lang": "ko" }, // Korean
  { "label": "Lingua Latina", "lang": "la" }, // Latin
  { "label": "L\u00ebtzebuergesch", "lang": "lb" }, // Luxembourgish
  { "label": "\u0ea5\u0eb2\u0ea7", "lang": "lo" }, // Lao
  { "label": "Lietuvi\u0173", "lang": "lt" }, // Lithuanian
  { "label": "Latvie\u0161u", "lang": "lv" }, // Latvian
  { "label": "Fiteny Malagasy", "lang": "mg" },
  { "label": "Kajin M\u0327aje\u013c", "lang": "mh" },
  { "label": "Te Reo M\u0101ori", "lang": "mi" }, // Maori
  { "label": "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438", "lang": "mk" }, // Macedonian
  { "label": "\u041c\u043e\u043d\u0433\u043e\u043b", "lang": "mn" }, // Mongolian
  { "label": "Bahasa Melayu", "lang": "ms" }, // Malay
  { "label": "Malti", "lang": "mt" }, // Maltese
  { "label": "\u1019\u103c\u1014\u103a\u1019\u102c\u1018\u102c\u101e\u102c", "lang": "my" }, // Burmese
  { "label": "Ekakairan", "lang": "na" }, // Nauru
  { "label": "\u0928\u0947\u092a\u093e\u0932\u0940", "lang": "ne" }, // Nepali
  { "label": "Nederlands", "lang": "nl" }, // Dutch
  { "label": "Norsk", "lang": "no" },
  { "label": "Polski", "lang": "pl" },
  { "label": "Portugu\u00eas", "lang": "pt" }, // Portuguese
  { "label": "Rom\u00e2n\u0103", "lang": "ro" }, // Romanian
  { "label": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", "lang": "ru" }, // Russian
  { "label": "Kinyarwanda", "lang": "rw" },
  { "label": "\u0633\u0646\u062f\u06be\u06cc", "lang": "sd" }, // Sindhi
  { "label": "Sloven\u010dina", "lang": "sk" }, // Slovak
  { "label": "Sloven\u0161\u010dina", "lang": "sl" }, // Slovenian
  { "label": "Soomaali", "lang": "so" },
  { "label": "Shqip", "lang": "sq" }, // Albanian
  { "label": "\u0421\u0440\u043f\u0441\u043a\u0438", "lang": "sr" }, // Serbian
  { "label": "Svenska", "lang": "sv" }, // Swedish
  { "label": "Kiswahili", "lang": "sw" }, // Swahili
  { "label": "\u0442\u043e\u04b7\u0438\u043a\u04e3", "lang": "tg" }, // Tajik
  { "label": "\u0e44\u0e17\u0e22", "lang": "th" }, // Thai
  { "label": "\u1275\u130d\u122d\u129b", "lang": "ti" }, // Tigrinya
  { "label": "T\u00fcrkmen", "lang": "tk" },
  { "label": "T\u00fcrk\u00e7e", "lang": "tr" },
  { "label": "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", "lang": "uk" }, // Ukrainian
  { "label": "O\u02bcm\u0259\u02bcm\u012fn\u0259", "lang": "uz" }, // Uzbek
  { "label": "Ti\u1ebfng Vi\u1ec7t", "lang": "vi" }, // Vietnamese
  { "label": "\u4e2d\u6587", "lang": "zh" }, // Chinese
];

module.exports = languagesList;