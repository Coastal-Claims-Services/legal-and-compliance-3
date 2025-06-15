import React, { useState, useMemo } from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Filter, BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';

// Import rule data
import { KENTUCKY_RULES } from '../data/kentuckyRules';
import { floridaRules } from '../data/floridaRules';
import { texasRules } from '../data/texasRules';
import { hawaiiRules } from '../data/hawaiiRules';
import { georgiaRules } from '../data/georgiaRules';
import { alabamaRules } from '../data/alabamaRules';

// Combine all rules with state information
const ALL_RULES = [
  ...KENTUCKY_RULES.map(rule => ({ ...rule, state: 'Kentucky' })),
  ...floridaRules.map(rule => ({ ...rule, state: 'Florida' })),
  ...texasRules.map(rule => ({ ...rule, state: 'Texas' })),
  ...hawaiiRules.map(rule => ({ ...rule, state: 'Hawaii' })),
  ...georgiaRules.map(rule => ({ ...rule, state: 'Georgia' })),
  ...alabamaRules.map(rule => ({ ...rule, state: 'Alabama' })),
];

const CATEGORIES = [
  'All Categories',
  'Public Adjuster Compliance',
  'Carrier Obligations',
  'Legal Framework',
  'Licensing Requirements',
  'Fee Regulations',
  'Documentation Requirements',
  'Disciplinary Actions'
];

const STATES = ['All States', 'Kentucky', 'Florida', 'Texas', 'Hawaii', 'Georgia', 'Alabama'];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedState, setSelectedState] = useState('All States');
  const [confidenceFilter, setConfidenceFilter] = useState('All');

  const filteredRules = useMemo(() => {
    return ALL_RULES.filter(rule => {
      const matchesSearch = searchTerm === '' || 
        rule.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.sources.some(source => source.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All Categories' || 
        rule.category === selectedCategory;

      const matchesState = selectedState === 'All States' || 
        rule.state === selectedState;

      const matchesConfidence = confidenceFilter === 'All' || 
        rule.confidence === confidenceFilter;

      return matchesSearch && matchesCategory && matchesState && matchesConfidence;
    });
  }, [searchTerm, selectedCategory, selectedState, confidenceFilter]);

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
                    <h1 className="text-4xl font-bold mb-2">Rule Search</h1>
                    <p className="text-xl text-muted-foreground">Search across all state compliance rules</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search rules, descriptions, sources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Confidence Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Confidence</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All Categories');
                      setSelectedState('All States');
                      setConfidenceFilter('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4">
                <p className="text-muted-foreground">
                  Found {filteredRules.length} rule{filteredRules.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {filteredRules.map((rule) => (
                  <Card key={`${rule.state}-${rule.id}`} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">Rule {rule.id}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{rule.state}</span>
                            <Badge variant="outline">{rule.category}</Badge>
                            {getConfidenceBadge(rule.confidence)}
                          </div>
                        </div>
                        <Link to={`/admin/details?state=${rule.state}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">
                        {rule.text}
                      </p>
                      {rule.sources.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Sources: </span>
                          <span className="text-muted-foreground">{rule.sources.join(', ')}</span>
                        </div>
                      )}
                      {rule.sunset && (
                        <div className="text-sm mt-1">
                          <span className="font-medium">Sunset Date: </span>
                          <span className="text-muted-foreground">{rule.sunset}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredRules.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No rules found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
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

export default Search;