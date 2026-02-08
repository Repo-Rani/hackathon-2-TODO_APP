'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, RotateCcw, Edit3, Trash2, Languages, Volume2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chatAPI, ChatResponse } from '@/lib/chat-api';
import { useSession } from '@/lib/auth';
import { useTaskContext } from '@/contexts/TaskContext';
import { translateToUrdu, translateToEnglish, detectLanguage } from '@/lib/translation';
import { speakText, listenForSpeech, isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '@/lib/voice';

const ChatPage = () => {
  const { theme } = useTheme();
  const { data: session } = useSession(); // ✅ Fixed: useSession returns {data, isPending}
  const { triggerRefresh } = useTaskContext();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; language?: 'en' | 'ur' }[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('en');
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // ✅ Get user ID - ensure it matches the task API user ID
  // For now, use the authenticated user ID, but fall back to session user ID
  const userId = session?.user?.id;

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatPageMessages');
      const savedConversationId = localStorage.getItem('chatPageConversationId');

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
        // Parse as number since it's stored as string
        const parsedId = parseInt(savedConversationId, 10);
        if (!isNaN(parsedId)) {
          setCurrentConversationId(parsedId);
        }
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatPageMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save conversation ID to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentConversationId !== null) {
      localStorage.setItem('chatPageConversationId', currentConversationId.toString());
    }
  }, [currentConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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
      // Validation check
      if (!userId) {
        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant' as const,
          content: 'Please log in to use the chat feature.',
          timestamp: new Date(),
          language: selectedLanguage
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Send message to backend
      const response: ChatResponse = await chatAPI.sendMessage(
        userId,
        userMessage.content,
        currentConversationId ?? undefined
      );

      // Update conversation ID
      setCurrentConversationId(response.conversation_id);

      // Add assistant response to chat
      let processedResponse = response.response;

      // Translate based on user's selected language
      if (selectedLanguage === 'ur' && detectLanguage(response.response) === 'en') {
        // Translate English response to Urdu
        processedResponse = await translateToUrdu(response.response);
      } else if (selectedLanguage === 'en' && detectLanguage(response.response) === 'ur') {
        // Translate Urdu response to English
        processedResponse = await translateToEnglish(response.response);
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
        console.log('Tool calls detected in chat page, triggering task refresh...', response.tool_calls);
        // Dispatch a custom event to notify other components about task changes
        window.dispatchEvent(new CustomEvent('taskUpdated', {
          detail: {
            action: 'refresh',
            tool_calls: response.tool_calls,
            source: 'chat-page',
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
              source: 'chat-page',
              tool_calls: response.tool_calls,
              timestamp: Date.now()
            }
          }));
        }, 100); // Faster delay for better UX
      } else {
        // Even if no tool calls, check if response mentions task operations and trigger refresh
        const responseLower = response.response.toLowerCase();
        const taskKeywords = ['created', 'added', 'deleted', 'completed', 'updated', 'task', 'tasks', 'marked', 'done', 'finished'];
        if (taskKeywords.some(keyword => responseLower.includes(keyword))) {
          console.log('Task-related response detected in chat page, triggering immediate refresh...');

          // Dispatch events to notify other components immediately
          window.dispatchEvent(new CustomEvent('taskUpdated', {
            detail: { action: 'refresh', source: 'chat-page', timestamp: Date.now() }
          }));

          // Trigger refresh through context
          triggerRefresh();

          // Small delay to ensure operation is complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('tasksChanged', {
              detail: { source: 'chat-page', timestamp: Date.now() }
            }));
          }, 100); // Much faster delay for immediate feedback
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: error instanceof Error
          ? error.message
          : 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    // Clear localStorage for this conversation
    localStorage.removeItem('chatPageMessages');
    localStorage.removeItem('chatPageConversationId');
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditContent(message.content);
    }
  };

  const saveEditedMessage = () => {
    if (editingMessageId) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editingMessageId
            ? { ...msg, content: editContent, timestamp: new Date() }
            : msg
        )
      );
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditContent('');
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="w-10 h-10 text-orange-500" />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Todo Assistant</h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your intelligent task management companion
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={selectedLanguage} onValueChange={(value: 'en' | 'ur') => setSelectedLanguage(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ur">اردو</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={startNewConversation}
              variant="outline"
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'border-gray-600' : ''}`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Chat</span>
            </Button>

            <Button
              onClick={() => {
                setMessages([]);
                setCurrentConversationId(null);
                // Clear localStorage for this conversation
                localStorage.removeItem('chatPageMessages');
                localStorage.removeItem('chatPageConversationId');
              }}
              variant="outline"
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'border-gray-600' : ''}`}
              title="Delete conversation"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Chat Header */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Conversation</span>
                {currentConversationId && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-125 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <Bot className="w-16 h-16 text-orange-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Welcome to AI Todo Assistant!</h3>
                    <p className={`mb-6 max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      I can help you manage your tasks with natural language. Try commands like:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                      {[
                        'Add a task to buy groceries',
                        'Show my pending tasks',
                        'Mark task 1 as complete',
                        'Delete task 2'
                      ].map((cmd, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-200'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => setInputValue(cmd)}
                        >
                          "{cmd}"
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {editingMessageId === message.id ? (
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-bl-none`
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === 'assistant' && (
                              <Bot className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <textarea
                                className={`w-full p-2 rounded mb-2 ${
                                  theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                                }`}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={saveEditedMessage}
                                  className="text-sm"
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditMessage}
                                  className="text-sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                              <p className={`text-sm mt-1 ${message.role === 'user' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {message.role === 'user' && (
                              <User className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-bl-none`
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === 'assistant' && (
                              <Bot className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className={`text-sm ${message.role === 'user' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex gap-1 ml-2">
                                  {message.role === 'assistant' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => speakText(message.content, message.language || 'en')}
                                      className="h-6 w-6 p-1"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditMessage(message.id)}
                                    className="h-6 w-6 p-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="h-6 w-6 p-1 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {message.role === 'user' && (
                              <User className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 flex justify-start"
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      } rounded-bl-none`}
                    >
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={toggleListening}
                  className={`h-10 w-10 p-0 ${
                    isListening
                      ? 'animate-pulse bg-red-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-100'
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
                  placeholder="Type your message here (e.g., 'Add a task to buy groceries')..."
                  disabled={isLoading}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2">Natural Language</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Communicate with your todo list using everyday language. No complex commands needed.
            </p>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Smart task management with contextual understanding and intelligent suggestions.
            </p>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">Persistent Chats</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Continue conversations across sessions with full context preservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;