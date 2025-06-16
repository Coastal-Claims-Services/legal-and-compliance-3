
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, Users, Database } from "lucide-react";

const Reports = () => {
  const reportMetrics = [
    {
      title: "Total Rules",
      value: "2,847",
      description: "Across all states and silos",
      icon: Database,
      trend: "+12% from last month"
    },
    {
      title: "Active Users",
      value: "143",
      description: "Monthly active users",
      icon: Users,
      trend: "+8% from last month"
    },
    {
      title: "Search Queries", 
      value: "1,239",
      description: "Total searches this month",
      icon: BarChart3,
      trend: "+23% from last month"
    },
    {
      title: "Content Updates",
      value: "67",
      description: "Rules updated this month",
      icon: FileText,
      trend: "+5% from last month"
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">System Reports</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportMetrics.map((metric) => (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Florida PA rules updated - 15 new regulations added</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Texas Construction silo - 8 rules modified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Alabama status updated - PA still prohibited</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">New user registrations - 12 this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Searched States</CardTitle>
                <CardDescription>Most frequently accessed state resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Florida</span>
                    <span className="text-sm font-medium">342 searches</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Texas</span>
                    <span className="text-sm font-medium">289 searches</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">California</span>
                    <span className="text-sm font-medium">234 searches</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Georgia</span>
                    <span className="text-sm font-medium">187 searches</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alabama</span>
                    <span className="text-sm font-medium">156 searches</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Reports;
