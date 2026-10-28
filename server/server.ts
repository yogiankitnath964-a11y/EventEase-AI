import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 5),
    model: GEMINI_MODEL,
    serverTime: new Date().toISOString(),
  });
});

// Helper for deterministic fallback on server
function getDeterministicPlan(event: any) {
  const { name, type, date, city, guestCount, totalBudget, currency, theme, setting, dietaryRequirements } = event;
  const safeBudget = Number(totalBudget) || 10000;
  const safeGuests = Number(guestCount) || 50;

  const colorPalettes: Record<string, any[]> = {
    wedding: [
      { name: 'Royal Violet', hex: '#581c87' },
      { name: 'Botanical Lavender', hex: '#c084fc' },
      { name: 'Champagne Gold', hex: '#d97706' },
      { name: 'Ivory Cream', hex: '#fdfbf7' },
    ],
    birthday: [
      { name: 'Electric Purple', hex: '#7c3aed' },
      { name: 'Neon Coral', hex: '#f43f5e' },
      { name: 'Luminous Lavender', hex: '#d8b4fe' },
      { name: 'Midnight Onyx', hex: '#0f172a' },
    ],
    community: [
      { name: 'Emerald Forest', hex: '#059669' },
      { name: 'Lavender Wildflower', hex: '#c084fc' },
      { name: 'Earthy Terracotta', hex: '#ea580c' },
      { name: 'Warm Canvas', hex: '#fef3c7' },
    ],
  };

  const palette = colorPalettes[type] || colorPalettes.wedding;

  return {
    success: true,
    isAiGenerated: false,
    provider: 'deterministic-demo',
    plan: {
      concept: `A tailor-made ${type} celebration titled "${name}" designed for ${safeGuests} guests in ${city}. Harmonizes ${theme || 'elegant festive'} motifs within a ${setting} setting.`,
      themeDescription: `${theme || 'Curated Celebration'} — sophisticated interplay of ${palette.map(c => c.name).join(', ')}.`,
      colorPalette: palette,
      venueRecommendations: [
        {
          nameType: `Signature ${setting === 'outdoor' ? 'Lawn & Estate' : 'Boutique Hall'} in ${city}`,
          suitability: `Comfortably seats ${safeGuests} guests with dedicated catering staging area and parking.`,
          estimatedCostRange: `${currency === 'INR' ? '₹' : '$'}${Math.round(safeBudget * 0.25).toLocaleString()} – ${currency === 'INR' ? '₹' : '$'}${Math.round(safeBudget * 0.32).toLocaleString()}`,
        },
      ],
      cateringSuggestions: {
        menuStyle: type === 'wedding'
          ? 'Live Culinary Tasting Stations & Artisanal Dessert Trio'
          : 'Interactive Gourmet Sliders, Taco Bar & Signature Mocktails',
        dietaryAccommodations: dietaryRequirements?.length ? dietaryRequirements.join(', ') : 'Standard balanced menu with vegetarian options',
        perGuestEstimate: Math.max(20, Math.round((safeBudget * 0.32) / Math.max(1, safeGuests))),
      },
      entertainmentAndActivities: [
        'Acoustic fusion live musicians during arrivals and cocktail hour',
        'Custom interactive photo booth station with instant Polaroid and digital album link',
        'DJ set tailored to guest preferences and evening celebration dance floor',
      ],
      budgetSavingAlternatives: [
        'Repurpose ceremony floral arrangements as evening banquet centerpieces.',
        'Negotiate bundled audio/visual packages directly with venue.',
      ],
      contingencyPlans: [
        {
          risk: setting === 'outdoor' ? 'Sudden rain or adverse weather' : 'Power or AV equipment glitch',
          solution: setting === 'outdoor' ? 'Venue includes 4-hour advance marquee canopy deployment.' : 'On-call venue technician with backup generator.',
        },
      ],
      generatedAt: new Date().toISOString(),
      isAiGenerated: false,
      provider: 'deterministic-demo',
    },
    suggestedExpenses: [
      {
        category: 'venue',
        name: `${city} Event Venue Rental & Facility Fee`,
        estimatedCost: Math.round(safeBudget * 0.28),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: 'Includes access, baseline cleanup, and event coordinator check-in.',
      },
      {
        category: 'catering',
        name: `Full Catering & Beverage Service (${safeGuests} guests)`,
        estimatedCost: Math.round(safeBudget * 0.30),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: 'Includes appetizer rounds, main buffet/stations, and service staff.',
      },
      {
        category: 'decor',
        name: 'Themed Decor, Florals & Ambient Lighting',
        estimatedCost: Math.round(safeBudget * 0.14),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: `Palette: ${palette.map(c => c.name).join(', ')}.`,
      },
      {
        category: 'photography',
        name: 'Professional Photography & Cinematic Highlights',
        estimatedCost: Math.round(safeBudget * 0.10),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: 'Full milestone capture, online proofing gallery, and high-res downloads.',
      },
      {
        category: 'entertainment',
        name: 'Live Music, Sound Rig & DJ Service',
        estimatedCost: Math.round(safeBudget * 0.08),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: 'Includes wireless microphones and sound engineer.',
      },
      {
        category: 'miscellaneous',
        name: 'Stationery, Favors & Contingency Reserve',
        estimatedCost: Math.round(safeBudget * 0.10),
        actualCost: 0,
        paymentStatus: 'pending',
        notes: 'Emergency buffer and miscellaneous items.',
      },
    ],
    suggestedTasks: [
      {
        title: `Confirm venue booking in ${city}`,
        description: 'Review contract terms, cancellation clauses, and curfew rules.',
        phase: 'concept_and_venue',
        dueDate: date,
        priority: 'high',
        isCompleted: false,
        assignedCategory: 'Venue',
      },
      {
        title: 'Conduct catering tasting and lock in menu',
        description: 'Ensure accommodation of all specified dietary preferences.',
        phase: 'vendors_and_styling',
        dueDate: date,
        priority: 'high',
        isCompleted: false,
        assignedCategory: 'Catering',
      },
      {
        title: 'Dispatch invitations and track RSVPs',
        description: 'Collect dietary restrictions and headcount confirmations.',
        phase: 'invites_and_details',
        dueDate: date,
        priority: 'high',
        isCompleted: false,
        assignedCategory: 'Invitations',
      },
      {
        title: 'Final vendor walkthrough and day-of timeline sign-off',
        description: 'Distribute arrival schedules to all service partners.',
        phase: 'final_prep',
        dueDate: date,
        priority: 'high',
        isCompleted: false,
        assignedCategory: 'Coordination',
      },
    ],
    suggestedVendors: [
      {
        name: `Grand ${city} Premier Event Space`,
        category: 'venue',
        contactPerson: 'Lead Coordinator',
        email: `events@grand${city.toLowerCase().replace(/[^a-z]/g, '')}.example.com`,
        phone: '+1 (555) 012-3456',
        estimatedCost: Math.round(safeBudget * 0.28),
        actualCost: 0,
        bookingStatus: 'quoted',
        paymentStatus: 'pending',
        notes: 'Includes audio/video hookups and setup assistance.',
        isSample: true,
      },
      {
        name: 'Gourmet Epicurean Catering Group',
        category: 'catering',
        contactPerson: 'Executive Chef Team',
        email: 'tastings@epicureangroup.example.com',
        phone: '+1 (555) 012-7890',
        estimatedCost: Math.round(safeBudget * 0.30),
        actualCost: 0,
        bookingStatus: 'inquiry',
        paymentStatus: 'pending',
        notes: 'Specializes in accommodating dietary preferences with certified service staff.',
        isSample: true,
      },
    ],
  };
}

