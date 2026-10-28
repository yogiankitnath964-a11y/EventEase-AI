import { EventDetails, EventPlan } from '../types/event';
import { ExpenseItem, BudgetCategory } from '../types/budget';
import { TimelineTask, TaskPhase } from '../types/timeline';
import { Vendor, VendorCategory } from '../types/vendor';
import { GeneratePlanResponse, GeneratedIdeaItem, IdeaCategory } from '../types/ai';
import { calculateDateWithOffset } from '../utils/timelineCalculations';

export function generateDeterministicPlan(event: EventDetails): GeneratePlanResponse {
  const { name, type, date, city, guestCount, totalBudget, currency, theme, setting, dietaryRequirements, additionalInstructions } = event;

  // Adapt color palette to theme and event type
  let colorPalette = [
    { name: 'Royal Violet', hex: '#581c87' },
    { name: 'Lavender Mist', hex: '#c084fc' },
    { name: 'Champagne Gold', hex: '#d97706' },
    { name: 'Ivory Cream', hex: '#fdfbf7' },
  ];

  if (type === 'birthday') {
    colorPalette = [
      { name: 'Electric Purple', hex: '#7c3aed' },
      { name: 'Neon Coral', hex: '#f43f5e' },
      { name: 'Luminous Lavender', hex: '#d8b4fe' },
      { name: 'Midnight Onyx', hex: '#0f172a' },
    ];
  } else if (type === 'community') {
    colorPalette = [
      { name: 'Emerald Forest', hex: '#059669' },
      { name: 'Lavender Wildflower', hex: '#c084fc' },
      { name: 'Earthy Terracotta', hex: '#ea580c' },
      { name: 'Warm Canvas', hex: '#fef3c7' },
    ];
  }

  // Dietary note summary
  const dietaryNote = dietaryRequirements.length > 0
    ? dietaryRequirements.join(', ')
    : 'Standard balanced menu with universal vegetarian options';

  // Per-guest catering estimate calculation
  const cateringBudgetShare = totalBudget * 0.32;
  const perGuestEst = guestCount > 0 ? Math.max(15, Math.round(cateringBudgetShare / guestCount)) : 45;

  const concept = `An unforgettable ${type} celebration titled "${name}" designed exclusively for ${guestCount} guests in ${city}. The experience weaves ${theme || 'elegant festive'} aesthetics across a ${setting} setting, prioritizing smooth guest transitions, culinary delight accommodating ${dietaryNote}, and immersive memories.`;

  const themeDescription = `${theme || 'Curated Celebration'} — sophisticated interplay of ${colorPalette.map(c => c.name).join(', ')}.`;

  const plan: EventPlan = {
    concept,
    themeDescription,
    colorPalette,
    venueRecommendations: [
      {
        nameType: setting === 'outdoor' ? `Premier Open-Air Garden or Meadow Estate in ${city}` : setting === 'indoor' ? `Boutique Architectural Hall or Luxury Lounge in ${city}` : `Indoor-Outdoor Glasshouse or Courtyard Estate in ${city}`,
        suitability: `Perfect capacity for ${guestCount} guests with dedicated catering staging area and accessible restrooms.`,
        estimatedCostRange: `${currency === 'INR' ? '₹' : '$'}${Math.round(totalBudget * 0.25).toLocaleString()} – ${currency === 'INR' ? '₹' : '$'}${Math.round(totalBudget * 0.32).toLocaleString()}`,
      },
      {
        nameType: `Modern Panoramic Event Space with City Views in ${city}`,
        suitability: 'High ceilings, acoustic treatment, customizable lighting rigs, and ample on-site parking.',
        estimatedCostRange: `${currency === 'INR' ? '₹' : '$'}${Math.round(totalBudget * 0.20).toLocaleString()} – ${currency === 'INR' ? '₹' : '$'}${Math.round(totalBudget * 0.28).toLocaleString()}`,
      },
    ],
    cateringSuggestions: {
      menuStyle: type === 'wedding'
        ? 'Curated Live Culinary Action Stations & Artisanal Dessert Trio'
        : type === 'birthday'
        ? 'Interactive Gourmet Sliders, Taco Bar & Signature Mocktails/Cocktails'
        : 'Farm-to-Table Community Grazing Tables & Local Refreshments',
      dietaryAccommodations: `Strict separation and verified labeling for: ${dietaryNote}.`,
      perGuestEstimate: perGuestEst,
    },
    entertainmentAndActivities: [
      type === 'wedding'
        ? 'Live acoustic string duo for arrivals, transitioning to a high-energy DJ and saxophonist for the evening.'
        : type === 'birthday'
        ? 'Curated interactive trivia tournament, custom retro photo booth with instant digital sharing, and DJ dance set.'
        : 'Live regional acoustic bands, family craft/workshop pavilion, and local artisan showcase.',
      'Memory keepsake guestbook station with instant Polaroid snaps and gold ink pens.',
      'Signature welcome refreshment toast with custom labeled glassware.',
    ],
    budgetSavingAlternatives: [
      'Repurpose ceremony floral arrangements as evening banquet centerpieces and photo backdrop.',
      'Negotiate bundled sound and basic lighting directly with the venue rather than third-party transport fees.',
      'Opt for a boutique display cake paired with sheet cakes served smoothly from the catering pantry.',
    ],
    contingencyPlans: [
      {
        risk: setting === 'outdoor' || setting === 'hybrid' ? 'Sudden rain or adverse weather' : 'Power surge or AV equipment failure',
        solution: setting === 'outdoor' || setting === 'hybrid'
          ? 'Contract terms stipulate a 4-hour advance marquee canopy deployment or backup indoor hall guarantee.'
          : 'Venue engineer on standby with independent auxiliary backup generator and dual audio lines.',
      },
      {
        risk: 'Higher-than-anticipated RSVP turnout',
        solution: 'Catering contract includes a standard 10% flexible overage buffer on appetizers and beverage reserves.',
      },
    ],
    generatedAt: new Date().toISOString(),
    isAiGenerated: false,
    provider: 'deterministic-demo',
  };

  // Build suggested expenses aligned to total budget
  const suggestedExpenses: Omit<ExpenseItem, 'id' | 'eventId' | 'createdAt'>[] = [
    {
      category: 'venue' as BudgetCategory,
      name: `${city} Event Venue Rental & Facility Fee`,
      estimatedCost: Math.round(totalBudget * 0.28),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Includes 8-hour access, baseline cleanup, and bridal/prep suites.`,
    },
    {
      category: 'catering' as BudgetCategory,
      name: `Full Catering & Beverage Service (${guestCount} guests)`,
      estimatedCost: Math.round(totalBudget * 0.30),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Estimated at ~${perGuestEst} per guest plus service staff.`,
    },
    {
      category: 'decor' as BudgetCategory,
      name: `Theme Styling, Florals & Ambient Lighting`,
      estimatedCost: Math.round(totalBudget * 0.14),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Color palette: ${colorPalette.map(c => c.name).join(', ')}.`,
    },
    {
      category: 'photography' as BudgetCategory,
      name: `Professional Photography & Highlights Reel`,
      estimatedCost: Math.round(totalBudget * 0.10),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Coverage of key milestones, guest portraits, and online digital gallery.`,
    },
    {
      category: 'entertainment' as BudgetCategory,
      name: `Sound System, DJ & Live Performers`,
      estimatedCost: Math.round(totalBudget * 0.08),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Includes PA speakers, wireless microphones, and curated music sets.`,
    },
    {
      category: 'attire' as BudgetCategory,
      name: `Event Attire, Grooming & Beauty Services`,
      estimatedCost: Math.round(totalBudget * 0.05),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Hair, makeup styling, and day-of touchups.`,
    },
    {
      category: 'miscellaneous' as BudgetCategory,
      name: `Invitations, Signage & Contingency Reserve`,
      estimatedCost: Math.round(totalBudget * 0.05),
      actualCost: 0,
      paymentStatus: 'pending',
      notes: `Print collateral, favors, and emergency buffer.`,
    },
  ];

  // Build date-aware suggested tasks
  const suggestedTasks: Omit<TimelineTask, 'id' | 'eventId'>[] = [
    {
      title: `Confirm and book venue in ${city}`,
      description: `Review contract cancellation terms, parking permits, and curfew rules.`,
      phase: 'concept_and_venue' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -120),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Venue',
    },
    {
      title: `Select and schedule tasting with caterer`,
      description: `Confirm menu addressing ${dietaryNote}.`,
      phase: 'vendors_and_styling' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -75),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Catering',
    },
    {
      title: `Finalize decor mockups and color palette`,
      description: `Source swatches for ${colorPalette.map(c => c.name).join(', ')}.`,
      phase: 'vendors_and_styling' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -60),
      priority: 'medium',
      isCompleted: false,
      assignedCategory: 'Decor',
    },
    {
      title: `Send out official invitations with RSVP deadline`,
      description: `Collect dietary preferences and plus-one confirmations.`,
      phase: 'invites_and_details' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -45),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Invitations',
    },
    {
      title: `Lock in final guest headcount with caterer and venue`,
      description: `Submit final seating arrangement and dietary counts.`,
      phase: 'final_prep' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -14),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Planning',
    },
    {
      title: `Vendor confirmation call and arrival schedule distribution`,
      description: `Share vendor contact sheet with load-in time slots.`,
      phase: 'final_prep' as TaskPhase,
      dueDate: calculateDateWithOffset(date, -5),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Coordination',
    },
    {
      title: `Day-of morning venue inspection and stage soundcheck`,
      description: `Verify floral placement, microphone levels, and registration desk.`,
      phase: 'event_day' as TaskPhase,
      dueDate: calculateDateWithOffset(date, 0),
      priority: 'high',
      isCompleted: false,
      assignedCategory: 'Execution',
    },
  ];

  // Build suggested vendors
  const suggestedVendors: Omit<Vendor, 'id' | 'eventId'>[] = [
    {
      name: `Signature ${city} Grand Pavilion`,
      category: 'venue' as VendorCategory,
      contactPerson: 'Event Sales Director',
      email: `reservations@${city.toLowerCase().replace(/[^a-z]/g, '')}events.example.com`,
      phone: '+1 (555) 234-5678',
      estimatedCost: Math.round(totalBudget * 0.28),
      actualCost: 0,
      bookingStatus: 'quoted',
      paymentStatus: 'pending',
      notes: `Includes indoor ballroom and private courtyard.`,
      isSample: true,
    },
    {
      name: `Artisanal Epicurean Catering`,
      category: 'catering' as VendorCategory,
      contactPerson: 'Lead Catering Coordinator',
      email: 'service@artisanalepicurean.example.com',
      phone: '+1 (555) 345-6789',
      estimatedCost: Math.round(totalBudget * 0.30),
      actualCost: 0,
      bookingStatus: 'inquiry',
      paymentStatus: 'pending',
      notes: `Specializes in multi-dietary catering with live cooking stations.`,
      isSample: true,
    },
    {
      name: `Prism & Petal Design Studio`,
      category: 'decor_florals' as VendorCategory,
      contactPerson: 'Creative Floral Director',
      email: 'studio@prismpetal.example.com',
      phone: '+1 (555) 456-7890',
      estimatedCost: Math.round(totalBudget * 0.14),
      actualCost: 0,
      bookingStatus: 'inquiry',
      paymentStatus: 'pending',
      notes: `Curates bespoke floral arches and ambient table scapes.`,
      isSample: true,
    },
    {
      name: `Aura Lens Photography & Cinema`,
      category: 'photography_videography' as VendorCategory,
      contactPerson: 'Principal Photographer',
      email: 'bookings@auralensmedia.example.com',
      phone: '+1 (555) 567-8901',
      estimatedCost: Math.round(totalBudget * 0.10),
      actualCost: 0,
      bookingStatus: 'inquiry',
      paymentStatus: 'pending',
      notes: `Includes full-day digital capture and short film summary.`,
      isSample: true,
    },
  ];

  return {
    success: true,
    isAiGenerated: false,
    provider: 'deterministic-demo',
    plan,
    suggestedExpenses,
    suggestedTasks,
    suggestedVendors,
    message: 'Generated personalized blueprint via high-fidelity Deterministic Planner.',
  };
}

