import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { StateSiloChat } from '../components/compliance-legal-3/StateSiloChat';
import { PromptEngineeringWorkshop } from '../components/compliance-legal-3/PromptEngineeringWorkshop';
import { HallucinationDetector } from '../components/compliance-legal-3/ai-HallucinationDetector';
import { AIGlossary } from '../components/compliance-legal-3/ai-AIGlossary';
import { useToast } from '../components/ui/use-toast';
import {
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Search,
  Building2,
  ChevronRight,
  Home,
  MapPin,
  BarChart3,
  Settings,
  FileBarChart,
  Trash2,
  Eye,
  Plus,
  Construction,
  MessageCircle,
  XCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Code2,
  Zap,
  Save,
  Loader2,
  Users,
  Award,
  Clock,
  FileCheck
} from 'lucide-react';

type ViewMode = 'admin' | 'reports' | 'coastal-admin' | 'dashboard' | 'states' | 'search' | 'compare' | 'employees' | 'company';

interface ComplianceRule {
  _id?: string;
  ruleId: string;
  state: string;
  silo: 'public_adjusting' | 'construction' | 'insurance_carrier' | 'legal';
  authority: 'REG' | 'STATUTE' | 'CASE' | 'ADVISORY';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  subcategory?: string;
  ruleText: string;
  sources: string[];
  leveragePoints?: string[];
  version: string;
  sunsetDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ComplianceTemplate {
  _id?: string;
  category: string;
  template: string;
  variables: string[];
}

interface ComplianceAlert {
  _id?: string;
  ruleId: string;
  state: string;
  confidence: string;
  description: string;
  category: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface StateInfo {
  code: string;
  name: string;
  status: 'active' | 'prohibited' | 'pending';
  requiresLicense?: boolean;
  licenseFee?: number;
  bondAmount?: number;
}

interface License {
  _id: string;
  name: string;
  type: string;
  licenseNumber: string;
  state: string;
  issuedDate: string;
  expiresDate: string;
  isActive: boolean;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
}

interface Bond {
  _id: string;
  name: string;
  bondNumber: string;
  state: string;
  amount: number;
  issuedDate: string;
  expiresDate: string;
  isActive: boolean;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
}

const ComplianceLegalHub = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('coastal-admin');
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [templates, setTemplates] = useState<ComplianceTemplate[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('ALL');

  // Form states
  const [newRule, setNewRule] = useState({
    ruleId: '',
    state: '',
    silo: 'public_adjusting' as const,
    authority: 'REG' as const,
    category: '',
    subcategory: '',
    confidence: 'MEDIUM' as const,
    sunsetDate: '',
    sources: '',
    ruleText: '',
    leveragePoints: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    category: '',
    template: '',
    variables: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    botName: 'Legal Compliance Assistant',
    updateFrequency: 'daily',
    minConfidence: 'MEDIUM'
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchRules();
    fetchTemplates();
    fetchAlerts();
    fetchStates();
    fetchLicenses();
    fetchBonds();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/compliance/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/compliance/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/compliance/alerts?status=pending');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/compliance/states');
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/licenses');
      if (response.ok) {
        const data = await response.json();
        setLicenses(data);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    }
  };

  const fetchBonds = async () => {
    try {
      const response = await fetch('/api/bonds');
      if (response.ok) {
        const data = await response.json();
        setBonds(data);
      }
    } catch (error) {
      console.error('Error fetching bonds:', error);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.ruleId || !newRule.state || !newRule.ruleText || !newRule.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const rule = {
        ...newRule,
        sources: newRule.sources.split('\n').filter(s => s.trim()),
        leveragePoints: newRule.leveragePoints ? newRule.leveragePoints.split('\n').filter(l => l.trim()) : [],
        version: '1.0.0'
      };

      const response = await fetch('/api/compliance/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rule added successfully"
        });
        await fetchRules();
        // Reset form
        setNewRule({
          ruleId: '',
          state: '',
          silo: 'public_adjusting',
          authority: 'REG',
          category: '',
          subcategory: '',
          confidence: 'MEDIUM',
          sunsetDate: '',
          sources: '',
          ruleText: '',
          leveragePoints: ''
        });
      } else {
        throw new Error('Failed to add rule');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add rule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const response = await fetch(`/api/compliance/rules/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Rule deleted successfully"
        });
        await fetchRules();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive"
      });
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.category || !newTemplate.template || !newTemplate.variables) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const template = {
        ...newTemplate,
        variables: newTemplate.variables.split(',').map(v => v.trim())
      };

      const response = await fetch('/api/compliance/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template added successfully"
        });
        await fetchTemplates();
        setNewTemplate({ category: '', template: '', variables: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/compliance/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Alert resolved"
        });
        await fetchAlerts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive"
      });
    }
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-64 bg-[#0f1823] border-r border-gray-800 h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Scale className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-white">Legal Hub</h1>
        </div>

        <nav className="space-y-1">
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Compliance Tracking</p>
            <Button
              variant={viewMode === 'dashboard' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'dashboard' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={viewMode === 'employees' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'employees' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('employees')}
            >
              <Users className="w-4 h-4 mr-2" />
              Employee Compliance
            </Button>
            <Button
              variant={viewMode === 'company' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'company' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('company')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Company Compliance
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Legal Resources</p>
            <Button
              variant={viewMode === 'states' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'states' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('states')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              States
            </Button>
            <Button
              variant={viewMode === 'search' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'search' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('search')}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Rules
            </Button>
            <Button
              variant={viewMode === 'compare' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'compare' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('compare')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare States
            </Button>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Administration</p>
            <Button
              variant={viewMode === 'coastal-admin' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'coastal-admin' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('coastal-admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Coastal Admin
            </Button>
            <Button
              variant={viewMode === 'admin' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'admin' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('admin')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Details
            </Button>
            <Button
              variant={viewMode === 'reports' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${viewMode === 'reports' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'}`}
              onClick={() => setViewMode('reports')}
            >
              <FileBarChart className="w-4 h-4 mr-2" />
              System Reports
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );

  // Admin Details View
  const AdminDetailsView = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Compliance & Legal Hub</h2>

      {/* System Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Connected</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">MongoDB Atlas</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Online</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Response: 42ms</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-semibold">{rules.length}</p>
            <p className="text-xs text-gray-500 mt-1">Compliance rules</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">System Version</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-semibold">v4.0.0</p>
            <p className="text-xs text-gray-500 mt-1">Unified system</p>
          </CardContent>
        </Card>
      </div>

      {/* Core System Settings */}
      <Card className="bg-[#0f1823] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Core System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <div>
              <p className="text-white font-medium">Auto-sync rules</p>
              <p className="text-xs text-gray-500">Automatically sync state rules every 24 hours</p>
            </div>
            <Button variant="outline" size="sm" className="text-green-400 border-green-600">
              Enabled
            </Button>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <div>
              <p className="text-white font-medium">AI Model</p>
              <p className="text-xs text-gray-500">GPT-4 Turbo with context awareness</p>
            </div>
            <Select defaultValue="advanced">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <div>
              <p className="text-white font-medium">Data retention</p>
              <p className="text-xs text-gray-500">Chat history and user queries retention period</p>
            </div>
            <Select defaultValue="90">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Maintenance mode</p>
              <p className="text-xs text-gray-500">Disable user access for system maintenance</p>
            </div>
            <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
              Disabled
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Coastal Claims Admin View
  const CoastalAdminView = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Coastal Claims Admin</h2>
        <p className="text-gray-400">Enhanced Compliance Rules & AI Management System</p>
      </div>

      {/* Compliance Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-[#0f1823] border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert._id} className="bg-gray-900 border-gray-700">
                <AlertDescription className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600/20 text-purple-400">{alert.state}</Badge>
                      <Badge className={alert.confidence === 'HIGH'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-yellow-600/20 text-yellow-400'}>
                        {alert.confidence}
                      </Badge>
                      <span className="text-xs text-gray-500 font-mono">{alert.ruleId}</span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.description}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => alert._id && handleResolveAlert(alert._id)}
                  >
                    Resolve
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats Bar */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Total Rules:</span>
          <Badge className="bg-gray-700">{rules.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">High Confidence:</span>
          <Badge className="bg-blue-600/20 text-blue-400">
            {rules.filter(r => r.confidence === 'HIGH').length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">States Covered:</span>
          <Badge className="bg-green-600/20 text-green-400">
            {states.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Templates:</span>
          <Badge className="bg-purple-600/20 text-purple-400">{templates.length}</Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0f1823] border-gray-700">
          <TabsTrigger value="rules" className="text-gray-400 data-[state=active]:text-white">
            State Rules
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-gray-400 data-[state=active]:text-white">
            Response Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-gray-400 data-[state=active]:text-white">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* State Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          {/* Add New Rule Form */}
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Add New State Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Rule ID</Label>
                  <Input
                    placeholder="XX-PUBADJ-FEES-001"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={newRule.ruleId}
                    onChange={(e) => setNewRule({...newRule, ruleId: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-gray-400">State Code</Label>
                  <Input
                    placeholder="FL"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={newRule.state}
                    onChange={(e) => setNewRule({...newRule, state: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Silo</Label>
                  <Select value={newRule.silo} onValueChange={(v: any) => setNewRule({...newRule, silo: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public_adjusting">Public Adjusting</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="insurance_carrier">Insurance Carrier</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Authority Level</Label>
                  <Select value={newRule.authority} onValueChange={(v: any) => setNewRule({...newRule, authority: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REG">REG</SelectItem>
                      <SelectItem value="STATUTE">STATUTE</SelectItem>
                      <SelectItem value="CASE">CASE</SelectItem>
                      <SelectItem value="ADVISORY">ADVISORY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-400">Confidence Level</Label>
                  <Select value={newRule.confidence} onValueChange={(v: any) => setNewRule({...newRule, confidence: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="LOW">LOW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-400">Sunset Date</Label>
                  <Input
                    type="date"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={newRule.sunsetDate}
                    onChange={(e) => setNewRule({...newRule, sunsetDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Category</Label>
                  <Input
                    placeholder="Public Adjusting"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={newRule.category}
                    onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Subcategory</Label>
                  <Input
                    placeholder="Licensing"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={newRule.subcategory}
                    onChange={(e) => setNewRule({...newRule, subcategory: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-400">Sources (one per line)</Label>
                <Textarea
                  placeholder="KRS 304.14-270&#10;DOI Bulletin 2023-05"
                  className="bg-gray-800 border-gray-700 text-white h-20"
                  value={newRule.sources}
                  onChange={(e) => setNewRule({...newRule, sources: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-gray-400">Leverage Points (one per line)</Label>
                <Textarea
                  placeholder="Required for all PA work&#10;Violation = criminal offense"
                  className="bg-gray-800 border-gray-700 text-white h-20"
                  value={newRule.leveragePoints}
                  onChange={(e) => setNewRule({...newRule, leveragePoints: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-gray-400">Rule Text</Label>
                <Textarea
                  placeholder="Enter the complete rule text..."
                  className="bg-gray-800 border-gray-700 text-white h-24"
                  value={newRule.ruleText}
                  onChange={(e) => setNewRule({...newRule, ruleText: e.target.value})}
                />
              </div>

              <Button onClick={handleAddRule} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Rule
              </Button>
            </CardContent>
          </Card>

          {/* All States Compliance Rules */}
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">All States Compliance Rules ({rules.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <Card key={rule._id} className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-500">{rule.ruleId}</span>
                            <Badge className="bg-purple-600/20 text-purple-400">{rule.state}</Badge>
                            <Badge className={
                              rule.authority === 'REG' ? 'bg-green-600/20 text-green-400' :
                              rule.authority === 'STATUTE' ? 'bg-blue-600/20 text-blue-400' :
                              rule.authority === 'CASE' ? 'bg-purple-600/20 text-purple-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }>
                              {rule.authority}
                            </Badge>
                            <Badge className={
                              rule.confidence === 'HIGH' ? 'bg-blue-600/20 text-blue-400' :
                              rule.confidence === 'LOW' ? 'bg-red-600/20 text-red-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }>
                              {rule.confidence}
                            </Badge>
                            <Badge className="bg-gray-700 text-gray-300">
                              {rule.silo.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-gray-700"
                            onClick={() => rule._id && handleDeleteRule(rule._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="mb-2">
                          <span className="text-xs text-gray-500">{rule.category}</span>
                          {rule.subcategory && <span className="text-xs text-gray-500"> / {rule.subcategory}</span>}
                        </div>

                        <p className="text-sm text-gray-300 mb-3">{rule.ruleText}</p>

                        {rule.leveragePoints && rule.leveragePoints.length > 0 && (
                          <div className="mb-3 p-2 bg-gray-800 rounded">
                            <p className="text-xs text-gray-500 mb-1">Leverage Points:</p>
                            <ul className="list-disc list-inside text-xs text-gray-400">
                              {rule.leveragePoints.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Sources: {rule.sources.join(', ')}</span>
                          <div className="flex items-center gap-3">
                            <span>v{rule.version}</span>
                            {rule.sunsetDate && <span className="text-yellow-500">Expires: {new Date(rule.sunsetDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {rules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No rules found. Add your first rule above.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Add Response Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Category</Label>
                <Input
                  placeholder="Public Adjusting"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-400">Template</Label>
                <Textarea
                  placeholder="Use {{variable}} for dynamic content"
                  className="bg-gray-800 border-gray-700 text-white h-24"
                  value={newTemplate.template}
                  onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-gray-400">Variables (comma separated)</Label>
                <Input
                  placeholder="state, requirement, source"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTemplate.variables}
                  onChange={(e) => setNewTemplate({...newTemplate, variables: e.target.value})}
                />
              </div>
              <Button onClick={handleAddTemplate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Template
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Response Templates ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card key={template._id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-purple-600/20 text-purple-400">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2 font-mono">{template.template}</p>
                      <div className="flex gap-2">
                        {template.variables.map((v) => (
                          <Badge key={v} className="bg-gray-700 text-gray-300 text-xs">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {templates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No templates found. Add your first template above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Bot Name</Label>
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  value={systemSettings.botName}
                  onChange={(e) => setSystemSettings({...systemSettings, botName: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-gray-400">Rule Update Frequency</Label>
                <Select value={systemSettings.updateFrequency}
                        onValueChange={(v) => setSystemSettings({...systemSettings, updateFrequency: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400">Minimum Confidence Level</Label>
                <Select value={systemSettings.minConfidence}
                        onValueChange={(v) => setSystemSettings({...systemSettings, minConfidence: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">HIGH</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="LOW">LOW</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Dashboard, States, Search, Compare, and Reports views would follow similar patterns
  // Placeholder implementations:
  const DashboardView = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Legal Compliance Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Active States</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{states.length}</p>
            <p className="text-xs text-gray-500">Licensed jurisdictions</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{rules.length}</p>
            <p className="text-xs text-gray-500">Across all states</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">High Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">{rules.filter(r => r.confidence === 'HIGH').length}</p>
            <p className="text-xs text-gray-500">Quality rules</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f1823] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400">{alerts.length}</p>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Employee Compliance View
  const EmployeeComplianceView = () => {
    const getExpirationStatus = (expiresDate: string) => {
      const daysUntilExpiration = Math.floor((new Date(expiresDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiration < 0) return 'expired';
      if (daysUntilExpiration <= 30) return 'expiring-soon';
      if (daysUntilExpiration <= 90) return 'expiring-warning';
      return 'active';
    };

    const filteredLicenses = selectedState === 'ALL' ? licenses : licenses.filter(l => l.state === selectedState);
    const filteredBonds = selectedState === 'ALL' ? bonds : bonds.filter(b => b.state === selectedState);

    // Group by employee
    const employeeMap = new Map<string, { name: string, licenses: License[], bonds: Bond[] }>();
    filteredLicenses.forEach(license => {
      const key = license.assignedTo._id;
      if (!employeeMap.has(key)) {
        employeeMap.set(key, {
          name: `${license.assignedTo.firstName} ${license.assignedTo.lastName}`,
          licenses: [],
          bonds: []
        });
      }
      employeeMap.get(key)!.licenses.push(license);
    });
    filteredBonds.forEach(bond => {
      const key = bond.assignedTo._id;
      if (!employeeMap.has(key)) {
        employeeMap.set(key, {
          name: `${bond.assignedTo.firstName} ${bond.assignedTo.lastName}`,
          licenses: [],
          bonds: []
        });
      }
      employeeMap.get(key)!.bonds.push(bond);
    });

    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Employee Compliance Tracking</h2>
            <p className="text-gray-400">Track licenses, bonds, and certifications by employee and state</p>
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{employeeMap.size}</p>
              <p className="text-xs text-gray-500">With compliance records</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Active Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">{filteredLicenses.filter(l => l.isActive).length}</p>
              <p className="text-xs text-gray-500">Currently valid</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-400">
                {filteredLicenses.filter(l => getExpirationStatus(l.expiresDate) === 'expiring-soon').length}
              </p>
              <p className="text-xs text-gray-500">Within 30 days</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0f1823] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-400">
                {filteredLicenses.filter(l => getExpirationStatus(l.expiresDate) === 'expired').length}
              </p>
              <p className="text-xs text-gray-500">Requires renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee Compliance Cards */}
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-4">
            {Array.from(employeeMap.entries()).map(([id, employee]) => (
              <Card key={id} className="bg-[#0f1823] border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {employee.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-400">
                        {employee.licenses.length} Licenses
                      </Badge>
                      <Badge className="bg-purple-600/20 text-purple-400">
                        {employee.bonds.length} Bonds
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="licenses" className="w-full">
                    <TabsList className="bg-gray-800 border-gray-700">
                      <TabsTrigger value="licenses" className="text-gray-400 data-[state=active]:text-white">
                        Licenses ({employee.licenses.length})
                      </TabsTrigger>
                      <TabsTrigger value="bonds" className="text-gray-400 data-[state=active]:text-white">
                        Bonds ({employee.bonds.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="licenses" className="space-y-3 mt-4">
                      {employee.licenses.map(license => {
                        const status = getExpirationStatus(license.expiresDate);
                        return (
                          <div key={license._id} className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-medium">{license.name}</p>
                                <p className="text-xs text-gray-500">{license.type} - {license.licenseNumber}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className="bg-purple-600/20 text-purple-400">{license.state}</Badge>
                                {status === 'expired' && <Badge className="bg-red-600/20 text-red-400">Expired</Badge>}
                                {status === 'expiring-soon' && <Badge className="bg-yellow-600/20 text-yellow-400">Expiring Soon</Badge>}
                                {status === 'active' && <Badge className="bg-green-600/20 text-green-400">Active</Badge>}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Issued: {new Date(license.issuedDate).toLocaleDateString()}</span>
                              <span>Expires: {new Date(license.expiresDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                      {employee.licenses.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No licenses found</p>
                      )}
                    </TabsContent>

                    <TabsContent value="bonds" className="space-y-3 mt-4">
                      {employee.bonds.map(bond => {
                        const status = getExpirationStatus(bond.expiresDate);
                        return (
                          <div key={bond._id} className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-medium">{bond.name}</p>
                                <p className="text-xs text-gray-500">{bond.bondNumber} - ${bond.amount.toLocaleString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className="bg-purple-600/20 text-purple-400">{bond.state}</Badge>
                                {status === 'expired' && <Badge className="bg-red-600/20 text-red-400">Expired</Badge>}
                                {status === 'expiring-soon' && <Badge className="bg-yellow-600/20 text-yellow-400">Expiring Soon</Badge>}
                                {status === 'active' && <Badge className="bg-green-600/20 text-green-400">Active</Badge>}
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Issued: {new Date(bond.issuedDate).toLocaleDateString()}</span>
                              <span>Expires: {new Date(bond.expiresDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                      {employee.bonds.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No bonds found</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
            {employeeMap.size === 0 && (
              <Card className="bg-[#0f1823] border-gray-800">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No employee compliance records found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Company Compliance View
  const CompanyComplianceView = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Company Compliance (CCS Corporate)</h2>
      <Card className="bg-[#0f1823] border-gray-800">
        <CardContent className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Company-level compliance tracking coming soon</p>
          <p className="text-sm text-gray-500">Track CCS corporate licenses, bonds, and registrations by state</p>
        </CardContent>
      </Card>
    </div>
  );

  const StatesView = () => <div className="p-6"><h2 className="text-3xl font-bold text-white">States View - Coming Soon</h2></div>;
  const SearchRulesView = () => <div className="p-6"><h2 className="text-3xl font-bold text-white">Search Rules - Coming Soon</h2></div>;
  const CompareStatesView = () => <div className="p-6"><h2 className="text-3xl font-bold text-white">Compare States - Coming Soon</h2></div>;
  const SystemReportsView = () => <div className="p-6"><h2 className="text-3xl font-bold text-white">System Reports - Coming Soon</h2></div>;

  return (
    <div className="flex h-screen bg-[#1a2332]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {viewMode === 'dashboard' && <DashboardView />}
        {viewMode === 'employees' && <EmployeeComplianceView />}
        {viewMode === 'company' && <CompanyComplianceView />}
        {viewMode === 'states' && <StatesView />}
        {viewMode === 'search' && <SearchRulesView />}
        {viewMode === 'compare' && <CompareStatesView />}
        {viewMode === 'admin' && <AdminDetailsView />}
        {viewMode === 'coastal-admin' && <CoastalAdminView />}
        {viewMode === 'reports' && <SystemReportsView />}
      </div>
    </div>
  );
};

export default ComplianceLegalHub;
