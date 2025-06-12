
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash, AlertTriangle, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { StateRule, RuleTest } from '../types/admin';

interface EnhancedStateRuleManagerProps {
  stateRules: StateRule[];
  onAddRule: (rule: StateRule) => void;
  onDeleteRule: (id: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
}

const AUTHORITY_LEVELS = ['STATUTE', 'REG', 'ADVISORY', 'CASE', 'AGENCY'] as const;
const CONFIDENCE_LEVELS = ['HIGH', 'MEDIUM', 'LOW'] as const;

const RULE_CATEGORIES = [
  'Public Adjuster Compliance',
  'Insurance Carrier Obligations', 
  'Legal Framework',
  'Construction Standards',
  'Professional Resources'
] as const;

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

export const EnhancedStateRuleManager: React.FC<EnhancedStateRuleManagerProps> = ({
  stateRules,
  onAddRule,
  onDeleteRule,
  selectedState,
  onStateChange
}) => {
  const [newRule, setNewRule] = useState({
    rule_id: '',
    category: '' as StateRule['category'],
    subcategory: '',
    text: '',
    authority_level: 'REG' as StateRule['authority_level'],
    confidence: 'MEDIUM' as StateRule['confidence'],
    sources: '',
    sunset: '',
    tests: ''
  });

  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedRuleTests, setSelectedRuleTests] = useState<RuleTest[]>([]);

  const addStateRule = () => {
    if (!selectedState || !newRule.category || !newRule.subcategory || !newRule.text || !newRule.rule_id) return;
    
    let parsedTests: RuleTest[] = [];
    if (newRule.tests.trim()) {
      try {
        parsedTests = JSON.parse(newRule.tests);
      } catch (e) {
        console.error('Invalid test JSON format');
        return;
      }
    }

    const rule: StateRule = {
      id: Date.now().toString(),
      state: selectedState,
      rule_id: newRule.rule_id,
      version: '1.0',
      last_updated: new Date().toISOString(),
      authority_level: newRule.authority_level,
      confidence: newRule.confidence,
      sunset: newRule.sunset || undefined,
      category: newRule.category,
      subcategory: newRule.subcategory,
      text: newRule.text,
      sources: newRule.sources.split('\n').filter(s => s.trim()),
      tests: parsedTests
    };
    
    onAddRule(rule);
    setNewRule({
      rule_id: '',
      category: '' as StateRule['category'],
      subcategory: '',
      text: '',
      authority_level: 'REG',
      confidence: 'MEDIUM',
      sources: '',
      sunset: '',
      tests: ''
    });
  };

  const getConfidenceBadgeColor = (confidence: StateRule['confidence']) => {
    switch (confidence) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthorityBadgeColor = (authority: StateRule['authority_level']) => {
    switch (authority) {
      case 'STATUTE': return 'bg-blue-100 text-blue-800';
      case 'REG': return 'bg-purple-100 text-purple-800';
      case 'CASE': return 'bg-orange-100 text-orange-800';
      case 'ADVISORY': return 'bg-gray-100 text-gray-800';
      case 'AGENCY': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (rule: StateRule) => {
    if (!rule.sunset) return false;
    const sunsetDate = new Date(rule.sunset);
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
    return sunsetDate <= sixtyDaysFromNow;
  };

  const showTests = (tests: RuleTest[]) => {
    setSelectedRuleTests(tests);
    setShowTestDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New State Rule (YAML Schema)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule_id">Rule ID</Label>
              <Input
                id="rule_id"
                value={newRule.rule_id}
                onChange={(e) => setNewRule({...newRule, rule_id: e.target.value})}
                placeholder="KY-PUBADJ-FEES-001"
              />
            </div>
            <div>
              <Label htmlFor="authority_level">Authority Level</Label>
              <Select value={newRule.authority_level} onValueChange={(value) => setNewRule({...newRule, authority_level: value as StateRule['authority_level']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTHORITY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="tests">Tests (JSON format, optional)</Label>
            <Textarea
              id="tests"
              value={newRule.tests}
              onChange={(e) => setNewRule({...newRule, tests: e.target.value})}
              placeholder='[{"given": {"fee_pct": 18, "cat": false}, "expect": "FAIL"}]'
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
          <CardTitle>{selectedState || 'All States'} Compliance Rules (Enhanced)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stateRules
              .filter(rule => !selectedState || rule.state === selectedState)
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{rule.rule_id}</h4>
                      <Badge className={getAuthorityBadgeColor(rule.authority_level)}>
                        {rule.authority_level}
                      </Badge>
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
                    <p className="text-sm font-medium text-muted-foreground">{rule.state} - {rule.category} - {rule.subcategory}</p>
                    <p className="text-sm mt-2">{rule.text}</p>
                    
                    {rule.sources.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Sources:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {rule.sources.map((source, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {rule.tests.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showTests(rule.tests)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Tests ({rule.tests.length})
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteRule(rule.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    v{rule.version}
                  </span>
                  <span>Updated: {new Date(rule.last_updated).toLocaleDateString()}</span>
                  {rule.sunset && (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Sunset: {new Date(rule.sunset).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rule Tests</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedRuleTests.map((test, idx) => (
              <div key={idx} className="border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Test {idx + 1}</span>
                  <Badge variant={test.expect.includes('FAIL') ? 'destructive' : 'default'}>
                    {test.expect}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Given:</span> {JSON.stringify(test.given)}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
