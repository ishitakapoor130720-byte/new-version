import React, { useState } from 'react';
import { BusinessDetails } from '../types';
import { motion } from 'motion/react';
import { Target, Globe, Shield, Sparkles, Building, Briefcase, Zap, HelpCircle, Instagram, Code, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface FormInputProps {
  onGenerate: (details: BusinessDetails) => void;
  isLoading: boolean;
}

export default function FormInput({ onGenerate, isLoading }: FormInputProps) {
  const [details, setDetails] = useState<BusinessDetails>({
    businessName: '',
    niche: '',
    website: '',
    competitorWebsite: '',
    primaryGoal: 'Sales / Conversions',
    targetAudience: '',
    location: '',
    runningAds: 'No',
    socialPlatforms: ['Instagram'],
    budget: '$500 - $1,500 / month',
    challenges: ''
  });

  const goals = [
    'Sales / Conversions',
    'High-ticket Lead Generation',
    'Social Followers & Growth',
    'Brand Position & Authority',
    'Local Customers & Bookings'
  ];

  const budgets = [
    'Less than $500 / month',
    '$500 - $1,500 / month',
    '$1,500 - $5,000 / month',
    '$5,000+ / month'
  ];

  const socialPlatformsList = [
    'Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Google Business'
  ];

  const toggleSocial = (platform: string) => {
    if (details.socialPlatforms.includes(platform)) {
      setDetails({
        ...details,
        socialPlatforms: details.socialPlatforms.filter(p => p !== platform)
      });
    } else {
      setDetails({
        ...details,
        socialPlatforms: [...details.socialPlatforms, platform]
      });
    }
  };

  // Preset loaders for fast onboarding / demo trials
  const presets = [
    {
      title: 'E-commerce Apparel',
      name: 'Bella Boutique',
      niche: 'Sustainable Women\'s Wear & Activewear',
      website: 'www.bellaboutique.co',
      competitor: 'www.everlane.com',
      goal: 'Sales / Conversions',
      audience: 'Modern eco-conscious women aged 22-38',
      location: 'National (E-comm)',
      ads: 'Yes (Meta, TikTok)',
      socials: ['Instagram', 'Facebook', 'TikTok'],
      budget: '$1,500 - $5,000 / month',
      challenges: 'High website drop-offs, stagnant organic followers, and expensive PPC cost-per-purchase.'
    },
    {
      title: 'Local Health Service',
      name: 'Apex Physical Therapy',
      niche: 'Sports rehabilitation & pelvic floor physical therapy clinic',
      website: 'www.apexphysio-chiropractics.com',
      competitor: 'www.jointhealthcenters.com',
      goal: 'Local Customers & Bookings',
      audience: 'Athletes, post-pregnancy mothers, and residents with lower back issues',
      location: 'Austin, Texas',
      ads: 'No',
      socials: ['Instagram', 'Google Business', 'Facebook'],
      budget: '$500 - $1,500 / month',
      challenges: 'Relying purely on referrals, zero localized organic search visibility, and manual WhatsApp patient scheduling.'
    },
    {
      title: 'Personal Brand',
      name: 'Sarah Jenkins Consulting',
      niche: 'High-ticket B2B Executive Leadership & Performance Coaching',
      website: 'www.sarahjenkinsleads.com',
      competitor: 'www.tonyrobbins.com',
      goal: 'High-ticket Lead Generation',
      audience: 'Mid-to-Senior level corporate directors, CEOs, and startup founders',
      location: 'Global (Virtual coaching)',
      ads: 'No',
      socials: ['LinkedIn', 'YouTube', 'Instagram'],
      budget: '$500 - $1,500 / month',
      challenges: 'Low content engagement, weak storytelling hooks on reels, and zero lead magnets to nurse corporate prospects.'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setDetails({
      businessName: p.name,
      niche: p.niche,
      website: p.website,
      competitorWebsite: p.competitor,
      primaryGoal: p.goal,
      targetAudience: p.audience,
      location: p.location,
      runningAds: p.ads,
      socialPlatforms: p.socials,
      budget: p.budget,
      challenges: p.challenges
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.businessName.trim() || !details.niche.trim() || !details.primaryGoal.trim()) {
      return;
    }
    onGenerate(details);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" id="form-input-container">
      {/* Intro Greetings */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3.5 py-1.5 text-xs text-teal-300 font-medium">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Interactive Agency Strategic Core</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-100 tracking-tight leading-[1.1]">
          Launch Your Growth Engine with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300">BuyZently AI</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
          Provide your parameters below to deploy an AI marketing audit, competitor vulnerability breakdown, viral content checklists, and structured growth roadmap.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Select a Pre-optimized Industry Profile to test:</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => applyPreset(p)}
              className={`group flex flex-col justify-start text-left rounded-xl border p-4 transition-all duration-300 relative overflow-hidden cursor-pointer ${
                details.businessName === p.name
                  ? 'border-teal-500 bg-teal-500/5 glow-teal'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-display font-bold text-sm text-slate-200 group-hover:text-teal-400 transition-colors uppercase tracking-tight">{p.title}</span>
                {details.businessName === p.name && (
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                )}
              </div>
              <span className="text-xs text-slate-400 mt-1 truncate font-mono">{p.name} ({p.location})</span>
              <span className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic">"{p.challenges}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Setup Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Building className="h-4 w-4 text-teal-400" />
              <span>Business name *</span>
            </label>
            <input
              type="text"
              required
              value={details.businessName}
              onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
              placeholder="e.g. Bella Boutique"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Niche or Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-teal-400" />
              <span>Niche / Industry *</span>
            </label>
            <input
              type="text"
              required
              value={details.niche}
              onChange={(e) => setDetails({ ...details, niche: e.target.value })}
              placeholder="e.g. Eco-friendly activewear boutique"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Website / Instagram */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Globe className="h-4 w-4 text-teal-400" />
              <span>Your Website / Instagram</span>
            </label>
            <input
              type="text"
              value={details.website}
              onChange={(e) => setDetails({ ...details, website: e.target.value })}
              placeholder="e.g. www.bellaboutique.co"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Competitor's Profile */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 animate-pulse-slow">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>Competitor's Website / Social Page</span>
            </label>
            <input
              type="text"
              value={details.competitorWebsite}
              onChange={(e) => setDetails({ ...details, competitorWebsite: e.target.value })}
              placeholder="e.g. www.everlane.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Target className="h-4 w-4 text-teal-400" />
              <span>Target audience demography</span>
            </label>
            <input
              type="text"
              value={details.targetAudience}
              onChange={(e) => setDetails({ ...details, targetAudience: e.target.value })}
              placeholder="e.g. High-income women aged 25-45"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* City / Location served */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Globe className="h-4 w-4 text-teal-400" />
              <span>Geographic Location / Target Market</span>
            </label>
            <input
              type="text"
              value={details.location}
              onChange={(e) => setDetails({ ...details, location: e.target.value })}
              placeholder="e.g. National, Austin TX, or Global"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Dynamic selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
          {/* Primary Goal Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Primary growth goal</label>
            <div className="space-y-2">
              {goals.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setDetails({ ...details, primaryGoal: g })}
                  className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-colors cursor-pointer ${
                    details.primaryGoal === g
                      ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms selector */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Instagram className="h-4 w-4 text-teal-400" />
              <span>Active Social Media Channels (Select Multiple)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socialPlatformsList.map((platform) => {
                const isSelected = details.socialPlatforms.includes(platform);
                return (
                  <button
                    type="button"
                    key={platform}
                    onClick={() => toggleSocial(platform)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-medium'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && (
                        <svg className="h-3 w-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs">{platform}</span>
                  </button>
                );
              })}
            </div>

            {/* Ads and Budget parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/40">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Currently running paid ads?</label>
                <div className="flex gap-2">
                  {['No', 'Yes (Meta/PPC)', 'Seeking help'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDetails({ ...details, runningAds: val })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs text-center transition-colors cursor-pointer ${
                        details.runningAds === val
                          ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                          : 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Rough Marketing Budget</label>
                <select
                  value={details.budget}
                  onChange={(e) => setDetails({ ...details, budget: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  {budgets.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Major bottlenecks / Challenges */}
        <div className="space-y-1.5 pt-4 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-purple-400" />
            <span>Describe your major business bottleneck or challenges</span>
          </label>
          <textarea
            value={details.challenges}
            onChange={(e) => setDetails({ ...details, challenges: e.target.value })}
            placeholder="e.g. We spend hours writing content but reach is low. Paid ads are unprofitable. Competitor Zara dominates local social shares completely."
            rows={3}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Trigger Button */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isLoading || !details.businessName.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-display font-semibold transition-transform active:scale-[0.98] py-3.5 px-8 rounded-xl shadow-lg hover:shadow-teal-500/20 glow-teal cursor-pointer"
            id="generate-strategy-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying BuyZently AI Strategist...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Sparkles className="h-4.5 w-4.5" /> Optimize Profile & Competitors Now
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
