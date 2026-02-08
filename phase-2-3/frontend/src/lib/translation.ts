/**
 * Translation utilities for Urdu/English conversion
 */

// Enhanced translation API - uses real-time translation via free API
export const translateText = async (text: string, targetLang: 'en' | 'ur', sourceLang?: 'en' | 'ur'): Promise<string> => {
  console.log(`Translating "${text}" to ${targetLang}`);

  try {
    // Detect source language if not provided
    const detectedSourceLang = sourceLang || detectLanguage(text);
    // Use 'en' as default source if detection fails
    const actualSourceLang = detectedSourceLang === 'ur' ? 'ur' : 'en';

    // Use MyMemory API for real-time translation (free and works in browsers)
    // Make sure we use proper language codes (not 'auto')
    const sourceLangCode = actualSourceLang === 'ur' ? 'ur' : 'en';
    const targetLangCode = targetLang === 'ur' ? 'ur' : 'en';

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangCode}|${targetLangCode}`
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    // Handle both API response formats
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    } else if (data.translatedText) {
      return data.translatedText;
    }
    return text; // Return original text if no translation found
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to dictionary-based translation if API fails
    if (targetLang === 'ur') {
      return translateToUrduDict(text);
    } else {
      return translateToEnglishDict(text);
    }
  }
};

// Convenience functions for translating to specific languages
export const translateToUrdu = async (text: string): Promise<string> => {
  return await translateText(text, 'ur');
};

export const translateToEnglish = async (text: string): Promise<string> => {
  return await translateText(text, 'en');
};

// Detect language based on script
export const detectLanguage = (text: string): 'en' | 'ur' => {
  // Urdu uses Arabic script, which includes characters in the ranges:
  // U+0600-U+06FF (Arabic/Persian)
  // U+0750-U+077F (extended Arabic)
  // U+FB50-U+FDFF (Arabic presentation forms-A)
  // U+FE70-U+FEFF (Arabic presentation forms-B)
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

  return urduRegex.test(text) ? 'ur' : 'en';
};

// Optional: Cache for frequently translated phrases (improves performance)
const translationCache = new Map<string, Promise<string>>();

export const translateWithCache = async (text: string, targetLang: 'en' | 'ur'): Promise<string> => {
  const cacheKey = `${text}-${targetLang}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    console.log('Using cached translation');
    return await translationCache.get(cacheKey)!;
  }

  // Translate and cache the result
  const translationPromise = translateText(text, targetLang);
  translationCache.set(cacheKey, translationPromise);

  try {
    const result = await translationPromise;
    return result;
  } catch (error) {
    // If translation fails, remove from cache and return original text
    translationCache.delete(cacheKey);
    return text;
  }
};

