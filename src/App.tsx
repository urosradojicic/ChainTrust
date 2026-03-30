import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Web3Provider from "./providers/Web3Provider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import StartupDetail from "./pages/StartupDetail";
import Register from "./pages/Register";
import Staking from "./pages/Staking";
import Governance from "./pages/Governance";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/startup/:id" element={<StartupDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
