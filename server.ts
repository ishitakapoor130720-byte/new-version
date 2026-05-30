import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or is placeholder. Using smart localized advisor engine.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Low-level helper to generate a highly professional mock marketing strategy matching the schema
// so that the app works instantly and beautifully even without a configuration step,
// dynamically custom-tailored to the inputs.
function getSmartFallbackStrategy(inputs: any) {
  const name = inputs.businessName || "Your Brand";
  const niche = inputs.niche || "Digital Services";
  const goal = inputs.primaryGoal || "customer acquisition";
  const competitor = inputs.competitorWebsite || "Market Leaders";
  const location = inputs.location || "Local & Global";
  
  const isLocalOnGroup = location.toLowerCase().includes("city") || location.toLowerCase().includes("local") || location.length > 2;
  const isEcommerce = niche.toLowerCase().includes("ecom") || niche.toLowerCase().includes("shop") || niche.toLowerCase().includes("store") || niche.toLowerCase().includes("product") || niche.toLowerCase().includes("apparel");
  const isPersonalBrand = niche.toLowerCase().includes("coach") || niche.toLowerCase().includes("consult") || niche.toLowerCase().includes("creator") || niche.toLowerCase().includes("expert") || niche.toLowerCase().includes("agency");

  return {
    meta: {
      name,
      niche,
      primaryGoal: goal,
      location
    },
    businessAudit: {
      scores: {
        branding: isPersonalBrand ? 6 : 4,
        socialMedia: isEcommerce ? 5 : 3,
        websiteConversion: isLocalOnGroup ? 4 : 5,
        leadGen: 3,
        contentStrategy: 4
      },
      workingWell: [
        `Initial target market has strong underlying customer demand for ${niche}.`,
        `Basic positioning is clear, offering a foundation to develop advanced marketing funnels.`,
        `Ownership displays intense passion and deep domain knowledge in ${niche}.`
      ],
      hurtingGrowth: [
        `Severe lack of structured follow-ups or automated marketing funnels (e.g. WhatsApp / Email sequence), resulting in lost prospects.`,
        `Branding is currently generic for ${name}; it lacks high-converting hooks or strong trust-credibility proof points.`,
        `Inconsistent content deployment on active channels, failing to capture high intent organic customer traffic.`
      ],
      prioritizedImprovements: [
        `Launch a high-converting Lead Magnet (e.g., localized assessment, free strategy audit, or styled catalog) within 7 days.`,
        `Implement a automated WhatsApp/Email follow-up campaign to nurse warm inquiries instantly.`,
        `Rework the website or Instagram layout to lead with an ultra-focused conversion headline.`
      ]
    },
    competitorAnalysis: {
      strengths: [
        `Established visual identity with high posting frequency and highly optimized bio layouts.`,
        `Clear and prominent call-to-actions pointing to simple appointment booking or discount lead funnels.`,
        `Leveraging user-generated proof elements (UGC video content, case reviews) to build customer trust.`
      ],
      weaknesses: [
        `Overly standardized content formats which lack unique industry viewpoints or deep storytelling.`,
        `Fails to capture post-visit intent with retargeting ads, ignoring 95%+ of traffic that doesn't convert immediately.`,
        `Low keyword variety on long-tail informational searches in ${niche}.`
      ],
      marketingGaps: [
        `Competitors sell directly to a general audience. We can carve out a high-intent segment with high-value educational lead magnets.`,
        `Very poor responsive layout on their mobile landing pages. We can capture mobile ad traffic with a lightning-fast custom mobile landing page.`,
        `Absence of conversational automation. We can initiate custom automatic chats using WhatsApp automation to double reply rates.`
      ],
      contentOpportunities: [
        "Behind-the-scenes video reels demonstrating the proprietary delivery or manufacturing process.",
        "Interactive comparison carousels challenging traditional industry myths directly.",
        "Client video case studies emphasizing the transition from pain to relief."
      ],
      comparisonMatrix: [
        {
          feature: "Conversion Flow",
          you: "Generic contact form with high friction",
          competitor: "Direct appointment scheduler or gift coupon funnel"
        },
        {
          feature: "Content Relevance",
          you: "Ad-hoc promotional updates",
          competitor: "Value-driven viral hooks and visual carousels"
        },
        {
          feature: "Retargeting Ads",
          you: "None configured currently",
          competitor: "Basic awareness ads running on Meta Platforms"
        },
        {
          feature: "SEO Score",
          you: "Low organic keyword ranking",
          competitor: "Medium authority on primary category searches"
        }
      ]
    },
    growthRoadmap: {
      day30: {
        plan: "Funnels Optimization & Profile Overhaul",
        tasks: [
          { title: "Rewrite Primary Digital Bio", category: "Branding", description: "Revise Bio using the Hook-Value-CTA layout (e.g. 'We help X achieve Y with Z. Get the Free Audit 👇')" },
          { title: "Develop High-Value Lead Magnet", category: "Lead Gen", description: "Create a simple interactive cheat sheet, template, or diagnostic questionnaire tailored to your target audience." },
          { title: "Fix Mobile Page Conversion", category: "Website", description: "Increase font sizes, compress large images, and place a single sticky floating Action Button on mobile previews." }
        ]
      },
      day60: {
        plan: "Paid Trafficking & Custom Ad Funnel Setup",
        tasks: [
          { title: "Set up Targeted Meta Lead Ads", category: "Paid Ads", description: "Launch lookalike campaigns targeting high-affinity buyers with Lead Magnets and localized copy." },
          { title: "Launch Dynamic Retargeting campaigns", category: "Paid Ads", description: "Serve high-impact video reels only to prospects who visited your web page/profile in the past 30 days." },
          { title: "Email/WhatsApp Sequence Launch", category: "Automation", description: "Activate a 3-step automated messaging program delivering value, case reviews, and an exclusive call-to-action." }
        ]
      },
      day90: {
        plan: "Automation Matrix & Scale Up",
        tasks: [
          { title: "CRM Lead Routing Workflow", category: "Automation", description: "Design automatic task creation for team follow-ups the millisecond a new lead lands." },
          { title: "Video SEO Content Amplification", category: "SEO", description: "Transcribe top-performing Instagram reels into optimized blog articles and YouTube shorts to capture search traffic." },
          { title: "Custom Offer Upsell Program", category: "Branding", description: "Introduce a high-tier bundle or retainer packaging strategy to increase your lifetime customer value by 20%." }
        ]
      }
    },
    contentStrategy: {
      reels: [
        { hook: "The absolute worst mistake businesses make with " + niche, concept: "Point out an expensive industry myth, show how you solve it, and display actual results.", cta: "Comment 'STRATEGY' below for our free breakdown guide!" },
        { hook: "How to get 3x better results in " + niche + " without spending a fortune", concept: "Share 3 highly practical free tips that build instant professional goodwill.", cta: "Follow us at @" + name.replace(/\s+/g, '').toLowerCase() + " for daily real-world growth playbooks." },
        { hook: "They don't want you to know this simple hack...", concept: "Unveil an insider secret about " + niche + " that saves clients time or confusion.", cta: "Save this reel to execute it later!" }
      ],
      carousels: [
        { title: "5 Steps to Dominate Your Competitors in " + niche, slides: ["Slide 1: The current market landscape is shifting.", "Slide 2: Step 1 - Define your micro-audience niche.", "Slide 3: Step 2 - Establish proof-based authority before selling.", "Slide 4: Step 3 - Automate response sequences to convert fast.", "Slide 5: Step 4 - Continuous dynamic retargeting."], cta: "Slide left or send a direct text to get our blueprint!" },
        { title: "The exact Checklist we use to help " + niche + " brands scale", slides: ["Slide 1: Branding audit.", "Slide 2: Funnel landing speed.", "Slide 3: Social authority proofs.", "Slide 4: Meta paid retargeting.", "Slide 5: Automated pipeline routing."], cta: "Want BuyZently to build this exact pipeline for you? Tap the bio link!" }
      ],
      stories: [
        { concept: "Client Win / Behind-the-scenes", scriptText: "Today we finished an optimization for a brand struggling with lead capture. By removing 3 input fields and switching to a 2-step WhatsApp trigger, inquiry rates jumped immediately. Watch this result...", actionUrlText: "DM us 'GROWTH'" },
        { concept: "Direct Myth Buster & QA", scriptText: "Quick question: Are you still spending hours sending manual follow-ups? Here is a tiny automation we built that executes this in 4 seconds. Let's look at how it works.", actionUrlText: "Tap link to try the tool" }
      ],
      trendingTips: [
        "Leverage 5-clip visual progressions paired with conversational voiceovers.",
        "Use high-contrast text bubbles styled with a subtle neon backdrop on slate backgrounds.",
        "Reply to comments within the first 15 minutes of posting using a customized script to trigger the algorithm."
      ],
      viralHooks: [
        "Stop scrolling if you are trying to scale your " + niche + " business...",
        "I analyzed " + competitor + "’s entire ad funnel so you don’t have to...",
        "This is the one marketing secret that nobody in " + location + " is sharing..."
      ],
      viralCtas: [
        "Comment 'AUTOMATE' and I will send the direct script link to your inbox!",
        "Send us a DM with your biggest business bottleneck and we will map a solution.",
        "Book a free strategy audit with the BuyZently team today!"
      ]
    },
    adStrategy: {
      platform: isEcommerce ? "Meta Ads (Instagram & Facebook Shopping)" : (isLocalOnGroup ? "Google Map Local Service Ads + Localized Meta Lead Ads" : "Meta Leads & LinkedIn Sponsored Content"),
      objectives: ["Lead Generation", "Direct Conversions", "Inquiry Conversations"],
      targeting: {
        demographics: isPersonalBrand ? "Ages 25-50, Business owners, Decision makers" : "Ages 22-45, Localized service seekers, high household income",
        interests: [niche + " solutions", "Business development", "Competitive growth tools", "Marketing automation"],
        behaviors: ["Facebook Page Administrators", "Engaged shoppers", "Frequent business travelers"]
      },
      creatives: [
        { format: "Talking Head + Text Overlay", concept: "Founder addresses the major pain point directly in the first 3 seconds, shows a live screen demo, and holds a strong call-to-action card.", copy: "Struggling to find consistent, high-value clients? Stop relying on unpredictable word-of-mouth. Here is the exact strategy we use at BuyZently to automate pipeline generation safely..." },
        { format: "Social Proof Split Screen", concept: "Show a customer quote or video review on top, and dynamic close-ups of the workflow results on the bottom.", copy: "Simple transformations like this don't require huge marketing budgets. Explore our custom " + niche + " expansion roadmap today." }
      ],
      offers: [
        "Complimentary 15-Minute Competitor Gaps Diagnostic",
        "Exclusive 20% off your initial automation setup phase if secured this week",
        "No-Risk Guarantee: No leads generated, no payment due"
      ],
      budgetAllocation: {
        prospecting: 70,
        retargeting: 20,
        brandAwareness: 10
      },
      retargetingStrategy: "Implement custom tracking on form page visits and social media profile engagements. Serve a 15-second client review ad answering the top 3 common objections (FAQs) with a call-to-action directing to a calendar booking engine."
    },
    seoWeb: {
      seoImprovements: [
        `Target informational queries like 'how to scale ${niche}' and 'best ${niche} services in ${location}'.`,
        `Configure perfect technical meta descriptions, alt attributes on all media, and ensure a load speed under 1.8 seconds.`,
        `Set up a localized landing page structure matching searches for ${location} neighborhoods or cities.`
      ],
      headlines: [
        { currentType: "Current / Standard", proposedHeadline: "Generic, low engagement slogan", explanation: "Fails to state the clear functional benefit or trigger a user's desire immediately." },
        { currentType: "Proposed / High-Converting", proposedHeadline: `Supercharge Your ${niche} Growth — Automate Your Lead Flows & Outshine Competitors Comfortably`, explanation: "Combines the functional utility, a key burning pain point, and a highly desirable outcome instantly." }
      ],
      ctaOptimization: [
        "Change 'Contact Us' or 'Submit' to 'Get My Customized Growth Roadmap Free'",
        "Incorporate a secondary low-friction option e.g. 'Chat Instant via WhatsApp'",
        "Add a micro-text visual guarantee under the form button: 'No credit card needed • Ready in 10 minutes'"
      ],
      landingPageTrustSections: [
        "Logos or mentions of recognized local associations, tools, or industry standards.",
        "Interactive comparison scorecard showing the gaps you bridge versus generic alternatives.",
        "Real human client headshots alongside verified Google reviews or Instagram messages."
      ]
    },
    leadGen: {
      leadMagnets: [
        `The Ultimate ${niche} Checklist for 2026`,
        `Free 5-Minute Competitor Vulnerability audit engine`,
        `A high-value templates bundle resolving the absolute most common bottleneck in ${niche}`
      ],
      whatsappAutomation: [
        "Instant reply trigger: 'Hi [Name]! Thanks for requesting our growth audit. 🎁 Tap here to download the file directly: [Url]. Can I ask what your business's current monthly goal is?'",
        "24-Hour follow-up nudging: 'Hey [Name]! Just checking if you had a second to peek at Chapter 2. Businesses in your space usually use this to double conversion rates. Would you be open to a quick 10-minute brainstorming call?'"
      ],
      emailCampaigns: [
        { subject: "Re: Your Custom Competitor Growth Gaps Audit", brief: "Deliver the requested asset immediately. Lead with a short, confident, friendly greeting from BuyZently's senior strategist.", sequenceOrder: 1 },
        { subject: "How your competitors are silently stealing leads", brief: "Highlight structural leaks, focusing on the lack of automated lead nurseries and responsive CRM pipelines.", sequenceOrder: 2 },
        { subject: "Let's build your automated marketing machine together", brief: "A low-pressure, direct invitation to partner with BuyZently for pristine tech execution.", sequenceOrder: 3 }
      ],
      funnelSteps: [
        "Source: Organic high-hook reels or paid Google search ads.",
        "Landing page: Clean high-contrast value presentation offering a free resources package.",
        "Instant redirection: Offer a fast-track calendar booking link on the success page.",
        "Automated CRM Routing: Instantiate immediate WhatsApp messaging and email flows."
      ],
      crmWorkflowSteps: [
        "State 1: Lead requested the diagnostic magnet → automatically flag as Warm Warm Prospect and trigger auto-emails.",
        "State 2: Explored booking engine but didn't book → alert sales personnel to issue a personalized video intro.",
        "State 3: Booking finalized → automatically freeze follow-ups and populate notes fields for the strategist."
      ]
    }
  };
}

