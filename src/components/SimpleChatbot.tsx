
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, Key, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const SimpleChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');
  const [showStateSelection, setShowStateSelection] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for stored API key
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setApiKeySet(true);
    }

    // Add initial greeting message
    const initialMessage: Message = {
      id: 'initial',
      content: 'What state may I help you with today?',
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setApiKeySet(true);
    }
  };

  const callOpenAI = async (userMessage: string, state: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a specialized public adjuster assistant for ${state}. You help with insurance claims, compliance rules, and state-specific regulations. Provide specific, actionable guidance based on ${state} insurance law and regulations. Be professional and helpful.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
  };

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setShowStateSelection(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: state,
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Great! I can help you with public adjusting matters in ${state}. What specific questions do you have about insurance claims or public adjusting in your state?`,
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!apiKeySet) {
      alert('Please set your OpenAI API key first.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callOpenAI(inputValue, selectedState);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please check your API key and try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKeySet) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              To use the AI assistant, please enter your OpenAI API key. This will be stored securely in your browser.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your OpenAI API key (sk-...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
              Save API Key & Continue
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>Need an API key? Get one at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          Public Adjuster AI Assistant
          {selectedState && <span className="text-sm text-muted-foreground">- {selectedState}</span>}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Messages */}
        <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg p-4 bg-muted/20 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 mt-1">
                  {message.role === 'user' ? (
                    <User className="h-6 w-6 rounded-full bg-primary text-primary-foreground p-1" />
                  ) : (
                    <Bot className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground p-1" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Bot className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground p-1 flex-shrink-0 mt-1" />
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* State Selection or Input */}
        {showStateSelection ? (
          <div className="space-y-2">
            <Select onValueChange={handleStateSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select your state..." />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleChatbot;
