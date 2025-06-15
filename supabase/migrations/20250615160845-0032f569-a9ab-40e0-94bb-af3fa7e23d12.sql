-- Drop existing tables to start fresh
DROP TABLE IF EXISTS public.state_rules CASCADE;
DROP TABLE IF EXISTS public.conversation_history CASCADE;

-- Create state_rules table with 4-silo structure
CREATE TABLE public.state_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state VARCHAR(2) NOT NULL,
  silo VARCHAR(50) NOT NULL CHECK (silo IN ('public_adjusting', 'construction', 'insurance_carrier', 'legal')),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  rule_text TEXT NOT NULL,
  leverage_points TEXT[],
  sources TEXT[],
  version VARCHAR(10) DEFAULT '1.0',
  confidence VARCHAR(10) DEFAULT 'HIGH' CHECK (confidence IN ('HIGH', 'MEDIUM', 'LOW')),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation_history table for AI chat context
CREATE TABLE public.conversation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state VARCHAR(2) NOT NULL,
  silo VARCHAR(50) NOT NULL CHECK (silo IN ('public_adjusting', 'construction', 'insurance_carrier', 'legal')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.state_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for state_rules (public read, admin write)
CREATE POLICY "State rules are viewable by everyone" 
ON public.state_rules 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert state rules" 
ON public.state_rules 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update state rules" 
ON public.state_rules 
FOR UPDATE 
TO authenticated
USING (true);

-- RLS policies for conversation_history
CREATE POLICY "Users can view their own conversations" 
ON public.conversation_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
ON public.conversation_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_state_rules_state_silo ON public.state_rules(state, silo);
CREATE INDEX idx_conversation_history_state_silo ON public.conversation_history(state, silo);
CREATE INDEX idx_conversation_history_user ON public.conversation_history(user_id);

-- Insert sample data for Florida and Alabama
INSERT INTO public.state_rules (state, silo, category, subcategory, rule_text, leverage_points, sources) VALUES
-- Florida Public Adjusting
('FL', 'public_adjusting', 'License Requirements', 'Bond Requirements', 'Public adjusters must maintain a $50,000 surety bond', ARRAY['Can challenge unlicensed competitors', 'Bond claims for client protection'], ARRAY['Florida Statute 626.854']),
('FL', 'public_adjusting', 'Fee Structure', 'Fee Caps', 'Maximum 20% contingency fee for claims filed within 3 years of loss', ARRAY['Fee protection for clients', 'Cannot exceed statutory limits'], ARRAY['Florida Statute 626.8796']),

-- Florida Insurance Carrier Obligations  
('FL', 'insurance_carrier', 'Response Timeframes', 'Written Requests', 'Must respond to written requests within 14 calendar days', ARRAY['14-day violation = breach of contract', 'Statutory violation for delay'], ARRAY['Florida Statute 627.70131']),
('FL', 'insurance_carrier', 'Payment Deadlines', 'Claim Settlement', 'Must pay or deny claims within 90 days', ARRAY['90-day rule enforcement', 'Interest penalties for delays'], ARRAY['Florida Statute 627.70132']),

-- Florida Construction
('FL', 'construction', 'Matching Requirements', 'Material Matching', 'Must match materials when replacing damaged portions', ARRAY['Can demand matching even if costly', 'Aesthetic consistency required'], ARRAY['Florida Building Code']),

-- Florida Legal
('FL', 'legal', 'Fee Shifting', 'Bad Faith Claims', 'Successful bad faith claims allow attorney fee recovery', ARRAY['Insurance pays legal costs if they lose', 'Deterrent for carrier bad faith'], ARRAY['Florida Statute 627.428']),

-- Alabama (Prohibited State)
('AL', 'public_adjusting', 'License Requirements', 'State Prohibition', 'Public adjusting is illegal in Alabama - no licensing available', ARRAY['Cannot practice PA in Alabama', 'Refer clients to attorneys only'], ARRAY['Alabama Insurance Code']),
('AL', 'legal', 'Alternative Resources', 'Attorney Referrals', 'Public adjusters cannot practice - refer to insurance defense attorneys', ARRAY['Attorney-only state for insurance disputes'], ARRAY['Alabama Bar Association']);