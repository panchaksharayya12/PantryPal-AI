// Multilingual Speech Recognition & Culinary Entity Extraction for all Indian Languages

export interface ExtractedIngredient {
  original: string;
  normalized: string;
}

// Indian Language Multi-script & Transliteration Synonym Map
export const MULTILINGUAL_INGREDIENT_DICTIONARY: Record<string, { normalized: string }> = {
  // --- ONION ---
  'ಈರುಳ್ಳಿ': { normalized: 'Onion' },
  'eerulli': { normalized: 'Onion' },
  'erulli': { normalized: 'Onion' },
  'ullagaddi': { normalized: 'Onion' },
  'ಉಳ್ಳಾಗಡ್ಡಿ': { normalized: 'Onion' },
  'प्याज': { normalized: 'Onion' },
  'pyaaz': { normalized: 'Onion' },
  'pyaz': { normalized: 'Onion' },
  'வெங்காயம்': { normalized: 'Onion' },
  'vengayam': { normalized: 'Onion' },
  'ఉల్లిపాయ': { normalized: 'Onion' },
  'ullipaya': { normalized: 'Onion' },
  'ഉള്ളി': { normalized: 'Onion' },
  'ulli': { normalized: 'Onion' },
  'कांदा': { normalized: 'Onion' },
  'kanda': { normalized: 'Onion' },
  'পেঁয়াজ': { normalized: 'Onion' },
  'peyaj': { normalized: 'Onion' },
  'ડુંગળી': { normalized: 'Onion' },
  'dungli': { normalized: 'Onion' },
  'onion': { normalized: 'Onion' },
  'onions': { normalized: 'Onion' },

  // --- TOMATO ---
  'ಟೊಮೇಟೊ': { normalized: 'Tomato' },
  'ಟೊಮಾಟೊ': { normalized: 'Tomato' },
  'tomato': { normalized: 'Tomato' },
  'tomatoes': { normalized: 'Tomato' },
  'టమాటో': { normalized: 'Tomato' },
  'தக்காளி': { normalized: 'Tomato' },
  'thakkali': { normalized: 'Tomato' },
  'തക്കാളി': { normalized: 'Tomato' },
  'टमाटर': { normalized: 'Tomato' },
  'tamatar': { normalized: 'Tomato' },
  'टोमॅटो': { normalized: 'Tomato' },
  'টমেটো': { normalized: 'Tomato' },
  'ટામેટા': { normalized: 'Tomato' },

  // --- POTATO ---
  'ಆಲೂಗಡ್ಡೆ': { normalized: 'Potato' },
  'aalugadde': { normalized: 'Potato' },
  'alugadde': { normalized: 'Potato' },
  'ಬಟಾಟೆ': { normalized: 'Potato' },
  'batate': { normalized: 'Potato' },
  'आलू': { normalized: 'Potato' },
  'aaloo': { normalized: 'Potato' },
  'aalu': { normalized: 'Potato' },
  'உருளைக்கிழங்கு': { normalized: 'Potato' },
  'urulaikizhangu': { normalized: 'Potato' },
  'బంగాళాదుంప': { normalized: 'Potato' },
  'bangaladumpa': { normalized: 'Potato' },
  'ഉരുളക്കിഴങ്ങ്': { normalized: 'Potato' },
  'batata': { normalized: 'Potato' },
  'बટાટા': { normalized: 'Potato' },
  'আলু': { normalized: 'Potato' },
  'potato': { normalized: 'Potato' },
  'potatoes': { normalized: 'Potato' },

  // --- EGGS ---
  'ಮೊಟ್ಟೆ': { normalized: 'Eggs' },
  'ಮೊಟ್ಟೆಗಳು': { normalized: 'Eggs' },
  'motte': { normalized: 'Eggs' },
  'अंडा': { normalized: 'Eggs' },
  'अंडे': { normalized: 'Eggs' },
  'anda': { normalized: 'Eggs' },
  'ande': { normalized: 'Eggs' },
  'முட்டை': { normalized: 'Eggs' },
  'muttai': { normalized: 'Eggs' },
  'గుడ్లు': { normalized: 'Eggs' },
  'కోడిగుడ్లు': { normalized: 'Eggs' },
  'guddu': { normalized: 'Eggs' },
  'മുട്ട': { normalized: 'Eggs' },
  'अंडी': { normalized: 'Eggs' },
  'ডিম': { normalized: 'Eggs' },
  'ઈંડા': { normalized: 'Eggs' },
  'egg': { normalized: 'Eggs' },
  'eggs': { normalized: 'Eggs' },

  // --- GARLIC ---
  'ಬೆಳ್ಳುಳ್ಳಿ': { normalized: 'Garlic' },
  'bellulli': { normalized: 'Garlic' },
  'लहसुन': { normalized: 'Garlic' },
  'lehsun': { normalized: 'Garlic' },
  'பூண்டு': { normalized: 'Garlic' },
  'poondu': { normalized: 'Garlic' },
  'వెల్లుల్లి': { normalized: 'Garlic' },
  'vellulli': { normalized: 'Garlic' },
  'വെളുത്തുള്ളി': { normalized: 'Garlic' },
  'लसूण': { normalized: 'Garlic' },
  'রসুন': { normalized: 'Garlic' },
  'લસણ': { normalized: 'Garlic' },
  'garlic': { normalized: 'Garlic' },

  // --- GINGER ---
  'ಶುಂಠಿ': { normalized: 'Ginger' },
  'shunti': { normalized: 'Ginger' },
  'अदरक': { normalized: 'Ginger' },
  'adrak': { normalized: 'Ginger' },
  'இஞ்சி': { normalized: 'Ginger' },
  'inji': { normalized: 'Ginger' },
  'అల్లం': { normalized: 'Ginger' },
  'allam': { normalized: 'Ginger' },
  'ഇഞ്ചി': { normalized: 'Ginger' },
  'आले': { normalized: 'Ginger' },
  'আদা': { normalized: 'Ginger' },
  'આદું': { normalized: 'Ginger' },
  'ginger': { normalized: 'Ginger' },

  // --- CAPSICUM / BELL PEPPER ---
  'ಕ್ಯಾಪ್ಸಿಕಂ': { normalized: 'Capsicum' },
  'ದೊಡ್ಡ ಮೆಣಸಿನಕಾಯಿ': { normalized: 'Capsicum' },
  'capsicum': { normalized: 'Capsicum' },
  'शिमला मिर्च': { normalized: 'Capsicum' },
  'shimla mirch': { normalized: 'Capsicum' },
  'குடைமிளகாய்': { normalized: 'Capsicum' },
  'బెంగళూరు మిరప': { normalized: 'Capsicum' },
  'ढोबळी मिरची': { normalized: 'Capsicum' },

  // --- CARROT ---
  'ಕ್ಯಾರೆಟ್': { normalized: 'Carrot' },
  'carrot': { normalized: 'Carrot' },
  'गाजर': { normalized: 'Carrot' },
  'gajar': { normalized: 'Carrot' },
  'கேரட்': { normalized: 'Carrot' },
  'క్యారెట్': { normalized: 'Carrot' },

  // --- SPINACH ---
  'ಪಾಲಕ್': { normalized: 'Spinach' },
  'palak': { normalized: 'Spinach' },
  'पालक': { normalized: 'Spinach' },
  'பசலைக்கீரை': { normalized: 'Spinach' },
  'పాలకూర': { normalized: 'Spinach' },
  'spinach': { normalized: 'Spinach' },

  // --- PANEER ---
  'ಪನ್ನೀರ್': { normalized: 'Paneer' },
  'paneer': { normalized: 'Paneer' },
  'पनीर': { normalized: 'Paneer' },
  'பன்னீர்': { normalized: 'Paneer' },
  'పనీర్': { normalized: 'Paneer' },

  // --- RICE ---
  'ಅಕ್ಕಿ': { normalized: 'Rice' },
  'ಅನ್ನ': { normalized: 'Rice' },
  'akki': { normalized: 'Rice' },
  'anna': { normalized: 'Rice' },
  'चावल': { normalized: 'Rice' },
  'chawal': { normalized: 'Rice' },
  'भात': { normalized: 'Rice' },
  'அரிசி': { normalized: 'Rice' },
  'சாதம்': { normalized: 'Rice' },
  'బియ్యం': { normalized: 'Rice' },
  'అన్నం': { normalized: 'Rice' },
  'അരി': { normalized: 'Rice' },
  'চাল': { normalized: 'Rice' },
  'ચોખા': { normalized: 'Rice' },
  'rice': { normalized: 'Rice' },

  // --- MILK / YOGURT ---
  'ಹಾಲು': { normalized: 'Milk' },
  'haalu': { normalized: 'Milk' },
  'दूध': { normalized: 'Milk' },
  'doodh': { normalized: 'Milk' },
  'பால்': { normalized: 'Milk' },
  'పాలు': { normalized: 'Milk' },
  'milk': { normalized: 'Milk' },
  'ಮೊಸರು': { normalized: 'Yogurt' },
  'mosaru': { normalized: 'Yogurt' },
  'दही': { normalized: 'Yogurt' },
  'dahi': { normalized: 'Yogurt' },
  'தயிர்': { normalized: 'Yogurt' },
  'పెరుగు': { normalized: 'Yogurt' },
  'yogurt': { normalized: 'Yogurt' },

  // --- SPICES (TURMERIC / CUMIN / CHILLI) ---
  'ಅರಿಶಿನ': { normalized: 'Turmeric' },
  'arishina': { normalized: 'Turmeric' },
  'हल्दी': { normalized: 'Turmeric' },
  'haldi': { normalized: 'Turmeric' },
  'மஞ்சள்': { normalized: 'Turmeric' },
  'పసుపు': { normalized: 'Turmeric' },
  'turmeric': { normalized: 'Turmeric' },
  'ಜೀರಿಗೆ': { normalized: 'Cumin' },
  'jeerige': { normalized: 'Cumin' },
  'जीरा': { normalized: 'Cumin' },
  'jeera': { normalized: 'Cumin' },
  'சீரகம்': { normalized: 'Cumin' },
  'జీలకర్ర': { normalized: 'Cumin' },
  'cumin': { normalized: 'Cumin' },
  'ಗರಂ ಮಸಾಲಾ': { normalized: 'Garam Masala' },
  'गरम मसाला': { normalized: 'Garam Masala' },
  'garam masala': { normalized: 'Garam Masala' },
  'ಹಸಿಮೆಣಸಿನಕಾಯಿ': { normalized: 'Green Chilli' },
  'हरी मिर्च': { normalized: 'Green Chilli' },
  'chilli': { normalized: 'Green Chilli' },
  'chili': { normalized: 'Green Chilli' },
  'కొత్తిమీర': { normalized: 'Coriander' },
  'ಕೊತ್ತಂಬರಿ': { normalized: 'Coriander' },
  'धनिया': { normalized: 'Coriander' },
  'கொத்தமல்லி': { normalized: 'Coriander' },
  'coriander': { normalized: 'Coriander' },
};

