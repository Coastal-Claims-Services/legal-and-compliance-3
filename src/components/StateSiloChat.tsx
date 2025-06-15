import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StateRule {
  id: string;
  state: string;
  silo: string;
  category: string;
  subcategory: string;
  rule_text: string;
  leverage_points: string[];
  sources: string[];
  confidence: string;
  is_active: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface StateSiloChatProps {
  state: string;
  silo: string;
  siloName: string;
  stateName: string;
  rules: StateRule[];
}

export const StateSiloChat = ({ state, silo, siloName, stateName, rules }: StateSiloChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Load conversation history
    loadConversationHistory();
  }, [state, silo]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversationHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversation_history')
      .select('*')
      .eq('state', state)
      .eq('silo', silo)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error loading conversation history:', error);
      return;
    }

    const historyMessages: Message[] = [];
    data?.forEach((record) => {
      historyMessages.push({
        id: `${record.id}-user`,
        type: 'user',
        content: record.user_message,
        timestamp: new Date(record.created_at)
      });
      historyMessages.push({
        id: `${record.id}-ai`,
        type: 'ai',
        content: record.ai_response,
        timestamp: new Date(record.created_at)
      });
    });

    setMessages(historyMessages);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle Alabama prohibition
    if (state === 'AL' && (lowerMessage.includes('public adjust') || lowerMessage.includes('license'))) {
      return `❌ **Public Adjusting is ILLEGAL in Alabama**

Alabama does not license public adjusters. It's against state law to practice public adjusting here.

**What you should do instead:**
- Refer clients directly to insurance attorneys
- Focus on construction consulting (if licensed)
- Consider working in neighboring states like Florida or Georgia

**Legal Resources:**
- Alabama State Bar: (334) 269-1515
- Insurance Commissioner: (334) 269-3550

Would you like information about attorney referrals or other legal resources?`;
    }

    // Florida 14-day rule
    if (state === 'FL' && silo === 'insurance_carrier' && 
        (lowerMessage.includes('14 day') || lowerMessage.includes('response') || lowerMessage.includes('written request'))) {
      return `🎯 **Florida 14-Day Response Rule - Your LEVERAGE!**

**The Rule:** Insurance companies MUST respond to written requests within 14 calendar days (FL Stat 627.70131).

**When they violate this:**
- It's a breach of contract
- Statutory violation
- Grounds for bad faith claim
- Can demand immediate compliance

**How to use this leverage:**
1. Send ALL requests in writing (email/certified mail)
2. Date stamp everything
3. Count 14 calendar days (not business days)
4. Document the violation
5. Reference the statute in follow-up

**Sample follow-up:** "Your failure to respond within 14 days violates FL Stat 627.70131. Please provide immediate written response to avoid further statutory violations."

Need help with other Florida carrier obligations?`;
    }

    // Generic responses based on silo
    switch (silo) {
      case 'public_adjusting':
        if (lowerMessage.includes('license') || lowerMessage.includes('requirement')) {
          return `📋 **${stateName} Public Adjuster Requirements**

Based on our knowledge base for ${stateName}:

${rules.length > 0 ? rules.map(rule => `• **${rule.category}**: ${rule.rule_text}`).join('\n') : 'No specific licensing rules loaded for this state.'}

**Quick Questions I can help with:**
- License requirements and fees
- Bond requirements
- Continuing education
- Fee caps and structures
- Contract requirements

What specific licensing question do you have?`;
        }
        break;

      case 'insurance_carrier':
        if (lowerMessage.includes('breach') || lowerMessage.includes('violation')) {
          return `⚖️ **${stateName} Insurance Carrier Violations**

Here are the ways carriers breach their obligations in ${stateName}:

${rules.length > 0 ? rules.map(rule => 
  `• **${rule.category}**: ${rule.rule_text}${rule.leverage_points.length > 0 ? `\n  💪 Leverage: ${rule.leverage_points[0]}` : ''}`
).join('\n\n') : 'No carrier obligation rules loaded for this state.'}

**Common violations to watch for:**
- Late responses to written requests
- Unreasonable delays in claim handling
- Failure to provide proper documentation
- Inadequate investigation

What carrier behavior are you dealing with?`;
        }
        break;

      case 'construction':
        return `🏗️ **${stateName} Construction & Building Code Leverage**

Construction laws you can use to your advantage:

${rules.length > 0 ? rules.map(rule => 
  `• **${rule.category}**: ${rule.rule_text}${rule.leverage_points.length > 0 ? `\n  💪 Leverage: ${rule.leverage_points[0]}` : ''}`
).join('\n\n') : 'No construction rules loaded for this state.'}

**Common construction arguments:**
- Matching requirements for materials
- Code upgrade triggers
- Permit requirements
- Building department approvals

What construction issue are you dealing with?`;

      case 'legal':
        return `⚖️ **${stateName} Legal Resources & Attorney Support**

Legal leverage available in ${stateName}:

${rules.length > 0 ? rules.map(rule => 
  `• **${rule.category}**: ${rule.rule_text}${rule.leverage_points.length > 0 ? `\n  💪 Benefit: ${rule.leverage_points[0]}` : ''}`
).join('\n\n') : 'No legal resource rules loaded for this state.'}

**When to involve attorneys:**
- Bad faith claims
- Unreasonable delays
- Coverage disputes
- Fee shifting opportunities

Do you need attorney referrals or fee shifting information?`;

      default:
        return `I'm here to help with ${siloName.toLowerCase()} questions for ${stateName}. 

${rules.length > 0 ? `I have ${rules.length} rules loaded for this area. ` : ''}Try asking about:
- Specific laws and regulations
- Leverage opportunities  
- Compliance requirements
- Best practices

What would you like to know?`;
    }

    // Fallback response
    return `I'd be happy to help with ${siloName.toLowerCase()} questions for ${stateName}! 

${rules.length > 0 ? `I have ${rules.length} rules and regulations loaded for this area.` : 'I can provide general guidance even without specific rules loaded.'}

Try asking me about:
- Specific laws or requirements
- How to handle violations
- Leverage opportunities
- Best practices

What specific question do you have?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsgId = Date.now().toString();
    
    // Add user message
    const newUserMessage: Message = {
      id: userMsgId,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = generateAIResponse(userMessage);
      
      // Add AI message
      const aiMessage: Message = {
        id: `${userMsgId}-ai`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to conversation history if user is logged in
      if (user) {
        const { error } = await supabase
          .from('conversation_history')
          .insert({
            state,
            silo,
            user_id: user.id,
            user_message: userMessage,
            ai_response: aiResponse
          });

        if (error) {
          console.error('Error saving conversation:', error);
          toast.error('Failed to save conversation');
        }
      }

    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" />
                Ask me anything about {siloName.toLowerCase()} in {stateName}! 
                {state === 'AL' ? ' (Note: Public adjusting is prohibited here)' : ''}
              </div>
            </Card>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <Card className={`p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="p-3 bg-muted/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask about ${siloName.toLowerCase()} in ${stateName}...`}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!input.trim() || isLoading}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};