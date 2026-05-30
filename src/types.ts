/**
 * Types & Interfaces for BuyZently AI
 */

export interface BusinessDetails {
  businessName: string;
  niche: string;
  website: string;
  competitorWebsite: string;
  primaryGoal: string;
  targetAudience: string;
  location: string;
  runningAds: string;
  socialPlatforms: string[];
  budget: string;
  challenges: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ScoreSet {
  branding: number;
  socialMedia: number;
  websiteConversion: number;
  leadGen: number;
  contentStrategy: number;
}

export interface CompetitorComparison {
  feature: string;
  you: string;
  competitor: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  category: string;
  description: string;
  completed: boolean;
}

export interface ContentReel {
  hook: string;
  concept: string;
  cta: string;
}

export interface ContentCarousel {
  title: string;
  slides: string[];
  cta: string;
}

export interface ContentStory {
  concept: string;
  scriptText: string;
  actionUrlText: string;
}

export interface AdCreative {
  format: string;
  concept: string;
  copy: string;
}

export interface SEOHeadline {
  currentType: string;
  proposedHeadline: string;
  explanation: string;
}

export interface EmailCampaign {
  subject: string;
  brief: string;
  sequenceOrder: number;
}

export interface MarketingStrategy {
  meta: {
    name: string;
    niche: string;
    primaryGoal: string;
    location: string;
  };
  businessAudit: {
    scores: ScoreSet;
    workingWell: string[];
    hurtingGrowth: string[];
    prioritizedImprovements: string[];
  };
  competitorAnalysis: {
    strengths: string[];
    weaknesses: string[];
    marketingGaps: string[];
    contentOpportunities: string[];
    comparisonMatrix: CompetitorComparison[];
  };
  growthRoadmap: {
    day30: {
      plan: string;
      tasks: Omit<TimelineTask, 'id' | 'completed'>[];
    };
    day60: {
      plan: string;
      tasks: Omit<TimelineTask, 'id' | 'completed'>[];
    };
    day90: {
      plan: string;
      tasks: Omit<TimelineTask, 'id' | 'completed'>[];
    };
  };
  contentStrategy: {
    reels: ContentReel[];
    carousels: ContentCarousel[];
    stories: ContentStory[];
    trendingTips: string[];
    viralHooks: string[];
    viralCtas: string[];
  };
  adStrategy: {
    platform: string;
    objectives: string[];
    targeting: {
      demographics: string;
      interests: string[];
      behaviors: string[];
    };
    creatives: AdCreative[];
    offers: string[];
    budgetAllocation: {
      prospecting: number;
      retargeting: number;
      brandAwareness: number;
    };
    retargetingStrategy: string;
  };
  seoWeb: {
    seoImprovements: string[];
    headlines: SEOHeadline[];
    ctaOptimization: string[];
    landingPageTrustSections: string[];
  };
  leadGen: {
    leadMagnets: string[];
    whatsappAutomation: string[];
    emailCampaigns: EmailCampaign[];
    funnelSteps: string[];
    crmWorkflowSteps: string[];
  };
}

export interface LeadSubmission {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  contactName: string;
  servicesInterestedIn: string[];
  submittedAt: string;
}
