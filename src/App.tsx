import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProductPage } from "@/pages/ProductPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { MapPage } from "@/pages/MapPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { AddProductPage } from "@/pages/AddProductPage";
import NotFound from "./pages/NotFound";
import { AIServices } from "@/services/ai";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

// Initialize AI Services
const aiServices = new AIServices();
aiServices.warmUpCache();

// Create AI Context for global access
const AIContext = React.createContext({
  search: aiServices,
  cache: aiServices.getCacheStats(),
  clearCache: () => aiServices.clearCache()
});

export function AIProvider({ children }: { children: React.ReactNode }) {
  return (
    <AIContext.Provider value={{ search: aiServices, cache: aiServices.getCacheStats(), clearCache: () => aiServices.clearCache() }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => {
  const context = React.useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <AIProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout><HomePage /></Layout>} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
                  <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
                  <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
                  <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
                  <Route path="/map" element={<Layout><MapPage /></Layout>} />
                  <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
                  <Route path="/add-product" element={<Layout><AddProductPage /></Layout>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster position="top-right" richColors />
              </BrowserRouter>
            </AIProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
