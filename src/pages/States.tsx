import React, { useState } from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, AlertTriangle, FileText, Settings, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PinProtection } from '../components/PinProtection';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Mock data for demonstration - this would come from your backend
const STATE_DATA = {
  'Kentucky': {
    rules: 23,
    alerts: 2,
    lastUpdated: '2024-01-10',
    status: 'active',
    compliance: 'good'
  },
  'Florida': {
    rules: 19,
    alerts: 1,
    lastUpdated: '2025-06-13',
    status: 'active',
    compliance: 'good'
  },
  'Hawaii': {
    rules: 8,
    alerts: 0,
    lastUpdated: '2025-06-13',
    status: 'active',
    compliance: 'good'
  },
  'Texas': {
    rules: 12,
    alerts: 0,
    lastUpdated: '2025-06-13',
    status: 'active',
    compliance: 'good'
  },
  'California': {
    rules: 12,
    alerts: 0,
    lastUpdated: '2024-01-05',
    status: 'active',
    compliance: 'good'
  },
  'Georgia': {
    rules: 11,
    alerts: 0,
    lastUpdated: '2025-06-13',
    status: 'active',
    compliance: 'good'
  },
  'Alabama': {
    rules: 8,
    alerts: 1,
    lastUpdated: '2025-06-13',
    status: 'inactive',
    compliance: 'warning'
  }
};

const States = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'rules' | 'configure'; state: string } | null>(null);
  const navigate = useNavigate();

  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateData = (state: string) => {
    return STATE_DATA[state as keyof typeof STATE_DATA] || {
      rules: 0,
      alerts: 0,
      lastUpdated: null,
      status: 'inactive',
      compliance: 'none'
    };
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="outline">Not Configured</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      : <Badge variant="outline">Inactive</Badge>;
  };

  const handleProtectedAction = (type: 'rules' | 'configure', state: string) => {
    setPendingAction({ type, state });
    setShowPinDialog(true);
  };

  const handlePinSuccess = () => {
    if (pendingAction) {
      if (pendingAction.type === 'rules') {
        navigate(`/admin?state=${pendingAction.state}`);
      } else {
        navigate(`/admin?state=${pendingAction.state}&tab=settings`);
      }
    }
    setShowPinDialog(false);
    setPendingAction(null);
  };

  const handlePinClose = () => {
    setShowPinDialog(false);
    setPendingAction(null);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link to="/admin/details">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Admin Details
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold mb-2">State Management</h1>
                <p className="text-xl text-muted-foreground">Configure compliance rules for all states</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStates.map((state) => {
              const stateData = getStateData(state);
              return (
                <Card key={state} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {state}
                      </CardTitle>
                      {getStatusBadge(stateData.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rules:</span>
                        <div className="font-semibold">{stateData.rules}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Alerts:</span>
                        <div className="font-semibold flex items-center gap-1">
                          {stateData.alerts}
                          {stateData.alerts > 0 && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Compliance Status:</span>
                      <div className="mt-1">{getComplianceBadge(stateData.compliance)}</div>
                    </div>

                    {stateData.lastUpdated && (
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(stateData.lastUpdated).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 flex items-center gap-2"
                        onClick={() => handleProtectedAction('rules', state)}
                      >
                        <FileText className="h-3 w-3" />
                        Manage Rules
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 flex items-center gap-2"
                        onClick={() => handleProtectedAction('configure', state)}
                      >
                        <Settings className="h-3 w-3" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredStates.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No states found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </CardContent>
            </Card>
          )}
        </div>

        <PinProtection
          isOpen={showPinDialog}
          onClose={handlePinClose}
          onSuccess={handlePinSuccess}
          title="Admin Access Required"
        />
      </div>
    </ThemeProvider>
  );
};

export default States;
