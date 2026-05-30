import React, { useState } from 'react';
import { MarketingStrategy, BusinessDetails, TimelineTask } from '../types';
import { 
  Award, Shield, TrendingUp, Check, Copy, ExternalLink, Zap, 
  Target, Sliders, Users, Search, BookOpen, Clock, Play, FileText, 
  CheckCircle2, AlertCircle, Sparkles, MessageSquare, Briefcase, HelpCircle, ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  strategy: MarketingStrategy;
  inputs: BusinessDetails;
  onOpenConsultation: () => void;
}

export default function DashboardView({ strategy: rawStrategy, inputs, onOpenConsultation }: DashboardViewProps) {
  const strategy = React.useMemo(() => {
    return {
      ...rawStrategy,
      meta: {
        name: rawStrategy?.meta?.name || "Your Brand",
        niche: rawStrategy?.meta?.niche || "Your Niche",
        primaryGoal: rawStrategy?.meta?.primaryGoal || "Brand growth",
        location: rawStrategy?.meta?.location || "Global"
      },
      businessAudit: {
        scores: {
          branding: rawStrategy?.businessAudit?.scores?.branding ?? 5,
          socialMedia: rawStrategy?.businessAudit?.scores?.socialMedia ?? 5,
          websiteConversion: rawStrategy?.businessAudit?.scores?.websiteConversion ?? 5,
          leadGen: rawStrategy?.businessAudit?.scores?.leadGen ?? 5,
          contentStrategy: rawStrategy?.businessAudit?.scores?.contentStrategy ?? 5,
        },
        workingWell: rawStrategy?.businessAudit?.workingWell || [],
        hurtingGrowth: rawStrategy?.businessAudit?.hurtingGrowth || [],
        prioritizedImprovements: rawStrategy?.businessAudit?.prioritizedImprovements || []
      },
      competitorAnalysis: {
        strengths: rawStrategy?.competitorAnalysis?.strengths || [],
        weaknesses: rawStrategy?.competitorAnalysis?.weaknesses || [],
        marketingGaps: rawStrategy?.competitorAnalysis?.marketingGaps || [],
        contentOpportunities: rawStrategy?.competitorAnalysis?.contentOpportunities || [],
        comparisonMatrix: rawStrategy?.competitorAnalysis?.comparisonMatrix || []
      },
      growthRoadmap: {
        day30: {
          plan: rawStrategy?.growthRoadmap?.day30?.plan || "Funnel Setup",
          tasks: rawStrategy?.growthRoadmap?.day30?.tasks || []
        },
        day60: {
          plan: rawStrategy?.growthRoadmap?.day60?.plan || "Scaling Campaign",
          tasks: rawStrategy?.growthRoadmap?.day60?.tasks || []
        },
        day90: {
          plan: rawStrategy?.growthRoadmap?.day90?.plan || "Automation & CRM Setup",
          tasks: rawStrategy?.growthRoadmap?.day90?.tasks || []
        }
      },
      contentStrategy: {
        reels: rawStrategy?.contentStrategy?.reels || [],
        carousels: rawStrategy?.contentStrategy?.carousels || [],
        stories: rawStrategy?.contentStrategy?.stories || [],
        trendingTips: rawStrategy?.contentStrategy?.trendingTips || [],
        viralHooks: rawStrategy?.contentStrategy?.viralHooks || [],
        viralCtas: rawStrategy?.contentStrategy?.viralCtas || []
      },
      adStrategy: {
        platform: rawStrategy?.adStrategy?.platform || "Meta Ads & Lead Funnels",
        objectives: rawStrategy?.adStrategy?.objectives || ["Lead Generation", "Direct Conversions"],
        targeting: {
          demographics: rawStrategy?.adStrategy?.targeting?.demographics || "Ages 25-55, business owners",
          interests: rawStrategy?.adStrategy?.targeting?.interests || [],
          behaviors: rawStrategy?.adStrategy?.targeting?.behaviors || []
        },
        creatives: rawStrategy?.adStrategy?.creatives || [],
        offers: rawStrategy?.adStrategy?.offers || [],
        budgetAllocation: {
          prospecting: rawStrategy?.adStrategy?.budgetAllocation?.prospecting ?? 70,
          retargeting: rawStrategy?.adStrategy?.budgetAllocation?.retargeting ?? 20,
          brandAwareness: rawStrategy?.adStrategy?.budgetAllocation?.brandAwareness ?? 10
        },
        retargetingStrategy: rawStrategy?.adStrategy?.retargetingStrategy || "Dynamic sequence retargeting"
      },
      seoWeb: {
        seoImprovements: rawStrategy?.seoWeb?.seoImprovements || [],
        headlines: rawStrategy?.seoWeb?.headlines || [],
        ctaOptimization: rawStrategy?.seoWeb?.ctaOptimization || [],
        landingPageTrustSections: rawStrategy?.seoWeb?.landingPageTrustSections || []
      },
      leadGen: {
        leadMagnets: rawStrategy?.leadGen?.leadMagnets || [],
        whatsappAutomation: rawStrategy?.leadGen?.whatsappAutomation || [],
        emailCampaigns: rawStrategy?.leadGen?.emailCampaigns || [],
        funnelSteps: rawStrategy?.leadGen?.funnelSteps || [],
        crmWorkflowSteps: rawStrategy?.leadGen?.crmWorkflowSteps || []
      }
    };
  }, [rawStrategy]);

  const [activeTab, setActiveTab] = useState<'audit' | 'competitors' | 'roadmap' | 'content' | 'ads' | 'seo' | 'leads'>('audit');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Roadmap tasks interactive states
  const [completedRoadmapTasks, setCompletedRoadmapTasks] = useState<Record<string, boolean>>({});

  // Ad budget allocation states (interactive custom slider/allocator)
  const [prospectingBudget, setProspectingBudget] = useState(strategy.adStrategy.budgetAllocation.prospecting);
  const [retargetingBudget, setRetargetingBudget] = useState(strategy.adStrategy.budgetAllocation.retargeting);
  const [awarenessBudget, setAwarenessBudget] = useState(strategy.adStrategy.budgetAllocation.brandAwareness);

  // Calculate totals
  const totalAllocated = prospectingBudget + retargetingBudget + awarenessBudget;

  const tabs = [
    { id: 'audit', label: '1. Brand Audit', icon: Award },
    { id: 'competitors', label: '2. Competitor Gaps', icon: Search },
    { id: 'roadmap', label: '3. Growth Roadmap', icon: Clock },
    { id: 'content', label: '4. Content Suite', icon: Play },
    { id: 'ads', label: '5. Display Ads', icon: Sliders },
    { id: 'seo', label: '6. SEO & Web', icon: BookOpen },
    { id: 'leads', label: '7. Lead Systems', icon: Zap },
  ] as const;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Timeline handler
  const toggleTimelineTask = (day: string, idx: number) => {
    const taskId = `${day}-${idx}`;
    setCompletedRoadmapTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateRoadmapProgress = () => {
    const totalTasks = 9; // 3 tasks * 3 columns
    const completedCount = Object.values(completedRoadmapTasks).filter(Boolean).length;
    return Math.round((completedCount / totalTasks) * 100);
  };

  // Convert roadmap items into a unified layout
  const roadmapProgress = calculateRoadmapProgress();

  return (
    <div className="space-y-6" id="strategy-dashboard-view">
      {/* Top Brand Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        {/* Glowing background circles */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-3 py-1 text-xs text-teal-300 font-semibold font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
              <span>STRATEGY DEVELOPED • READY</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-100">
              {strategy.meta.name} <span className="text-teal-400 font-light">Blueprint</span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              <span>Niche: <strong className="text-slate-300">{strategy.meta.niche}</strong></span>
              <span>•</span>
              <span>Goal: <strong className="text-slate-300">{strategy.meta.primaryGoal}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-300">{strategy.meta.location}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => handleCopy(JSON.stringify(strategy, null, 2), 'full-strategy')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-xs font-semibold px-4 py-2.5 text-slate-300 transition-colors cursor-pointer"
            >
              {copiedId === 'full-strategy' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedId === 'full-strategy' ? 'Copied Blueprint!' : 'Copy RAW JSON Data'}</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-xs font-bold px-4 py-2.5 text-slate-950 transition-all shadow-lg active:scale-95 glow-teal cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>Deploy with BuyZently</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-slate-800/80 text-sm scrollbar-none" id="tabs-navigation-list">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-t-xl transition-all font-display font-semibold border-b-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'border-teal-500 text-teal-400 bg-slate-950/40 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/10 min-h-[400px]">
        {/* 1. BRAND AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6" id="brand-audit-panel">
            {/* Visual Scores metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {Object.entries(strategy.businessAudit.scores).map(([key, score]) => {
                const label = key.replace(/([A-Z])/g, ' $1');
                const percent = (score as number) * 10;
                
                // Color mapping based on values
                let colorClass = 'bg-teal-500';
                let textClass = 'text-teal-400';
                if (percent < 50) {
                  colorClass = 'bg-red-500';
                  textClass = 'text-red-400';
                } else if (percent < 80) {
                  colorClass = 'bg-amber-500';
                  textClass = 'text-amber-400';
                }

                return (
                  <div key={key} className="bg-slate-950/40 rounded-xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Core Metric</span>
                      <h4 className="text-xs font-bold text-slate-300 uppercase truncate">{label}</h4>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between text-slate-200">
                        <span className={`text-2xl font-display font-extrabold ${textClass}`}>{score}/10</span>
                        <span className="text-[10px] text-slate-500">{percent}% Optimal</span>
                      </div>
                      {/* Linear meter */}
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit findings description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Working Well */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-200 text-sm">Strategic Foundations</h3>
                    <p className="text-[10px] text-slate-500">Elements working well</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {strategy.businessAudit.workingWell.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold font-mono mt-0.5">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hurting Growth */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-200 text-sm">Leaky Bottlenecks</h3>
                    <p className="text-[10px] text-slate-500">What is hurting growth</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {strategy.businessAudit.hurtingGrowth.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="text-red-400 font-bold font-mono mt-0.5">✗</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Fixes */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4 relative overflow-hidden glow-teal">
                <div className="absolute top-0 right-0 h-16 w-16 bg-teal-500/5 rotate-45 transform pointer-events-none" />
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Zap className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-200 text-sm">First Priority Actions</h3>
                    <p className="text-[10px] text-teal-400 uppercase tracking-wider font-semibold">Immediate fixes</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {strategy.businessAudit.prioritizedImprovements.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <div className="h-4.5 w-4.5 rounded bg-teal-500/10 flex items-center justify-center shrink-0 mt-0.5 text-teal-400 font-mono font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategy Statement Intro */}
            <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-5 text-center max-w-2xl mx-auto space-y-3">
              <h3 className="font-display font-bold text-sm text-slate-200">Strategic Consultant Evaluation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                By sealing these funnel leaks and creating customized lead-generation incentives, we capture prospect intent before they choose competitors like <strong className="text-teal-400">{inputs.competitorWebsite || 'others'}</strong>. Navigate through tabs 2-7 to configure visual posts, direct targeting, and automation flows.
              </p>
              <div className="pt-1.5">
                <button
                  onClick={() => setActiveTab('competitors')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                >
                  <span>Explore Competitor Gaps</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMPETITOR GAPS TAB */}
        {activeTab === 'competitors' && (
          <div className="space-y-6" id="competitor-gaps-panel">
            {/* Matrices Checklist columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Competitor Profile */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span>Competitor Strengths / Visual Footprint</span>
                </h3>
                <ul className="space-y-3">
                  {strategy.competitorAnalysis.strengths.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                      <span className="text-teal-400 font-semibold mt-0.5">■</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span>Competitor Deficiencies / Missing Elements</span>
                </h3>
                <ul className="space-y-3">
                  {strategy.competitorAnalysis.weaknesses.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                      <span className="text-amber-400 font-semibold mt-0.5">■</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Market Gaps */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-teal-400" />
                  <span>Your Exclusive Marketing Gaps</span>
                </h3>
                <ul className="space-y-3">
                  {strategy.competitorAnalysis.marketingGaps.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                      <div className="h-2 w-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content opportunities */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Play className="h-4 w-4 text-emerald-400" />
                  <span>High-Converting Missing Content Ideas</span>
                </h3>
                <ul className="space-y-3">
                  {strategy.competitorAnalysis.contentOpportunities.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-slate-300">
                      <div className="h-4.5 w-4.5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dynamic Comparison Matrix */}
            <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-teal-400" />
                <span>Competitor Head-to-Head Comparison</span>
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-mono">
                      <th className="p-3 border-b border-slate-850">Evaluation Matrix</th>
                      <th className="p-3 border-b border-slate-850 text-slate-200 font-display font-bold">You ({strategy.meta.name})</th>
                      <th className="p-3 border-b border-slate-850 text-purple-300">The Competitor ({inputs.competitorWebsite || 'Selected Brand'})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {strategy.competitorAnalysis.comparisonMatrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-3 font-semibold text-slate-400">{item.feature}</td>
                        <td className="p-3 text-slate-200 font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="text-teal-400">•</span>
                            <span>{item.you}</span>
                          </div>
                        </td>
                        <td className="p-3 text-purple-200">
                          <div className="flex items-center gap-1.5">
                            <span className="text-purple-400">•</span>
                            <span>{item.competitor}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. GROWTH ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6" id="growth-roadmap-panel">
            {/* Interactive Progress Bar */}
            <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider font-mono">Roadmap Action Completion Tracker</h4>
                <p className="text-xs text-slate-400">Toggle completion of each task on the vertical columns below to recalculate metrics.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-display font-extrabold text-slate-100">{roadmapProgress}%</span>
                  <span className="block text-[10px] text-slate-500 font-mono">Completed</span>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                  <Check className={`h-5 w-5 ${roadmapProgress === 100 ? 'text-teal-400 stroke-[3px]' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>

            {/* Roadmap Horizontal Grid representing 30-60-90 structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Day 30 Setup Plan */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Phase 1</span>
                    <h3 className="font-display font-bold text-slate-200 text-sm">30-Day Setup Plan</h3>
                  </div>
                  <div className="rounded-full bg-teal-500/10 text-teal-400 px-2.5 py-0.5 text-[10px] font-bold">
                    Setup
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">"{strategy.growthRoadmap.day30.plan}"</p>

                <div className="space-y-2.5 pt-2">
                  {strategy.growthRoadmap.day30.tasks.map((task, idx) => {
                    const isCompleted = completedRoadmapTasks[`day30-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTimelineTask('day30', idx)}
                        className={`group rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                          isCompleted
                            ? 'border-teal-500/50 bg-teal-500/5 opacity-75'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            className={`h-4.5 w-4.5 rounded flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                              isCompleted ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isCompleted && <Check className="h-3 w-3 stroke-[3px]" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{task.title}</span>
                              <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-purple-400 px-1.5 rounded">{task.category}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 lines-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day 60 Setup Plan */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-display">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Phase 2</span>
                    <h3 className="font-bold text-slate-200 text-sm">60-Day Scaling Plan</h3>
                  </div>
                  <div className="rounded-full bg-purple-500/10 text-purple-400 px-2.5 py-0.5 text-[10px] font-bold">
                    PPC & Ads
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">"{strategy.growthRoadmap.day60.plan}"</p>

                <div className="space-y-2.5 pt-2">
                  {strategy.growthRoadmap.day60.tasks.map((task, idx) => {
                    const isCompleted = completedRoadmapTasks[`day60-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTimelineTask('day60', idx)}
                        className={`group rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                          isCompleted
                            ? 'border-teal-500/50 bg-teal-500/5 opacity-75'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            className={`h-4.5 w-4.5 rounded flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                              isCompleted ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isCompleted && <Check className="h-3 w-3 stroke-[3px]" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{task.title}</span>
                              <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-purple-400 px-1.5 rounded">{task.category}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 lines-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day 90 Automation Plan */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Phase 3</span>
                    <h3 className="font-display font-bold text-slate-200 text-sm">90-Day Automation</h3>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold">
                    Automation
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">"{strategy.growthRoadmap.day90.plan}"</p>

                <div className="space-y-2.5 pt-2">
                  {strategy.growthRoadmap.day90.tasks.map((task, idx) => {
                    const isCompleted = completedRoadmapTasks[`day90-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTimelineTask('day90', idx)}
                        className={`group rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                          isCompleted
                            ? 'border-teal-500/50 bg-teal-500/5 opacity-75'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            className={`h-4.5 w-4.5 rounded flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                              isCompleted ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isCompleted && <Check className="h-3 w-3 stroke-[3px]" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{task.title}</span>
                              <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-purple-400 px-1.5 rounded">{task.category}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 lines-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VIRAL CONTENT SUITE TAB */}
        {activeTab === 'content' && (
          <div className="space-y-6" id="viral-content-suite-panel">
            {/* Split layout: Reels concepts, carousels, hooks and cues */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left col: 10 customized Reels briefs */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-950/45 rounded-xl border border-slate-800 p-4">
                  <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    <Play className="h-4.5 w-4.5 text-teal-400" />
                    <span>Viral Reels Playbooks (High-Converting Concepts)</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Copy scripts to paste directly into your storyboard drafts:</p>
                </div>

                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {strategy.contentStrategy.reels.map((reel, idx) => (
                    <div key={idx} className="bg-slate-900/30 rounded-xl border border-slate-800 p-4 space-y-2.5 relative">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                        <span className="text-[10px] font-mono uppercase bg-teal-500/10 text-teal-300 font-bold px-2 py-0.5 rounded">Reel Script Idea #{idx + 1}</span>
                        <button
                          onClick={() => handleCopy(`HOOK: ${reel.hook}\nCONCEPT: ${reel.concept}\nCTA: ${reel.cta}`, `reel-${idx}`)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy script"
                        >
                          {copiedId === `reel-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase">Hook Line:</span>
                          <strong className="text-slate-200 italic font-display">"{reel.hook}"</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase font-medium">Concept / Visual sequence:</span>
                          <span className="text-slate-300 leading-relaxed">{reel.concept}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase font-medium">CTA Comment Trigger:</span>
                          <span className="text-teal-400 font-semibold">{reel.cta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel: Carousels, Stories, trending hooks/CTAs */}
              <div className="space-y-4">
                {/* Carousels */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-3.5">
                  <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span>Carousel Slide Outlines</span>
                  </h4>
                  <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                    {strategy.contentStrategy.carousels.map((car, idx) => (
                      <div key={idx} className="bg-slate-950/40 rounded-lg p-3 border border-slate-850 space-y-2">
                        <div className="text-xs font-bold text-slate-200">{car.title}</div>
                        <ul className="space-y-1.5 pl-3 border-l border-slate-800 text-[11px] text-slate-400">
                          {car.slides.map((slide, sIdx) => (
                            <li key={sIdx}>{slide}</li>
                          ))}
                        </ul>
                        <div className="text-[10px] text-teal-400 italic">CTA: {car.cta}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Viral hooks, CTAs, trending playbooks */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Viral Hooks & trigger items</span>
                  </h4>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Viral Hooks:</span>
                      <div className="space-y-1.5">
                        {strategy.contentStrategy.viralHooks.map((h, idx) => (
                          <div key={idx} className="text-[11px] bg-slate-950/40 border border-slate-850 px-2.5 py-1.5 rounded text-slate-300 italic">
                            "{h}"
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">High-conversions CTAs:</span>
                      <div className="space-y-1.5">
                        {strategy.contentStrategy.viralCtas.map((cta, idx) => (
                          <div key={idx} className="text-[11px] bg-slate-950/40 border border-slate-850 px-2.5 py-1.5 rounded text-slate-300 font-medium">
                            {cta}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. DISPLAY ADS TAB */}
        {activeTab === 'ads' && (
          <div className="space-y-6" id="display-ads-panel">
            {/* Interactive Ad budget allocation calculator */}
            <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/80">
                <div>
                  <h4 className="font-display font-semibold text-sm text-slate-200 flex items-center gap-1.5">
                    <Sliders className="h-4.5 w-4.5 text-teal-400" />
                    <span>Interactive Paid Ad Budget Allocator</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Drag target percentages to preview the visual distribution of monthly PPC budgets.</p>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${totalAllocated === 100 ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>
                  Allocation Balance: {totalAllocated}% {totalAllocated === 100 ? '(Balanced)' : '(Adjust to 100%)'}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {/* Slider 1: Prospecting */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Cold Prospecting (New Visitors)</span>
                    <strong className="text-teal-400 font-mono">{prospectingBudget}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={prospectingBudget}
                    onChange={(e) => setProspectingBudget(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer h-1.5 rounded bg-slate-800"
                  />
                  <p className="text-[10px] text-slate-500">Targets high-intent lookalike audiences who have never intersected with your brand.</p>
                </div>

                {/* Slider 2: Retargeting */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Warm Retargeting (Social / Web Vis.)</span>
                    <strong className="text-purple-400 font-mono">{retargetingBudget}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={retargetingBudget}
                    onChange={(e) => setRetargetingBudget(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer h-1.5 rounded bg-slate-800"
                  />
                  <p className="text-[10px] text-slate-500">Targets page visits, cart-abandonments, or social profiles engaged over past 30 days.</p>
                </div>

                {/* Slider 3: Brand Awareness */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">LAL Brand Authority</span>
                    <strong className="text-emerald-400 font-mono">{awarenessBudget}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={awarenessBudget}
                    onChange={(e) => setAwarenessBudget(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 rounded bg-slate-800"
                  />
                  <p className="text-[10px] text-slate-500">Continuous micro-budget awareness showcasing stories, testimonials, or features.</p>
                </div>
              </div>

              {/* Visual allocation indicators */}
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${(prospectingBudget / totalAllocated) * 100}%` }} />
                <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(retargetingBudget / totalAllocated) * 100}%` }} />
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(awarenessBudget / totalAllocated) * 100}%` }} />
              </div>
            </div>

            {/* Platform selection and targeting specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign configuration briefs */}
              <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-205 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Target className="h-4.5 w-4.5 text-teal-400" />
                  <span>Paid Channels & Objectives</span>
                </h3>
                <div className="space-y-3.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 font-mono text-[9px] tracking-wider block">BEST ADVERTISING PLATFORM:</span>
                    <strong className="text-slate-100 font-display text-sm">{strategy.adStrategy.platform}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 font-mono text-[9px] tracking-wider block">CAMPAIGN OBJECTIVES:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {strategy.adStrategy.objectives.map((obj, idx) => (
                        <span key={idx} className="bg-slate-950 border border-slate-800 text-teal-300 px-2 py-0.5 rounded text-[10px] font-semibold">{obj}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-mono text-[9px] tracking-wider block">TARGET AUDIENCE SPECS:</span>
                    <div className="space-y-2 mt-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                      <div>
                        <span className="text-[10px] text-slate-500 font-sans block font-semibold">Demography:</span>
                        <p>{strategy.adStrategy.targeting.demographics}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-semibold">Interests:</span>
                        <p className="text-purple-300">{strategy.adStrategy.targeting.interests.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-semibold">Behaviors:</span>
                        <p className="text-slate-400">{strategy.adStrategy.targeting.behaviors.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Copy variations */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-205 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <FileText className="h-4.5 w-4.5 text-purple-4005" />
                    <span>Creative Ad Copy Variations</span>
                  </h3>

                  <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                    {strategy.adStrategy.creatives.map((cr, idx) => (
                      <div key={idx} className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-850 space-y-2.5 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-mono font-bold bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded">{cr.format}</span>
                          <button
                            onClick={() => handleCopy(`CONCEPT: ${cr.concept}\nCOPY: ${cr.copy}`, `ad-${idx}`)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                            title="Copy ad copy"
                          >
                            {copiedId === `ad-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="text-xs">
                          <span className="text-[10px] text-slate-500 font-mono block">Creative concept:</span>
                          <p className="text-slate-200 italic font-medium">"{cr.concept}"</p>
                        </div>
                        <div className="text-xs bg-slate-950/70 p-2.5 rounded border border-slate-900 leading-relaxed font-sans text-slate-300">
                          {cr.copy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign retargeting strategy */}
            <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-3">
              <h4 className="font-display font-semibold text-xs text-teal-400 uppercase tracking-wider">Dynamic Retargeting Setup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{strategy.adStrategy.retargetingStrategy}</p>
            </div>
          </div>
        )}

        {/* 6. SEO & CONVERSIONS TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6" id="seo-conversions-panel">
            {/* Headlines A/B Testing layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Headline block */}
              <div className="space-y-4">
                <div className="bg-slate-950/45 rounded-xl border border-slate-800 p-4">
                  <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-teal-400" />
                    <span>Conversions Headlines A/B Test</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Swap your general header with these targeted psychological statements:</p>
                </div>

                <div className="space-y-3.5">
                  {strategy.seoWeb.headlines.map((hl, idx) => {
                    const isProposed = hl.currentType.toLowerCase().includes("proposed") || hl.currentType.toLowerCase().includes("converting");
                    return (
                      <div key={idx} className={`rounded-xl border p-4 space-y-2.5 ${
                        isProposed ? 'border-teal-500/50 bg-teal-500/5 glow-teal' : 'border-slate-800 bg-slate-950/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                            isProposed ? 'bg-teal-500/10 text-teal-300 animate-pulse' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {hl.currentType}
                          </span>
                          <button
                            onClick={() => handleCopy(hl.proposedHeadline, `headline-${idx}`)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {copiedId === `headline-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <h4 className="font-display font-bold text-sm text-slate-200 italic">"{hl.proposedHeadline}"</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{hl.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions bullets right */}
              <div className="space-y-4">
                {/* SEO Rankings optimization */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Rankings & Long-tail Search Terms
                  </h3>
                  <ul className="space-y-3">
                    {strategy.seoWeb.seoImprovements.map((imp, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="h-2 w-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trust and Conversion factors */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Landing Page Credibility Proofs
                  </h3>
                  <ul className="space-y-3">
                    {strategy.seoWeb.landingPageTrustSections.map((imp, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="h-4.5 w-4.5 rounded bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. LEAD SYSTEMS TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6" id="lead-systems-panel">
            {/* Lead magnet builders & automations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp, email sequencing templates */}
              <div className="space-y-4">
                {/* WhatsApp conversational templates */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <MessageSquare className="h-4.5 w-4.5 text-teal-400" />
                    <span>WhatsApp Conversational Automations</span>
                  </h3>
                  <div className="space-y-3.5">
                    {strategy.leadGen.whatsappAutomation.map((auto, idx) => (
                      <div key={idx} className="bg-slate-950/40 rounded-xl border border-slate-850 p-3.5 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded">Auto trigger #{idx + 1}</span>
                          <button
                            onClick={() => handleCopy(auto, `chat-auto-${idx}`)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {copiedId === `chat-auto-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300 font-sans">{auto}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email sequencing */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-2 font-display">
                    <CheckCircle2 className="h-4.5 w-4.5 text-purple-400" />
                    <span>Autoresponder Nurture Sequences</span>
                  </h3>
                  <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1">
                    {strategy.leadGen.emailCampaigns.map((em, idx) => (
                      <div key={idx} className="bg-slate-950/40 rounded-lg p-3 border border-slate-850 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono text-purple-300">
                          <span>STEP #{em.sequenceOrder} IN TIMELINE</span>
                        </div>
                        <div className="font-bold text-slate-200">"{em.subject}"</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{em.brief}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Magnets and CRM layouts */}
              <div className="space-y-4">
                {/* Lead magnets list */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Proposed High-Value Lead Incentives
                  </h3>
                  <ul className="space-y-3">
                    {strategy.leadGen.leadMagnets.map((magn, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="h-4.5 w-4.5 rounded bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <span>{magn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pipeline routing funnel */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                  <h3 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                    CRM Lead Pipelines Routing
                  </h3>
                  <ul className="space-y-3">
                    {strategy.leadGen.crmWorkflowSteps.map((magn, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <div className="h-2.5 w-2.5 rounded bg-purple-400 mt-2 shrink-0" />
                        <span>{magn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BuyZently Implementation Partner Pitch Banner */}
      <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-teal-950/20 to-slate-900 p-6 shadow-xl relative overflow-hidden glow-teal">
        {/* Glowing light source */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500/10 rounded-full blur-2xl" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <span>Let BuyZently Execute This Strategy For You</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Why deal with the technical headache of custom pixel trackers, design templates, CRM triggers, and paid retargeting? Our digital agency team handles everything in-house. Book your free blueprint analysis session.
            </p>
          </div>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-display font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            id="book-consultation-footer-btn"
          >
            <span>Book Alignment Call</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
