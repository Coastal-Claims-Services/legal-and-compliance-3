import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Construction, Shield, Scale, MessageCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StateSiloChat } from '@/components/StateSiloChat';

const STATES = [
  { code: 'AL', name: 'Alabama', status: 'prohibited' },
  { code: 'FL', name: 'Florida', status: 'active' },
  { code: 'TX', name: 'Texas', status: 'active' },
  { code: 'GA', name: 'Georgia', status: 'active' },
  { code: 'NC', name: 'North Carolina', status: 'pending' },
];

const SILOS = [
  {
    id: 'public_adjusting',
    name: 'Public Adjusting',
    icon: Building2,
    description: 'Laws & rules for public adjusters',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: Construction,
    description: 'Building codes & contractor leverage',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
  },
  {
    id: 'insurance_carrier',
    name: 'Insurance Carrier',
    icon: Shield,
    description: 'Carrier obligations & breach detection',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  },
  {
    id: 'legal',
    name: 'Legal Resources',
    icon: Scale,
    description: 'Attorney resources & fee shifting',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  }
];

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

const States = () => {
  const [selectedState, setSelectedState] = useState<string>('FL');
  const [selectedSilo, setSelectedSilo] = useState<string>('public_adjusting');
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStateRules();
  }, [selectedState]);

  const fetchStateRules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('state_rules')
      .select('*')
      .eq('state', selectedState)
      .eq('is_active', true)
      .order('silo', { ascending: true })
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching state rules:', error);
    } else {
      setStateRules(data || []);
    }
    setLoading(false);
  };

  const getStateStatus = (stateCode: string) => {
    const state = STATES.find(s => s.code === stateCode);
    return state?.status || 'unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'prohibited': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active - PA Licensed';
      case 'prohibited': return 'Prohibited - No PA License';
      case 'pending': return 'Pending - License Review';
      default: return 'Unknown Status';
    }
  };

  const getRulesForSilo = (siloId: string) => {
    return stateRules.filter(rule => rule.silo === siloId);
  };

  const selectedStateData = STATES.find(s => s.code === selectedState);

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
                    <h1 className="text-4xl font-bold">State Legal Resources</h1>
                    <p className="text-xl text-muted-foreground">4-Silo Knowledge Base per State</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* State Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(state.status)}
                            {state.name} ({state.code})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedStateData && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getStatusIcon(selectedStateData.status)}
                      {getStatusText(selectedStateData.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* 4-Silo Tabs */}
              <Tabs value={selectedSilo} onValueChange={setSelectedSilo} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  {SILOS.map((silo) => {
                    const Icon = silo.icon;
                    const siloRules = getRulesForSilo(silo.id);
                    return (
                      <TabsTrigger key={silo.id} value={silo.id} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {silo.name}
                        {siloRules.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {siloRules.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {SILOS.map((silo) => {
                  const Icon = silo.icon;
                  const siloRules = getRulesForSilo(silo.id);
                  
                  return (
                    <TabsContent key={silo.id} value={silo.id} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Knowledge Base */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {selectedStateData?.name} - {silo.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{silo.description}</p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {loading ? (
                              <div className="space-y-3">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                              </div>
                            ) : siloRules.length > 0 ? (
                              siloRules.map((rule) => (
                                <div key={rule.id} className="border rounded-lg p-4 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm">{rule.category}</h4>
                                      {rule.subcategory && (
                                        <p className="text-xs text-muted-foreground">{rule.subcategory}</p>
                                      )}
                                    </div>
                                    <Badge className={silo.color}>
                                      {rule.confidence}
                                    </Badge>
                                  </div>
                                  <p className="text-sm">{rule.rule_text}</p>
                                  
                                  {rule.leverage_points && rule.leverage_points.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-muted-foreground mb-1">Leverage Points:</p>
                                      <ul className="list-disc list-inside text-xs space-y-1">
                                        {rule.leverage_points.map((point, index) => (
                                          <li key={index} className="text-muted-foreground">{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {rule.sources && rule.sources.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Sources: {rule.sources.join(', ')}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                  No {silo.name.toLowerCase()} rules available for {selectedStateData?.name}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Use the chat to ask questions and get AI-powered insights
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* AI Chat */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MessageCircle className="h-5 w-5" />
                              Ask AI Assistant
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Get instant answers about {silo.name.toLowerCase()} in {selectedStateData?.name}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <StateSiloChat 
                              state={selectedState}
                              silo={silo.id}
                              siloName={silo.name}
                              stateName={selectedStateData?.name || selectedState}
                              rules={siloRules}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default States;
