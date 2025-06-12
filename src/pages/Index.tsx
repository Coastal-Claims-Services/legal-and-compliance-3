
import SimpleChatbot from '../components/SimpleChatbot';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-4">Public Adjuster Portal</h1>
              <p className="text-xl text-muted-foreground">AI-Powered Assistant</p>
            </div>
            <ThemeToggle />
          </div>
          
          <SimpleChatbot />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
