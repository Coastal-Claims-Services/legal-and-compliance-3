
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
import { Settings, Database, FileText, Plus, Edit, Trash } from 'lucide-react';

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

const Admin = () => {
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>([]);
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
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-4">Public Adjuster Admin</h1>
              <p className="text-xl text-muted-foreground">Manage Rules & Data</p>
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
                        placeholder="e.g., Insurance Claims, Licensing, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rule">Rule</Label>
                    <Textarea
                      id="rule"
                      value={newRule.rule}
                      onChange={(e) => setNewRule({...newRule, rule: e.target.value})}
                      placeholder="Enter the specific rule or regulation..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRule.description}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                      placeholder="Additional context or explanation..."
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
                  <CardTitle>Existing State Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  {stateRules.length === 0 ? (
                    <p className="text-muted-foreground">No rules added yet.</p>
                  ) : (
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
                  )}
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
                      placeholder="e.g., Claim Denial, Documentation, etc."
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
                      placeholder="state, claimType, amount, etc."
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
                  <CardTitle>Existing Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  {responseTemplates.length === 0 ? (
                    <p className="text-muted-foreground">No templates added yet.</p>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <Input
                      id="bot-name"
                      defaultValue="Public Adjuster AI Assistant"
                      placeholder="Enter bot name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="default-response">Default Response</Label>
                    <Textarea
                      id="default-response"
                      defaultValue="I'm here to help with public adjusting matters. Please let me know your specific question."
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
