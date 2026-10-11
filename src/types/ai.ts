export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: 'openai' | 'fallback';
  timestamp: string;
}

