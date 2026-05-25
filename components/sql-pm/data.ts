export type SQLDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface KPI {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface TableCol {
  name: string;
  type: string;
}

export interface DbTable {
  name: string;
  cols: TableCol[];
  sampleRows: string[][];
}

export interface PMChoice {
  text: string;
}

export interface Challenge {
  businessProblem: string;
  schema: DbTable[];
  starterQuery: string;
  solution: string;
  outputHeaders: string[];
  outputRows: string[][];
  hints: string[];
  pmQuestion: string;
  pmChoices: PMChoice[];
  correctPMIndex: number;
  pmExplanation: string;
  insightBreakdown: string[];
  pmRecommendations: string[];
  stakeholderQuestion: string;
}

export interface Scenario {
  id: string;
  company: string;
  industry: string;
  emoji: string;
  accentBorder: string;
  accentText: string;
  accentBg: string;
  accentGlow: string;
  tagline: string;
  description: string;
  kpis: KPI[];
  chartData: ChartPoint[];
  chartLabel: string;
  chartType: "line" | "bar";
  estimatedMinutes: number;
  sqlDifficulty: SQLDifficulty;
  pmDifficulty: SQLDifficulty;
  skills: string[];
  sqlConcept?: string;
  challenge: Challenge;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "swiggy",
    company: "Swiggy",
    industry: "Food Delivery",
    emoji: "🍕",
    accentBorder: "border-orange-500/30",
    accentText: "text-orange-400",
    accentBg: "bg-orange-500/10",
    accentGlow: "shadow-orange-500/20",
    tagline: "Food Delivery Analytics",
    description:
      "Analyze order patterns, delivery performance, and city-level metrics for India's largest food delivery platform.",
    kpis: [
      { label: "Daily Orders", value: "2.4M", delta: "+12%", up: true },
      { label: "Avg Delivery Time", value: "28 min", delta: "-3 min", up: true },
      { label: "GMV Today", value: "₹142Cr", delta: "+8%", up: true },
      { label: "Cancellation Rate", value: "4.2%", delta: "+0.8%", up: false },
    ],
    chartData: [
      { label: "W1", value: 1.8 },
      { label: "W2", value: 2.1 },
      { label: "W3", value: 1.9 },
      { label: "W4", value: 2.3 },
      { label: "W5", value: 2.1 },
      { label: "W6", value: 2.4 },
      { label: "W7", value: 2.2 },
      { label: "W8", value: 2.4 },
    ],
    chartLabel: "Weekly Orders (M)",
    chartType: "line",
    estimatedMinutes: 12,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["JOIN", "GROUP BY", "AVG", "ORDER BY", "WHERE", "TIMESTAMPDIFF"],
    challenge: {
      businessProblem:
        "📉 Daily orders dropped 18% in Delhi last week. Your VP of Growth asks you to identify which city–restaurant-category combination is underperforming and understand if it's a delivery-time issue.",
      schema: [
        {
          name: "orders",
          cols: [
            { name: "order_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "restaurant_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" },
            { name: "order_value", type: "DECIMAL" },
            { name: "created_at", type: "TIMESTAMP" },
            { name: "delivered_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1001", "501", "201", "Delhi", "delivered", "345.00", "2024-01-15 12:30", "2024-01-15 13:05"],
            ["1002", "502", "202", "Mumbai", "delivered", "220.00", "2024-01-15 13:00", "2024-01-15 13:22"],
            ["1003", "503", "201", "Delhi", "cancelled", "0.00", "2024-01-15 13:15", "NULL"],
          ],
        },
        {
          name: "restaurants",
          cols: [
            { name: "restaurant_id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "category", type: "VARCHAR" },
            { name: "city", type: "VARCHAR" },
            { name: "rating", type: "DECIMAL" },
          ],
          sampleRows: [
            ["201", "Bikanervala", "Indian", "Delhi", "4.2"],
            ["202", "McDonald's", "Fast Food", "Mumbai", "4.0"],
            ["203", "Pizza Hut", "Pizza", "Delhi", "3.8"],
          ],
        },
      ],
      starterQuery: `SELECT
  r.city,
  r.category,
  COUNT(o.order_id) AS total_orders,
  -- Add avg delivery time here
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE o.status = 'delivered'
  -- Filter for last 7 days
GROUP BY r.city, r.category
ORDER BY total_orders DESC;`,
      solution: `SELECT
  r.city,
  r.category,
  COUNT(o.order_id) AS total_orders,
  ROUND(AVG(
    TIMESTAMPDIFF(MINUTE, o.created_at, o.delivered_at)
  ), 1) AS avg_delivery_min,
  ROUND(AVG(o.order_value), 2) AS avg_order_value
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE o.status = 'delivered'
  AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY r.city, r.category
ORDER BY total_orders DESC
LIMIT 10;`,
      outputHeaders: ["city", "category", "total_orders", "avg_delivery_min", "avg_order_value"],
      outputRows: [
        ["Mumbai", "Fast Food", "45,230", "22.3", "₹218"],
        ["Bangalore", "Pizza", "38,410", "25.8", "₹285"],
        ["Delhi", "Indian", "29,180", "38.4", "₹312"],
        ["Delhi", "Fast Food", "21,050", "41.2", "₹195"],
        ["Hyderabad", "Biryani", "18,920", "24.1", "₹245"],
      ],
      hints: [
        "Start with a JOIN between orders and restaurants to bring in category info.",
        "Use TIMESTAMPDIFF(MINUTE, created_at, delivered_at) to calculate delivery time, then wrap with AVG().",
        "Add WHERE o.status = 'delivered' and a date filter. Group by city AND category.",
      ],
      pmQuestion:
        "The data shows Delhi (Indian food) has a 38 min avg delivery time vs Mumbai's 22 min. As a PM, what would you investigate FIRST?",
      pmChoices: [
        { text: "Check if Delhi restaurants have complex menus causing longer prep times" },
        { text: "Look at driver supply in Delhi during peak hours and compare to Mumbai" },
        { text: "Survey Delhi customers to understand their delivery-time expectations" },
        { text: "Launch a 'Free Delivery' campaign in Delhi to offset the slower experience" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Delivery time is primarily a supply-side problem. Before blaming restaurants (demand-side), a PM should verify driver supply during peak hours. Driver data tells you immediately if this is an operational vs product problem — it's the fastest path to root cause.",
      insightBreakdown: [
        "Delhi's avg delivery time (38.4 min) is 72% higher than Mumbai — a clear outlier",
        "High delivery time → lower repeat-order rate (direct retention impact)",
        "Indian food in Delhi is the highest-value segment (₹312 avg) — critical to fix",
        "The 18% order drop correlates with the delivery spike — likely causal, not coincidental",
      ],
      pmRecommendations: [
        "Investigate driver utilization in Delhi during 12–2 PM and 7–9 PM peak slots",
        "Check if a competitor launched an offer in Delhi the same week",
        "Run a temporary 'Priority Delivery' experiment for Indian food category in Delhi",
        "Alert rule: auto-flag if avg delivery > 35 min for 3+ consecutive days in any top-5 city",
      ],
      stakeholderQuestion:
        "Your CPO asks: 'Should we add more delivery partners in Delhi or optimize routing first?' — How do you build the case?",
    },
  },
  {
    id: "spotify",
    company: "Spotify",
    industry: "Music Streaming",
    emoji: "🎵",
    accentBorder: "border-green-500/30",
    accentText: "text-green-400",
    accentBg: "bg-green-500/10",
    accentGlow: "shadow-green-500/20",
    tagline: "Music Streaming Analytics",
    description:
      "Dive into user retention, listening patterns, and subscription metrics for a global music streaming platform.",
    kpis: [
      { label: "Monthly Active Users", value: "8.2M", delta: "+5%", up: true },
      { label: "Avg Stream Time", value: "47 min/day", delta: "+3 min", up: true },
      { label: "Premium Subscribers", value: "2.1M", delta: "+2%", up: true },
      { label: "7-Day Retention", value: "62%", delta: "-4%", up: false },
    ],
    chartData: [
      { label: "Jan", value: 7.1 },
      { label: "Feb", value: 7.3 },
      { label: "Mar", value: 7.6 },
      { label: "Apr", value: 7.9 },
      { label: "May", value: 8.0 },
      { label: "Jun", value: 8.2 },
      { label: "Jul", value: 7.8 },
      { label: "Aug", value: 8.2 },
    ],
    chartLabel: "Monthly Active Users (M)",
    chartType: "line",
    estimatedMinutes: 15,
    sqlDifficulty: "Intermediate",
    pmDifficulty: "Intermediate",
    skills: ["CTE", "DATE functions", "Retention", "Cohort Analysis", "CASE WHEN"],
    challenge: {
      businessProblem:
        "📉 7-day retention dropped from 66% to 62% in Q3. Your Head of Product needs a cohort analysis to identify which signup-month cohorts are churning fastest and whether plan type is a factor.",
      schema: [
        {
          name: "users",
          cols: [
            { name: "user_id", type: "INT" },
            { name: "signup_date", type: "DATE" },
            { name: "plan_type", type: "VARCHAR" },
            { name: "country", type: "VARCHAR" },
          ],
          sampleRows: [
            ["1001", "2024-01-15", "free", "IN"],
            ["1002", "2024-01-20", "premium", "US"],
            ["1003", "2024-02-05", "free", "IN"],
          ],
        },
        {
          name: "listening_events",
          cols: [
            { name: "event_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "track_id", type: "INT" },
            { name: "listened_at", type: "TIMESTAMP" },
            { name: "duration_sec", type: "INT" },
            { name: "source", type: "VARCHAR" },
          ],
          sampleRows: [
            ["5001", "1001", "301", "2024-01-16 08:30", "180", "playlist"],
            ["5002", "1001", "302", "2024-01-16 08:33", "220", "radio"],
            ["5003", "1002", "303", "2024-01-20 20:00", "195", "search"],
          ],
        },
      ],
      starterQuery: `-- Cohort retention: signup month → Day 7 retention
WITH cohorts AS (
  SELECT
    user_id,
    DATE_FORMAT(signup_date, '%Y-%m') AS cohort_month,
    plan_type
  FROM users
)
-- Add retention logic: who listened on Day 7-14?
SELECT ...
FROM cohorts c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN listening_events le ON ...
GROUP BY cohort_month, plan_type;`,
      solution: `WITH cohorts AS (
  SELECT
    u.user_id,
    DATE_FORMAT(u.signup_date, '%Y-%m') AS cohort_month,
    u.plan_type,
    u.signup_date
  FROM users u
),
retention AS (
  SELECT
    c.cohort_month,
    c.plan_type,
    COUNT(DISTINCT c.user_id) AS cohort_size,
    COUNT(DISTINCT CASE
      WHEN le.listened_at BETWEEN
        DATE_ADD(c.signup_date, INTERVAL 7 DAY) AND
        DATE_ADD(c.signup_date, INTERVAL 14 DAY)
      THEN c.user_id
    END) AS retained_day7
  FROM cohorts c
  LEFT JOIN listening_events le ON c.user_id = le.user_id
  GROUP BY c.cohort_month, c.plan_type
)
SELECT
  cohort_month,
  plan_type,
  cohort_size,
  retained_day7,
  ROUND(100.0 * retained_day7 / cohort_size, 1) AS retention_pct
FROM retention
ORDER BY cohort_month, plan_type;`,
      outputHeaders: ["cohort_month", "plan_type", "cohort_size", "retained_day7", "retention_pct"],
      outputRows: [
        ["2024-01", "free", "124,530", "71,812", "57.7%"],
        ["2024-01", "premium", "28,410", "22,158", "78.0%"],
        ["2024-02", "free", "98,240", "54,013", "55.0%"],
        ["2024-02", "premium", "22,180", "17,300", "78.0%"],
        ["2024-03", "free", "87,100", "43,550", "50.0%"],
        ["2024-03", "premium", "19,500", "15,210", "78.0%"],
      ],
      hints: [
        "Use a CTE to assign each user to a cohort_month from their signup_date using DATE_FORMAT.",
        "For Day-7 retention: check if a listening_event exists between signup_date+7 and signup_date+14 days.",
        "Use COUNT(DISTINCT CASE WHEN ... THEN user_id END) inside your aggregation to count retained users.",
      ],
      pmQuestion:
        "Free-user retention dropped from 57.7% → 50% over 3 cohorts, while premium stays flat at 78%. What's the most likely root cause?",
      pmChoices: [
        { text: "Product quality has declined — both segments would show the drop" },
        { text: "Free tier friction (ads, skip limits) creates a worse early experience" },
        { text: "Marketing is acquiring lower-intent free users across newer cohorts" },
        { text: "Premium features are pulling users away from the free tier faster" },
      ],
      correctPMIndex: 2,
      pmExplanation:
        "Premium retention is perfectly flat at 78% — that rules out product quality. The cohort-level drop for free users points to acquisition quality: newer free cohorts have lower intent. If social ads replaced SEO as the top acquisition channel, you'd see exactly this pattern. Check channel mix across cohorts.",
      insightBreakdown: [
        "Premium users retain at 78% consistently — the core product experience is solid",
        "Free retention fell 7.7pp in 3 months — a clear trend, not random noise",
        "28pp gap between free (50%) and premium (78%) = large conversion-lever opportunity",
        "Cohort analysis localizes the problem to new-user acquisition, not existing user churn",
      ],
      pmRecommendations: [
        "Audit acquisition channels by cohort month — identify which channels produce Day-7 listeners",
        "A/B test a playlist-first onboarding flow for new free users to build Day-1 habit",
        "Track '% of new users who listen on Day 3 and Day 7' as leading retention indicators",
        "Model: if free Day-7 retention reaches 65%, what does that mean for premium conversions?",
      ],
      stakeholderQuestion:
        "CMO: 'Lower the paywall to convert more free users.' Product: 'Improve the free experience first.' Which do you prioritize?",
    },
  },
  {
    id: "uber",
    company: "Uber",
    industry: "Ride-Sharing",
    emoji: "🚗",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/10",
    accentGlow: "shadow-sky-500/20",
    tagline: "Ride-Sharing Operations Analytics",
    description:
      "Optimize driver supply, demand matching, and city-level marketplace health for a ride-sharing platform.",
    kpis: [
      { label: "Completed Rides", value: "890K", delta: "+6%", up: true },
      { label: "Driver Utilization", value: "74%", delta: "-5%", up: false },
      { label: "Surge Pricing %", value: "31%", delta: "+8%", up: false },
      { label: "Avg ETA", value: "4.2 min", delta: "+1.1 min", up: false },
    ],
    chartData: [
      { label: "6AM", value: 12 },
      { label: "9AM", value: 45 },
      { label: "12PM", value: 38 },
      { label: "3PM", value: 22 },
      { label: "6PM", value: 58 },
      { label: "9PM", value: 41 },
      { label: "12AM", value: 15 },
    ],
    chartLabel: "Demand (K rides/hr)",
    chartType: "bar",
    estimatedMinutes: 13,
    sqlDifficulty: "Intermediate",
    pmDifficulty: "Advanced",
    skills: ["Subquery", "GROUP BY", "Ratio calc", "LEFT JOIN", "HAVING"],
    challenge: {
      businessProblem:
        "⚠️ Surge pricing hit 31% — the highest in 6 months. This is hurting demand and brand perception. Find which city–hour combinations have the worst supply-to-demand ratio so you can target driver incentives.",
      schema: [
        {
          name: "ride_requests",
          cols: [
            { name: "request_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "requested_at", type: "TIMESTAMP" },
            { name: "status", type: "VARCHAR" },
            { name: "surge_multiplier", type: "DECIMAL" },
          ],
          sampleRows: [
            ["9001", "Bangalore", "2024-08-15 18:30", "completed", "1.8"],
            ["9002", "Mumbai", "2024-08-15 18:35", "no_driver", "2.2"],
            ["9003", "Delhi", "2024-08-15 09:00", "completed", "1.0"],
          ],
        },
        {
          name: "driver_activity",
          cols: [
            { name: "driver_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "online_at", type: "TIMESTAMP" },
            { name: "offline_at", type: "TIMESTAMP" },
            { name: "rides_completed", type: "INT" },
          ],
          sampleRows: [
            ["D001", "Bangalore", "2024-08-15 17:00", "2024-08-15 22:00", "8"],
            ["D002", "Mumbai", "2024-08-15 18:00", "2024-08-15 21:00", "5"],
            ["D003", "Delhi", "2024-08-15 08:00", "2024-08-15 14:00", "10"],
          ],
        },
      ],
      starterQuery: `SELECT
  rr.city,
  HOUR(rr.requested_at) AS hour_of_day,
  COUNT(rr.request_id) AS demand_count,
  -- Add driver supply count
  -- Calculate supply / demand ratio
FROM ride_requests rr
LEFT JOIN (
  -- Subquery: active drivers per city per hour
) da ON rr.city = da.city
     AND HOUR(rr.requested_at) = da.hour_of_day
GROUP BY rr.city, HOUR(rr.requested_at)
ORDER BY -- worst ratio first`,
      solution: `SELECT
  rr.city,
  HOUR(rr.requested_at) AS hour_of_day,
  COUNT(rr.request_id) AS demand_count,
  COALESCE(da.active_drivers, 0) AS supply_drivers,
  ROUND(
    COALESCE(da.active_drivers, 0) * 1.0 / COUNT(rr.request_id), 2
  ) AS supply_demand_ratio,
  ROUND(AVG(rr.surge_multiplier), 2) AS avg_surge
FROM ride_requests rr
LEFT JOIN (
  SELECT
    city,
    HOUR(online_at) AS hour_of_day,
    COUNT(DISTINCT driver_id) AS active_drivers
  FROM driver_activity
  GROUP BY city, HOUR(online_at)
) da ON rr.city = da.city
     AND HOUR(rr.requested_at) = da.hour_of_day
GROUP BY rr.city, HOUR(rr.requested_at), da.active_drivers
HAVING supply_demand_ratio < 0.5
ORDER BY supply_demand_ratio ASC
LIMIT 10;`,
      outputHeaders: ["city", "hour", "demand", "drivers", "ratio", "avg_surge"],
      outputRows: [
        ["Bangalore", "18:00", "4,230", "890", "0.21", "2.1x"],
        ["Mumbai", "19:00", "5,100", "1,050", "0.21", "2.3x"],
        ["Delhi", "18:00", "3,880", "910", "0.23", "1.9x"],
        ["Chennai", "18:00", "2,140", "520", "0.24", "1.8x"],
        ["Hyderabad", "19:00", "1,980", "510", "0.26", "1.7x"],
      ],
      hints: [
        "Write a subquery inside LEFT JOIN to count DISTINCT drivers per city per HOUR from driver_activity.",
        "Join driver supply back to ride_requests grouped by city and hour. Use COALESCE(da.active_drivers, 0) for cities with no drivers.",
        "Calculate ratio as drivers / demand. Use HAVING to filter for ratio < 0.5 (severely underserved slots).",
      ],
      pmQuestion:
        "Bangalore 6 PM has a 0.21 supply:demand ratio. As a PM, what's the MOST impactful immediate action?",
      pmChoices: [
        { text: "Launch a time-based 'boost' incentive for drivers online in Bangalore 5–8 PM" },
        { text: "Cap surge pricing at 1.5x to prevent demand from collapsing further" },
        { text: "Show longer ETAs upfront to reduce ride requests during peak shortage" },
        { text: "Build an ML model to predict tomorrow's supply needs" },
      ],
      correctPMIndex: 0,
      pmExplanation:
        "Supply-side intervention is the fastest lever and can move supply within hours. Capping surge (B) reduces driver earnings and worsens supply. Suppressing demand (C) is a band-aid. Prediction models (D) are strategic but don't solve today's crisis. Fix the immediate supply gap first.",
      insightBreakdown: [
        "Peak demand is 5–10x higher at 6–7 PM than midday — predictable and addressable",
        "All top-5 underserved slots are evening peak hours — a consistent, city-wide pattern",
        "0.21 ratio = 1 driver per ~5 ride requests — directly explains the 31% surge rate",
        "Bangalore and Mumbai have the highest demand shortfall in absolute terms",
      ],
      pmRecommendations: [
        "Launch time-based driver incentives 4–6 PM to pre-position supply before peak hits",
        "Push notifications to offline drivers near high-demand zones at 5 PM daily",
        "Create a 'Power Hour' program: bonus pay for every ride completed 6–8 PM",
        "North Star metric: % of city-hours where supply ratio > 0.4 across top-5 cities",
      ],
      stakeholderQuestion:
        "Finance says the driver incentives cost ₹2Cr/month. How do you build the ROI case to get this approved?",
    },
  },
  {
    id: "instagram",
    company: "Instagram",
    industry: "Social Media",
    emoji: "📸",
    accentBorder: "border-pink-500/30",
    accentText: "text-pink-400",
    accentBg: "bg-pink-500/10",
    accentGlow: "shadow-pink-500/20",
    tagline: "Social Platform Engagement Analytics",
    description:
      "Analyze content engagement, user behavior, and feed optimization for a social media platform.",
    kpis: [
      { label: "DAU", value: "14.2M", delta: "+3%", up: true },
      { label: "Avg Session Time", value: "22 min", delta: "-8 min", up: false },
      { label: "Reel Views", value: "480M/day", delta: "+15%", up: true },
      { label: "Story CTR", value: "3.2%", delta: "-0.8%", up: false },
    ],
    chartData: [
      { label: "Reels", value: 82 },
      { label: "Stories", value: 64 },
      { label: "Posts", value: 41 },
      { label: "Lives", value: 28 },
      { label: "Carousel", value: 55 },
    ],
    chartLabel: "Engagement Rate by Type (%)",
    chartType: "bar",
    estimatedMinutes: 11,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["GROUP BY", "CASE WHEN", "SUM / COUNT", "AVG", "JOIN"],
    challenge: {
      businessProblem:
        "📉 Average session time dropped 8 minutes over 4 weeks, but DAU is still growing. Identify which content types and age segments are most affected — is this a Reels problem, a Feed problem, or a specific cohort issue?",
      schema: [
        {
          name: "content_views",
          cols: [
            { name: "view_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "content_id", type: "INT" },
            { name: "content_type", type: "VARCHAR" },
            { name: "viewed_at", type: "TIMESTAMP" },
            { name: "watch_duration_sec", type: "INT" },
            { name: "completed", type: "BOOLEAN" },
          ],
          sampleRows: [
            ["7001", "1001", "501", "reel", "2024-08-15 19:30", "28", "1"],
            ["7002", "1001", "502", "post", "2024-08-15 19:31", "5", "1"],
            ["7003", "1002", "503", "story", "2024-08-15 20:00", "12", "1"],
          ],
        },
        {
          name: "users",
          cols: [
            { name: "user_id", type: "INT" },
            { name: "signup_date", type: "DATE" },
            { name: "age_group", type: "VARCHAR" },
            { name: "account_type", type: "VARCHAR" },
          ],
          sampleRows: [
            ["1001", "2023-06-10", "18-24", "personal"],
            ["1002", "2022-03-15", "25-34", "creator"],
            ["1003", "2024-01-20", "13-17", "personal"],
          ],
        },
      ],
      starterQuery: `SELECT
  cv.content_type,
  u.age_group,
  COUNT(*) AS total_views,
  ROUND(AVG(cv.watch_duration_sec), 1) AS avg_watch_sec,
  -- Add completion rate (SUM completed / COUNT * 100)
FROM content_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.viewed_at >= DATE_SUB(NOW(), INTERVAL 28 DAY)
GROUP BY cv.content_type, u.age_group
ORDER BY avg_watch_sec DESC;`,
      solution: `SELECT
  cv.content_type,
  u.age_group,
  COUNT(*) AS total_views,
  ROUND(AVG(cv.watch_duration_sec), 1) AS avg_watch_sec,
  ROUND(100.0 * SUM(cv.completed) / COUNT(*), 1) AS completion_rate_pct
FROM content_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.viewed_at >= DATE_SUB(NOW(), INTERVAL 28 DAY)
GROUP BY cv.content_type, u.age_group
ORDER BY avg_watch_sec DESC;`,
      outputHeaders: ["content_type", "age_group", "total_views", "avg_watch_sec", "completion_rate%"],
      outputRows: [
        ["reel", "18-24", "84,210,000", "26.4", "81%"],
        ["reel", "25-34", "62,400,000", "22.1", "74%"],
        ["story", "18-24", "41,800,000", "11.2", "88%"],
        ["post", "25-34", "28,600,000", "8.3", "91%"],
        ["carousel", "18-24", "19,400,000", "18.7", "65%"],
        ["reel", "35-44", "15,100,000", "14.8", "58%"],
      ],
      hints: [
        "JOIN content_views with users to get age_group for each view event.",
        "Completion rate = SUM(completed) / COUNT(*) * 100. Use ROUND(..., 1) to format it.",
        "GROUP BY BOTH content_type AND age_group to see the full segment breakdown.",
      ],
      pmQuestion:
        "Reels for 35–44 show 58% completion vs 81% for 18–24. What's the most likely explanation for the session-time drop?",
      pmChoices: [
        { text: "18–24 users reduced usage — they're the heaviest Reels consumers" },
        { text: "Reels algorithm isn't personalizing content well for 35–44 users" },
        { text: "25–34 users dropped off — they're the biggest advertiser demographic" },
        { text: "Creator accounts are disengaging, reducing content quality for everyone" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "A 23pp completion gap between 35–44 (58%) and 18–24 (81%) signals the Reels recommendation model is poorly calibrated for older users. Since Reels is the primary session driver, irrelevant content for this segment directly reduces time-in-app. This is a personalization problem, not a content supply or product quality issue.",
      insightBreakdown: [
        "Reels drive the most watch time across all demographics — it's the core surface",
        "35–44 completion rate (58%) vs 18–24 (81%) = 23pp personalization gap",
        "Stories have 88% completion for 18–24 but are too short (11 sec) to drive session length",
        "Carousel posts underperform across all segments (65%) — a secondary quality signal",
      ],
      pmRecommendations: [
        "Audit Reels recommendation model for 35–44 — likely under-represented in training data",
        "Experiment: surface more news, finance, and home-focused Reels for 35–44 vs trending teen content",
        "Model opportunity size: if 35–44 completion rate rises to 70%, what's the session-time recovery?",
        "Alert: if Reels completion rate for any age segment drops below 60%, trigger immediate review",
      ],
      stakeholderQuestion:
        "Head of Ads says '35–44 is our highest-CPM demographic. Their session drop is a revenue problem.' How do you prioritize this vs other roadmap items?",
    },
  },
  {
    id: "netflix",
    company: "Netflix",
    industry: "Video Streaming",
    emoji: "🎬",
    accentBorder: "border-red-500/30",
    accentText: "text-red-400",
    accentBg: "bg-red-500/10",
    accentGlow: "shadow-red-500/20",
    tagline: "Streaming Content Analytics",
    description:
      "Analyze content performance, watch time, churn signals, and subscriber behavior for a video streaming platform.",
    kpis: [
      { label: "Monthly Subscribers", value: "4.8M", delta: "+2%", up: true },
      { label: "Avg Watchtime", value: "2.1 hr/day", delta: "-18 min", up: false },
      { label: "Content Completion", value: "68%", delta: "-5%", up: false },
      { label: "Monthly Churn", value: "5.8%", delta: "+1.2%", up: false },
    ],
    chartData: [
      { label: "Drama", value: 78 },
      { label: "Action", value: 65 },
      { label: "Comedy", value: 71 },
      { label: "Thriller", value: 84 },
      { label: "Docs", value: 52 },
      { label: "Reality", value: 44 },
    ],
    chartLabel: "Avg Watchtime by Genre (min)",
    chartType: "bar",
    estimatedMinutes: 14,
    sqlDifficulty: "Intermediate",
    pmDifficulty: "Advanced",
    skills: ["CTE", "ROW_NUMBER()", "Window Functions", "DATEDIFF", "LEFT JOIN"],
    challenge: {
      businessProblem:
        "🚨 Monthly churn spiked from 4.6% to 5.8% after the last content release cycle. Identify users who churned in the last 30 days and find what they last watched — to understand if churn correlates with specific show endings or content quality drops.",
      schema: [
        {
          name: "subscriptions",
          cols: [
            { name: "subscription_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "start_date", type: "DATE" },
            { name: "end_date", type: "DATE" },
            { name: "status", type: "VARCHAR" },
            { name: "plan_type", type: "VARCHAR" },
          ],
          sampleRows: [
            ["S001", "1001", "2024-01-01", "2024-08-01", "churned", "standard"],
            ["S002", "1002", "2024-03-15", "NULL", "active", "premium"],
            ["S003", "1003", "2024-05-20", "2024-08-10", "churned", "basic"],
          ],
        },
        {
          name: "watch_history",
          cols: [
            { name: "watch_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "show_id", type: "INT" },
            { name: "show_name", type: "VARCHAR" },
            { name: "genre", type: "VARCHAR" },
            { name: "watched_at", type: "TIMESTAMP" },
            { name: "completion_pct", type: "INT" },
          ],
          sampleRows: [
            ["W001", "1001", "201", "Squid Game S2", "thriller", "2024-07-28 21:00", "95"],
            ["W002", "1001", "202", "Money Heist", "thriller", "2024-07-30 20:00", "100"],
            ["W003", "1003", "203", "Friends", "comedy", "2024-08-08 19:00", "80"],
          ],
        },
      ],
      starterQuery: `-- Find churned users and their last watched show
WITH churned AS (
  SELECT user_id, end_date
  FROM subscriptions
  WHERE status = 'churned'
    AND end_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
),
-- Rank each user's watches (most recent = 1)
ranked AS (
  SELECT
    wh.*,
    ROW_NUMBER() OVER (
      PARTITION BY wh.user_id
      ORDER BY wh.watched_at DESC
    ) AS rn
  FROM watch_history wh
  -- Filter to only churned users
)
SELECT ...`,
      solution: `WITH churned AS (
  SELECT user_id, end_date
  FROM subscriptions
  WHERE status = 'churned'
    AND end_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
),
ranked AS (
  SELECT
    wh.*,
    ROW_NUMBER() OVER (
      PARTITION BY wh.user_id
      ORDER BY wh.watched_at DESC
    ) AS rn
  FROM watch_history wh
  JOIN churned c ON wh.user_id = c.user_id
)
SELECT
  c.user_id,
  c.end_date AS churn_date,
  r.show_name AS last_watched,
  r.genre,
  r.completion_pct,
  DATEDIFF(c.end_date, r.watched_at) AS days_since_last_watch
FROM churned c
JOIN ranked r ON c.user_id = r.user_id AND r.rn = 1
ORDER BY c.end_date DESC;`,
      outputHeaders: ["user_id", "churn_date", "last_watched", "genre", "completion%", "days_since_watch"],
      outputRows: [
        ["10412", "2024-08-14", "Squid Game S2 Finale", "thriller", "100%", "3"],
        ["10891", "2024-08-13", "Squid Game S2 Finale", "thriller", "100%", "2"],
        ["11204", "2024-08-12", "Money Heist Part 5", "thriller", "100%", "5"],
        ["11892", "2024-08-11", "Stranger Things S4", "sci-fi", "100%", "4"],
        ["12001", "2024-08-10", "Friends Reunion", "comedy", "98%", "6"],
      ],
      hints: [
        "First CTE: filter subscriptions for status = 'churned' and end_date in the last 30 days.",
        "Second CTE: use ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY watched_at DESC) to rank each user's watches.",
        "Final SELECT: join churned users with the ranked watches where rn = 1 to get the last show watched.",
      ],
      pmQuestion:
        "Most churned users completed 'Squid Game S2' (100%) and churned 3–5 days later. What does this tell you?",
      pmChoices: [
        { text: "The finale disappointed users — they churned due to poor content quality" },
        { text: "Users subscribed for Squid Game, finished it, and had no reason to stay (content cliff)" },
        { text: "Squid Game attracted low-intent subscribers who were never long-term users" },
        { text: "The recommendation engine failed to suggest compelling next content after the finale" },
      ],
      correctPMIndex: 3,
      pmExplanation:
        "100% completion means the user LOVED the show. Churn after a great finale is a post-watch UX failure — the 'What to Watch Next' moment broke down. Netflix's recommendation carousel showed irrelevant content at the most critical retention moment. This is a recommendation + post-completion experience problem, not a content quality problem.",
      insightBreakdown: [
        "100% completion = user engagement was high — this is NOT a content quality churn",
        "3–5 day churn lag after completion = the post-show recommendation experience failed",
        "Thriller genre (84 min/session) is the highest-value segment — high stakes to retain",
        "Multiple shows appear (Squid Game, Money Heist, Stranger Things) — systemic, not show-specific",
      ],
      pmRecommendations: [
        "Redesign 'What to Watch Next' carousel for thriller-completers — curate, don't just algo",
        "Trigger a 'post-finale personalized recommendation' email within 24 hrs of series completion",
        "New metric: '% of completers who start another show within 48 hrs' — measure as churn proxy",
        "Build a 'Thriller Superfan' segment and design retention flows specific to this high-value cohort",
      ],
      stakeholderQuestion:
        "Content team wants 3 new thrillers greenlit to retain these users. Data team says fix the algo first. Which do you fund?",
    },
  },
  {
    id: "saas",
    company: "SaaS Dashboard",
    industry: "B2B SaaS",
    emoji: "💼",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentGlow: "shadow-violet-500/20",
    tagline: "SaaS Product Analytics",
    description:
      "Monitor MRR, churn, feature adoption, and customer health metrics for a B2B SaaS platform.",
    kpis: [
      { label: "MRR", value: "$2.4M", delta: "+8%", up: true },
      { label: "Churn Rate", value: "3.2%", delta: "+0.5%", up: false },
      { label: "Feature Adoption", value: "42%", delta: "-6%", up: false },
      { label: "NPS Score", value: "38", delta: "-4 pts", up: false },
    ],
    chartData: [
      { label: "Jan", value: 1.8 },
      { label: "Feb", value: 1.95 },
      { label: "Mar", value: 2.1 },
      { label: "Apr", value: 2.22 },
      { label: "May", value: 2.31 },
      { label: "Jun", value: 2.4 },
    ],
    chartLabel: "MRR Growth ($M)",
    chartType: "line",
    estimatedMinutes: 13,
    sqlDifficulty: "Intermediate",
    pmDifficulty: "Advanced",
    skills: ["CTE", "LEFT JOIN", "Adoption calc", "CASE WHEN", "Percentage"],
    challenge: {
      businessProblem:
        "📊 The 'Advanced Analytics' feature launched 8 weeks ago with a 60% adoption target. It's only at 42%. Your Head of Product suspects it's a plan-tier issue. Find adoption rates by plan tier and see if the numbers support the hypothesis.",
      schema: [
        {
          name: "accounts",
          cols: [
            { name: "account_id", type: "INT" },
            { name: "company_name", type: "VARCHAR" },
            { name: "plan_tier", type: "VARCHAR" },
            { name: "seats", type: "INT" },
            { name: "created_at", type: "DATE" },
            { name: "mrr", type: "DECIMAL" },
          ],
          sampleRows: [
            ["A001", "Acme Corp", "enterprise", "50", "2022-03-10", "2400.00"],
            ["A002", "StartupXYZ", "growth", "10", "2023-08-20", "299.00"],
            ["A003", "SoloFreelancer", "starter", "1", "2024-01-15", "49.00"],
          ],
        },
        {
          name: "feature_events",
          cols: [
            { name: "event_id", type: "INT" },
            { name: "account_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "feature_name", type: "VARCHAR" },
            { name: "event_type", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["E001", "A001", "U101", "advanced_analytics", "first_use", "2024-06-20 10:00"],
            ["E002", "A001", "U102", "advanced_analytics", "recurring_use", "2024-07-15 14:00"],
            ["E003", "A002", "U201", "advanced_analytics", "first_use", "2024-07-01 09:00"],
          ],
        },
      ],
      starterQuery: `SELECT
  a.plan_tier,
  COUNT(DISTINCT a.account_id) AS total_accounts,
  -- Count accounts that used the feature
  -- Calculate adoption rate %
FROM accounts a
LEFT JOIN (
  -- Subquery: get distinct accounts that adopted
  SELECT DISTINCT account_id
  FROM feature_events
  WHERE feature_name = 'advanced_analytics'
) fe ON a.account_id = fe.account_id
GROUP BY a.plan_tier
ORDER BY adoption_rate_pct DESC;`,
      solution: `SELECT
  a.plan_tier,
  COUNT(DISTINCT a.account_id) AS total_accounts,
  COUNT(DISTINCT fe.account_id) AS adopted_accounts,
  ROUND(
    100.0 * COUNT(DISTINCT fe.account_id) / COUNT(DISTINCT a.account_id), 1
  ) AS adoption_rate_pct,
  ROUND(AVG(a.mrr), 2) AS avg_mrr,
  ROUND(AVG(a.seats), 1) AS avg_seats
FROM accounts a
LEFT JOIN (
  SELECT DISTINCT account_id
  FROM feature_events
  WHERE feature_name = 'advanced_analytics'
) fe ON a.account_id = fe.account_id
GROUP BY a.plan_tier
ORDER BY adoption_rate_pct DESC;`,
      outputHeaders: ["plan_tier", "total_accounts", "adopted", "adoption_rate%", "avg_mrr", "avg_seats"],
      outputRows: [
        ["enterprise", "284", "231", "81.3%", "$2,840", "48"],
        ["growth", "1,420", "682", "48.0%", "$310", "12"],
        ["starter", "4,810", "1,010", "21.0%", "$52", "1.2"],
      ],
      hints: [
        "Use LEFT JOIN from accounts to a subquery of DISTINCT account_ids in feature_events for 'advanced_analytics'.",
        "COUNT(DISTINCT fe.account_id) counts adopters; COUNT(DISTINCT a.account_id) counts everyone. Divide and multiply by 100.",
        "Include AVG(mrr) and AVG(seats) to see if there's a value/size pattern behind adoption differences.",
      ],
      pmQuestion:
        "Enterprise adoption is 81%, Starter is 21%. The overall 42% is dragged down by volume of Starter accounts. What's the RIGHT metric to report to leadership?",
      pmChoices: [
        { text: "Overall adoption % — treat all accounts equally regardless of plan" },
        { text: "Revenue-weighted adoption % — weight adoption by MRR contribution" },
        { text: "Enterprise adoption only — they're the only accounts that matter for revenue" },
        { text: "User-level adoption within adopted accounts — 'are all seats using it?'" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Enterprise accounts (81% adoption) contribute ~60% of MRR. When you weight adoption by revenue, the effective adoption rate for your revenue base is ~68% — above the 60% target. Tracking flat % treats a $49/mo starter account equally to a $2,840/mo enterprise account, which distorts the business picture.",
      insightBreakdown: [
        "Enterprise (81%) vs Starter (21%) shows the feature resonates strongly with high-value customers",
        "Revenue-weighted adoption ≈ 68% — actually above the 60% target when measured correctly",
        "Overall 42% is a misleading denominator — 4,810 Starter accounts dominate account count",
        "Starter gap (21%) may indicate pricing mismatch — the feature may belong in Growth+ only",
      ],
      pmRecommendations: [
        "Redefine the adoption KPI as revenue-weighted adoption % for all board/leadership reporting",
        "Investigate WHY Starter accounts don't adopt — use-case fit issue or UX/discoverability gap?",
        "Consider restricting Advanced Analytics to Growth+ tier to improve feature positioning",
        "Build an enterprise activation flow to convert the 19% non-adopters to first use",
      ],
      stakeholderQuestion:
        "CEO asks: 'Should we invest in a Starter-tier onboarding campaign to drive adoption from 21% to 40%?' How do you respond?",
    },
  },
  {
    id: "ecommerce",
    company: "E-Commerce",
    industry: "Online Retail",
    emoji: "🛒",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentGlow: "shadow-amber-500/20",
    tagline: "E-Commerce Conversion Analytics",
    description:
      "Optimize the purchase funnel, reduce cart abandonment, and improve conversion rates for an online store.",
    kpis: [
      { label: "GMV (Monthly)", value: "₹48Cr", delta: "+14%", up: true },
      { label: "Conversion Rate", value: "2.8%", delta: "-0.4%", up: false },
      { label: "Cart Abandonment", value: "68%", delta: "+5%", up: false },
      { label: "ARPU", value: "₹1,240", delta: "+8%", up: true },
    ],
    chartData: [
      { label: "Visit", value: 100 },
      { label: "PDP", value: 58 },
      { label: "Cart", value: 32 },
      { label: "Checkout", value: 14 },
      { label: "Payment", value: 8 },
      { label: "Order", value: 4 },
    ],
    chartLabel: "Purchase Funnel (% of visitors)",
    chartType: "bar",
    estimatedMinutes: 12,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["Funnel Analysis", "CASE WHEN", "COUNT DISTINCT", "NULLIF", "Conversion Calc"],
    challenge: {
      businessProblem:
        "📉 Conversion rate dropped from 3.2% to 2.8% month-over-month and cart abandonment hit 68%. Find the biggest funnel drop-off by device type — and identify whether this is a mobile product-page problem or a checkout problem.",
      schema: [
        {
          name: "funnel_events",
          cols: [
            { name: "event_id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "session_id", type: "VARCHAR" },
            { name: "event_name", type: "VARCHAR" },
            { name: "device_type", type: "VARCHAR" },
            { name: "category", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["F001", "1001", "S-abc", "product_view", "mobile", "Electronics", "2024-08-15 10:00"],
            ["F002", "1001", "S-abc", "add_to_cart", "mobile", "Electronics", "2024-08-15 10:03"],
            ["F003", "1001", "S-abc", "checkout_start", "mobile", "Electronics", "2024-08-15 10:05"],
          ],
        },
      ],
      starterQuery: `SELECT
  device_type,
  COUNT(DISTINCT CASE WHEN event_name = 'product_view' THEN user_id END) AS viewers,
  COUNT(DISTINCT CASE WHEN event_name = 'add_to_cart' THEN user_id END) AS cart_adds,
  COUNT(DISTINCT CASE WHEN event_name = 'checkout_start' THEN user_id END) AS checkouts,
  COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) AS purchases
  -- Add view_to_cart % and overall CVR %
FROM funnel_events
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY device_type
ORDER BY purchases DESC;`,
      solution: `SELECT
  device_type,
  COUNT(DISTINCT CASE WHEN event_name = 'product_view' THEN user_id END) AS viewers,
  COUNT(DISTINCT CASE WHEN event_name = 'add_to_cart' THEN user_id END) AS cart_adds,
  COUNT(DISTINCT CASE WHEN event_name = 'checkout_start' THEN user_id END) AS checkouts,
  COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) AS purchases,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_name = 'add_to_cart' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_name = 'product_view' THEN user_id END), 0), 1
  ) AS view_to_cart_pct,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_name = 'purchase' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_name = 'product_view' THEN user_id END), 0), 1
  ) AS overall_cvr_pct
FROM funnel_events
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY device_type
ORDER BY overall_cvr_pct DESC;`,
      outputHeaders: ["device_type", "viewers", "cart_adds", "checkouts", "purchases", "view→cart%", "overall_cvr%"],
      outputRows: [
        ["desktop", "248,000", "89,280", "42,160", "17,360", "36.0%", "7.0%"],
        ["tablet", "84,000", "25,200", "10,920", "3,276", "30.0%", "3.9%"],
        ["mobile", "682,000", "163,680", "61,560", "13,640", "24.0%", "2.0%"],
      ],
      hints: [
        "Use COUNT(DISTINCT CASE WHEN event_name = 'X' THEN user_id END) to count unique users at each stage.",
        "view-to-cart% = cart_adds / viewers * 100. Wrap the denominator in NULLIF(..., 0) to avoid division-by-zero.",
        "overall_cvr% = purchases / viewers * 100. This single number tells you the full-funnel efficiency by device.",
      ],
      pmQuestion:
        "Mobile has 3.5x more users but 5x lower CVR than desktop (2% vs 7%). What should you fix FIRST?",
      pmChoices: [
        { text: "Redesign the mobile checkout flow — most mobile drop-off happens at payment" },
        { text: "Improve mobile product pages — view-to-cart rate (24%) is 12pp below desktop (36%)" },
        { text: "Launch mobile-only discounts to incentivize mobile purchases" },
        { text: "Focus on desktop optimization since it already converts well and gives fastest ROI" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "The biggest drop-off on mobile is at view-to-cart (24% vs 36% on desktop) — that's the product page level, BEFORE checkout. Fixing mobile checkout alone won't close this gap. Mobile PDPs likely suffer from poor image quality, small CTAs, or slow load times. Always fix the highest-volume, biggest-drop stage first.",
      insightBreakdown: [
        "Mobile view-to-cart (24%) vs desktop (36%) = 12pp gap — this is the primary leak",
        "Mobile drives 66% of traffic but only 36% of revenue — massive untapped opportunity",
        "Desktop checkout-to-purchase rate is strong (41%) — checkout UX is not the problem",
        "The funnel leak is at the product page level on mobile — it's a content/UX issue",
      ],
      pmRecommendations: [
        "Audit mobile PDP UX: image quality, 'Add to Cart' button placement, page load speed",
        "A/B test: sticky 'Add to Cart' button on mobile product pages vs current layout",
        "Check mobile page load time — if >3 sec, speed alone explains most of the CVR gap",
        "North Star metric: mobile view-to-cart rate — track weekly, target 30% within 60 days",
      ],
      stakeholderQuestion:
        "Engineering says fixing mobile PDPs takes 6 weeks. Growth says launch a mobile discount to fix CVR faster. Which do you approve?",
    },
  },
];
