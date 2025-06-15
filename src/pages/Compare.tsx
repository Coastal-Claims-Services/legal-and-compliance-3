import React, { useState } from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, MapPin, ArrowRight } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';

// Import rule data
import { KENTUCKY_RULES } from '../data/kentuckyRules';
import { floridaRules } from '../data/floridaRules';
import { texasRules } from '../data/texasRules';
import { hawaiiRules } from '../data/hawaiiRules';
import { georgiaRules } from '../data/georgiaRules';
import { alabamaRules } from '../data/alabamaRules';
import { delawareRules } from '../data/delawareRules';

const STATE_RULES = {
  'Kentucky': KENTUCKY_RULES,
  'Florida': floridaRules,
  'Texas': texasRules,
  'Hawaii': hawaiiRules,
  'Georgia': georgiaRules,
  'Alabama': alabamaRules,
  'Delaware': delawareRules,
};

const STATES = ['Kentucky', 'Florida', 'Texas', 'Hawaii', 'Georgia', 'Alabama', 'Delaware'];

const Compare = () => {
  const [selectedState1, setSelectedState1] = useState<string>('');
  const [selectedState2, setSelectedState2] = useState<string>('');

  const state1Rules = selectedState1 ? STATE_RULES[selectedState1 as keyof typeof STATE_RULES] || [] : [];
  const state2Rules = selectedState2 ? STATE_RULES[selectedState2 as keyof typeof STATE_RULES] || [] : [];

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'HIGH':
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'LOW':
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  const getComparisonStats = () => {
    if (!selectedState1 || !selectedState2) return null;

    const state1Categories = new Set(state1Rules.map(r => r.category));
    const state2Categories = new Set(state2Rules.map(r => r.category));
    const commonCategories = new Set([...state1Categories].filter(c => state2Categories.has(c)));

    return {
      state1RuleCount: state1Rules.length,
      state2RuleCount: state2Rules.length,
      state1Categories: state1Categories.size,
      state2Categories: state2Categories.size,
      commonCategories: commonCategories.size,
    };
  };

  const stats = getComparisonStats();

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1">
            <div className="container mx-auto py-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-4xl font-bold mb-2">State Comparison</h1>
                    <p className="text-xl text-muted-foreground">Compare compliance rules between states</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              {/* State Selection */}
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Select States to Compare
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Select value={selectedState1} onValueChange={setSelectedState1}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select first state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state} disabled={state === selectedState2}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      
                      <Select value={selectedState2} onValueChange={setSelectedState2}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select second state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state} disabled={state === selectedState1}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Stats */}
              {stats && (
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparison Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats.state1RuleCount}</div>
                          <div className="text-sm text-muted-foreground">{selectedState1} Rules</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats.commonCategories}</div>
                          <div className="text-sm text-muted-foreground">Common Categories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats.state2RuleCount}</div>
                          <div className="text-sm text-muted-foreground">{selectedState2} Rules</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Side by Side Comparison */}
              {selectedState1 && selectedState2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* State 1 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {selectedState1}
                      </CardTitle>
                      <p className="text-muted-foreground">{state1Rules.length} rules</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {state1Rules.map((rule) => (
                          <div key={rule.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium">Rule {rule.id}</span>
                              {getConfidenceBadge(rule.confidence)}
                            </div>
                            <Badge variant="outline" className="mb-2">{rule.category}</Badge>
                            <p className="text-sm text-muted-foreground">
                              {rule.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* State 2 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {selectedState2}
                      </CardTitle>
                      <p className="text-muted-foreground">{state2Rules.length} rules</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {state2Rules.map((rule) => (
                          <div key={rule.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium">Rule {rule.id}</span>
                              {getConfidenceBadge(rule.confidence)}
                            </div>
                            <Badge variant="outline" className="mb-2">{rule.category}</Badge>
                            <p className="text-sm text-muted-foreground">
                              {rule.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {(!selectedState1 || !selectedState2) && (
                <Card className="text-center py-12">
                  <CardContent>
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select states to compare</h3>
                    <p className="text-muted-foreground">Choose two states from the dropdown menus above to see a detailed comparison</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Compare;