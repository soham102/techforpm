/**
 * Static content for the PM Interview Prep page. Kept in one module so
 * the page stays declarative and the data is easy to extend.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface QuestionCategory {
  id: string;
  title: string;
  icon: string; // lucide-react icon name
  blurb: string;
  sample: string;
  difficulty: Difficulty;
  frequency: "Very High" | "High" | "Medium";
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "product-sense",
    title: "Product Sense",
    icon: "Lightbulb",
    blurb:
      "Show you deeply understand users and can spot opportunities worth building.",
    sample: "What's a product you love and how would you make it 10x better?",
    difficulty: "Intermediate",
    frequency: "Very High",
  },
  {
    id: "product-design",
    title: "Product Design",
    icon: "PenTool",
    blurb:
      "Design a product or feature end-to-end, from user pain to success metrics.",
    sample: "Design a fitness app for people who hate working out.",
    difficulty: "Intermediate",
    frequency: "Very High",
  },
  {
    id: "metrics",
    title: "Metrics & Analytics",
    icon: "LineChart",
    blurb:
      "Define what success looks like and diagnose what the numbers are telling you.",
    sample: "How would you measure the success of Instagram Reels?",
    difficulty: "Intermediate",
    frequency: "Very High",
  },
  {
    id: "estimation",
    title: "Estimation / Guesstimates",
    icon: "Calculator",
    blurb:
      "Break a huge unknown into a structured, defensible back-of-envelope number.",
    sample: "Estimate the number of restaurants in Mumbai.",
    difficulty: "Beginner",
    frequency: "High",
  },
  {
    id: "execution",
    title: "Execution",
    icon: "Gauge",
    blurb:
      "A metric dropped — walk through how you'd investigate, isolate, and act.",
    sample: "DAU dropped 8% week-over-week. What do you do?",
    difficulty: "Advanced",
    frequency: "High",
  },
  {
    id: "behavioral",
    title: "Behavioral",
    icon: "Users",
    blurb:
      "Prove you can lead without authority, handle conflict, and learn from failure.",
    sample: "Tell me about a time you shipped something that failed.",
    difficulty: "Beginner",
    frequency: "Very High",
  },
  {
    id: "strategy",
    title: "Strategy",
    icon: "Map",
    blurb:
      "Reason about markets, moats, and where a company should place its bets.",
    sample: "Should YouTube enter the podcasting market?",
    difficulty: "Advanced",
    frequency: "Medium",
  },
  {
    id: "technical",
    title: "Technical Collaboration",
    icon: "Cpu",
    blurb:
      "Speak engineering's language enough to make sound trade-off decisions.",
    sample: "Explain what an API is and why it matters for this feature.",
    difficulty: "Intermediate",
    frequency: "Medium",
  },
  {
    id: "prioritization",
    title: "Prioritization",
    icon: "ListChecks",
    blurb:
      "Given limited resources, decide what to build now, next, and never.",
    sample: "You have 5 features and one sprint. How do you choose?",
    difficulty: "Beginner",
    frequency: "High",
  },
  {
    id: "rca",
    title: "Root Cause Analysis",
    icon: "Search",
    blurb:
      "Move past symptoms to the real cause before proposing any fix.",
    sample: "Checkout conversion fell 15% overnight. Why?",
    difficulty: "Advanced",
    frequency: "Medium",
  },
];

export interface ApproachStep {
  title: string;
  detail: string;
}

export interface ApproachTrack {
  id: string;
  label: string;
  steps: ApproachStep[];
}

export const APPROACH_TRACKS: ApproachTrack[] = [
  {
    id: "design",
    label: "Product Design",
    steps: [
      {
        title: "Clarify the goal",
        detail:
          "Restate the question. Ask what success means and what constraints exist before designing anything.",
      },
      {
        title: "Identify the users",
        detail:
          "List 2–3 user segments and pick one to focus on. Be explicit about why that segment.",
      },
      {
        title: "Understand pain points",
        detail:
          "Map the user's journey and find the sharpest, most frequent frustrations.",
      },
      {
        title: "Prioritize use cases",
        detail:
          "Rank pain points by impact and frequency. Anchor on the highest-leverage one.",
      },
      {
        title: "Brainstorm solutions",
        detail:
          "Generate 3+ distinct ideas before converging. Show breadth, then pick.",
      },
      {
        title: "Define success metrics",
        detail:
          "State the one metric that proves the solution worked, plus a guardrail metric.",
      },
      {
        title: "Discuss trade-offs",
        detail:
          "Name what you're sacrificing and why it's acceptable. This signals seniority.",
      },
    ],
  },
  {
    id: "metrics-track",
    label: "Metrics Question",
    steps: [
      {
        title: "Clarify the product & goal",
        detail:
          "What stage is the product in? Growth, engagement, or monetization focus?",
      },
      {
        title: "Map the user journey",
        detail:
          "Acquisition → activation → engagement → retention → revenue.",
      },
      {
        title: "Pick a North Star",
        detail:
          "Choose the single metric that best captures delivered value.",
      },
      {
        title: "Add input metrics",
        detail:
          "Identify the levers that move the North Star upstream.",
      },
      {
        title: "Add guardrails",
        detail:
          "Counter-metrics that catch gaming or unintended harm.",
      },
      {
        title: "Segment & sanity-check",
        detail:
          "Slice by cohort/platform; pressure-test against edge cases.",
      },
    ],
  },
  {
    id: "estimation-track",
    label: "Estimation",
    steps: [
      {
        title: "Clarify scope",
        detail:
          "Define exactly what you're counting and the boundaries of the estimate.",
      },
      {
        title: "Choose an approach",
        detail:
          "Top-down (population) or bottom-up (per-unit). State which and why.",
      },
      {
        title: "Break into drivers",
        detail:
          "Decompose into variables you can reason about individually.",
      },
      {
        title: "Assign reasonable numbers",
        detail:
          "Use round, defensible assumptions. Say them out loud.",
      },
      {
        title: "Calculate stepwise",
        detail:
          "Multiply through cleanly so the interviewer can follow.",
      },
      {
        title: "Sanity-check",
        detail:
          "Does the order of magnitude feel right? Adjust and state confidence.",
      },
    ],
  },
];

export interface Framework {
  id: string;
  name: string;
  expansion: string;
  purpose: string;
  whenToUse: string;
  example: string;
  steps: string[];
  tags: string[];
}

export const FRAMEWORKS: Framework[] = [
  {
    id: "circles",
    name: "CIRCLES",
    expansion: "Comprehend · Identify · Report · Cut · List · Evaluate · Summarize",
    purpose: "A complete structure for product design questions.",
    whenToUse: "“Design a product / improve X” prompts.",
    example: "Design a ride-share app for senior citizens.",
    steps: [
      "Comprehend the situation",
      "Identify the customer",
      "Report customer needs",
      "Cut through prioritization",
      "List solutions",
      "Evaluate trade-offs",
      "Summarize recommendation",
    ],
    tags: ["Design", "End-to-end"],
  },
  {
    id: "aarrr",
    name: "AARRR",
    expansion: "Acquisition · Activation · Retention · Revenue · Referral",
    purpose: "Pirate-metrics funnel for growth & metrics questions.",
    whenToUse: "Growth, funnel, or metrics-definition prompts.",
    example: "Where is Duolingo leaking users in its funnel?",
    steps: [
      "Acquisition",
      "Activation",
      "Retention",
      "Revenue",
      "Referral",
    ],
    tags: ["Metrics", "Growth"],
  },
  {
    id: "rice",
    name: "RICE",
    expansion: "Reach · Impact · Confidence · Effort",
    purpose: "Score and rank competing initiatives objectively.",
    whenToUse: "Prioritization questions with multiple features.",
    example: "Rank 4 roadmap bets for next quarter.",
    steps: [
      "Estimate Reach",
      "Estimate Impact",
      "Rate Confidence",
      "Estimate Effort",
      "Score = R×I×C ÷ E",
    ],
    tags: ["Prioritization"],
  },
  {
    id: "moscow",
    name: "MoSCoW",
    expansion: "Must · Should · Could · Won't",
    purpose: "Fast scope triage for an MVP or release.",
    whenToUse: "“What goes in v1?” scoping decisions.",
    example: "Scope the MVP of a budgeting app.",
    steps: ["Must have", "Should have", "Could have", "Won't have (now)"],
    tags: ["Prioritization", "MVP"],
  },
  {
    id: "heart",
    name: "HEART",
    expansion: "Happiness · Engagement · Adoption · Retention · Task success",
    purpose: "Google's UX-quality measurement framework.",
    whenToUse: "Measuring experience quality of a feature.",
    example: "Measure the success of a redesigned onboarding.",
    steps: [
      "Happiness",
      "Engagement",
      "Adoption",
      "Retention",
      "Task success",
    ],
    tags: ["Metrics", "UX"],
  },
  {
    id: "north-star",
    name: "North Star Metric",
    expansion: "One metric that captures core value delivered",
    purpose: "Align the org around the value users actually get.",
    whenToUse: "Defining the single most important metric.",
    example: "Spotify → time spent listening.",
    steps: [
      "Find the value moment",
      "Make it measurable",
      "Map input levers",
      "Add guardrails",
    ],
    tags: ["Metrics", "Strategy"],
  },
  {
    id: "5-whys",
    name: "5 Whys",
    expansion: "Ask “why?” five times to reach the root cause",
    purpose: "Drill from a symptom to the true underlying cause.",
    whenToUse: "Root cause analysis & execution questions.",
    example: "Why did checkout conversion drop?",
    steps: [
      "State the problem",
      "Ask why (×5)",
      "Validate with data",
      "Fix the root, not the symptom",
    ],
    tags: ["RCA", "Execution"],
  },
  {
    id: "swot",
    name: "SWOT",
    expansion: "Strengths · Weaknesses · Opportunities · Threats",
    purpose: "Quick strategic situation assessment.",
    whenToUse: "Strategy & market-entry questions.",
    example: "Should Netflix launch gaming?",
    steps: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
    tags: ["Strategy"],
  },
  {
    id: "jtbd",
    name: "JTBD",
    expansion: "Jobs To Be Done — the progress a user is hiring you for",
    purpose: "Frame needs around the user's underlying goal.",
    whenToUse: "Product sense & design discovery.",
    example: "What job is a user 'hiring' a to-do app for?",
    steps: [
      "Identify the job",
      "Context & motivation",
      "Current alternatives",
      "Success criteria",
    ],
    tags: ["Discovery", "Design"],
  },
];

export interface MockQuestion {
  id: string;
  prompt: string;
  type: string;
  difficulty: Difficulty;
  minutes: number;
  hints: string[];
  structure: string[];
}

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: "elderly",
    prompt: "Design a product for elderly users.",
    type: "Product Design",
    difficulty: "Intermediate",
    minutes: 8,
    hints: [
      "Pick ONE concrete segment (e.g. seniors living alone).",
      "Their top pains: loneliness, health management, tech anxiety.",
      "Bias toward simplicity — large targets, voice, fewer steps.",
    ],
    structure: [
      "Clarify goal & constraints",
      "Choose a senior sub-segment",
      "Map their sharpest pain points",
      "Prioritize the highest-impact one",
      "Propose 2–3 solutions, pick one",
      "Define a success metric + guardrail",
      "Call out trade-offs",
    ],
  },
  {
    id: "spotify",
    prompt: "How would you improve Spotify engagement?",
    type: "Product Sense",
    difficulty: "Intermediate",
    minutes: 7,
    hints: [
      "Define 'engagement' first — listening time per WAU?",
      "Segment: casual vs power vs lapsed listeners.",
      "Look for the weakest step in the listening loop.",
    ],
    structure: [
      "Define engagement precisely",
      "Pick a target segment",
      "Diagnose where the loop breaks",
      "Brainstorm 3 levers",
      "Prioritize with impact/effort",
      "Define how you'd measure the win",
    ],
  },
  {
    id: "uber-pool",
    prompt: "How would you measure success for Uber Pool?",
    type: "Metrics",
    difficulty: "Advanced",
    minutes: 6,
    hints: [
      "Uber Pool's value = cheaper rides via shared capacity.",
      "North Star should capture matched, completed shared rides.",
      "Add guardrails for rider experience (wait + detour time).",
    ],
    structure: [
      "Clarify Pool's goal",
      "Map rider & driver journey",
      "Propose a North Star metric",
      "Add input metrics",
      "Add guardrail metrics",
      "Segment & sanity-check",
    ],
  },
  {
    id: "mumbai",
    prompt: "Estimate the number of restaurants in Mumbai.",
    type: "Estimation",
    difficulty: "Beginner",
    minutes: 5,
    hints: [
      "Start from population (~20M) and households.",
      "Bottom-up: people per restaurant in a typical area.",
      "State assumptions out loud and round aggressively.",
    ],
    structure: [
      "Clarify scope (dine-in only?)",
      "Choose top-down vs bottom-up",
      "Decompose into drivers",
      "Assign round numbers",
      "Calculate stepwise",
      "Sanity-check the magnitude",
    ],
  },
];

export interface CommonMistake {
  mistake: string;
  why: string;
  better: string;
}

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    mistake: "Jumping straight into solutions",
    why: "Signals you solve before you understand the problem.",
    better: "Clarify the goal and user first — earn the right to solve.",
  },
  {
    mistake: "Ignoring user pain points",
    why: "Features without a real pain feel arbitrary.",
    better: "Anchor every idea to a specific, validated user pain.",
  },
  {
    mistake: "No prioritization",
    why: "Listing 10 ideas equally shows weak judgment.",
    better: "Use a framework (RICE/impact-effort) and commit to one.",
  },
  {
    mistake: "Weak or vanity metrics",
    why: "“More engagement” isn't measurable or honest.",
    better: "Name one North Star + a guardrail you'd actually track.",
  },
  {
    mistake: "No trade-off discussion",
    why: "Real PM decisions always cost something.",
    better: "Explicitly state what you sacrifice and why it's worth it.",
  },
  {
    mistake: "Rambling, unstructured answers",
    why: "The interviewer loses the thread and your signal drops.",
    better: "Narrate your structure: “I'll cover A, then B, then C.”",
  },
];

export interface RoadmapWeek {
  week: number;
  focus: string;
  summary: string;
  checklist: string[];
}

export const ROADMAP: RoadmapWeek[] = [
  {
    week: 1,
    focus: "Product Thinking",
    summary: "Build the instinct to start from users and problems.",
    checklist: [
      "Study 5 products you use daily",
      "Write their core user + job",
      "Practice clarifying questions",
    ],
  },
  {
    week: 2,
    focus: "Frameworks",
    summary: "Internalize the core structures until they're automatic.",
    checklist: [
      "Learn CIRCLES, RICE, HEART, AARRR",
      "Apply each to one real product",
      "Build your own cheat-sheet",
    ],
  },
  {
    week: 3,
    focus: "Product Design",
    summary: "Run full design answers end-to-end, out loud.",
    checklist: [
      "Do 5 design questions timed",
      "Record & review yourself",
      "Tighten your structure",
    ],
  },
  {
    week: 4,
    focus: "Metrics",
    summary: "Get fluent at defining and diagnosing metrics.",
    checklist: [
      "Define North Stars for 8 products",
      "Practice 3 execution drops",
      "Drill guardrail thinking",
    ],
  },
  {
    week: 5,
    focus: "Mock Interviews",
    summary: "Simulate pressure with realistic timed mocks.",
    checklist: [
      "3 peer mock interviews",
      "Collect structured feedback",
      "Fix your top 2 weaknesses",
    ],
  },
  {
    week: 6,
    focus: "Final Preparation",
    summary: "Polish, rest, and walk in with confidence.",
    checklist: [
      "Refine behavioral stories (STAR)",
      "Light review only — no cramming",
      "Mock the day-before routine",
    ],
  },
];

export const STATS = [
  { value: "500+", label: "Practice Questions" },
  { value: "20+", label: "Interview Frameworks" },
  { value: "Mock", label: "Product Cases" },
] as const;
