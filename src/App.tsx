import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RefreshCw, ChevronLeft, MessageSquare, 
  HelpCircle, CheckCircle, Handshake, Mail, Info, FileText 
} from 'lucide-react';
import { BusinessDetails, MarketingStrategy } from './types';
import FormInput from './components/FormInput';
import DashboardView from './components/DashboardView';
import ChatInterface from './components/ChatInterface';
import LeadCaptureModal from './components/LeadCaptureModal';

export default function App() {
  const [inputs, setInputs] = useState<BusinessDetails | null>(null);
  const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsultant, setShowConsultant] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async (details: BusinessDetails) => {
    setIsLoading(true);
    setErrorMessage('');
    setInputs(details);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data = await response.json();
      setStrategy(data.strategy);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('We encountered an optimization issue, but we have deployed a precise, tailored strategic plan to get you started.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStrategy(null);
    setInputs(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden" id="applet-main-canvas">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/45 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/10">
              <Sparkles className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-100">
                BuyZently <span className="text-teal-400 font-light">AI</span>
              </span>
              <span className="block text-[9px] font-mono font-medium text-slate-500 tracking-widest uppercase">Marketing Strategist</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {strategy && (
              <>
                <button
                  onClick={() => setShowConsultant(!showConsultant)}
                  className={`hidden md:inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    showConsultant
                      ? 'border-teal-500/40 bg-teal-500/5 text-teal-400'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                  id="toggle-consultant-sidebar-btn"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{showConsultant ? 'Hide Assistant' : 'Show Assistant'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:text-slate-100 text-xs font-semibold px-3 py-1.5 text-slate-400 transition-colors cursor-pointer"
                  id="reset-form-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Modify Parameters</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              id="request-consultation-header-btn"
            >
              <Handshake className="h-3.5 w-3.5" />
              <span>Get Proposal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {/* 1. Intake Profile Onboarding */}
          {!strategy && !isLoading && (
            <motion.div
              key="intake-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FormInput onGenerate={handleGenerate} isLoading={isLoading} />
            </motion.div>
          )}

          {/* 2. Loading State */}
          {isLoading && (
            <motion.div
              key="loading-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6 text-center max-w-md mx-auto"
              id="loading-strategy-splash"
            >
              <div className="relative flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-teal-500/20 opacity-75" />
                <div className="h-12 w-12 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-100">Analyzing Gaps & Competitors...</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The BuyZently AI is currently mapping visual hook script patterns, tracking target interests demographics, configuring automated WhatsApp responders, and preparing localized SEO headlines models.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-850 p-4 w-full text-left font-mono text-[10px] text-slate-500 space-y-1 select-none">
                <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-teal-400 animate-pulse" /><span>Initializing Google GenAI client...</span></div>
                <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-teal-400 animate-pulse" /><span>Analyzing niche: "{inputs?.niche}"...</span></div>
                <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-teal-500 animate-pulse" /><span>Querying competitor specs: "{inputs?.competitorWebsite}"...</span></div>
                <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-teal-400" /><span>Drafting reels, scripts & A/B testing copy...</span></div>
              </div>
            </motion.div>
          )}

          {/* 3. Generated Strategy Center Dashboard */}
          {strategy && !isLoading && (
            <motion.div
              key="strategy-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {errorMessage && (
                <div className="flex items-center gap-2.5 rounded-xl bg-amber-950/40 border border-amber-800 p-4 text-xs text-amber-300">
                  <Info className="h-5 w-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Grid: 70% Strategy Center, 30% Consultant Chat Companion */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className={showConsultant ? "lg:col-span-8" : "lg:col-span-12 transition-all duration-300"}>
                  <DashboardView 
                    strategy={strategy} 
                    inputs={inputs!} 
                    onOpenConsultation={() => setIsLeadModalOpen(true)} 
                  />
                </div>

                {showConsultant && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 lg:sticky lg:top-20"
                    id="chat-sidebar-wrapper"
                  >
                    <ChatInterface currentStrategy={strategy} inputs={inputs!} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating consult chat launcher on small displays */}
      {strategy && !showConsultant && (
        <button
          onClick={() => setShowConsultant(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 p-4 text-slate-950 shadow-xl glow-teal active:scale-95 transition-transform cursor-pointer"
          id="floating-chat-trigger-btn"
        >
          <MessageSquare className="h-6 w-6 stroke-[2.5]" />
        </button>
      )}

      {/* Elegant Agency Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center">
          <div>
            <span className="font-display font-semibold uppercase tracking-wider text-slate-400">BuyZently Digital Agency</span>
            <span className="block mt-1">© 2026 BuyZently. Realize high returns on your brand with custom marketing systems.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLeadModalOpen(true)} className="hover:text-teal-400 transition-colors cursor-pointer">Support Channel</button>
            <span>•</span>
            <button onClick={() => setIsLeadModalOpen(true)} className="hover:text-teal-400 transition-colors cursor-pointer">Terms & Conditions</button>
          </div>
        </div>
      </footer>

      {/* Conversion Lead Modal Dialog */}
      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        businessName={inputs?.businessName || strategy?.meta?.name || ''}
        primaryGoal={inputs?.primaryGoal || strategy?.meta?.primaryGoal || 'Acquisition'}
      />
    </div>
  );
}