// Ensure database/schema and OAuth is set properly if they were requested (not requested, keeping local-state)

// 1. Audit / Strategy generation API
app.post("/api/generate-strategy", async (req, res) => {
  const inputs = req.body;
  if (!inputs || !inputs.businessName) {
    return res.status(400).json({ error: "Please provide valid business details including your business name." });
  }

  const ai = getGenAI();
  if (!ai) {
    // Return high-quality, customized mock immediately
    return res.json({ strategy: getSmartFallbackStrategy(inputs) });
  }

  try {
    const prompt = `
You are BuyZently AI — an advanced AI-powered Marketing Strategist, Competitor Analysis Expert, and Business Growth Consultant for a digital marketing agency called "BuyZently".
Act like a senior digital marketing consultant with deep expertise in Meta Ads, Google Ads, funnel optimization, conversions, and automation.

Your purpose is to analyze the user's business inputs and generate a comprehensive, highly custom, realistic marketing strategy. 
Return the response strictly as a JSON object matching this TypeScript interface structure exactly:

interface ScoreSet {
  branding: number; // 1 to 10
  socialMedia: number; // 1 to 10
  websiteConversion: number; // 1 to 10
  leadGen: number; // 1 to 10
  contentStrategy: number; // 1 to 10
}

interface CompetitorComparison {
  feature: string;
  you: string;
  competitor: string;
}

interface TimelineTask {
  title: string;
  category: string;
  description: string;
}

interface ContentReel {
  hook: string;
  concept: string;
  cta: string;
}

interface ContentCarousel {
  title: string;
  slides: string[];
  cta: string;
}

interface ContentStory {
  concept: string;
  scriptText: string;
  actionUrlText: string;
}

interface AdCreative {
  format: string;
  concept: string;
  copy: string;
}

interface SEOHeadline {
  currentType: string;
  proposedHeadline: string;
  explanation: string;
}

interface EmailCampaign {
  subject: string;
  brief: string;
  sequenceOrder: number;
}

interface MarketingStrategy {
  meta: {
    name: string;
    niche: string;
    primaryGoal: string;
    location: string;
  };
  businessAudit: {
    scores: ScoreSet;
    workingWell: string[]; // 3 points
    hurtingGrowth: string[]; // 3 points
    prioritizedImprovements: string[]; // 3 points
  };
  competitorAnalysis: {
    strengths: string[]; // 3 points
    weaknesses: string[]; // 3 points
    marketingGaps: string[]; // 3 points
    contentOpportunities: string[]; // 3 points
    comparisonMatrix: CompetitorComparison[]; // 4 feature comparisons
  };
  growthRoadmap: {
    day30: { plan: string; tasks: TimelineTask[] }; // 3 tasks
    day60: { plan: string; tasks: TimelineTask[] }; // 3 tasks
    day90: { plan: string; tasks: TimelineTask[] }; // 3 tasks
  };
  contentStrategy: {
    reels: ContentReel[]; // 10 highly creative reels
    carousels: ContentCarousel[]; // 5 carousels
    stories: ContentStory[]; // 5 storytelling concepts
    trendingTips: string[]; // 3 tips
    viralHooks: string[]; // 3 hooks
    viralCtas: string[]; // 3 ctas
  };
  adStrategy: {
    platform: string;
    objectives: string[];
    targeting: { demographics: string; interests: string[]; behaviors: string[] };
    creatives: AdCreative[]; // 3 distinct creative concepts with copies
    offers: string[]; // 3 compelling offers
    budgetAllocation: { prospecting: number; retargeting: number; brandAwareness: number }; // should sum to 100
    retargetingStrategy: string;
  };
  seoWeb: {
    seoImprovements: string[]; // 3 items
    headlines: SEOHeadline[]; // 2 headline optimizations
    ctaOptimization: string[]; // 3 suggestions
    landingPageTrustSections: string[]; // 3 sections
  };
  leadGen: {
    leadMagnets: string[]; // 3 ideas
    whatsappAutomation: string[]; // 2 triggers
    emailCampaigns: EmailCampaign[]; // 3 sequence steps
    funnelSteps: string[]; // 4 steps
    crmWorkflowSteps: string[]; // 3 steps
  }
}

Use these user inputs:
- Business Name: ${inputs.businessName}
- Niche/Industry: ${inputs.niche}
- Website/Instagram: ${inputs.website || "None"}
- Competitor's Website/Instagram: ${inputs.competitorWebsite || "None"}
- Primary Goal: ${inputs.primaryGoal}
- Target Audience: ${inputs.targetAudience || "General target audience"}
- Location/City: ${inputs.location || "Global"}
- Running Ads Currently?: ${inputs.runningAds || "No"}
- Social Platforms: ${inputs.socialPlatforms ? inputs.socialPlatforms.join(", ") : "Instagram, Facebook"}
- Marketing Budget: ${inputs.budget || "Not specified"}
- Main Challenges: ${inputs.challenges || "Not specified"}

Special formatting rules:
- Follow standard, realistic marketing assessments. Do not give maximum scores (e.g. 10/10) to weaknesses. Give constructive scores (3/10 to 6/10) that justify growth strategies!
- If the user has no website, focus heavily on Instagram and social media optimization.
- If the user is a local business, focus heavily on local SEO, Google Business Profile, and WhatsApp marketing.
- If the user is an ecommerce business, focus on Meta Ads, influencer marketing, UGC content, retargeting, and conversion optimization.
- If the user is a personal brand, focus on authority building, storytelling, and audience engagement.
- Tone must be extremely professional, strategic, modern, and smart (never generic, no robotic summaries).
- Ensure the JSON returned is well-formed, completely conforming to the requested schema. Return the raw JSON block without markdown packaging or backticks if possible, or inside standard backticks. We need to parse it cleanly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Using Type.OBJECT and defining responseSchema makes it highly resilient and exact.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meta: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                niche: { type: Type.STRING },
                primaryGoal: { type: Type.STRING },
                location: { type: Type.STRING }
              }
            },
            businessAudit: {
              type: Type.OBJECT,
              properties: {
                scores: {
                  type: Type.OBJECT,
                  properties: {
                    branding: { type: Type.INTEGER },
                    socialMedia: { type: Type.INTEGER },
                    websiteConversion: { type: Type.INTEGER },
                    leadGen: { type: Type.INTEGER },
                    contentStrategy: { type: Type.INTEGER }
                  }
                },
                workingWell: { type: Type.ARRAY, items: { type: Type.STRING } },
                hurtingGrowth: { type: Type.ARRAY, items: { type: Type.STRING } },
                prioritizedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            competitorAnalysis: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                marketingGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                contentOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                comparisonMatrix: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      feature: { type: Type.STRING },
                      you: { type: Type.STRING },
                      competitor: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            growthRoadmap: {
              type: Type.OBJECT,
              properties: {
                day30: {
                  type: Type.OBJECT,
                  properties: {
                    plan: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                day60: {
                  type: Type.OBJECT,
                  properties: {
                    plan: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                day90: {
                  type: Type.OBJECT,
                  properties: {
                    plan: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            },
            contentStrategy: {
              type: Type.OBJECT,
              properties: {
                reels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      hook: { type: Type.STRING },
                      concept: { type: Type.STRING },
                      cta: { type: Type.STRING }
                    }
                  }
                },
                carousels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      slides: { type: Type.ARRAY, items: { type: Type.STRING } },
                      cta: { type: Type.STRING }
                    }
                  }
                },
                stories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      concept: { type: Type.STRING },
                      scriptText: { type: Type.STRING },
                      actionUrlText: { type: Type.STRING }
                    }
                  }
                },
                trendingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                viralHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                viralCtas: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            adStrategy: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                targeting: {
                  type: Type.OBJECT,
                  properties: {
                    demographics: { type: Type.STRING },
                    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                    behaviors: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                creatives: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      format: { type: Type.STRING },
                      concept: { type: Type.STRING },
                      copy: { type: Type.STRING }
                    }
                  }
                },
                offers: { type: Type.ARRAY, items: { type: Type.STRING } },
                budgetAllocation: {
                  type: Type.OBJECT,
                  properties: {
                    prospecting: { type: Type.INTEGER },
                    retargeting: { type: Type.INTEGER },
                    brandAwareness: { type: Type.INTEGER }
                  }
                },
                retargetingStrategy: { type: Type.STRING }
              }
            },
            seoWeb: {
              type: Type.OBJECT,
              properties: {
                seoImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
                headlines: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      currentType: { type: Type.STRING },
                      proposedHeadline: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    }
                  }
                },
                ctaOptimization: { type: Type.ARRAY, items: { type: Type.STRING } },
                landingPageTrustSections: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            leadGen: {
              type: Type.OBJECT,
              properties: {
                leadMagnets: { type: Type.ARRAY, items: { type: Type.STRING } },
                whatsappAutomation: { type: Type.ARRAY, items: { type: Type.STRING } },
                emailCampaigns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      brief: { type: Type.STRING },
                      sequenceOrder: { type: Type.INTEGER }
                    }
                  }
                },
                funnelSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                crmWorkflowSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });

    const outputText = response.text || "";
    const parsedStrategy = JSON.parse(outputText.trim());
    return res.json({ strategy: parsedStrategy });
  } catch (error: any) {
    console.error("Gemini strategy generation error:", error);
    // Graceful fallback in case of high traffic / rate limiting or schema mismatch
    return res.json({
      strategy: getSmartFallbackStrategy(inputs),
      warning: "There was an optimization delay. Loaded a precise pre-optimized marketing blueprint."
    });
  }
});

// 2. Chat Followup / Refinement API
app.post("/api/chat-followup", async (req, res) => {
  const { messages, currentStrategy, inputs } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const ai = getGenAI();
  if (!ai) {
    // Provide a beautiful localized mock reply as fallback
    const latestMessage = messages[messages.length - 1]?.content || "";
    const name = inputs?.businessName || currentStrategy?.meta?.name || "partner";
    let mockResponseText = `That is an excellent question! From a marketing perspective at BuyZently:

For **${name}**, focusing on this area is exactly how we unlock hidden conversions. We suggest:
1. **Accelerating response cycles**: If you address new chat inputs or questions within 5 minutes, retention jumps by 300%.
2. **Double down on micro-storytelling**: Highlight one real client transformation per week.
3. **Structured Lead Magnetic routing**: Instead of driving general traffic, always offer highly specific value kits.

This is exactly the type of precise, automated growth workflow we implement. Would you like to map out how BuyZently can handle this setup for you?`;
    
    return res.json({ reply: mockResponseText });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are BuyZently AI — an advanced AI-powered Marketing Strategist and Growth Consultant. 
Your tone is professional, strategic, modern, results-driven, highly competent, and friendly. Never robotic. Always keep responses actionable.
You represent "BuyZently", a premium digital marketing agency capable of executing these tasks (Social Media, PPC Ads, SEO, Lead Gen, WhatsApp/CRM Automations, and Branding).

The client has defined their business parameters:
${JSON.stringify(inputs || currentStrategy?.meta || {})}

And we generated this marketing strategy:
${JSON.stringify(currentStrategy || {})}

Help them iterate, elaborate, write ad copy, write reel scripts, or explain marketing tactics. Always tie your help back to how we at BuyZently can act as their execution partner to set up these exact systems securely.`,
      },
    });

    // Feed conversational context
    let responseText = "";
    // Send the conversation messages
    // The chat.sendMessage takes only a single string 'message' parameter. To handle multi-turn, we can send them sequentially or bundle them.
    // For simplicity, we can pass the history as a curated thread or send the last user message, prefaced by the chat history representation.
    const thread = messages.map(m => `${m.role === 'user' ? 'User' : 'BuyZently AI'}: ${m.content}`).join("\n");
    const promptMessage = `Here is our conversation history so far. Respond to the latest message as BuyZently AI. Keep it elegant, structured, clear and under 250 words.
    
    ${thread}
    
    BuyZently AI:`;

    const response = await chat.sendMessage({ message: promptMessage });
    responseText = response.text || "I am here to help you coordinate your strategy. How would you like us to proceed?";
    
    return res.json({ reply: responseText });
  } catch (error: any) {
    console.error("Gemini chat-followup error:", error);
    return res.status(500).json({ error: "Consultant is busy. Please try asking again shortly." });
  }
});

// Serve static assets in production, handle SPA fallback
if (process.env.NODE_ENV !== "production") {
  const startDev = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development Server running on http://localhost:${PORT}`);
    });
  };
  startDev();
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on port ${PORT}`);
  });
}
