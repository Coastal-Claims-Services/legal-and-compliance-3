
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
import { Badge } from '@/components/ui/badge';
import { Settings, Database, FileText, Plus, Edit, Trash, ArrowLeft, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedStateRuleManager } from '../components/EnhancedStateRuleManager';
import { StateRule, ResponseTemplate, ComplianceAlert } from '../types/admin';
import { KENTUCKY_RULES } from '../data/kentuckyRules';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const INITIAL_COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: '1',
    state: 'Kentucky',
    type: 'Rule Change',
    message: 'New fee cap legislation effective January 1, 2024. Review all active contracts.',
    priority: 'High',
    date: new Date().toISOString(),
    resolved: false,
    rule_id: 'KY-PUBADJ-FEES-003'
  },
  {
    id: '2', 
    state: 'Kentucky',
    type: 'Sunset Warning',
    message: 'Matching rule 806 KAR 12:095 expires 2028-11-30. Monitor for renewal.',
    priority: 'Medium',
    date: new Date().toISOString(),
    resolved: false,
    rule_id: 'KY-PROP-MATCH-007'
  },
  {
    id: '3',
    state: 'Florida',
    type: 'Bond Expiration',
    message: '5 adjusters have bonds expiring within 30 days. Renewal required.',
    priority: 'High',
    date: new Date().toISOString(),
    resolved: false
  }
];

const INITIAL_RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    id: '1',
    category: 'Reality Check',
    template: 'Let me challenge your assumptions here: {assumption}. The problem with that approach is {legal_weakness}. A stronger strategy would be {alternative_approach} because {reasoning}. The risk you are not seeing is {compliance_risk}.',
    variables: ['assumption', 'legal_weakness', 'alternative_approach', 'reasoning', 'compliance_risk'],
    confidence: 'High',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    category: 'Kentucky Hard Facts',
    template: 'Here are the hard facts for Kentucky: NO fee-shifting in first-party claims. {specific_law} creates {actual_remedy}, not attorney fees. Your contingency fee is {percentage}. Insurer knows this. Strategy: {adjusted_approach}.',
    variables: ['specific_law', 'actual_remedy', 'percentage', 'adjusted_approach'],
    confidence: 'High',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    category: 'Enforcement Gap Warning',
    template: 'Warning: {regulation_cited} has no private right of action. You cannot sue based on this. It is guidance only. Focus instead on {enforceable_provision} because {legal_reasoning}.',
    variables: ['regulation_cited', 'enforceable_provision', 'legal_reasoning'],
    confidence: 'Medium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    category: 'Timeframe Compliance',
    template: 'Kentucky insurer response requirements: Acknowledge in 10 days, investigate promptly. No statutory decision deadline. Document delays starting {start_date}. Unreasonable delay claim requires {evidence_needed}. Current delay status: {assessment}.',
    variables: ['start_date', 'evidence_needed', 'assessment'],
    confidence: 'High',
    lastUpdated: new Date().toISOString()
  }
];

const Admin = () => {
  const [stateRules, setStateRules] = useState<StateRule[]>(KENTUCKY_RULES);
  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>(INITIAL_RESPONSE_TEMPLATES);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>(INITIAL_COMPLIANCE_ALERTS);
  const [selectedState, setSelectedState] = useState<string>('Kentucky');
  const [newTemplate, setNewTemplate] = useState({
    category: '',
    template: '',
    variables: ''
  });

  const addStateRule = (rule: StateRule) => {
    setStateRules([...stateRules, rule]);
  };

  const deleteRule = (id: string) => {
    setStateRules(stateRules.filter(rule => rule.id !== id));
  };

  const addResponseTemplate = () => {
    if (!newTemplate.category || !newTemplate.template) return;
    
    const template: ResponseTemplate = {
      id: Date.now().toString(),
      category: newTemplate.category,
      template: newTemplate.template,
      variables: newTemplate.variables.split(',').map(v => v.trim()).filter(v => v),
      confidence: 'Medium',
      lastUpdated: new Date().toISOString()
    };
    
    setResponseTemplates([...responseTemplates, template]);
    setNewTemplate({ category: '', template: '', variables: '' });
  };

  const deleteTemplate = (id: string) => {
    setResponseTemplates(responseTemplates.filter(template => template.id !== id));
  };

  const resolveAlert = (id: string) => {
    setComplianceAlerts(alerts => 
      alerts.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };

  const unresolvedAlerts = complianceAlerts.filter(alert => !alert.resolved);
  const highConfidenceRules = stateRules.filter(rule => rule.confidence === 'HIGH').length;
  const rulesWithTests = stateRules.filter(rule => rule.tests.length > 0).length;
  const expiringSoonRules = stateRules.filter(rule => {
    if (!rule.sunset) return false;
    const sunsetDate = new Date(rule.sunset);
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
    return sunsetDate <= sixtyDaysFromNow;
  }).length;

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
              <div>
                <h1 className="text-4xl font-bold mb-2">Coastal Claims Admin</h1>
                <p className="text-xl text-muted-foreground">Enhanced Compliance Rules & AI Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {unresolvedAlerts.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {unresolvedAlerts.length} Alerts
                </Badge>
              )}
              <ThemeToggle />
            </div>
          </div>

          {unresolvedAlerts.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unresolvedAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant={alert.priority === 'High' ? 'destructive' : 'secondary'}>
                          {alert.priority}
                        </Badge>
                        <span className="font-medium text-sm">{alert.state}</span>
                        <span className="text-sm">{alert.message}</span>
                        {alert.rule_id && (
                          <Badge variant="outline" className="text-xs">
                            {alert.rule_id}
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                        Resolve
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Total Rules: {stateRules.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">High Confidence: {highConfidenceRules}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">With Tests: {rulesWithTests}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Expiring Soon: {expiringSoonRules}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <Label htmlFor="state-filter">Filter by State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All states..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="rules" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Enhanced State Rules
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
              <EnhancedStateRuleManager
                stateRules={stateRules}
                onAddRule={addStateRule}
                onDeleteRule={deleteRule}
                selectedState={selectedState === 'all' ? '' : selectedState}
                onStateChange={setSelectedState}
              />
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
                      placeholder="e.g., Fee-Shifting Challenge, Matching Dispute, Bond Alert"
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
                      placeholder="state, deadline_date, fee_percentage, bond_amount"
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
                  <CardTitle>Response Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseTemplates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{template.category}</h4>
                            <Badge>{template.confidence}</Badge>
                          </div>
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
                  <CardTitle>System Settings</CardTitle>
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
                    <Label htmlFor="update-frequency">Rule Update Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="confidence-threshold">Minimum Confidence Level</Label>
                    <Select defaultValue="regulatory">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="statutory">Statutory Only</SelectItem>
                        <SelectItem value="regulatory">Regulatory & Above</SelectItem>
                        <SelectItem value="advisory">All Sources</SelectItem>
                      </SelectContent>
                    </Select>
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
