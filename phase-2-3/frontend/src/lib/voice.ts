/**
 * Voice utilities for speech recognition and synthesis
 */

// Simple wrapper for Web Speech API
export const speakText = (text: string, language: 'en' | 'ur' = 'en') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Set language
    utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';

    // Set speech rate and pitch
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech not supported in this browser');
  }
};

export const listenForSpeech = (language: 'en' | 'ur' = 'en'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    } else {
      reject(new Error('Speech recognition not supported in this browser'));
    }
  });
};

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Check if browser supports speech synthesis
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Get available voices (useful for language-specific voices)
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return speechSynthesis.getVoices();
  }
  return [];
};