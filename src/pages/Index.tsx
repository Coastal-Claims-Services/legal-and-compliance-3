
import SimpleChatbot from '../components/SimpleChatbot';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Settings, BookOpen, Search, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';

const Index = () => {
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
                  <div className="text-center flex-1">
                    <h1 className="text-4xl font-bold mb-4">Legal Compliance Hub</h1>
                    <p className="text-xl text-muted-foreground">AI-Powered State Resource Management</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
              
              <SimpleChatbot />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