export function generateDeterministicIdeas(
  category: IdeaCategory,
  eventType: string,
  theme?: string
): GeneratedIdeaItem[] {
  const currentTheme = theme || 'Festive & Elegant';

  switch (category) {
    case 'invitation_text':
      return [
        {
          title: 'Poetic & Warm Classic Invitation',
          content: `With joyful hearts and cherished memories in the making, we cordially invite you to celebrate with us as we mark this unforgettable milestone. Join us for an evening of warmth, laughter, and heartfelt celebration.`,
          tags: ['Formal', 'Heartfelt', 'Classic'],
          tips: 'Ideal for physical print cards with foil stamping.',
        },
        {
          title: 'Modern & Vibrant Casual Invite',
          content: `Good vibes, great music, and unforgettable stories! We are turning up the celebration and can’t wait to have our favorite people under one roof. Save the date and bring your best dancing shoes!`,
          tags: ['Modern', 'Casual', 'Energetic'],
          tips: 'Perfect for WhatsApp, email, or digital event landing pages.',
        },
        {
          title: 'Intimate & Storyteller Tone',
          content: `Every chapter is made sweeter by the people who share it. You have been an essential part of our journey, and your presence would mean the world as we celebrate this special day together.`,
          tags: ['Intimate', 'Warm', 'Personal'],
          tips: 'Pairs beautifully with a personal photo memory.',
        },
      ];

    case 'decor_concepts':
      return [
        {
          title: 'Cascading Lavender & Candlelight Glow',
          content: `Suspended lavender wisteria blooms intertwined with fairy micro-LED strands creating a starry celestial canopy above guest tables. Brushed brass hurricane lanterns with glowing pillar candles add intimate warmth.`,
          tags: ['Lavender', 'Lighting', 'Romantic'],
          tips: 'Use flameless flickering LED candles to satisfy indoor venue fire codes.',
        },
        {
          title: 'Modern Minimalist Botanical Arch',
          content: `Asymmetrical gold metal arch adorned with eucalyptus, dried pampas grass, and soft blush roses. Framed with a custom illuminated neon script sign bearing the event slogan or couple’s names.`,
          tags: ['Botanical', 'Minimalist', 'Instagrammable'],
          tips: 'Double as both ceremony backdrop and photo booth feature.',
        },
        {
          title: 'Velvet Lounge & Statement Bar',
          content: `Curated lounge seating with deep plum and lavender velvet armchairs, marble coffee tables, and a dramatic floral spray spilling over a fluted timber beverage bar.`,
          tags: ['Luxury', 'Lounge', 'Cocktail'],
          tips: 'Provides comfortable gathering pockets for elderly guests and intimate chats.',
        },
      ];

    case 'birthday_themes':
      return [
        {
          title: 'Midnight in Paris / Golden Era Speakeasy',
          content: `Dim amber lighting, vintage jazz trumpet quartet, crystal glassware, velvet drapery, and a secret password for entry into the private celebration lounge.`,
          tags: ['Sophisticated', '20s Vintage', 'Music'],
        },
        {
          title: 'Synthwave Neon Odyssey',
          content: `Retro 80s aesthetics with ultraviolet blacklights, geometric neon grid photo backdrops, arcade retro classics, and glowing molecular cocktail bar.`,
          tags: ['Energetic', 'Retro', 'Futuristic'],
        },
        {
          title: 'Garden Sunset BoHo Soirée',
          content: `Low wooden grazing tables with Turkish floor cushions, macramé runners, acoustic indie singer-songwriter, and artisanal stone-baked pizza oven.`,
          tags: ['Outdoor', 'Boho', 'Relaxed'],
        },
      ];

    case 'wedding_elements':
      return [
        {
          title: 'Audio Guestbook Vintage Telephone Station',
          content: `Guests pick up a retro rotary telephone to hear a greeting from the couple, then leave heartfelt voicemails, toasts, and songs recorded digitally into an audio keepsake album.`,
          tags: ['Memories', 'Interactive', 'Audio'],
        },
        {
          title: 'Bespoke Scent Station / Perfume Bar',
          content: `A luxury interactive station where guests can blend their own 10ml travel fragrance using botanical notes like lavender, bergamot, sandalwood, and neroli.`,
          tags: ['Luxury', 'Favors', 'Experiential'],
        },
        {
          title: 'Late Night Midnight Snack Truck',
          content: `Surprise guests at 11:00 PM with mini artisanal grilled cheeses, churro bites with spiced chocolate, and iced espresso shots to reignite energy on the dance floor.`,
          tags: ['Food', 'Surprise', 'Party'],
        },
      ];

    case 'community_activities':
      return [
        {
          title: 'Collaborative Community Canvas Mural',
          content: `A large pre-drawn canvas segmented into mosaic tiles where children and adults paint a section representing community resilience and unity, to be hung permanently in the civic center.`,
          tags: ['Art', 'All-Ages', 'Lasting Impact'],
        },
        {
          title: 'Neighborhood Talent & Acoustic Showcase',
          content: `A 90-minute open-air showcase featuring youth choir, local cultural dance troupes, and acoustic bands with comfortable picnic blanket seating.`,
          tags: ['Music', 'Culture', 'Engagement'],
        },
        {
          title: 'Interactive Seed Bomb & Microgreen Workshop',
          content: `Hands-on station teaching families how to roll clay, soil, and native wildflower seeds into pollinator seed bombs to take home and plant in local garden patches.`,
          tags: ['Eco', 'Educational', 'Families'],
        },
      ];

    case 'sustainable_hacks':
      return [
        {
          title: '100% Potted Plants & Herbs as Centerpieces',
          content: `Replace cut flowers that wither after one night with potted lavender, rosemary, and olive saplings. Guests take them home as living keepsakes, or they are donated to a community garden.`,
          tags: ['Zero-Waste', 'Living Plants', 'Favors'],
        },
        {
          title: 'Digital NFC Wood Badges & QR Program',
          content: `Eliminate paper waste by placing small wooden blocks with engraved QR codes / NFC taps on each table linking directly to digital menus, live photo uploads, and itinerary.`,
          tags: ['Paperless', 'Tech', 'Smart'],
        },
        {
          title: 'Catering Food Rescue Partnership',
          content: `Partner with local verified food recovery organizations (e.g. City Harvest or local shelters) to safely pack and redistribute unserved banquet meals within 3 hours of event conclusion.`,
          tags: ['Social Impact', 'Food Rescue', 'Ethics'],
        },
      ];

    default:
      return [];
  }
}

