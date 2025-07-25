/* eslint-disable @typescript-eslint/no-unused-vars */
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./page/notfound";
import Index from "./page";
import QuizApp from "./components/quizapp";
import ExamListPage from "./components/examList";
import {QuestionProvider } from './context/questionContext';

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <QuestionProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<QuizApp />} />
           <Route path="/home" element={<ExamListPage/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </QuestionProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App