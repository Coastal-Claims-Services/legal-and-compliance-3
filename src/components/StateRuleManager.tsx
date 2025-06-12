
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, AlertTriangle, Calendar } from 'lucide-react';
import { StateRule } from '../types/admin';

interface StateRuleManagerProps {
  stateRules: StateRule[];
  onAddRule: (rule: StateRule) => void;
  onDeleteRule: (id: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
}

const RULE_CATEGORIES = [
  'Public Adjuster Compliance',
  'Insurance Carrier Obligations', 
  'Legal Framework',
  'Construction Standards',
  'Professional Resources'
] as const;

const CONFIDENCE_LEVELS = ['Statutory', 'Regulatory', 'Advisory'] as const;

const SUBCATEGORIES = {
  'Public Adjuster Compliance': [
    'License Requirements',
    'Bond Requirements', 
    'Fee Caps & Structures',
    'Contract Requirements',
    'Contact Restrictions',
    'Record Keeping'
  ],
  'Insurance Carrier Obligations': [
    'Response Timeframes',
    'Payment Deadlines',
    'Check Naming Protocols',
    'Letter of Representation',
    'Investigation Requirements',
    'Communication Standards'
  ],
  'Legal Framework': [
    'Fee-Shifting Statutes',
    'Bad Faith Standards',
    'Statute of Limitations',
    'Multi-State Jurisdiction',
    'Discovery Rules',
    'Court Procedures'
  ],
  'Construction Standards': [
    'Matching Requirements',
    'Repair vs Replacement',
    'Code Upgrade Triggers',
    'Permit Requirements',
    'Building Department Rules',
    'Material Standards'
  ],
  'Professional Resources': [
    'State Associations',
    'Regulatory Contacts',
    'Training Requirements',
    'Industry Tools',
    'Certification Programs',
    'Networking Resources'
  ]
};

export const StateRuleManager: React.FC<StateRuleManagerProps> = ({
  stateRules,
  onAddRule,
  onDeleteRule,
  selectedState,
  onStateChange
}) => {
  const [newRule, setNewRule] = useState({
    category: '' as StateRule['category'],
    subcategory: '',
    rule: '',
    description: '',
    confidence: 'Regulatory' as StateRule['confidence'],
    sourceUrl: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: ''
  });

  const addStateRule = () => {
    if (!selectedState || !newRule.category || !newRule.subcategory || !newRule.rule) return;
    
    const rule: StateRule = {
      id: Date.now().toString(),
      state: selectedState,
      category: newRule.category,
      subcategory: newRule.subcategory,
      rule: newRule.rule,
      description: newRule.description,
      confidence: newRule.confidence,
      sourceUrl: newRule.sourceUrl || undefined,
      effectiveDate: newRule.effectiveDate,
      expirationDate: newRule.expirationDate || undefined,
      version: '1.0',
      lastUpdated: new Date().toISOString()
    };
    
    onAddRule(rule);
    setNewRule({
      category: '' as StateRule['category'],
      subcategory: '',
      rule: '',
      description: '',
      confidence: 'Regulatory',
      sourceUrl: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expirationDate: ''
    });
  };

  const getConfidenceBadgeColor = (confidence: StateRule['confidence']) => {
    switch (confidence) {
      case 'Statutory': return 'bg-green-100 text-green-800';
      case 'Regulatory': return 'bg-blue-100 text-blue-800';
      case 'Advisory': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (rule: StateRule) => {
    if (!rule.expirationDate) return false;
    const expirationDate = new Date(rule.expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New State Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newRule.category} onValueChange={(value) => setNewRule({...newRule, category: value as StateRule['category'], subcategory: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {RULE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select value={newRule.subcategory} onValueChange={(value) => setNewRule({...newRule, subcategory: value})} disabled={!newRule.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory..." />
                </SelectTrigger>
                <SelectContent>
                  {newRule.category && SUBCATEGORIES[newRule.category]?.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence">Confidence Level</Label>
              <Select value={newRule.confidence} onValueChange={(value) => setNewRule({...newRule, confidence: value as StateRule['confidence']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIDENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={newRule.effectiveDate}
                onChange={(e) => setNewRule({...newRule, effectiveDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="expirationDate">Expiration Date (optional)</Label>
              <Input
                id="expirationDate"
                type="date"
                value={newRule.expirationDate}
                onChange={(e) => setNewRule({...newRule, expirationDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sourceUrl">Source URL (optional)</Label>
            <Input
              id="sourceUrl"
              value={newRule.sourceUrl}
              onChange={(e) => setNewRule({...newRule, sourceUrl: e.target.value})}
              placeholder="https://insurance.ky.gov/..."
            />
          </div>

          <div>
            <Label htmlFor="rule">Rule Text</Label>
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
          <CardTitle>{selectedState || 'All States'} Compliance Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stateRules
              .filter(rule => !selectedState || rule.state === selectedState)
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{rule.state} - {rule.category}</h4>
                      <Badge className={getConfidenceBadgeColor(rule.confidence)}>
                        {rule.confidence}
                      </Badge>
                      {isExpiringSoon(rule) && (
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{rule.subcategory}</p>
                    <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{rule.rule}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Effective: {new Date(rule.effectiveDate).toLocaleDateString()}
                  </span>
                  {rule.expirationDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {new Date(rule.expirationDate).toLocaleDateString()}
                    </span>
                  )}
                  <span>v{rule.version}</span>
                  {rule.sourceUrl && (
                    <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
