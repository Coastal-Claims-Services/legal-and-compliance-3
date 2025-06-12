
import SimpleChatbot from '../components/SimpleChatbot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Public Adjuster Portal</h1>
          <p className="text-xl text-muted-foreground">AI-Powered Assistant</p>
        </div>
        
        <SimpleChatbot />
      </div>
    </div>
  );
};

export default Index;
