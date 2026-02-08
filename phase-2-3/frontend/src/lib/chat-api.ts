/**
 * Chat API Client for AI-Powered Todo Chatbot
 * Handles communication with the backend chat endpoint
 */

interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: Array<{
    name: string;
    arguments: Record<string, any>;
  }> | null;  // Changed to allow null for backward compatibility
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

class ChatAPIClient {
  private baseURL: string;

  constructor() {
    // ✅ Fixed: Remove /api from base URL since chat route already has prefix
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Try multiple storage locations
    const tokenSources = [
      localStorage.getItem('better-auth.session_token'), // Better Auth token
      localStorage.getItem('auth_token'),
      localStorage.getItem('access_token'),
      localStorage.getItem('token'),
      // Cookie fallback
      document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*=\s*([^;]+).*$)|^.*$/, "$1")
    ];

    return tokenSources.find(token => token && token.length > 0) || null;
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(
    userId: string,
    message: string,
    conversationId?: number, // Changed to number to match backend
    language?: 'en' | 'ur'
  ): Promise<ChatResponse> {
    try {
      // ✅ Updated endpoint to match new API spec
      const endpoint = `${this.baseURL}/api/${userId}/chat`;

      console.log('🚀 Sending message to:', endpoint);
      console.log('📝 Message:', message);
      console.log('🌐 Language:', language);

      const token = this.getAuthToken();
      console.log('🔑 Token found:', token ? 'Yes' : 'No');

      if (!userId) {
        console.error('❌ No user ID provided for chat');
        throw new Error('User ID is required to send chat messages');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in.');
        }
        
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('✅ Response received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // ✅ User-friendly error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('❌ Cannot connect to backend. Please ensure the server is running on http://localhost:8000');
      }
      
      throw error;
    }
  }

  /**
   * Get list of user's conversations
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const token = this.getAuthToken();

      const response = await fetch(`${this.baseURL}/chat/${userId}/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: Conversation[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages from a specific conversation
   */
  async getConversationMessages(userId: string, conversationId: string): Promise<Message[]> {
    try {
      const token = this.getAuthToken();

      const response = await fetch(`${this.baseURL}/chat/${userId}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: Message[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPIClient();

export type { ChatRequest, ChatResponse, Conversation, Message };