import React, { useState } from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Database, FileText, Plus, Edit, Trash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

interface StateRule {
  id: string;
  state: string;
  category: string;
  rule: string;
  description: string;
}

interface ResponseTemplate {
  id: string;
  category: string;
  template: string;
  variables: string[];
}

const INITIAL_KENTUCKY_RULES: StateRule[] = [
  {
    id: '1',
    state: 'Kentucky',
    category: 'Primary Guidance Protocol',
    rule: 'Before answering ANY Kentucky compliance question: 1. Start by consulting KRS Chapter 304 (Kentucky Insurance Code) and 806 KAR regulations. 2. Distinguish between enforceable statutory duties vs. regulatory guidance without private enforcement. 3. Focus on policy language interpretation over unenforceable regulations. 4. Never promise outcomes based on regulations lacking private rights of action.',
    description: 'Official source consultation protocol - prevents false promises based on unenforceable guidance'
  },
  {
    id: '2',
    state: 'Kentucky',
    category: 'Fee Shifting Reality',
    rule: 'Kentucky does NOT provide fee-shifting in first-party insurance claims. KRS 304.12-230 prohibits unfair practices but creates NO attorney fee recovery. Adjusters pay their own legal costs (30-50% contingency). Factor this into ALL settlement strategies - insurers know you are paying legal fees.',
    description: 'Hard stop on fee-shifting expectations - prevents unrealistic client promises'
  },
  {
    id: '3',
    state: 'Kentucky',
    category: 'Matching Claims Strategy',
    rule: 'For Kentucky matching disputes: 1. Analyze specific policy language for "like kind and quality" provisions first. 2. Reference 806 KAR 12:095 Section 9(1)(b) as regulatory guidance ONLY - NOT enforceable law. 3. Build arguments on contract interpretation, not Advisory Opinion 2023-08. 4. No private right of action = no litigation leverage. 5. Alternative: Focus on diminished value claims if matching unavailable.',
    description: 'Prevents reliance on unenforceable matching regulations - forces policy-based arguments'
  },
  {
    id: '4',
    state: 'Kentucky',
    category: 'Bad Faith Standards',
    rule: 'Kentucky bad faith requires proving insurer conduct was BOTH unreasonable AND in bad faith. UCSPA violations alone are insufficient. Must show deliberate misconduct or reckless disregard. High bar to meet. Do not oversell bad faith prospects to clients - focus on contract breaches instead.',
    description: 'Sets realistic expectations for bad faith claims - prevents overselling weak cases'
  },
  {
    id: '5',
    state: 'Kentucky',
    category: 'Insurer Response Timeframes',
    rule: 'Kentucky insurers must acknowledge claims within 10 days and begin investigation promptly. No specific statutory deadline for claim decisions, but unreasonable delay can support UCSPA violation. Document all delays with dates and communications. Focus on "unreasonable delay" rather than specific day counts.',
    description: 'Provides concrete timeframe expectations while avoiding false precision'
  },
  {
    id: '6',
    state: 'Kentucky',
    category: 'Behavior & Communication',
    rule: 'Be direct, sharp, and legally precise. Always assume speaking to licensed public adjuster. Challenge assumptions, provide counterpoints, test reasoning. No optimistic interpretations of weak legal positions. If the law is against us, say so and pivot to stronger arguments.',
    description: 'Communication style requirements - prevents wishful thinking and lazy analysis'
  }
];

const INITIAL_RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    id: '1',
    category: 'Reality Check',
    template: 'Let me challenge your assumptions here: {assumption}. The problem with that approach is {legal_weakness}. A stronger strategy would be {alternative_approach} because {reasoning}. The risk you are not seeing is {compliance_risk}.',
    variables: ['assumption', 'legal_weakness', 'alternative_approach', 'reasoning', 'compliance_risk']
  },
  {
    id: '2',
    category: 'Kentucky Hard Facts',
    template: 'Here are the hard facts for Kentucky: NO fee-shifting in first-party claims. {specific_law} creates {actual_remedy}, not attorney fees. Your contingency fee is {percentage}. Insurer knows this. Strategy: {adjusted_approach}.',
    variables: ['specific_law', 'actual_remedy', 'percentage', 'adjusted_approach']
  },
  {
    id: '3',
    category: 'Enforcement Gap Warning',
    template: 'Warning: {regulation_cited} has no private right of action. You cannot sue based on this. It is guidance only. Focus instead on {enforceable_provision} because {legal_reasoning}.',
    variables: ['regulation_cited', 'enforceable_provision', 'legal_reasoning']
  },
  {
    id: '4',
    category: 'Timeframe Compliance',
    template: 'Kentucky insurer response requirements: Acknowledge in 10 days, investigate promptly. No statutory decision deadline. Document delays starting {start_date}. Unreasonable delay claim requires {evidence_needed}. Current delay status: {assessment}.',
    variables: ['start_date', 'evidence_needed', 'assessment']
  }
];

