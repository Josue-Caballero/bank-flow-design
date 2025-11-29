import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoanApplication from "./pages/LoanApplication";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicationsList from "./pages/admin/ApplicationsList";
import ApplicationDetail from "./pages/admin/ApplicationDetail";
import AutomaticRulesConfig from "./pages/admin/AutomaticRulesConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solicitud" element={<LoanApplication />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/solicitudes" element={<ApplicationsList />} />
          <Route path="/admin/solicitud/:id" element={<ApplicationDetail />} />
          <Route path="/admin/aprobaciones" element={<ApplicationsList />} />
          <Route path="/admin/reglas" element={<AutomaticRulesConfig />} />
          <Route path="/admin/configuracion" element={<AdminDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
