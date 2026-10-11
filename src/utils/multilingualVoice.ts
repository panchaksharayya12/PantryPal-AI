// Multilingual Speech Recognition & Culinary Entity Extraction for all Indian Languages

export interface ExtractedIngredient {
  original: string;
  normalized: string;
  emoji: string;
}

// Indian Language Multi-script & Transliteration Synonym Map
export const MULTILINGUAL_INGREDIENT_DICTIONARY: Record<string, { normalized: string; emoji: string }> = {
  // --- ONION ---
  'ಈರುಳ್ಳಿ': { normalized: 'Onion', emoji: '🧅' },
  'eerulli': { normalized: 'Onion', emoji: '🧅' },
  'erulli': { normalized: 'Onion', emoji: '🧅' },
  'ullagaddi': { normalized: 'Onion', emoji: '🧅' },
  'ಉಳ್ಳಾಗಡ್ಡಿ': { normalized: 'Onion', emoji: '🧅' },
  'प्याज': { normalized: 'Onion', emoji: '🧅' },
  'pyaaz': { normalized: 'Onion', emoji: '🧅' },
  'pyaz': { normalized: 'Onion', emoji: '🧅' },
  'வெங்காயம்': { normalized: 'Onion', emoji: '🧅' },
  'vengayam': { normalized: 'Onion', emoji: '🧅' },
  'ఉల్లిపాయ': { normalized: 'Onion', emoji: '🧅' },
  'ullipaya': { normalized: 'Onion', emoji: '🧅' },
  'ഉള്ളി': { normalized: 'Onion', emoji: '🧅' },
  'ulli': { normalized: 'Onion', emoji: '🧅' },
  'कांदा': { normalized: 'Onion', emoji: '🧅' },
  'kanda': { normalized: 'Onion', emoji: '🧅' },
  'পেঁয়াজ': { normalized: 'Onion', emoji: '🧅' },
  'peyaj': { normalized: 'Onion', emoji: '🧅' },
  'ડુંગળી': { normalized: 'Onion', emoji: '🧅' },
  'dungli': { normalized: 'Onion', emoji: '🧅' },
  'onion': { normalized: 'Onion', emoji: '🧅' },
  'onions': { normalized: 'Onion', emoji: '🧅' },

  // --- TOMATO ---
  'ಟೊಮೇಟೊ': { normalized: 'Tomato', emoji: '🍅' },
  'ಟೊಮಾಟೊ': { normalized: 'Tomato', emoji: '🍅' },
  'tomato': { normalized: 'Tomato', emoji: '🍅' },
  'tomatoes': { normalized: 'Tomato', emoji: '🍅' },
  'టమాటో': { normalized: 'Tomato', emoji: '🍅' },
  'தக்காளி': { normalized: 'Tomato', emoji: '🍅' },
  'thakkali': { normalized: 'Tomato', emoji: '🍅' },
  'തക്കാളി': { normalized: 'Tomato', emoji: '🍅' },
  'टमाटर': { normalized: 'Tomato', emoji: '🍅' },
  'tamatar': { normalized: 'Tomato', emoji: '🍅' },
  'टोमॅटो': { normalized: 'Tomato', emoji: '🍅' },
  'টমেটো': { normalized: 'Tomato', emoji: '🍅' },
  'ટામેટા': { normalized: 'Tomato', emoji: '🍅' },

  // --- POTATO ---
  'ಆಲೂಗಡ್ಡೆ': { normalized: 'Potato', emoji: '🥔' },
  'aalugadde': { normalized: 'Potato', emoji: '🥔' },
  'alugadde': { normalized: 'Potato', emoji: '🥔' },
  'ಬಟಾಟೆ': { normalized: 'Potato', emoji: '🥔' },
  'batate': { normalized: 'Potato', emoji: '🥔' },
  'आलू': { normalized: 'Potato', emoji: '🥔' },
  'aaloo': { normalized: 'Potato', emoji: '🥔' },
  'aalu': { normalized: 'Potato', emoji: '🥔' },
  'உருளைக்கிழங்கு': { normalized: 'Potato', emoji: '🥔' },
  'urulaikizhangu': { normalized: 'Potato', emoji: '🥔' },
  'బంగాళాదుంప': { normalized: 'Potato', emoji: '🥔' },
  'bangaladumpa': { normalized: 'Potato', emoji: '🥔' },
  'ഉരുളക്കിഴങ്ങ്': { normalized: 'Potato', emoji: '🥔' },
  'batata': { normalized: 'Potato', emoji: '🥔' },
  'बટાટા': { normalized: 'Potato', emoji: '🥔' },
  'আলু': { normalized: 'Potato', emoji: '🥔' },
  'potato': { normalized: 'Potato', emoji: '🥔' },
  'potatoes': { normalized: 'Potato', emoji: '🥔' },

  // --- EGGS ---
  'ಮೊಟ್ಟೆ': { normalized: 'Eggs', emoji: '🥚' },
  'ಮೊಟ್ಟೆಗಳು': { normalized: 'Eggs', emoji: '🥚' },
  'motte': { normalized: 'Eggs', emoji: '🥚' },
  'अंडा': { normalized: 'Eggs', emoji: '🥚' },
  'अंडे': { normalized: 'Eggs', emoji: '🥚' },
  'anda': { normalized: 'Eggs', emoji: '🥚' },
  'ande': { normalized: 'Eggs', emoji: '🥚' },
  'முட்டை': { normalized: 'Eggs', emoji: '🥚' },
  'muttai': { normalized: 'Eggs', emoji: '🥚' },
  'గుడ్లు': { normalized: 'Eggs', emoji: '🥚' },
  'కోడిగుడ్లు': { normalized: 'Eggs', emoji: '🥚' },
  'guddu': { normalized: 'Eggs', emoji: '🥚' },
  'മുട്ട': { normalized: 'Eggs', emoji: '🥚' },
  'अंडी': { normalized: 'Eggs', emoji: '🥚' },
  'ডিম': { normalized: 'Eggs', emoji: '🥚' },
  'ઈંડા': { normalized: 'Eggs', emoji: '🥚' },
  'egg': { normalized: 'Eggs', emoji: '🥚' },
  'eggs': { normalized: 'Eggs', emoji: '🥚' },

  // --- GARLIC ---
  'ಬೆಳ್ಳುಳ್ಳಿ': { normalized: 'Garlic', emoji: '🧄' },
  'bellulli': { normalized: 'Garlic', emoji: '🧄' },
  'लहसुन': { normalized: 'Garlic', emoji: '🧄' },
  'lehsun': { normalized: 'Garlic', emoji: '🧄' },
  'பூண்டு': { normalized: 'Garlic', emoji: '🧄' },
  'poondu': { normalized: 'Garlic', emoji: '🧄' },
  'వెల్లుల్లి': { normalized: 'Garlic', emoji: '🧄' },
  'vellulli': { normalized: 'Garlic', emoji: '🧄' },
  'വെളുത്തുള്ളി': { normalized: 'Garlic', emoji: '🧄' },
  'लसूण': { normalized: 'Garlic', emoji: '🧄' },
  'রসুন': { normalized: 'Garlic', emoji: '🧄' },
  'લસણ': { normalized: 'Garlic', emoji: '🧄' },
  'garlic': { normalized: 'Garlic', emoji: '🧄' },

  // --- GINGER ---
  'ಶುಂಠಿ': { normalized: 'Ginger', emoji: '🫚' },
  'shunti': { normalized: 'Ginger', emoji: '🫚' },
  'अदरक': { normalized: 'Ginger', emoji: '🫚' },
  'adrak': { normalized: 'Ginger', emoji: '🫚' },
  'இஞ்சி': { normalized: 'Ginger', emoji: '🫚' },
  'inji': { normalized: 'Ginger', emoji: '🫚' },
  'అల్లం': { normalized: 'Ginger', emoji: '🫚' },
  'allam': { normalized: 'Ginger', emoji: '🫚' },
  'ഇഞ്ചി': { normalized: 'Ginger', emoji: '🫚' },
  'आले': { normalized: 'Ginger', emoji: '🫚' },
  'আদা': { normalized: 'Ginger', emoji: '🫚' },
  'આદું': { normalized: 'Ginger', emoji: '🫚' },
  'ginger': { normalized: 'Ginger', emoji: '🫚' },

  // --- CAPSICUM / BELL PEPPER ---
  'ಕ್ಯಾಪ್ಸಿಕಂ': { normalized: 'Capsicum', emoji: '🫑' },
  'ದೊಡ್ಡ ಮೆಣಸಿನಕಾಯಿ': { normalized: 'Capsicum', emoji: '🫑' },
  'capsicum': { normalized: 'Capsicum', emoji: '🫑' },
  'शिमला मिर्च': { normalized: 'Capsicum', emoji: '🫑' },
  'shimla mirch': { normalized: 'Capsicum', emoji: '🫑' },
  'குடைமிளகாய்': { normalized: 'Capsicum', emoji: '🫑' },
  'బెంగళూరు మిరప': { normalized: 'Capsicum', emoji: '🫑' },
  'ढोबळी मिरची': { normalized: 'Capsicum', emoji: '🫑' },

  // --- CARROT ---
  'ಕ್ಯಾರೆಟ್': { normalized: 'Carrot', emoji: '🥕' },
  'carrot': { normalized: 'Carrot', emoji: '🥕' },
  'गाजर': { normalized: 'Carrot', emoji: '🥕' },
  'gajar': { normalized: 'Carrot', emoji: '🥕' },
  'கேரட்': { normalized: 'Carrot', emoji: '🥕' },
  'క్యారెట్': { normalized: 'Carrot', emoji: '🥕' },

  // --- SPINACH ---
  'ಪಾಲಕ್': { normalized: 'Spinach', emoji: '🥬' },
  'palak': { normalized: 'Spinach', emoji: '🥬' },
  'पालक': { normalized: 'Spinach', emoji: '🥬' },
  'பசலைக்கீரை': { normalized: 'Spinach', emoji: '🥬' },
  'పాలకూర': { normalized: 'Spinach', emoji: '🥬' },
  'spinach': { normalized: 'Spinach', emoji: '🥬' },

  // --- PANEER ---
  'ಪನ್ನೀರ್': { normalized: 'Paneer', emoji: '🧀' },
  'paneer': { normalized: 'Paneer', emoji: '🧀' },
  'पनीर': { normalized: 'Paneer', emoji: '🧀' },
  'பன்னீர்': { normalized: 'Paneer', emoji: '🧀' },
  'పనీర్': { normalized: 'Paneer', emoji: '🧀' },

  // --- RICE ---
  'ಅಕ್ಕಿ': { normalized: 'Rice', emoji: '🍚' },
  'ಅನ್ನ': { normalized: 'Rice', emoji: '🍚' },
  'akki': { normalized: 'Rice', emoji: '🍚' },
  'anna': { normalized: 'Rice', emoji: '🍚' },
  'चावल': { normalized: 'Rice', emoji: '🍚' },
  'chawal': { normalized: 'Rice', emoji: '🍚' },
  'भात': { normalized: 'Rice', emoji: '🍚' },
  'அரிசி': { normalized: 'Rice', emoji: '🍚' },
  'சாதம்': { normalized: 'Rice', emoji: '🍚' },
  'బియ్యం': { normalized: 'Rice', emoji: '🍚' },
  'అన్నం': { normalized: 'Rice', emoji: '🍚' },
  'അരി': { normalized: 'Rice', emoji: '🍚' },
  'চাল': { normalized: 'Rice', emoji: '🍚' },
  'ચોખા': { normalized: 'Rice', emoji: '🍚' },
  'rice': { normalized: 'Rice', emoji: '🍚' },

  // --- MILK / YOGURT ---
  'ಹಾಲು': { normalized: 'Milk', emoji: '🥛' },
  'haalu': { normalized: 'Milk', emoji: '🥛' },
  'दूध': { normalized: 'Milk', emoji: '🥛' },
  'doodh': { normalized: 'Milk', emoji: '🥛' },
  'பால்': { normalized: 'Milk', emoji: '🥛' },
  'పాలు': { normalized: 'Milk', emoji: '🥛' },
  'milk': { normalized: 'Milk', emoji: '🥛' },
  'ಮೊಸರು': { normalized: 'Yogurt', emoji: '🥣' },
  'mosaru': { normalized: 'Yogurt', emoji: '🥣' },
  'दही': { normalized: 'Yogurt', emoji: '🥣' },
  'dahi': { normalized: 'Yogurt', emoji: '🥣' },
  'தயிர்': { normalized: 'Yogurt', emoji: '🥣' },
  'పెరుగు': { normalized: 'Yogurt', emoji: '🥣' },
  'yogurt': { normalized: 'Yogurt', emoji: '🥣' },

  // --- SPICES (TURMERIC / CUMIN / CHILLI) ---
  'ಅರಿಶಿನ': { normalized: 'Turmeric', emoji: '🟡' },
  'arishina': { normalized: 'Turmeric', emoji: '🟡' },
  'हल्दी': { normalized: 'Turmeric', emoji: '🟡' },
  'haldi': { normalized: 'Turmeric', emoji: '🟡' },
  'மஞ்சள்': { normalized: 'Turmeric', emoji: '🟡' },
  'పసుపు': { normalized: 'Turmeric', emoji: '🟡' },
  'turmeric': { normalized: 'Turmeric', emoji: '🟡' },
  'ಜೀರಿಗೆ': { normalized: 'Cumin', emoji: '🟤' },
  'jeerige': { normalized: 'Cumin', emoji: '🟤' },
  'जीरा': { normalized: 'Cumin', emoji: '🟤' },
  'jeera': { normalized: 'Cumin', emoji: '🟤' },
  'சீரகம்': { normalized: 'Cumin', emoji: '🟤' },
  'జీలకర్ర': { normalized: 'Cumin', emoji: '🟤' },
  'cumin': { normalized: 'Cumin', emoji: '🟤' },
  'ಗರಂ ಮಸಾಲಾ': { normalized: 'Garam Masala', emoji: '🤎' },
  'गरम मसाला': { normalized: 'Garam Masala', emoji: '🤎' },
  'garam masala': { normalized: 'Garam Masala', emoji: '🤎' },
  'ಹಸಿಮೆಣಸಿನಕಾಯಿ': { normalized: 'Green Chilli', emoji: '🌶️' },
  'हरी मिर्च': { normalized: 'Green Chilli', emoji: '🌶️' },
  'chilli': { normalized: 'Green Chilli', emoji: '🌶️' },
  'chili': { normalized: 'Green Chilli', emoji: '🌶️' },
  'కొత్తిమీర': { normalized: 'Coriander', emoji: '🌿' },
  'ಕೊತ್ತಂಬರಿ': { normalized: 'Coriander', emoji: '🌿' },
  'धनिया': { normalized: 'Coriander', emoji: '🌿' },
  'கொத்தமல்லி': { normalized: 'Coriander', emoji: '🌿' },
  'coriander': { normalized: 'Coriander', emoji: '🌿' },
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

