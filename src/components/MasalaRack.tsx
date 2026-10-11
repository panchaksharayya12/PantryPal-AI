import React from 'react';
import { Sparkles, Flame, Check, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';

export interface SpiceItem {
  id: string;
  name: string; // standard search term used in recipe matcher
  color: string;
  names: Record<string, string>;
  aromaNotes: Record<string, string>;
}

export const MASALA_ITEMS: SpiceItem[] = [
  {
    id: 'turmeric',
    name: 'Turmeric Powder', color: '#EAB308',
    names: {
      en: 'Turmeric Powder',
      kn: 'ಅರಿಶಿನ ಪುಡಿ (Haldi)',
      hi: 'हल्दी पाउडर (Haldi)',
      ta: 'மஞ்சள் தூள்',
      te: 'పసుపు పొడి',
      ml: 'മഞ്ഞൾപ്പൊടി',
      mr: 'हळद पावडर',
      bn: 'হলুদ গুঁড়ো',
      gu: 'હળદર'
    },
    aromaNotes: {
      en: 'Golden earthy warmth & color',
      kn: 'ಬಂಗಾರದ ಬಣ್ಣ ಮತ್ತು ಸುವಾಸನೆ',
      hi: 'सुनहरा रंग और सौंधी महक',
      ta: 'தங்க நிறம் மற்றும் மணம்',
      te: 'బంగారు రంగు మరియు సువాసన',
      ml: 'സ്വർണ്ണ നിറവും സുഗന്ധവും',
      mr: 'सोनेरी रंग आणि सुवास',
      bn: 'সোনালী রঙ ও গন্ধ',
      gu: 'સોનેરી રંગ અને સુગંધ'
    }
  },
  {
    id: 'cumin',
    name: 'Cumin Seeds', color: '#B45309',
    names: {
      en: 'Cumin Seeds',
      kn: 'ಜೀರಿಗೆ ಕಾಳುಗಳು (Jeera)',
      hi: 'जीरा साबुत (Jeera)',
      ta: 'சீரகம் (Jeera)',
      te: 'జీలకర్ర',
      ml: 'ജീരകം',
      mr: 'जिरे',
      bn: 'জিরে',
      gu: 'જીરું'
    },
    aromaNotes: {
      en: 'Nutty & warm tempering base',
      kn: 'ಖಾರ ಮತ್ತು ಒಗ್ಗರಣೆಯ ಬೇಸ್',
      hi: 'तड़के का मुख्य सुगंधित आधार',
      ta: 'தாளிப்புக்கான அடிப்படை',
      te: 'పోపుకు ముఖ్యమైన ఆధారం',
      ml: 'താളിക്കാനുള്ള സ്വാദ്',
      mr: 'खमंग फोडणीचा पाया',
      bn: 'ফোড়নের বিশেষ স্বাদ',
      gu: 'વઘાર માટે ઉત્તમ'
    }
  },
  {
    id: 'red_chilli',
    name: 'Red Chilli Powder', color: '#DC2626',
    names: {
      en: 'Red Chilli Powder',
      kn: 'ಅಚ್ಚ ಖಾರದ ಪುಡಿ (Lal Mirch)',
      hi: 'लाल मिर्च पाउडर',
      ta: 'தனி மிளகாய் தூள்',
      te: 'ఎర్ర కారం పొడి',
      ml: 'മുളകുപൊടി',
      mr: 'लाल तिखट',
      bn: 'লাল লঙ্কা গুঁড়ো',
      gu: 'લાલ મરચું'
    },
    aromaNotes: {
      en: 'Vibrant heat & deep crimson color',
      kn: 'ತೀಕ್ಷ್ಣ ಖಾರ ಮತ್ತು ಕೆಂಪು ಬಣ್ಣ',
      hi: 'तीखापन और गहरा लाल रंग',
      ta: 'காரமும் அடர் சிவப்பு நிறமும்',
      te: 'తీవ్రమైన ఘాటు మరియు రంగు',
      ml: 'എരിവും കടും ചുവപ്പും',
      mr: 'झणझणीत तिखट आणि रंग',
      bn: 'ঝাল ও গাঢ় লাল রং',
      gu: 'તીખાશ અને લાલ રંગ'
    }
  },
  {
    id: 'coriander',
    name: 'Coriander Powder', color: '#15803D',
    names: {
      en: 'Coriander Powder',
      kn: 'ಕೊತ್ತಂಬರಿ ಪುಡಿ (Dhania)',
      hi: 'धनिया पाउडर (Dhania)',
      ta: 'மல்லி தூள் (Dhania)',
      te: 'ధనియాల పొడి',
      ml: 'മല്ലിപ്പൊടി',
      mr: 'धने पावडर',
      bn: 'ধনে গুঁড়ো',
      gu: 'ધાણા પાવડર'
    },
    aromaNotes: {
      en: 'Mild citrusy thickening aroma',
      kn: 'ಗ್ರೇವಿಗೆ ಸಾಂದ್ರತೆ ಮತ್ತು ಸುವಾಸನೆ',
      hi: 'ग्रेवी को गाढ़ा करने वाली खुशबू',
      ta: 'கிரேவியை கெட்டியாக்கும் மணம்',
      te: 'గ్రేవీకి చక్కని చిక్కదనం',
      ml: 'ഗ്രേവിക്ക് കൊഴുപ്പും മണവും',
      mr: 'रश्श्याला दाटपणा देणारा सुवास',
      bn: 'ঝোল ঘন করার মিষ্টি গন্ধ',
      gu: 'ગ્રેવી માટે સરસ સુગંધ'
    }
  },
  {
    id: 'garam_masala',
    name: 'Garam Masala', color: '#92400E',
    names: {
      en: 'Garam Masala',
      kn: 'ಗರಂ ಮಸಾಲಾ (Garam Masala)',
      hi: 'शाही गरम मसाला',
      ta: 'கரம் மசாலா',
      te: 'గరం మసాలా',
      ml: 'ഗരം മസാല',
      mr: 'गरम मसाला',
      bn: 'গরম মসলা',
      gu: 'ગરમ મસાલો'
    },
    aromaNotes: {
      en: 'Royal blend of 11 whole spices',
      kn: '೧೧ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳ ರಾಜ ಮಿಶ್ರಣ',
      hi: '11 खड़े मसालों का शाही मिश्रण',
      ta: '11 நறுமணப் பொருட்களின் கலவை',
      te: '11 సుగంధ ద్రవ్యాల మిశ్రమం',
      ml: '11 സുഗന്ധവ്യഞ്ജനങ്ങളുടെ കൂട്ട്',
      mr: 'खड्या मसाल्यांचे शाही मिश्रण',
      bn: 'বিশেষ সুগন্ধি মসলার মিশ্রণ',
      gu: 'ખાસ મસાલાઓનું મિશ્રણ'
    }
  },
  {
    id: 'mustard_seeds',
    name: 'Mustard Seeds', color: '#CA8A04',
    names: {
      en: 'Mustard Seeds',
      kn: 'ಸಾಸಿವೆ ಕಾಳುಗಳು (Sasive)',
      hi: 'राई / काली सरसों (Rai)',
      ta: 'கடுகு (Kadugu)',
      te: 'ఆవాలు (Avalu)',
      ml: 'കടുക്',
      mr: 'मोहरी',
      bn: 'সর্ষে দানা',
      gu: 'રાઈ દાણા'
    },
    aromaNotes: {
      en: 'Pungent crackling spice pop',
      kn: 'ಚಟಪಟ ಸಿಡಿಯುವ ಒಗ್ಗರಣೆ ಗಮಲು',
      hi: 'तड़कने वाली खास खुशबू',
      ta: 'வெடிக்கும் தாளிப்பு வாசம்',
      te: 'చిటపటలాడే పోపు సువాసన',
      ml: 'പൊട്ടുന്ന താളിക്കൽ മണം',
      mr: 'तडतडणाऱ्या मोहरीचा स्वाद',
      bn: 'ফোড়নের ঝাঁঝালো গন্ধ',
      gu: 'તડતડતી રાઈનો સ્વાદ'
    }
  },
  {
    id: 'curry_leaves',
    name: 'Curry Leaves', color: '#16A34A',
    names: {
      en: 'Fresh Curry Leaves',
      kn: 'ತಾಜಾ ಕರಿಬೇವು (Karibevu)',
      hi: 'ताजा कढ़ी पत्ता',
      ta: 'கறிவேப்பிலை',
      te: 'కరివేపాకు',
      ml: 'കറിവേപ്പില',
      mr: 'कढीपत्ता',
      bn: 'কারিপাতা',
      gu: 'મીઠો લીમડો'
    },
    aromaNotes: {
      en: 'Authentic South Indian tempering',
      kn: 'ದಕ್ಷಿಣ ಭಾರತದ ಅಸಲಿ ಪರಿಮಳ',
      hi: 'दक्षिण भारतीय तड़के की महक',
      ta: 'தென்னிந்திய பாரம்பரிய மணம்',
      te: 'సాంప్రదాయ పోపు పరిమళం',
      ml: 'തനത് നാടൻ കറിമണം',
      mr: 'पारंपरिक फोडणीचा घमघमाट',
      bn: 'দক্ষিণ ভারতীয় ফোড়ন',
      gu: 'દક્ષિણ ભારતનો સ્વાદ'
    }
  },
  {
    id: 'cardamom',
    name: 'Cardamom', color: '#059669',
    names: {
      en: 'Green Cardamom',
      kn: 'ಏಲಕ್ಕಿ (Elaichi)',
      hi: 'हरी इलायची (Elaichi)',
      ta: 'ஏலக்காய் (Yelakkai)',
      te: 'యాలకులు',
      ml: 'ഏലക്ക',
      mr: 'हिरवी वेलची',
      bn: 'সবুজ এলাচ',
      gu: 'લીલી એલચી'
    },
    aromaNotes: {
      en: 'Floral sweet & herbal aroma',
      kn: 'ಸಿಹಿ ಮತ್ತು ಸುಗಂಧಭರಿತ ಪರಿಮಳ',
      hi: 'मीठी और मनमोहक महक',
      ta: 'இனிய நறுமண சுவை',
      te: 'తీపి మరియు సుగంధ పరిమళం',
      ml: 'മധുരതരമായ സുഗന്ധം',
      mr: 'गोड आणि सुवासिक गंध',
      bn: 'মিষ্টি ও সুগন্ধি',
      gu: 'મીઠી સુગંધ'
    }
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon', color: '#78350F',
    names: {
      en: 'Cinnamon Sticks',
      kn: 'ದಾಲ್ಚಿನ್ನಿ (Dalchini)',
      hi: 'दालचीनी (Dalchini)',
      ta: 'இலவங்கப்பட்டை',
      te: 'దాల్చిన చెక్క',
      ml: 'കറുവാപ്പട്ട',
      mr: 'दालचिनी',
      bn: 'দারুচিনি',
      gu: 'તજ'
    },
    aromaNotes: {
      en: 'Sweet woody warmth in curries',
      kn: 'ಮಸಾಲೆ ಸಾರಿಗೆ ಗಾಢ ಮಾಧುರ್ಯ',
      hi: 'करी में मीठी सौंधी गर्माहट',
      ta: 'குழம்புகளுக்கு அடர்ந்த மணம்',
      te: 'కూరలకు గాఢమైన రుచి',
      ml: 'കറികൾക്ക് പ്രത്യേക സ്വാദ്',
      mr: 'रश्श्याला खास गोडवा',
      bn: 'ঝোল ও বিরিয়ানির সুগন্ধ',
      gu: 'શાક માટે ઉત્તમ સુગંધ'
    }
  },
  {
    id: 'black_pepper',
    name: 'Black Pepper', color: '#4B5563',
    names: {
      en: 'Black Pepper',
      kn: 'ಕರಿಮೆಣಸು (Karimenasu)',
      hi: 'काली मिर्च (Kali Mirch)',
      ta: 'கருப்பு மிளகு',
      te: 'నల్ల మిరియాలు',
      ml: 'കുരുമുളക്',
      mr: 'काळी मिरी',
      bn: 'গোলমরিচ',
      gu: 'કાળા મરી'
    },
    aromaNotes: {
      en: 'Piquant sharpness & bold finish',
      kn: 'ಘಾಟು ಮತ್ತು ತೀಕ್ಷ್ಣ ರುಚಿ',
      hi: 'तीखा और गरमागरम स्वाद',
      ta: 'காரமும் தனித்துவ சுவையும்',
      te: 'ఘాటైన ఘుమఘుమ',
      ml: 'തീവ്രമായ എരിവ്',
      mr: 'तीव्र आणि झणझणीत चव',
      bn: 'তীক্ষ্ণ ঝাঁঝালো স্বাদ',
      gu: 'તીખી અને સરસ સુગંધ'
    }
  },
  {
    id: 'chaat_masala',
    name: 'Chaat Masala', color: '#D97706',
    names: {
      en: 'Chaat Masala',
      kn: 'ಚಾಟ್ ಮಸಾಲಾ (Chaat Masala)',
      hi: 'चटपटा चाट मसाला',
      ta: 'சாட் மசாலா',
      te: 'చాట్ మసాలా',
      ml: 'ചാറ്റ് മസാല',
      mr: 'चाट मसाला',
      bn: 'চাট মশলা',
      gu: 'ચાટ મસાલો'
    },
    aromaNotes: {
      en: 'Tangy, zesty umami sprinkle',
      kn: 'ಹುಳಿ-ಉಪ್ಪು ಚಟಪಟ ಸುವಾಸನೆ',
      hi: 'खट्टा-मीठा चटपटा स्वाद',
      ta: 'புளிப்பும் உப்பும் கலந்த சுவை',
      te: 'పుల్లటి మరియు చురుకైన రుచి',
      ml: 'പുളിയും എരിവും ചേർന്ന രുചി',
      mr: 'चटपटीत आणि आंबट-गोड स्वाद',
      bn: 'চটপটা টক-ঝাল স্বাদ',
      gu: 'ચટપટો મજેદાર સ્વાદ'
    }
  },
  {
    id: 'kasuri_methi',
    name: 'Kasuri Methi', color: '#047857',
    names: {
      en: 'Kasuri Methi',
      kn: 'ಕಸ್ತೂರಿ ಮೇಥಿ (Kasuri Methi)',
      hi: 'कसूरी मेथी',
      ta: 'கசூரி மேத்தி',
      te: 'కసూరి మేథి',
      ml: 'കസ്തൂരി മേത്തി',
      mr: 'कसुरी मेथी',
      bn: 'কসৌরি মেথি',
      gu: 'કસુરી મેથી'
    },
    aromaNotes: {
      en: 'Smoky buttery restaurant finish',
      kn: 'ಹೋಟೆಲ್ ಶೈಲಿಯ ಬೆಣ್ಣೆಯ ಸುವಾಸನೆ',
      hi: 'ढाबा स्टाइल बटर महक',
      ta: 'ரெஸ்டாரன்ட் ஸ்டைல் மணம்',
      te: 'రెస్టారెంట్ స్టైల్ సువాసన',
      ml: 'റെസ്റ്റോറന്റ് സ്റ്റൈൽ രുചി',
      mr: 'हॉटेल स्टाईल खमंग सुगंध',
      bn: 'রেস্তোরাঁর মতো অপূর্ব গন্ধ',
      gu: 'હોટલ જેવી સરસ સુગંધ'
    }
  }
];

interface MasalaRackProps {
  activeIngredients: string[];
  onToggleSpice: (spiceName: string) => void;
  isDark?: boolean;
}

export const MasalaRack: React.FC<MasalaRackProps> = ({
  activeIngredients,
  onToggleSpice,
  isDark = true,
}) => {
  const { t, language } = useLanguage();

  const isSpiceActive = (name: string) => {
    const lower = name.toLowerCase();
    return activeIngredients.some((ing) => ing.toLowerCase().includes(lower) || lower.includes(ing.toLowerCase()));
  };

  const activeCount = MASALA_ITEMS.filter((item) => isSpiceActive(item.name)).length;

  const handleSelectAll = () => {
    MASALA_ITEMS.forEach((item) => {
      if (!isSpiceActive(item.name)) {
        onToggleSpice(item.name);
      }
    });
  };

  const handleClearAll = () => {
    MASALA_ITEMS.forEach((item) => {
      if (isSpiceActive(item.name)) {
        onToggleSpice(item.name);
      }
    });
  };

  return (
    <div className={`mt-8 p-6 sm:p-7 rounded-3xl border transition-all ${
      isDark
        ? 'bg-[#141A16] border-[#233328] text-white shadow-xl'
        : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820] shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>{t('masalaBadge', 'Aromatic Masala & Spice Rack')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('masalaTitle', 'Select Your Masalas & Spices')} ({activeCount}/{MASALA_ITEMS.length})
          </h3>
          <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] mt-1">
            {t('masalaSubtitle', "Toggle the masalas you have at home. We'll automatically match authentic spiced curries, gravies & stir-fries!")}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleSelectAll}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-[#1C2620] hover:bg-[#25362B] text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#315C43] border border-emerald-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('selectAllSpices', 'Select All 12')}</span>
          </button>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#737B72] hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetSpices', 'Reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Spices Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {MASALA_ITEMS.map((spice) => {
          const active = isSpiceActive(spice.name);
          const localizedName = spice.names[language] || spice.name;
          const localizedAroma = spice.aromaNotes[language] || spice.aromaNotes['en'];

          return (
            <motion.div
              key={spice.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleSpice(spice.name)}
              className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                active
                  ? isDark
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                    : 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                  : isDark
                    ? 'bg-[#18201B]/80 hover:bg-[#1E2922] border-white/5 hover:border-white/20'
                    : 'bg-white hover:bg-white/90 border-[#E8E5DC] hover:border-[#315C43]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: spice.color }}
                >
                  <div className="w-2 rounded-full bg-white/40 blur-[0.5px]" />
                </div>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : isDark ? 'bg-white/10 text-white/50' : 'bg-black/5 text-[#737B72]'
                }`}>
                  {active ? <Check className="w-3 h-3" /> : '+'}
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-xs font-black truncate">{localizedName}</p>
                <p className="text-[10px] text-amber-500/90 font-bold mt-0.5 truncate">{spice.name}</p>
                <p className="text-[9px] text-[#737B72] dark:text-[#9CA3AF] line-clamp-1 mt-1 font-medium">
                  {localizedAroma}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
