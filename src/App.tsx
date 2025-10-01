
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import States from "./pages/States";
import Search from "./pages/Search";
import Compare from "./pages/Compare";
import Auth from "./pages/Auth";
import Reports from "./pages/Reports";
import ComplianceLegalHub from "./pages/ComplianceLegalHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComplianceLegalHub />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/details" element={<Admin />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/states" element={<States />} />
          <Route path="/search" element={<Search />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
