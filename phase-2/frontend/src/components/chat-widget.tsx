'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Sparkles, Loader2, Languages, Volume2, Mic, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { chatAPI, ChatResponse } from '@/lib/chat-api';
import { useSession } from '@/lib/auth';
import { useTaskContext } from '@/contexts/TaskContext';
import { DESIGN_SYSTEM } from '@/lib/utils';
import { translateToUrdu, translateToEnglish, detectLanguage } from '@/lib/translation';
import { speakText, listenForSpeech, isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '@/lib/voice';

const ChatWidget = () => {
  const { theme } = useTheme();

  // Use actual session
  const { data: session, isPending } = useSession();
  const { triggerRefresh } = useTaskContext();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; language?: 'en' | 'ur' }[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null); // ✅ Changed from string to number
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('en');
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages');
      const savedConversationId = localStorage.getItem('chatConversationId');
      const savedLanguage = localStorage.getItem('chatLanguage');

      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }

      if (savedConversationId) {
        // ✅ Parse string to number
        const parsedId = parseInt(savedConversationId, 10);
        if (!isNaN(parsedId)) {
          setCurrentConversationId(parsedId);
        }
      }

      if (savedLanguage) {
        setSelectedLanguage(savedLanguage as 'en' | 'ur');
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save conversation ID to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentConversationId !== null) {
      // ✅ Convert number to string for localStorage
      localStorage.setItem('chatConversationId', currentConversationId.toString());
    }
  }, [currentConversationId]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatLanguage', selectedLanguage);
    }
  }, [selectedLanguage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollAreaRef.current!.scrollTop = scrollAreaRef.current!.scrollHeight;
      }, 0);
    }
  }, [messages]);

  // Close widget when navigating to chat page
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.location.pathname === '/chat') {
      setIsOpen(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Check if user is authenticated
    if (!session || !session.user) {
      const authErrorMessage = {
        id: `auth-error-${Date.now()}`,
        role: 'assistant' as const,
        content: selectedLanguage === 'ur'
          ? 'براہ کرم لاگ ان کریں تاکہ چیٹ بورڈ استعمال کرسکیں۔'
          : 'Please sign in to use the chat feature.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, authErrorMessage]);
      return;
    }

    // Determine the actual language of the input (in case user typed in different language than selected)
    const inputLanguage = detectLanguage(inputValue.trim());
    let processedInput = inputValue.trim();

    // If user selected Urdu but typed in English, translate to Urdu before sending
    if (selectedLanguage === 'ur' && inputLanguage === 'en') {
      processedInput = await translateToUrdu(inputValue.trim());
    }
    // If user selected English but typed in Urdu, translate to English before sending
    else if (selectedLanguage === 'en' && inputLanguage === 'ur') {
      processedInput = await translateToEnglish(inputValue.trim());
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: processedInput,
      timestamp: new Date(),
      language: selectedLanguage
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response: ChatResponse = await chatAPI.sendMessage(
        session.user.id!,
        userMessage.content,
        currentConversationId ?? undefined // ✅ Now it's number | null, so ?? undefined works
      );

      // Update conversation ID if it's the first message
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
      }

      // Add assistant response to chat
      let processedResponse = response.response;

      // Translate based on user's selected language
      if (selectedLanguage === 'ur' && detectLanguage(response.response) === 'en') {
        // Translate English response to Urdu
        try {
          processedResponse = await translateToUrdu(response.response); // ✅ Fixed
        } catch (e) {
          console.warn('Translation to Urdu failed, using original:', e);
          processedResponse = response.response;
        }
      } else if (selectedLanguage === 'en' && detectLanguage(response.response) === 'ur') {
        // Translate Urdu response to English
        try {
          processedResponse = await translateToEnglish(response.response); // ✅ Fixed
        } catch (e) {
          console.warn('Translation to English failed, using original:', e);
          processedResponse = response.response;
        }
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant' as const,
        content: processedResponse,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if the response contains task-related information and trigger a refresh
      if (response.tool_calls && response.tool_calls.length > 0) {
        console.log('Tool calls detected, triggering task refresh...', response.tool_calls);
        // Dispatch a custom event to notify other components about task changes
        window.dispatchEvent(new CustomEvent('taskUpdated', {
          detail: {
            action: 'refresh',
            tool_calls: response.tool_calls,
            source: 'chat-widget',
            timestamp: Date.now()
          }
        }));

        // Trigger refresh through context
        triggerRefresh();

        // Also refresh the task list directly if needed
        setTimeout(() => {
          // Find any task list components and force a refresh
          const refreshEvent = new Event('refreshTasks');
          window.dispatchEvent(refreshEvent);

          // Additional event for broader updates
          window.dispatchEvent(new CustomEvent('tasksChanged', {
            detail: {
              source: 'chat-widget',
              tool_calls: response.tool_calls,
              timestamp: Date.now()
            }
          }));
        }, 100);
      } else {
        // Even if no tool calls, check if response mentions task operations and trigger refresh
        const responseLower = response.response.toLowerCase();
        const taskKeywords = ['created', 'added', 'deleted', 'completed', 'updated', 'task', 'tasks', 'marked', 'done', 'finished'];
        if (taskKeywords.some(keyword => responseLower.includes(keyword))) {
          console.log('Task-related response detected, triggering immediate refresh...');

          // Dispatch events to notify other components immediately
          window.dispatchEvent(new CustomEvent('taskUpdated', {
            detail: { action: 'refresh', source: 'chat-widget', timestamp: Date.now() }
          }));

          // Trigger refresh through context
          triggerRefresh();

          // Small delay to ensure operation is complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('tasksChanged', {
              detail: { source: 'chat-widget', timestamp: Date.now() }
            }));
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: selectedLanguage === 'ur'
          ? 'معاف کریں، آپ کی درخواست کو پروسیس کرنے میں خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔'
          : 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time and no saved messages
      const welcomeMessage = selectedLanguage === 'ur'
        ? 'ہیلو! میں آپ کا AI ٹوڈو اسسٹنٹ ہوں۔ میں آج آپ کے کاموں کو منظم کرنے میں کیسے مدد کر سکتا ہوں؟'
        : 'Hello! I\'m your AI Todo Assistant. How can I help you manage your tasks today?';

      const welcomeMsg = {
        id: 'welcome',
        role: 'assistant' as const,
        content: welcomeMessage,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages([welcomeMsg]);
      // Also save to localStorage
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMsg]));
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    // Don't allow deletion of welcome message
    if (messageId === 'welcome') {
      return;
    }
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const toggleListening = async () => {
    if (!isSpeechRecognitionSupported()) {
      alert(selectedLanguage === 'ur'
        ? 'معاف کریں، آواز کا استعمال صرف تازہ ترین براؤزرز میں دستیاب ہے۔'
        : 'Sorry, voice input is only available in modern browsers.');
      return;
    }

    if (!isListening) {
      setIsListening(true);
      try {
        const transcript = await listenForSpeech(selectedLanguage);
        setInputValue(transcript);
      } catch (error) {
        console.error('Speech recognition error:', error);
        alert(selectedLanguage === 'ur'
          ? 'آواز کی شناخت میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔'
          : 'Error with speech recognition. Please try again.');
      } finally {
        setIsListening(false);
      }
    }
  };


  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleWidget}
          className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center group bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white hover:scale-110 transition-all duration-300"
          whileHover={{ scale: 1.15, boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 0, 360, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
            scale: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <X className="w-7 h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Bot className="w-7 h-7" />
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-2 h-2 text-yellow-800" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-400"
            animate={{
              scale: [1, 1.4, 1.8],
              opacity: [1, 0.7, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </div>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Chat Widget */}
            <motion.div
              className="fixed bottom-24 right-6 w-96 h-[500px] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.8, rotateY: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Bot className="w-6 h-6 text-orange-500" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">AI Todo Assistant</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedLanguage === 'ur' ? 'زندہ چیٹ' : 'Live Chat'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Language Selector */}
                    <Select value={selectedLanguage} onValueChange={(value: 'en' | 'ur') => setSelectedLanguage(value)}>
                      <SelectTrigger className="w-16 h-8 text-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">اردو</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMessages([]);
                        setCurrentConversationId(null);
                        // Clear localStorage for this conversation
                        localStorage.removeItem('chatMessages');
                        localStorage.removeItem('chatConversationId');
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-500/20"
                      title="Clear conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleWidget}
                      className="h-8 w-8 p-0 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4 max-h-[calc(500px-180px)]" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none'
                              : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-bl-none'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === 'assistant' && (
                              <div className="mt-0.5">
                                <Bot className="w-4 h-4 text-orange-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p
                                className={`whitespace-pre-wrap ${
                                  message.language === 'ur' ? 'text-right font-amiri' : ''
                                }`}
                              >
                                {message.content}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className={`text-sm ${
                                  message.role === 'user'
                                    ? 'text-blue-100/80'
                                    : 'text-gray-500/80 dark:text-gray-300/80'
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {message.language === 'ur' && ' • اردو'}
                                </p>
                                {/* Only show delete button for non-welcome messages */}
                                {message.id !== 'welcome' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            {message.role === 'user' && (
                              <div className="mt-0.5">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div
                          className="max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-bl-none"
                        >
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-orange-400" />
                            <div className="flex space-x-1">
                              <motion.div
                                className="w-2 h-2 bg-orange-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-orange-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-orange-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                            <span className="text-sm">
                              {selectedLanguage === 'ur' ? 'سوچ رہا ہوں...' : 'Thinking...'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={toggleListening}
                        className={`h-10 w-10 p-0 ${
                          isListening
                            ? 'animate-pulse bg-red-500 text-white border border-red-500'
                            : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {isListening ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>

                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          selectedLanguage === 'ur'
                            ? ' مجھے بتائیں کہ میں آپ کی کیا مدد کر سکتا ہوں ...'
                            : 'Ask me anything...'
                        }
                        disabled={isLoading}
                        className="flex-1 h-10 bg-transparent dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading || !inputValue.trim()}
                      className="h-10 w-10 p-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>

                  <p className="text-sm mt-2 text-center text-gray-500 dark:text-gray-400">
                    {selectedLanguage === 'ur'
                      ? 'ای ۔آئی کے ذریعے محرک: آپ کے کاموں کو ذہنی طور پر چلانے کے لیے'
                      : 'AI Powered: For intelligently managing your tasks'}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;