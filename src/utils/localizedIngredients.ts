import { SupportedLanguage } from '../context/LanguageContext.tsx';

const INGREDIENT_LOCALIZATION: Record<string, Record<SupportedLanguage, string>> = {
  tomato: {
    en: 'Tomato',
    kn: 'ಟೊಮೇಟೊ (Tomato)',
    hi: 'टमाटर (Tomato)',
    ta: 'தக்காளி (Tomato)',
    te: 'టమోటా (Tomato)',
    ml: 'തക്കാളി (Tomato)',
    mr: 'टोमॅटो (Tomato)',
    bn: 'টমেটো (Tomato)',
    gu: 'ટામેટા (Tomato)'
  },
  onion: {
    en: 'Onion',
    kn: 'ಈರುಳ್ಳಿ (Onion)',
    hi: 'प्याज (Onion)',
    ta: 'வெங்காயம் (Onion)',
    te: 'ఉల్లిపాయ (Onion)',
    ml: 'സവാള (Onion)',
    mr: 'कांदा (Onion)',
    bn: 'পেঁয়াজ (Onion)',
    gu: 'ડુંગળી (Onion)'
  },
  potato: {
    en: 'Potato',
    kn: 'ಆಲೂಗಡ್ಡೆ (Potato)',
    hi: 'आलू (Potato)',
    ta: 'உருளைக்கிழங்கு (Potato)',
    te: 'బంగాళాదుంప (Potato)',
    ml: 'ഉരുളക്കിഴങ്ങ് (Potato)',
    mr: 'बटाटा (Potato)',
    bn: 'আলু (Potato)',
    gu: 'બટાટા (Potato)'
  },
  egg: {
    en: 'Egg',
    kn: 'ಮೊಟ್ಟೆ (Egg)',
    hi: 'अंडा (Egg)',
    ta: 'முட்டை (Egg)',
    te: 'గుడ్డు (Egg)',
    ml: 'മുട്ട (Egg)',
    mr: 'अंडे (Egg)',
    bn: 'ডিম (Egg)',
    gu: 'ઈંડું (Egg)'
  },
  eggs: {
    en: 'Eggs',
    kn: 'ಮೊಟ್ಟೆಗಳು (Eggs)',
    hi: 'अंडे (Eggs)',
    ta: 'முட்டைகள் (Eggs)',
    te: 'గుడ్లు (Eggs)',
    ml: 'മുട്ടകൾ (Eggs)',
    mr: 'अंडी (Eggs)',
    bn: 'ডিম (Eggs)',
    gu: 'ઈંડા (Eggs)'
  },
  garlic: {
    en: 'Garlic',
    kn: 'ಬೆಳ್ಳುಳ್ಳಿ (Garlic)',
    hi: 'लहसुन (Garlic)',
    ta: 'பூண்டு (Garlic)',
    te: 'వెల్లుల్లి (Garlic)',
    ml: 'വെളുത്തുള്ളി (Garlic)',
    mr: 'लसूण (Garlic)',
    bn: 'রসুন (Garlic)',
    gu: 'લસણ (Garlic)'
  },
  spinach: {
    en: 'Spinach',
    kn: 'ಪಾಲಕ್ ಸೊಪ್ಪು (Spinach)',
    hi: 'पालक (Spinach)',
    ta: 'பசலைக்கீரை (Spinach)',
    te: 'పాలకూర (Spinach)',
    ml: 'ചീര (Spinach)',
    mr: 'पालक (Spinach)',
    bn: 'পালং শাক (Spinach)',
    gu: 'પાલક (Spinach)'
  },
  capsicum: {
    en: 'Capsicum',
    kn: 'ದೊಣ್ಣೆಮೆಣಸಿನಕಾಯಿ (Capsicum)',
    hi: 'शिमला मिर्च (Capsicum)',
    ta: 'குடைமிளகாய் (Capsicum)',
    te: 'క్యాప్సికమ్ (Capsicum)',
    ml: 'ക്യാപ്സിക്കം (Capsicum)',
    mr: 'ढोबळी मिरची (Capsicum)',
    bn: 'ক্যাপসিকাম (Capsicum)',
    gu: 'કેપ્સિકમ (Capsicum)'
  },
  carrot: {
    en: 'Carrot',
    kn: 'ಕ್ಯಾರೆಟ್ (Carrot)',
    hi: 'गाजर (Carrot)',
    ta: 'கேரட் (Carrot)',
    te: 'క్యారెట్ (Carrot)',
    ml: 'കാരറ്റ് (Carrot)',
    mr: 'गाजर (Carrot)',
    bn: 'গাজর (Carrot)',
    gu: 'ગાજર (Carrot)'
  },
  rice: {
    en: 'Rice',
    kn: 'ಅಕ್ಕಿ (Rice)',
    hi: 'चावल (Rice)',
    ta: 'அரிசி (Rice)',
    te: 'బియ్యం (Rice)',
    ml: 'അരി (Rice)',
    mr: 'तांदूळ (Rice)',
    bn: 'চাল (Rice)',
    gu: 'ચોખા (Rice)'
  },
  paneer: {
    en: 'Paneer',
    kn: 'ಪನೀರ್ (Paneer)',
    hi: 'पनीर (Paneer)',
    ta: 'பன்னீர் (Paneer)',
    te: 'పనీర్ (Paneer)',
    ml: 'പനീർ (Paneer)',
    mr: 'पनीर (Paneer)',
    bn: 'পনির (Paneer)',
    gu: 'પનીર (Paneer)'
  },
  chicken: {
    en: 'Chicken',
    kn: 'ಕೋಳಿ ಮಾಂಸ (Chicken)',
    hi: 'चिकन (Chicken)',
    ta: 'கோழி இறைச்சி (Chicken)',
    te: 'చికెన్ (Chicken)',
    ml: 'ചിക്കൻ (Chicken)',
    mr: 'चिकन (Chicken)',
    bn: 'চিকেন (Chicken)',
    gu: 'ચિકન (Chicken)'
  },
  milk: {
    en: 'Milk',
    kn: 'ಹಾಲು (Milk)',
    hi: 'दूध (Milk)',
    ta: 'பால் (Milk)',
    te: 'పాలు (Milk)',
    ml: 'പാൽ (Milk)',
    mr: 'दूध (Milk)',
    bn: 'দুধ (Milk)',
    gu: 'દૂધ (Milk)'
  },
  turmeric: {
    en: 'Turmeric Powder',
    kn: 'ಅರಿಶಿನ ಪುಡಿ (Haldi)',
    hi: 'हल्दी पाउडर (Haldi)',
    ta: 'மஞ்சள் தூள் (Haldi)',
    te: 'పసుపు పొడి (Haldi)',
    ml: 'മഞ്ഞൾപ്പൊടി (Haldi)',
    mr: 'हळद पावडर (Haldi)',
    bn: 'হলুদ গুঁড়ো (Haldi)',
    gu: 'હળદર (Haldi)'
  },
  cumin: {
    en: 'Cumin Seeds',
    kn: 'ಜೀರಿಗೆ (Jeera)',
    hi: 'जीरा (Jeera)',
    ta: 'சீரகம் (Jeera)',
    te: 'జీలకర్ర (Jeera)',
    ml: 'ജീരകം (Jeera)',
    mr: 'जिरे (Jeera)',
    bn: 'জিরে (Jeera)',
    gu: 'જીરું (Jeera)'
  },
  mustard: {
    en: 'Mustard Seeds',
    kn: 'ಸಾಸಿವೆ (Sasive)',
    hi: 'राई / सरसों (Rai)',
    ta: 'கடுகு (Rai)',
    te: 'ఆవాలు (Rai)',
    ml: 'കടുക് (Rai)',
    mr: 'मोहरी (Rai)',
    bn: 'সর্ষে দানা (Rai)',
    gu: 'રાઈ (Rai)'
  },
  coriander: {
    en: 'Coriander Powder',
    kn: 'ಕೊತ್ತಂಬರಿ ಪುಡಿ (Dhania)',
    hi: 'धनिया पाउडर (Dhania)',
    ta: 'மல்லி தூள் (Dhania)',
    te: 'ధనియాల పొడి (Dhania)',
    ml: 'മല്ലിപ്പൊടി (Dhania)',
    mr: 'धने पावडर (Dhania)',
    bn: 'ধনে গুঁড়ো (Dhania)',
    gu: 'ધાણા પાવડર (Dhania)'
  },
  chilli: {
    en: 'Red Chilli Powder',
    kn: 'ಖಾರದ ಪುಡಿ (Chilli)',
    hi: 'लाल मिर्च (Chilli)',
    ta: 'மிளகாய் தூள் (Chilli)',
    te: 'కారం పొడి (Chilli)',
    ml: 'മുളകുപൊടി (Chilli)',
    mr: 'लाल तिखट (Chilli)',
    bn: 'লাল লঙ্কা গুঁড়ো (Chilli)',
    gu: 'લાલ મરચું (Chilli)'
  },
  garam: {
    en: 'Garam Masala',
    kn: 'ಗರಂ ಮಸಾಲಾ (Garam Masala)',
    hi: 'गरम मसाला',
    ta: 'கரம் மசாலா',
    te: 'గరం మసాలా',
    ml: 'ഗരം മസാല',
    mr: 'गरम मसाला',
    bn: 'গরম মসলা',
    gu: 'ગરમ મસાલો'
  }
};

export function getLocalizedIngredient(name: string, lang: SupportedLanguage): string {
  if (lang === 'en') return name;
  const lower = name.toLowerCase().trim();
  for (const [key, map] of Object.entries(INGREDIENT_LOCALIZATION)) {
    if (lower.includes(key) || key.includes(lower)) {
      return map[lang] || name;
    }
  }
  return name;
}