// Intelligently extract ingredients from natural spoken speech in any Indian language
export function extractIngredientsFromSpeech(spokenText: string): ExtractedIngredient[] {
  const clean = spokenText.toLowerCase();
  const words = clean.split(/[\s,।.?!\n]+/);
  const found: ExtractedIngredient[] = [];
  const addedNormals = new Set<string>();

  // 1. Direct multi-word check
  for (const [key, val] of Object.entries(MULTILINGUAL_INGREDIENT_DICTIONARY)) {
    if (key.includes(' ') && clean.includes(key)) {
      if (!addedNormals.has(val.normalized)) {
        found.push({ original: key, normalized: val.normalized, emoji: val.emoji });
        addedNormals.add(val.normalized);
      }
    }
  }

  // 2. Single token matching
  for (const word of words) {
    const trimmed = word.trim();
    if (!trimmed) continue;

    // Check exact dictionary match
    if (MULTILINGUAL_INGREDIENT_DICTIONARY[trimmed]) {
      const match = MULTILINGUAL_INGREDIENT_DICTIONARY[trimmed];
      if (!addedNormals.has(match.normalized)) {
        found.push({ original: trimmed, normalized: match.normalized, emoji: match.emoji });
        addedNormals.add(match.normalized);
      }
    } else {
      // Substring check for Kannada/Hindi suffixes (e.g. "ಟೊಮೇಟೊಗಳು", "ఈరుల్లియు", "tamatar-wale")
      for (const [key, val] of Object.entries(MULTILINGUAL_INGREDIENT_DICTIONARY)) {
        if (key.length >= 4 && (trimmed.startsWith(key) || key.startsWith(trimmed))) {
          if (!addedNormals.has(val.normalized)) {
            found.push({ original: trimmed, normalized: val.normalized, emoji: val.emoji });
            addedNormals.add(val.normalized);
          }
          break;
        }
      }
    }
  }

  return found;
}

// Web Speech API Voice Recognition Controller
export class MultilingualVoiceRecognizer {
  private recognition: any = null;
  public isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    speechCode: string, // e.g. 'kn-IN', 'hi-IN', 'ta-IN', 'en-IN'
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.recognition.lang = speechCode;
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const text = final || interim;
        onTranscript(text, Boolean(final));
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError(err?.message || 'Failed to start microphone');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
  }
}

// Text-to-Speech synthesis in user language
export function speakText(text: string, speechCode: string = 'kn-IN') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // cancel any active speech

    // Strip markdown formatting before speaking
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 300); // speak concise snippet

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(speechCode.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS error:', e);
  }
}

export const voiceRecognizer = new MultilingualVoiceRecognizer();