// AI Plan Generation Endpoint
app.post('/api/plan', async (req: Request, res: Response) => {
  const { event } = req.body;

  if (!event || !event.name || !event.date) {
    return res.status(400).json({ error: 'Missing required event details (name, date).' });
  }

  // If Gemini API key is missing, return deterministic blueprint
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim().length < 6) {
    return res.json(getDeterministicPlan(event));
  }

  try {
    const prompt = `You are a world-class professional event planning architect and budgeting specialist.
Create a complete, highly personalized, and mathematically realistic event blueprint.

Event Details:
- Name: "${event.name}"
- Type: ${event.type}
- Date: ${event.date}
- Location: ${event.city}
- Guest Count: ${event.guestCount}
- Total Budget: ${event.totalBudget} ${event.currency}
- Theme & Aesthetic: ${event.theme || 'Elegant celebration'}
- Setting: ${event.setting}
- Dietary Requirements: ${event.dietaryRequirements?.join(', ') || 'Standard balanced'}
- Additional Instructions: ${event.additionalInstructions || 'None'}

Return ONLY valid JSON matching this exact structure:
{
  "plan": {
    "concept": "2-3 sentences describing the immersive event narrative",
    "themeDescription": "Detailed theme aesthetics and atmosphere",
    "colorPalette": [
      { "name": "Color Name", "hex": "#HEX" }
    ],
    "venueRecommendations": [
      {
        "nameType": "Specific type of venue in city",
        "suitability": "Why this venue matches guest count and setting",
        "estimatedCostRange": "Cost range string"
      }
    ],
    "cateringSuggestions": {
      "menuStyle": "Menu style description",
      "dietaryAccommodations": "How dietary requirements are met",
      "perGuestEstimate": 45
    },
    "entertainmentAndActivities": [
      "Activity or performance idea 1",
      "Activity or performance idea 2",
      "Activity or performance idea 3"
    ],
    "budgetSavingAlternatives": [
      "Practical cost-saving suggestion 1",
      "Practical cost-saving suggestion 2"
    ],
    "contingencyPlans": [
      {
        "risk": "Potential risk",
        "solution": "Actionable mitigation"
      }
    ]
  },
  "suggestedExpenses": [
    {
      "category": "venue" | "catering" | "decor" | "photography" | "entertainment" | "attire" | "logistics" | "miscellaneous",
      "name": "Expense item name",
      "estimatedCost": 2500,
      "actualCost": 0,
      "paymentStatus": "pending",
      "notes": "Short note"
    }
  ],
  "suggestedTasks": [
    {
      "title": "Task title",
      "description": "Short details",
      "phase": "concept_and_venue" | "vendors_and_styling" | "invites_and_details" | "final_prep" | "event_day",
      "dueDate": "YYYY-MM-DD",
      "priority": "high" | "medium" | "low",
      "isCompleted": false,
      "assignedCategory": "Category"
    }
  ],
  "suggestedVendors": [
    {
      "name": "Vendor Name",
      "category": "venue" | "catering" | "decor_florals" | "photography_videography" | "music_dj_entertainment" | "planner_coordinator",
      "contactPerson": "Contact name",
      "email": "email@example.com",
      "phone": "+1 (555) ...",
      "estimatedCost": 1500,
      "actualCost": 0,
      "bookingStatus": "inquiry" | "quoted" | "booked",
      "paymentStatus": "pending",
      "notes": "Details",
      "isSample": true
    }
  ]
}

Ensure the sum of estimatedCost across suggestedExpenses approximately matches the user's Total Budget of ${event.totalBudget}.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.7,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiRes.ok) {
      console.warn(`Gemini API error ${apiRes.status}:`, await apiRes.text());
      return res.json(getDeterministicPlan(event));
    }

    const data: any = await apiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.json(getDeterministicPlan(event));
    }

    const parsed = JSON.parse(rawText);
    return res.json({
      success: true,
      isAiGenerated: true,
      provider: 'gemini',
      plan: {
        ...parsed.plan,
        generatedAt: new Date().toISOString(),
        isAiGenerated: true,
        provider: 'gemini',
      },
      suggestedExpenses: parsed.suggestedExpenses || [],
      suggestedTasks: parsed.suggestedTasks || [],
      suggestedVendors: parsed.suggestedVendors || [],
    });
  } catch (err) {
    console.warn('Gemini request failed, falling back to deterministic plan:', err);
    return res.json(getDeterministicPlan(event));
  }
});

// AI Ideas Generator Endpoint
app.post('/api/ideas', async (req: Request, res: Response) => {
  const { category, eventType, theme, guestCount, city, additionalPrompt } = req.body;

  if (!category) {
    return res.status(400).json({ error: 'Missing idea category' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim().length < 6) {
    // Return sample ideas
    return res.json({
      success: true,
      isAiGenerated: false,
      provider: 'deterministic-demo',
      ideas: [
        {
          title: `Curated ${category.replace('_', ' ')} Concept`,
          content: `Bespoke creative direction tailored for a ${eventType || 'milestone'} celebration in ${city || 'your city'}. Focuses on immersive attendee participation and aesthetic harmony.`,
          tags: ['Curated', 'Inspiration', 'Atmosphere'],
          tips: 'Combine with soft ambient lighting for maximum visual impact.',
        },
      ],
    });
  }

  try {
    const prompt = `Generate 3 innovative, highly creative ideas for category "${category}" in a ${eventType} event with theme "${theme || 'Festive'}".
Guest count: ${guestCount || 50}, City: ${city || 'General'}.
Additional prompt: ${additionalPrompt || 'None'}

Return ONLY valid JSON:
{
  "ideas": [
    {
      "title": "Creative Title",
      "content": "Rich 2-3 sentence concept description",
      "tags": ["Tag1", "Tag2"],
      "tips": "Practical execution tip"
    }
  ]
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.8,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const data: any = await apiRes.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return res.json({
          success: true,
          isAiGenerated: true,
          provider: 'gemini',
          ideas: parsed.ideas || [],
        });
      }
    }
  } catch (err) {
    console.warn('Gemini ideas call failed:', err);
  }

  return res.json({
    success: true,
    isAiGenerated: false,
    provider: 'deterministic-demo',
    ideas: [],
  });
});

app.listen(PORT, () => {
  console.log(`EventEase AI server listening on http://localhost:${PORT}`);
  console.log(`AI Provider: ${GEMINI_API_KEY ? 'Google Gemini (' + GEMINI_MODEL + ')' : 'Deterministic Demo Mode'}`);
});

