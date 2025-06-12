
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  mode?: 'general' | 'state';
  state?: string;
}

const AIAssistant = () => {
  const [mode, setMode] = useState<'general' | 'state'>('general');
  const [selectedState, setSelectedState] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModeSwitch = (newMode: 'general' | 'state') => {
    setMode(newMode);
    setSelectedState('');
    if (newMode === 'state') {
      addSystemMessage('Switched to State Compliance mode. Please select a state to get started.');
    } else {
      addSystemMessage('Switched to General AI mode. How can I help you today?');
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'assistant',
      timestamp: new Date(),
      mode
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    addSystemMessage(`Great! I'm now ready to help you with ${state} compliance questions. What would you like to know?`);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (mode === 'state' && !selectedState) {
      toast({
        title: "Please select a state first",
        description: "Choose a state before asking compliance questions.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      mode,
      state: selectedState
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual OpenAI API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let responseContent = '';
      if (mode === 'state') {
        responseContent = `Based on ${selectedState} regulations: ${getStateResponse(inputValue, selectedState)}`;
      } else {
        responseContent = `General AI response to: ${inputValue}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        mode,
        state: selectedState
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStateResponse = (question: string, state: string) => {
    // Mock state-specific responses (will be replaced with actual OpenAI API integration)
    const mockResponses: Record<string, string> = {
      'Alabama': 'Public adjusting is illegal in Alabama. You cannot practice there.',
      'Texas': 'Texas allows public adjusting with proper licensing and bonding requirements.',
      'Florida': 'Florida has specific matching requirements and attorney fee-shifting opportunities.',
      'California': 'California has strict consumer protection laws affecting public adjusting practices.'
    };
    
    return mockResponses[state] || `I'll help you with ${state} specific compliance questions. This will connect to our regulatory database.`;
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Assistant
          </CardTitle>
          
          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'general' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeSwitch('general')}
            >
              General AI
            </Button>
            <Button
              variant={mode === 'state' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeSwitch('state')}
            >
              State Compliance
            </Button>
          </div>

          {/* State Selector (only shown in state mode) */}
          {mode === 'state' && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Select State:</span>
                {selectedState && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedState}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => setSelectedState('')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
              {!selectedState && (
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                  {states.map((state) => (
                    <Button
                      key={state}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleStateSelect(state)}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Messages */}
          <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg p-4 bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>
                  {mode === 'general' 
                    ? 'Ask me anything! I\'m here to help.' 
                    : 'Select a state above to get started with compliance questions.'
                  }
                </p>
              </div>
            )}
            
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
                      {message.state && ` • ${message.state}`}
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

          {/* Input */}
          <div className="flex gap-2 mt-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === 'state' && !selectedState
                  ? 'Select a state first...'
                  : mode === 'state'
                  ? `Ask about ${selectedState} compliance...`
                  : 'Ask me anything...'
              }
              disabled={isLoading || (mode === 'state' && !selectedState)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim() || (mode === 'state' && !selectedState)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
