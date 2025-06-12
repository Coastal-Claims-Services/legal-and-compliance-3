
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

const CONFIDENCE_LEVELS = ['HIGH', 'MEDIUM', 'LOW'] as const;

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
    text: '',
    confidence: 'MEDIUM' as StateRule['confidence'],
    sources: '',
    sunset: ''
  });

  const addStateRule = () => {
    if (!selectedState || !newRule.category || !newRule.subcategory || !newRule.text) return;
    
    const rule: StateRule = {
      id: Date.now().toString(),
      state: selectedState,
      rule_id: `${selectedState}-${newRule.category.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`,
      version: '1.0',
      last_updated: new Date().toISOString(),
      authority_level: 'REG',
      confidence: newRule.confidence,
      sunset: newRule.sunset || undefined,
      category: newRule.category,
      subcategory: newRule.subcategory,
      text: newRule.text,
      sources: newRule.sources.split('\n').filter(s => s.trim()),
      tests: []
    };
    
    onAddRule(rule);
    setNewRule({
      category: '' as StateRule['category'],
      subcategory: '',
      text: '',
      confidence: 'MEDIUM',
      sources: '',
      sunset: ''
    });
  };

  const getConfidenceBadgeColor = (confidence: StateRule['confidence']) => {
    switch (confidence) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (rule: StateRule) => {
    if (!rule.sunset) return false;
    const sunsetDate = new Date(rule.sunset);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return sunsetDate <= thirtyDaysFromNow;
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
          
          <div>
            <Label htmlFor="sunset">Sunset Date (optional)</Label>
            <Input
              id="sunset"
              type="date"
              value={newRule.sunset}
              onChange={(e) => setNewRule({...newRule, sunset: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="sources">Sources (one per line)</Label>
            <Textarea
              id="sources"
              value={newRule.sources}
              onChange={(e) => setNewRule({...newRule, sources: e.target.value})}
              placeholder="KRS 304.12-235(1)-(3)&#10;806 KAR 12:095 § 6(2)(d)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="text">Rule Text</Label>
            <Textarea
              id="text"
              value={newRule.text}
              onChange={(e) => setNewRule({...newRule, text: e.target.value})}
              placeholder="Enter the specific compliance rule or protocol..."
              rows={3}
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
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{rule.text}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated: {new Date(rule.last_updated).toLocaleDateString()}
                  </span>
                  {rule.sunset && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {new Date(rule.sunset).toLocaleDateString()}
                    </span>
                  )}
                  <span>v{rule.version}</span>
                  {rule.sources.length > 0 && (
                    <span>Sources: {rule.sources.length}</span>
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