const Admin = () => {
  const [stateRules, setStateRules] = useState<StateRule[]>(INITIAL_KENTUCKY_RULES);
  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>(INITIAL_RESPONSE_TEMPLATES);
  const [selectedState, setSelectedState] = useState<string>('');
  const [newRule, setNewRule] = useState({
    category: '',
    rule: '',
    description: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    category: '',
    template: '',
    variables: ''
  });

  const addStateRule = () => {
    if (!selectedState || !newRule.category || !newRule.rule) return;
    
    const rule: StateRule = {
      id: Date.now().toString(),
      state: selectedState,
      category: newRule.category,
      rule: newRule.rule,
      description: newRule.description
    };
    
    setStateRules([...stateRules, rule]);
    setNewRule({ category: '', rule: '', description: '' });
  };

  const addResponseTemplate = () => {
    if (!newTemplate.category || !newTemplate.template) return;
    
    const template: ResponseTemplate = {
      id: Date.now().toString(),
      category: newTemplate.category,
      template: newTemplate.template,
      variables: newTemplate.variables.split(',').map(v => v.trim()).filter(v => v)
    };
    
    setResponseTemplates([...responseTemplates, template]);
    setNewTemplate({ category: '', template: '', variables: '' });
  };

  const deleteRule = (id: string) => {
    setStateRules(stateRules.filter(rule => rule.id !== id));
  };

  const deleteTemplate = (id: string) => {
    setResponseTemplates(responseTemplates.filter(template => template.id !== id));
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to AI
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Coastal Claims Admin</h1>
                <p className="text-xl text-muted-foreground">Manage Compliance Rules & AI Templates</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Tabs defaultValue="rules" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                State Rules
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Response Templates
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New State Rule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state-select">State</Label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state..." />
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
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newRule.category}
                        onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                        placeholder="e.g., Primary Guidance Protocol, Compliance Analysis"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rule">Rule</Label>
                    <Textarea
                      id="rule"
                      value={newRule.rule}
                      onChange={(e) => setNewRule({...newRule, rule: e.target.value})}
                      placeholder="Enter the specific compliance rule or protocol..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRule.description}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                      placeholder="Brief explanation of rule purpose or context..."
                      rows={2}
                    />
                  </div>
                  <Button onClick={addStateRule} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indiana Compliance Rules (Coastal Claims)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stateRules.map((rule) => (
                      <div key={rule.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{rule.state} - {rule.category}</h4>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm">{rule.rule}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Response Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Input
                      id="template-category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      placeholder="e.g., Compliance Challenge, Risk Analysis, Indiana Primer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-text">Template</Label>
                    <Textarea
                      id="template-text"
                      value={newTemplate.template}
                      onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                      placeholder="Enter response template with {variables} in curly braces..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-variables">Variables (comma-separated)</Label>
                    <Input
                      id="template-variables"
                      value={newTemplate.variables}
                      onChange={(e) => setNewTemplate({...newTemplate, variables: e.target.value})}
                      placeholder="assumption, counterpoint, risk_scenario, alternative_approach"
                    />
                  </div>
                  <Button onClick={addResponseTemplate} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coastal Claims Response Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseTemplates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{template.category}</h4>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-2">{template.template}</p>
                        {template.variables.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Variables: {template.variables.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coastal Claims AI Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <Input
                      id="bot-name"
                      defaultValue="Coastal Claims Compliance AI"
                      placeholder="Enter bot name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="communication-style">Communication Style</Label>
                    <Textarea
                      id="communication-style"
                      defaultValue="Direct, sharp, and loyal. Zero corporate filler. Always assume speaking to licensed public adjuster or apprentice. Challenge thinking and provide counterpoints."
                      placeholder="Define the AI's communication approach..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default-response">Default Response</Label>
                    <Textarea
                      id="default-response"
                      defaultValue="I'm here to help with Indiana public adjusting compliance matters for Coastal Claims. Most of the time you're looking for me to reaffirm the rules for this state. Would you like a primer of the dos and don'ts for public adjusters in Indiana?"
                      placeholder="Default response when no specific rule matches..."
                      rows={3}
                    />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Admin;
