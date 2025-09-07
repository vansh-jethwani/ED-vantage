import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";
import Quiz from "@/pages/Quiz";
import PlaceholderPage from "@/pages/PlaceholderPage";
import Courses from "@/pages/Courses";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Colleges from "@/pages/Colleges";
import Careers from "@/pages/Careers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout /> }>
            <Route index element={<Index />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="courses" element={<Courses />} />
            <Route path="colleges" element={<Colleges />} />
            <Route path="careers" element={<Careers />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