// Dictionary for fallback translation
const urduDictionary: Record<string, string> = {
  'hello': 'ہیلو',
  'hi': 'ہیلو',
  'goodbye': 'الوداع',
  'thank you': 'شکریہ',
  'please': 'براہ کرم',
  'sorry': 'معاف کریں',
  'yes': 'ہاں',
  'no': 'نہیں',
  'help': 'مدد',
  'todo': 'ٹوڈو',
  'task': 'کام',
  'add': 'شامل کریں',
  'delete': 'حذف کریں',
  'complete': 'مکمل',
  'pending': 'زیر التوا',
  'completed': 'مکمل شدہ',
  'list': 'فہرست',
  'show': 'دکھائیں',
  'mark': 'نشان زد کریں',
  'as': 'بطور',
  'buy groceries': 'دودھ، انڈے، روٹی وغیرہ خریدنا ہے',
  'walk the dog': 'کتے کو ٹہلنا',
  'clean house': 'گھر صاف کرنا ہے',
  'laundry': 'دھوتی کپڑے',
  'homework': 'ہوم ورک',
  'meeting': 'میٹنگ',
  'appointment': 'ملاقات',
  'call mom': 'ماں کو فون کرنا ہے',
  'exercise': 'ورزش',
  'read book': 'کتاب پڑھنا',
  'pay bills': 'بلز جمع کروانا',
  'schedule meeting': 'میٹنگ کا وقت طے کرنا',
  'write report': 'رپورٹ لکھنا',
  'buy milk': 'دودھ خریدنا',
  'pick up kids': 'بچوں کو اسکول سے لانا',
  'cook dinner': 'رات کا کھانا بنانا',
  'water plants': 'پودوں کو پانی دینا',
  'take medicine': 'ادویات لینا',
  'buy bread': 'روٹی خریدنا',
  'send email': 'ای میل بھیجنا',
  'finish project': 'پراجیکٹ مکمل کرنا',
  'clean room': 'کمرہ صاف کرنا',
  'wash dishes': 'برتن دھونا',
  'buy eggs': 'انڈے خریدنا',
  'walk': 'ٹہلنا',
  'dog': 'کتا',
  'groceries': 'دودھ، انڈے، روٹی وغیرہ',
  'work': 'کام',
  'today': 'آج',
  'tomorrow': 'کل',
  'yesterday': 'کل',
  'urgent': 'ضروری',
  'important': 'اہم',
  'normal': 'عام',
  'low': 'کم',
  'high': 'زیادہ',
  'priority': 'ترجیح',
  'deadline': 'آخری تاریخ',
  'due': 'واجب الادا',
  'time': 'وقت',
  'date': 'تاریخ',
  'now': 'ابھی',
  'later': 'بعد میں',
  'morning': 'صبح',
  'afternoon': 'دوپہر',
  'evening': 'شام',
  'night': 'رات',
  'week': 'ہفتہ',
  'month': 'مہینہ',
  'year': 'سال',
  'january': 'جنوری',
  'february': 'فروری',
  'march': 'مارچ',
  'april': 'اپریل',
  'may': 'مئی',
  'june': 'جون',
  'july': 'جولائی',
  'august': 'اگست',
  'september': 'ستمبر',
  'october': 'اکتوبر',
  'november': 'نومبر',
  'december': 'دسمبر',
  'monday': 'سوموار',
  'tuesday': 'منگل',
  'wednesday': 'بدھ',
  'thursday': 'جمعرات',
  'friday': 'جمعہ',
  'saturday': 'ہفتہ',
  'sunday': 'اتوار',
  'add task': 'کام شامل کریں',
  'add biryani': 'بریانی شامل کریں',
  'buy biryani ingredients': 'بریانی کے سامان خریدیں',
  'buy icecream': 'آئس کریم خریدیں',
  'add task to buy biryani': 'بریانی خریدنے کا کام شامل کریں',
  'add task to buy groceries': 'دودھ، انڈے، روٹی وغیرہ خریدنے کا کام شامل کریں',
  'add task to walk the dog': 'کتے کو ٹہلانے کا کام شامل کریں',
};

// Dictionary-based fallback functions
export const translateToUrduDict = (text: string): string => {
  // First check if the full phrase exists in the dictionary
  const lowerText = text.toLowerCase().trim();
  if (urduDictionary[lowerText]) {
    return urduDictionary[lowerText];
  }

  // Check for common multi-word phrases
  const commonPhrases = [
    'add task',
    'buy groceries',
    'walk the dog',
    'clean house',
    'call mom',
    'pay bills',
    'buy milk',
    'water plants',
    'buy eggs',
    'buy bread',
    'add biryani',
    'buy biryani ingredients',
    'buy icecream',
    'add task to buy biryani',
    'add task to buy groceries',
    'add task to walk the dog'
  ];

  for (const phrase of commonPhrases) {
    if (lowerText.includes(phrase)) {
      const translatedPhrase = urduDictionary[phrase] || phrase;
      const result = lowerText.replace(phrase, translatedPhrase);
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  }

  // Split the text into words and translate individually
  const words = text.split(' ');
  const translatedWords: string[] = [];

  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
    if (urduDictionary[cleanWord]) {
      translatedWords.push(urduDictionary[cleanWord]);
    } else {
      translatedWords.push(word); // Keep original if not found
    }
  }

  return translatedWords.join(' ');
};

export const translateToEnglishDict = (text: string): string => {
  // Create reverse dictionary for English translation
  const englishDictionary: Record<string, string> = {};
  Object.entries(urduDictionary).forEach(([en, ur]) => {
    englishDictionary[ur] = en;
  });

  // Check if the full phrase exists in the reverse dictionary
  if (englishDictionary[text]) {
    return englishDictionary[text];
  }

  // Split the text into words and translate individually
  const words = text.split(' ');
  const translatedWords: string[] = [];

  for (const word of words) {
    if (englishDictionary[word]) {
      translatedWords.push(englishDictionary[word]);
    } else {
      translatedWords.push(word); // Keep original if not found
    }
  }

  return translatedWords.join(' ');
};

// Clear translation cache (useful for memory management)
export const clearTranslationCache = (): void => {
  translationCache.clear();
};