import type { Scenario } from "./data";

export const FOUNDATION_SCENARIOS: Scenario[] = [
  // ── 1. SELECT * ───────────────────────────────────────────────────────────
  {
    id: "f-select-all",
    company: "QuickBites",
    industry: "Restaurant Discovery",
    emoji: "🍽️",
    accentBorder: "border-orange-500/30",
    accentText: "text-orange-400",
    accentBg: "bg-orange-500/10",
    accentGlow: "shadow-orange-500/20",
    tagline: "Restaurant Discovery App",
    description: "Pull all records from a table to audit your restaurant database before a major launch.",
    sqlConcept: "SELECT *",
    kpis: [
      { label: "Total Restaurants", value: "1,240", delta: "+80", up: true },
      { label: "Active Listings", value: "1,040", delta: "+60", up: true },
      { label: "Avg Rating", value: "4.1", delta: "+0.1", up: true },
      { label: "Inactive Listings", value: "200", delta: "+20", up: false },
    ],
    chartData: [
      { label: "Jan", value: 900 },
      { label: "Feb", value: 960 },
      { label: "Mar", value: 1010 },
      { label: "Apr", value: 1080 },
      { label: "May", value: 1160 },
      { label: "Jun", value: 1240 },
    ],
    chartLabel: "Total Restaurants (cumulative)",
    chartType: "line",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["SELECT *", "WHERE", "Basic filtering"],
    challenge: {
      businessProblem:
        "🍽️ Your team is launching a new city. Before importing data, the BD lead asks you to pull every restaurant record to audit quality. Get all columns for active restaurants.",
      schema: [
        {
          name: "restaurants",
          cols: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "city", type: "VARCHAR" },
            { name: "category", type: "VARCHAR" },
            { name: "rating", type: "DECIMAL" },
            { name: "is_active", type: "BOOLEAN" },
            { name: "created_at", type: "DATE" },
          ],
          sampleRows: [
            ["1", "Bikanervala", "Delhi", "Indian", "4.3", "1", "2022-03-10"],
            ["2", "McDonald's", "Mumbai", "Fast Food", "4.0", "1", "2021-06-15"],
            ["3", "Old Dhaba", "Delhi", "Indian", "3.8", "0", "2020-11-01"],
          ],
        },
      ],
      starterQuery: `-- Get ALL columns for every active restaurant
SELECT *
FROM restaurants
WHERE -- filter active only
ORDER BY city, rating DESC;`,
      solution: `SELECT *
FROM restaurants
WHERE is_active = 1
ORDER BY city, rating DESC;`,
      outputHeaders: ["id", "name", "city", "category", "rating", "is_active", "created_at"],
      outputRows: [
        ["2", "McDonald's", "Mumbai", "Fast Food", "4.0", "1", "2021-06-15"],
        ["8", "Trident Café", "Mumbai", "Café", "4.5", "1", "2023-01-20"],
        ["1", "Bikanervala", "Delhi", "Indian", "4.3", "1", "2022-03-10"],
        ["5", "Haldiram's", "Delhi", "Indian", "4.1", "1", "2021-09-05"],
      ],
      hints: [
        "SELECT * means 'select all columns' — no need to list them individually.",
        "Use WHERE is_active = 1 (or TRUE) to filter out inactive restaurants.",
      ],
      pmQuestion: "You see 200 inactive restaurants. As a PM, what's your first action?",
      pmChoices: [
        { text: "Delete all inactive records to clean up the database" },
        { text: "Check if inactive = closed permanently or temporarily unavailable, before any action" },
        { text: "Email all 200 restaurant owners to reactivate immediately" },
        { text: "Ignore them — inactive restaurants don't affect active users" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "A PM never makes irreversible data decisions without understanding the cause. 'Inactive' could mean temporarily closed, seasonally paused, or onboarding issue — not necessarily churn. Segment before acting.",
      insightBreakdown: [
        "SELECT * is great for audits and exploration — but avoid it in production queries (returns unused columns)",
        "1,040 active out of 1,240 total = 84% activation rate — reasonable for a marketplace",
        "City-level audit helps catch data quality gaps (missing categories, wrong ratings) before launch",
      ],
      pmRecommendations: [
        "Use SELECT * for quick audits; use SELECT specific_cols in dashboards to reduce data transfer",
        "Add a 'reason_inactive' column to restaurants so the PM can segment inactive listings by cause",
        "Track 'active restaurant count' as a supply-side metric in your weekly dashboard",
      ],
      stakeholderQuestion:
        "Your CEO asks for a list of all restaurants. Do you send the raw SELECT * output, or build a formatted report?",
    },
  },

  // ── 2. SELECT specific columns ────────────────────────────────────────────
  {
    id: "f-select-cols",
    company: "ShopEasy",
    industry: "E-Commerce",
    emoji: "🛍️",
    accentBorder: "border-blue-500/30",
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentGlow: "shadow-blue-500/20",
    tagline: "E-Commerce Inventory",
    description: "Select only the columns you need — a core habit for efficient, readable queries.",
    sqlConcept: "SELECT columns",
    kpis: [
      { label: "Total Products", value: "4,820", delta: "+120", up: true },
      { label: "Low Stock (<50)", value: "340", delta: "+45", up: false },
      { label: "Avg Price", value: "₹1,840", delta: "+₹120", up: true },
      { label: "Out of Stock", value: "82", delta: "+12", up: false },
    ],
    chartData: [
      { label: "Electronics", value: 980 },
      { label: "Fashion", value: 1420 },
      { label: "Home", value: 860 },
      { label: "Sports", value: 640 },
      { label: "Books", value: 920 },
    ],
    chartLabel: "Products by Category",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["SELECT columns", "WHERE", "Aliases"],
    challenge: {
      businessProblem:
        "📦 Your inventory team needs a quick low-stock report — just product name, price, and stock quantity. The full products table has 12 columns; they only need 3.",
      schema: [
        {
          name: "products",
          cols: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "description", type: "TEXT" },
            { name: "price", type: "DECIMAL" },
            { name: "stock_qty", type: "INT" },
            { name: "category", type: "VARCHAR" },
            { name: "supplier_id", type: "INT" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1", "USB-C Hub", "High-speed...", "1299.00", "12", "Electronics", "101", "2023-05-10"],
            ["2", "Yoga Mat", "Anti-slip...", "849.00", "6", "Sports", "104", "2023-07-21"],
            ["3", "Novel: Dune", "Sci-fi...", "399.00", "180", "Books", "102", "2022-12-01"],
          ],
        },
      ],
      starterQuery: `-- Get only name, price, and stock_qty for low-stock products
SELECT name, price, stock_qty
FROM products
WHERE -- stock below 50
ORDER BY stock_qty ASC;`,
      solution: `SELECT
  name,
  price,
  stock_qty
FROM products
WHERE stock_qty < 50
ORDER BY stock_qty ASC;`,
      outputHeaders: ["name", "price", "stock_qty"],
      outputRows: [
        ["Wireless Earbuds Pro", "₹3,499", "3"],
        ["Yoga Mat Premium", "₹849", "6"],
        ["USB-C Hub 7-in-1", "₹1,299", "12"],
        ["Running Shoes M", "₹2,199", "18"],
        ["Desk Lamp LED", "₹599", "24"],
      ],
      hints: [
        "List only the 3 column names you need after SELECT — no need for *.",
        "Add WHERE stock_qty < 50 to filter low-stock items, then ORDER BY stock_qty ASC to see the worst first.",
      ],
      pmQuestion: "82 products are out of stock. What's the PM's first question before escalating to the supply team?",
      pmChoices: [
        { text: "Reorder all 82 products immediately to avoid revenue loss" },
        { text: "Which of the 82 are high-demand items? Prioritize restocking by sales velocity" },
        { text: "Remove out-of-stock products from the website to avoid customer frustration" },
        { text: "Send discount codes to users who viewed out-of-stock products" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Not all out-of-stock products are equal. A PM first segments by demand: high-velocity items (sell fast) need urgent restocking; slow-moving items don't. Restocking everything equally wastes cash and warehouse space.",
      insightBreakdown: [
        "Selecting only needed columns reduces query cost and makes results easier to scan",
        "340 low-stock products = 7% of catalog — worth an automated reorder alert system",
        "ORDER BY stock_qty ASC shows the most urgent items first — always sort for actionability",
      ],
      pmRecommendations: [
        "Build a daily 'Low Stock Alert' report using this query — auto-email to supply team",
        "Add a 'reorder_threshold' column to products so the alert fires at the right level per item",
        "Track: 'out-of-stock rate' as a weekly supply-chain health metric",
      ],
      stakeholderQuestion:
        "Supply team asks for the full products table. Do you send SELECT * or the focused 3-column report?",
    },
  },

  // ── 3. WHERE ──────────────────────────────────────────────────────────────
  {
    id: "f-where",
    company: "FitTrack",
    industry: "Fitness App",
    emoji: "💪",
    accentBorder: "border-green-500/30",
    accentText: "text-green-400",
    accentBg: "bg-green-500/10",
    accentGlow: "shadow-green-500/20",
    tagline: "Fitness Tracking Platform",
    description: "Filter rows to find exactly what matters — WHERE is the most-used clause in any PM's toolkit.",
    sqlConcept: "WHERE",
    kpis: [
      { label: "Total Users", value: "124K", delta: "+8%", up: true },
      { label: "Active This Week", value: "61K", delta: "+3%", up: true },
      { label: "Avg Workouts/Week", value: "3.2", delta: "-0.3", up: false },
      { label: "Premium Users", value: "28K", delta: "+5%", up: true },
    ],
    chartData: [
      { label: "Mon", value: 18 },
      { label: "Tue", value: 22 },
      { label: "Wed", value: 25 },
      { label: "Thu", value: 21 },
      { label: "Fri", value: 19 },
      { label: "Sat", value: 28 },
      { label: "Sun", value: 24 },
    ],
    chartLabel: "Daily Active Users (K)",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["WHERE", "AND", "Boolean filters"],
    challenge: {
      businessProblem:
        "💪 Users complained the app shows irrelevant workout plans. Your task: find only active Beginner-level plans to audit quality before a homepage redesign.",
      schema: [
        {
          name: "workout_plans",
          cols: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "difficulty", type: "VARCHAR" },
            { name: "duration_weeks", type: "INT" },
            { name: "is_active", type: "BOOLEAN" },
            { name: "goal", type: "VARCHAR" },
            { name: "created_at", type: "DATE" },
          ],
          sampleRows: [
            ["1", "30-Day Abs", "Beginner", "4", "1", "Weight Loss", "2023-01-10"],
            ["2", "Advanced HIIT", "Advanced", "8", "1", "Strength", "2023-03-05"],
            ["3", "Morning Stretch", "Beginner", "2", "0", "Flexibility", "2022-11-20"],
          ],
        },
      ],
      starterQuery: `SELECT id, name, difficulty, duration_weeks, goal
FROM workout_plans
WHERE -- only active Beginner plans
ORDER BY duration_weeks;`,
      solution: `SELECT id, name, difficulty, duration_weeks, goal
FROM workout_plans
WHERE is_active = TRUE
  AND difficulty = 'Beginner'
ORDER BY duration_weeks;`,
      outputHeaders: ["id", "name", "difficulty", "duration_weeks", "goal"],
      outputRows: [
        ["8", "7-Day Reset", "Beginner", "1", "Recovery"],
        ["1", "30-Day Abs", "Beginner", "4", "Weight Loss"],
        ["11", "Beginner Yoga Flow", "Beginner", "4", "Flexibility"],
        ["15", "Walk to Run", "Beginner", "6", "Endurance"],
        ["3", "Home Strength Starter", "Beginner", "8", "Strength"],
      ],
      hints: [
        "Use WHERE is_active = TRUE to filter for active plans, then add AND difficulty = 'Beginner'.",
        "Multiple conditions in WHERE are joined with AND (both must be true) or OR (either can be true).",
      ],
      pmQuestion: "Only 12 active Beginner plans exist. Users drop off after Week 2. What's your hypothesis?",
      pmChoices: [
        { text: "12 plans is plenty — quality matters more than quantity" },
        { text: "Content gap: not enough variety at Beginner level to keep users engaged past Week 2" },
        { text: "Beginners should be pushed to Intermediate after Week 2 automatically" },
        { text: "Week 2 drop-off is normal — all fitness apps see it" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "If users consistently drop after Week 2, and you have only 12 Beginner plans, they've likely exhausted their options. Content depth and progression variety at the Beginner level is a retention lever, not a UX problem.",
      insightBreakdown: [
        "WHERE with AND narrows results — every additional condition reduces the result set",
        "12 active Beginner plans for 28K+ beginner users = low content-to-user ratio",
        "Sorting by duration_weeks makes the list actionable — shows plan length range at a glance",
      ],
      pmRecommendations: [
        "Commission 10+ new Beginner plans with diverse goals (flexibility, weight loss, strength)",
        "A/B test a 'Week 2 Check-In' notification to reduce drop-off",
        "Add a 'Days remaining' badge on plans to create completion urgency",
      ],
      stakeholderQuestion:
        "Content team says 'Beginner plans are deprioritized because Advanced users are more engaged.' How do you respond?",
    },
  },

  // ── 4. AND / OR ───────────────────────────────────────────────────────────
  {
    id: "f-and-or",
    company: "NeoBank",
    industry: "Fintech / Banking",
    emoji: "🏦",
    accentBorder: "border-cyan-500/30",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentGlow: "shadow-cyan-500/20",
    tagline: "Digital Banking Platform",
    description: "Combine multiple filter conditions with AND / OR to build precise, real-world queries.",
    sqlConcept: "AND / OR",
    kpis: [
      { label: "Daily Transactions", value: "2.1M", delta: "+9%", up: true },
      { label: "Flagged Today", value: "3,240", delta: "+18%", up: false },
      { label: "Avg Txn Value", value: "₹4,200", delta: "+5%", up: true },
      { label: "Cross-border Txns", value: "8.2%", delta: "+1.2%", up: false },
    ],
    chartData: [
      { label: "Mon", value: 1.8 },
      { label: "Tue", value: 2.0 },
      { label: "Wed", value: 2.1 },
      { label: "Thu", value: 1.9 },
      { label: "Fri", value: 2.4 },
      { label: "Sat", value: 1.4 },
      { label: "Sun", value: 1.1 },
    ],
    chartLabel: "Daily Transactions (M)",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["AND", "OR", "WHERE", "Comparison operators"],
    challenge: {
      businessProblem:
        "🚨 Risk team needs to flag transactions that are EITHER above ₹50,000 OR from outside India — for manual review. Either condition alone should trigger the flag.",
      schema: [
        {
          name: "transactions",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "amount", type: "DECIMAL" },
            { name: "country", type: "VARCHAR" },
            { name: "type", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1001", "501", "75000.00", "IN", "transfer", "completed", "2024-08-15 10:30"],
            ["1002", "502", "12000.00", "US", "payment", "completed", "2024-08-15 11:00"],
            ["1003", "503", "8500.00", "IN", "purchase", "completed", "2024-08-15 11:15"],
          ],
        },
      ],
      starterQuery: `SELECT id, user_id, amount, country, type
FROM transactions
WHERE -- amount > 50000 OR foreign country
ORDER BY amount DESC;`,
      solution: `SELECT id, user_id, amount, country, type
FROM transactions
WHERE amount > 50000
   OR country != 'IN'
ORDER BY amount DESC;`,
      outputHeaders: ["id", "user_id", "amount", "country", "type"],
      outputRows: [
        ["2041", "812", "₹1,20,000", "IN", "transfer"],
        ["1001", "501", "₹75,000", "IN", "transfer"],
        ["1002", "502", "₹12,000", "US", "payment"],
        ["2190", "934", "₹8,200", "AE", "purchase"],
        ["1844", "601", "₹3,100", "GB", "payment"],
      ],
      hints: [
        "Use OR between two conditions — a row is returned if EITHER condition is true.",
        "country != 'IN' means 'not equal to India'. You can also write country <> 'IN'.",
      ],
      pmQuestion: "3,240 transactions flagged. Most are high-value domestic transfers, not foreign. What's the risk team's next step?",
      pmChoices: [
        { text: "Block all 3,240 transactions immediately pending review" },
        { text: "Segment by condition: review foreign txns first (higher risk), then large domestic" },
        { text: "Increase the threshold to ₹1,00,000 to reduce noise" },
        { text: "Auto-approve domestic high-value transactions to reduce queue" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Not all flags carry equal risk. Foreign transactions have a different risk profile than large domestic transfers. Segmenting the queue by condition type lets the risk team prioritize correctly without arbitrarily raising thresholds.",
      insightBreakdown: [
        "OR means either condition alone is enough to flag — creates a broad safety net",
        "Cross-border transactions at 8.2% of volume but potentially higher risk — prioritize in the queue",
        "Large domestic transfers may include salary payouts, B2B — need pattern recognition, not blanket blocks",
      ],
      pmRecommendations: [
        "Add a 'risk_score' column combining multiple signals (amount, country, velocity) for better prioritization",
        "Build a risk dashboard showing flagged txns by condition type and review status",
        "Set thresholds via config, not hardcoded SQL — so risk ops can tune without engineering",
      ],
      stakeholderQuestion:
        "Compliance asks you to lower the threshold to ₹25,000. What data would you pull to evaluate the impact before agreeing?",
    },
  },

  // ── 5. ORDER BY ───────────────────────────────────────────────────────────
  {
    id: "f-order-by",
    company: "BeatFlow",
    industry: "Music Streaming",
    emoji: "🎧",
    accentBorder: "border-purple-500/30",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentGlow: "shadow-purple-500/20",
    tagline: "Music Streaming Platform",
    description: "Sort results to find top performers, worst offenders, or chronological sequences.",
    sqlConcept: "ORDER BY",
    kpis: [
      { label: "Songs in Catalog", value: "8.4M", delta: "+200K", up: true },
      { label: "Streams Today", value: "41M", delta: "+6%", up: true },
      { label: "Avg Song Duration", value: "3m 28s", delta: "-5s", up: false },
      { label: "New Releases", value: "1,240", delta: "+180", up: true },
    ],
    chartData: [
      { label: "Pop", value: 38 },
      { label: "Hip-Hop", value: 28 },
      { label: "Rock", value: 14 },
      { label: "EDM", value: 11 },
      { label: "Classical", value: 5 },
      { label: "Other", value: 4 },
    ],
    chartLabel: "Stream Share by Genre (%)",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["ORDER BY", "DESC / ASC", "LIMIT"],
    challenge: {
      businessProblem:
        "🎵 Your editorial team is building the 'Top 10 This Week' playlist feature. Pull songs ranked by play count, highest first.",
      schema: [
        {
          name: "songs",
          cols: [
            { name: "id", type: "INT" },
            { name: "title", type: "VARCHAR" },
            { name: "artist", type: "VARCHAR" },
            { name: "genre", type: "VARCHAR" },
            { name: "play_count", type: "INT" },
            { name: "duration_sec", type: "INT" },
            { name: "release_date", type: "DATE" },
          ],
          sampleRows: [
            ["1", "Blinding Lights", "The Weeknd", "Pop", "4820000", "200", "2019-11-29"],
            ["2", "God's Plan", "Drake", "Hip-Hop", "3940000", "198", "2018-01-19"],
            ["3", "Clair de Lune", "Debussy", "Classical", "120000", "330", "1905-01-01"],
          ],
        },
      ],
      starterQuery: `SELECT title, artist, genre, play_count
FROM songs
-- Sort by play count, highest first
LIMIT 10;`,
      solution: `SELECT title, artist, genre, play_count
FROM songs
ORDER BY play_count DESC
LIMIT 10;`,
      outputHeaders: ["title", "artist", "genre", "play_count"],
      outputRows: [
        ["Blinding Lights", "The Weeknd", "Pop", "4,820,000"],
        ["As It Was", "Harry Styles", "Pop", "4,610,000"],
        ["God's Plan", "Drake", "Hip-Hop", "3,940,000"],
        ["Shape of You", "Ed Sheeran", "Pop", "3,720,000"],
        ["Levitating", "Dua Lipa", "Pop", "3,580,000"],
      ],
      hints: [
        "Use ORDER BY play_count DESC — DESC means highest first (descending). ASC means lowest first.",
        "Add LIMIT 10 after ORDER BY to return only the top 10 rows.",
      ],
      pmQuestion: "Top 3 songs are all Pop. EDM is growing 40% YoY but underrepresented in the Top 10. How do you handle this for the playlist feature?",
      pmChoices: [
        { text: "Show pure play-count ranking — data should speak for itself" },
        { text: "Add a 'Trending' sort (growth rate) alongside 'Most Played' as two tab options" },
        { text: "Manually curate the playlist to add EDM regardless of play count" },
        { text: "Remove the genre filter entirely and show all genres equally" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Pure play-count favors established genres. A 'Trending' sort (week-over-week growth rate) surfaces fast-rising genres like EDM to the right audience. Offering both views serves different user intents without overriding data.",
      insightBreakdown: [
        "ORDER BY DESC puts the highest values first — always clarify ASC vs DESC in your query intent",
        "Play count alone is lagging — doesn't capture momentum. Consider play_count_7d for recency",
        "LIMIT without ORDER BY returns random rows — always pair them",
      ],
      pmRecommendations: [
        "Add a 'play_count_7d' column to songs so the Top 10 reflects recent trends, not all-time",
        "Build two playlist tabs: 'All-Time Hits' (play_count DESC) and 'Trending Now' (7d growth DESC)",
        "Personalize the Top 10 by user genre affinity — one global chart isn't optimal",
      ],
      stakeholderQuestion:
        "Editorial team wants full manual control over the Top 10. Data team says 'let the algorithm decide.' How do you balance both?",
    },
  },

  // ── 6. LIMIT ──────────────────────────────────────────────────────────────
  {
    id: "f-limit",
    company: "Glimpse",
    industry: "Social Media",
    emoji: "📱",
    accentBorder: "border-pink-500/30",
    accentText: "text-pink-400",
    accentBg: "bg-pink-500/10",
    accentGlow: "shadow-pink-500/20",
    tagline: "Social Media Feed",
    description: "Control how many rows are returned — essential for pagination, top-N lists, and performance.",
    sqlConcept: "LIMIT",
    kpis: [
      { label: "DAU", value: "9.2M", delta: "+4%", up: true },
      { label: "Posts per Day", value: "14M", delta: "+8%", up: true },
      { label: "Avg Feed Scroll", value: "38 posts", delta: "+5", up: true },
      { label: "Avg Session", value: "18 min", delta: "-2 min", up: false },
    ],
    chartData: [
      { label: "6AM", value: 0.8 },
      { label: "9AM", value: 2.1 },
      { label: "12PM", value: 3.4 },
      { label: "3PM", value: 2.8 },
      { label: "6PM", value: 4.2 },
      { label: "9PM", value: 3.9 },
      { label: "12AM", value: 1.2 },
    ],
    chartLabel: "Hourly Active Users (M)",
    chartType: "line",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["LIMIT", "ORDER BY", "Pagination"],
    challenge: {
      businessProblem:
        "📲 The home feed loads the 20 most recent posts per refresh. Your engineer needs to test the pagination query — show how LIMIT controls the feed batch size.",
      schema: [
        {
          name: "posts",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "content", type: "TEXT" },
            { name: "likes", type: "INT" },
            { name: "comments", type: "INT" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["5001", "1001", "Just finished my run! 🏃", "142", "18", "2024-08-15 07:30"],
            ["5002", "1002", "Sunset from my rooftop 🌅", "380", "42", "2024-08-15 18:45"],
            ["5003", "1003", "New recipe I tried today...", "91", "7", "2024-08-15 12:00"],
          ],
        },
      ],
      starterQuery: `-- Return the 20 most recent posts for the home feed
SELECT id, user_id, likes, comments, created_at
FROM posts
ORDER BY created_at DESC
-- Limit to 20 rows`,
      solution: `SELECT id, user_id, likes, comments, created_at
FROM posts
ORDER BY created_at DESC
LIMIT 20;`,
      outputHeaders: ["id", "user_id", "likes", "comments", "created_at"],
      outputRows: [
        ["9241", "4012", "380", "42", "2024-08-15 22:58"],
        ["9240", "2891", "112", "9", "2024-08-15 22:55"],
        ["9239", "3104", "48", "3", "2024-08-15 22:51"],
        ["9238", "1820", "204", "21", "2024-08-15 22:49"],
        ["9237", "4521", "67", "5", "2024-08-15 22:45"],
      ],
      hints: [
        "LIMIT goes at the end of the query — after ORDER BY.",
        "LIMIT 20 means 'return at most 20 rows.' Combine with ORDER BY to control WHICH 20 rows.",
      ],
      pmQuestion: "Users scroll past 38 posts before engaging. Should you increase the batch LIMIT or personalize first?",
      pmChoices: [
        { text: "Increase LIMIT to 50 so users have more content per refresh" },
        { text: "Personalize post ranking — scroll depth is a relevance problem, not a quantity problem" },
        { text: "Reduce LIMIT to 10 to force faster engagement" },
        { text: "Add infinite scroll so LIMIT doesn't matter" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "38 posts before engagement means the first 38 weren't relevant. More posts (higher LIMIT) just extends the problem. Personalization changes which 20 posts are shown — addressing relevance, not volume.",
      insightBreakdown: [
        "LIMIT controls batch size but not quality — relevance comes from ORDER BY and ranking logic",
        "38-post scroll depth before engagement is a strong signal of poor content ranking",
        "Session time dropping (-2 min) while scroll depth increases = users are endlessly browsing, not engaging",
      ],
      pmRecommendations: [
        "Instrument 'first interaction post position' — if avg is 38, top 37 posts are wasted real estate",
        "A/B test ML-ranked feed vs chronological — measure first-interaction position as the primary metric",
        "Keep LIMIT at 20 for performance; fix the ranking, not the limit",
      ],
      stakeholderQuestion:
        "Growth PM says 'just show more posts per batch — engagement will go up.' How do you challenge this with data?",
    },
  },

  // ── 7. COUNT ──────────────────────────────────────────────────────────────
  {
    id: "f-count",
    company: "RideGo",
    industry: "Ride-Sharing",
    emoji: "🚖",
    accentBorder: "border-yellow-500/30",
    accentText: "text-yellow-400",
    accentBg: "bg-yellow-500/10",
    accentGlow: "shadow-yellow-500/20",
    tagline: "Ride-Sharing Operations",
    description: "COUNT is the most common SQL function — used in every operations, product, and growth query.",
    sqlConcept: "COUNT",
    kpis: [
      { label: "Rides This Week", value: "1.24M", delta: "+7%", up: true },
      { label: "Cancellation Rate", value: "6.8%", delta: "+1.2%", up: false },
      { label: "Avg Rating", value: "4.6", delta: "0", up: true },
      { label: "Active Drivers", value: "28K", delta: "+400", up: true },
    ],
    chartData: [
      { label: "Mon", value: 168 },
      { label: "Tue", value: 172 },
      { label: "Wed", value: 180 },
      { label: "Thu", value: 175 },
      { label: "Fri", value: 210 },
      { label: "Sat", value: 195 },
      { label: "Sun", value: 140 },
    ],
    chartLabel: "Daily Completed Rides (K)",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["COUNT", "GROUP BY", "DATE()", "WHERE"],
    challenge: {
      businessProblem:
        "📊 Operations wants to know how many completed rides happened each day this week — to spot any anomalies in the daily numbers.",
      schema: [
        {
          name: "rides",
          cols: [
            { name: "id", type: "INT" },
            { name: "driver_id", type: "INT" },
            { name: "rider_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" },
            { name: "fare", type: "DECIMAL" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["9001", "D101", "R501", "Mumbai", "completed", "182.00", "2024-08-12 08:30"],
            ["9002", "D102", "R502", "Delhi", "cancelled", "0.00", "2024-08-12 09:00"],
            ["9003", "D103", "R503", "Bangalore", "completed", "240.00", "2024-08-12 09:15"],
          ],
        },
      ],
      starterQuery: `SELECT
  DATE(created_at) AS ride_date,
  COUNT(*) AS total_rides
FROM rides
WHERE status = 'completed'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY ride_date;`,
      solution: `SELECT
  DATE(created_at) AS ride_date,
  COUNT(*) AS total_rides
FROM rides
WHERE status = 'completed'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY ride_date;`,
      outputHeaders: ["ride_date", "total_rides"],
      outputRows: [
        ["2024-08-09", "140,210"],
        ["2024-08-10", "168,450"],
        ["2024-08-11", "172,100"],
        ["2024-08-12", "180,320"],
        ["2024-08-13", "175,890"],
        ["2024-08-14", "209,640"],
        ["2024-08-15", "195,100"],
      ],
      hints: [
        "COUNT(*) counts every row that passes the WHERE filter. Use it with GROUP BY to count per group.",
        "DATE(created_at) extracts just the date part from a timestamp — so all rides on the same day group together.",
      ],
      pmQuestion: "Monday has 29% fewer rides than Friday. Before investigating supply, what's the first context check?",
      pmChoices: [
        { text: "Immediately increase driver incentives on Mondays" },
        { text: "Check if Monday-Friday demand difference is a known seasonal pattern, not an anomaly" },
        { text: "Assume Monday is broken and file an incident" },
        { text: "Compare Monday vs last Monday year-over-year before acting" },
      ],
      correctPMIndex: 3,
      pmExplanation:
        "Monday–Friday variance is expected in ride-sharing (commute vs weekend patterns). A YoY comparison tells you if this Monday was worse than usual — that's the anomaly signal. Acting on expected seasonality wastes resources.",
      insightBreakdown: [
        "COUNT(*) with GROUP BY is the foundation of all ops reporting — learn it cold",
        "Friday peak (210K) vs Sunday trough (140K) = 50% variance is normal for urban ride-sharing",
        "Weekly trend shows consistent growth — no anomaly, just seasonal pattern",
      ],
      pmRecommendations: [
        "Set day-of-week baselines (Monday avg, Friday avg) so ops can alert on deviations, not raw counts",
        "Track 'rides vs same day last week' as the primary daily health metric",
        "Add city breakdown to this query: GROUP BY DATE(created_at), city for localized ops view",
      ],
      stakeholderQuestion:
        "Operations head asks 'why is Monday always low?' — how do you explain it using data and product context?",
    },
  },

  // ── 8. SUM ────────────────────────────────────────────────────────────────
  {
    id: "f-sum",
    company: "MarketHub",
    industry: "Online Marketplace",
    emoji: "💰",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentGlow: "shadow-emerald-500/20",
    tagline: "Online Marketplace Revenue",
    description: "SUM aggregates numeric values — the go-to for revenue, GMV, and any financial rollup.",
    sqlConcept: "SUM",
    kpis: [
      { label: "Monthly GMV", value: "₹48Cr", delta: "+14%", up: true },
      { label: "Avg Order Value", value: "₹1,240", delta: "+8%", up: true },
      { label: "Total Orders", value: "387K", delta: "+11%", up: true },
      { label: "Refund Rate", value: "3.1%", delta: "+0.4%", up: false },
    ],
    chartData: [
      { label: "Jan", value: 38 },
      { label: "Feb", value: 40 },
      { label: "Mar", value: 42 },
      { label: "Apr", value: 39 },
      { label: "May", value: 44 },
      { label: "Jun", value: 48 },
    ],
    chartLabel: "Monthly GMV (₹ Cr)",
    chartType: "line",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["SUM", "GROUP BY", "ROUND", "ORDER BY"],
    challenge: {
      businessProblem:
        "💰 Finance needs last month's total revenue by product category for the P&L report. Each order item has a price and quantity — revenue = price × quantity.",
      schema: [
        {
          name: "order_items",
          cols: [
            { name: "id", type: "INT" },
            { name: "order_id", type: "INT" },
            { name: "product_id", type: "INT" },
            { name: "category", type: "VARCHAR" },
            { name: "price", type: "DECIMAL" },
            { name: "quantity", type: "INT" },
            { name: "created_at", type: "DATE" },
          ],
          sampleRows: [
            ["1", "5001", "201", "Electronics", "8999.00", "1", "2024-07-14"],
            ["2", "5001", "202", "Fashion", "1499.00", "2", "2024-07-14"],
            ["3", "5002", "203", "Home", "3499.00", "1", "2024-07-20"],
          ],
        },
      ],
      starterQuery: `SELECT
  category,
  -- Total revenue = SUM(price * quantity)
  ROUND(SUM(price * quantity), 2) AS total_revenue
FROM order_items
WHERE created_at >= '2024-07-01'
  AND created_at < '2024-08-01'
GROUP BY category
ORDER BY total_revenue DESC;`,
      solution: `SELECT
  category,
  ROUND(SUM(price * quantity), 2) AS total_revenue
FROM order_items
WHERE created_at >= '2024-07-01'
  AND created_at < '2024-08-01'
GROUP BY category
ORDER BY total_revenue DESC;`,
      outputHeaders: ["category", "total_revenue"],
      outputRows: [
        ["Electronics", "₹18,40,200"],
        ["Fashion", "₹9,21,800"],
        ["Home", "₹6,84,100"],
        ["Sports", "₹4,12,500"],
        ["Books", "₹1,08,200"],
      ],
      hints: [
        "SUM(price * quantity) calculates revenue per row and adds them all up within each GROUP.",
        "Wrap with ROUND(..., 2) to get clean 2-decimal output. GROUP BY category to get one row per category.",
      ],
      pmQuestion: "Electronics is 3x Fashion revenue. Do you invest more in Electronics or try to grow Fashion?",
      pmChoices: [
        { text: "Double down on Electronics — it already drives the most revenue" },
        { text: "Analyze why Fashion is lower: supply gap, demand gap, or pricing issue — then decide" },
        { text: "Invest equally in both to diversify revenue" },
        { text: "Discontinue low-revenue categories like Books to focus resources" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Revenue gap alone doesn't tell you whether Fashion has growth potential or is structurally limited. You need to understand if it's a supply problem (few sellers), a demand problem (users aren't looking), or a pricing problem — before committing investment.",
      insightBreakdown: [
        "SUM with GROUP BY is the standard revenue rollup — used in every P&L and GMV report",
        "Electronics dominance (46% of GMV) creates concentration risk — platform is too dependent on one category",
        "Books at ₹1.08L is tiny but may have high margins — revenue alone doesn't capture category health",
      ],
      pmRecommendations: [
        "Add SUM(quantity) and COUNT(DISTINCT order_id) to this query for a fuller category picture",
        "Track category mix as a % of total GMV — alert if Electronics > 50% (concentration risk)",
        "Before growing Fashion: check Fashion conversion rate vs Electronics — is it a demand or supply gap?",
      ],
      stakeholderQuestion:
        "CFO says 'maximize Electronics revenue this quarter.' Category PM says 'Fashion is the future.' How do you align them?",
    },
  },

  // ── 9. AVG ────────────────────────────────────────────────────────────────
  {
    id: "f-avg",
    company: "StayNest",
    industry: "Hotel Booking",
    emoji: "🏨",
    accentBorder: "border-teal-500/30",
    accentText: "text-teal-400",
    accentBg: "bg-teal-500/10",
    accentGlow: "shadow-teal-500/20",
    tagline: "Hotel Booking Platform",
    description: "AVG surfaces the typical value in a dataset — critical for benchmarking and quality tracking.",
    sqlConcept: "AVG",
    kpis: [
      { label: "Hotels Listed", value: "12,400", delta: "+340", up: true },
      { label: "Avg Platform Rating", value: "4.2", delta: "+0.1", up: true },
      { label: "Bookings This Month", value: "184K", delta: "+9%", up: true },
      { label: "Cancellation Rate", value: "11%", delta: "+2%", up: false },
    ],
    chartData: [
      { label: "Budget", value: 3.9 },
      { label: "Mid-range", value: 4.1 },
      { label: "Boutique", value: 4.7 },
      { label: "Business", value: 4.3 },
      { label: "Resort", value: 4.5 },
    ],
    chartLabel: "Avg Rating by Hotel Type",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["AVG", "ROUND", "GROUP BY", "COUNT"],
    challenge: {
      businessProblem:
        "⭐ Product team wants to rank hotel types by guest satisfaction to decide which segment to feature in the 'Best on StayNest' campaign.",
      schema: [
        {
          name: "reviews",
          cols: [
            { name: "id", type: "INT" },
            { name: "hotel_id", type: "INT" },
            { name: "hotel_type", type: "VARCHAR" },
            { name: "rating", type: "DECIMAL" },
            { name: "review_date", type: "DATE" },
          ],
          sampleRows: [
            ["1", "201", "Boutique", "4.8", "2024-07-10"],
            ["2", "202", "Budget", "3.7", "2024-07-11"],
            ["3", "203", "Resort", "4.6", "2024-07-12"],
          ],
        },
      ],
      starterQuery: `SELECT
  hotel_type,
  ROUND(AVG(rating), 2) AS avg_rating,
  COUNT(*) AS review_count
FROM reviews
GROUP BY hotel_type
ORDER BY avg_rating DESC;`,
      solution: `SELECT
  hotel_type,
  ROUND(AVG(rating), 2) AS avg_rating,
  COUNT(*) AS review_count
FROM reviews
GROUP BY hotel_type
ORDER BY avg_rating DESC;`,
      outputHeaders: ["hotel_type", "avg_rating", "review_count"],
      outputRows: [
        ["Boutique", "4.71", "120"],
        ["Resort", "4.52", "890"],
        ["Business", "4.31", "2,140"],
        ["Mid-range", "4.12", "4,820"],
        ["Budget", "3.88", "6,100"],
      ],
      hints: [
        "AVG(rating) calculates the mean rating across all rows in each GROUP. Wrap with ROUND(…, 2) for 2 decimal places.",
        "Always include COUNT(*) alongside AVG — an average based on 5 reviews is less reliable than one from 5,000.",
      ],
      pmQuestion: "Boutique hotels have the highest avg rating (4.71) but only 120 reviews. Do you feature them in the campaign?",
      pmChoices: [
        { text: "Yes — highest rating = best quality = should be featured" },
        { text: "No — 120 reviews is too small a sample; the avg may not be statistically reliable" },
        { text: "Feature Resorts instead — 4.52 avg with 890 reviews is more trustworthy" },
        { text: "Feature Budget hotels — most users book budget anyway" },
      ],
      correctPMIndex: 2,
      pmExplanation:
        "Statistical significance matters. Boutique's 4.71 from 120 reviews has high variance — one viral review could move it significantly. Resort's 4.52 from 890 reviews is more stable and trustworthy for a campaign. Always pair AVG with COUNT.",
      insightBreakdown: [
        "AVG alone is misleading without COUNT — always show both in any rating report",
        "Budget hotels have the most reviews (6,100) but lowest avg (3.88) — volume ≠ quality",
        "Business hotels: high review count (2,140) and solid avg (4.31) — underrated segment for campaigns",
      ],
      pmRecommendations: [
        "Add a 'minimum review threshold' (e.g., ≥ 50 reviews) before any hotel appears in featured sections",
        "Track avg_rating trend over time — a hotel at 4.7 dropping to 4.2 is more concerning than one stable at 4.2",
        "Build a Bayesian average (weighted by review count) for fairer ranking of low-review hotels",
      ],
      stakeholderQuestion:
        "Marketing wants to feature the highest-rated hotel (4.95 avg, 8 reviews). How do you explain why that's risky?",
    },
  },

  // ── 10. MAX / MIN ─────────────────────────────────────────────────────────
  {
    id: "f-max-min",
    company: "GameZone",
    industry: "Gaming Platform",
    emoji: "🎮",
    accentBorder: "border-indigo-500/30",
    accentText: "text-indigo-400",
    accentBg: "bg-indigo-500/10",
    accentGlow: "shadow-indigo-500/20",
    tagline: "Gaming Leaderboard Analytics",
    description: "MAX and MIN find the extremes in your data — leaderboard tops, worst performers, salary ranges.",
    sqlConcept: "MAX / MIN",
    kpis: [
      { label: "Active Players", value: "2.4M", delta: "+12%", up: true },
      { label: "Games Available", value: "380", delta: "+24", up: true },
      { label: "Avg Session Time", value: "42 min", delta: "+5 min", up: true },
      { label: "Daily Matches", value: "8.2M", delta: "+18%", up: true },
    ],
    chartData: [
      { label: "Action", value: 42 },
      { label: "Puzzle", value: 28 },
      { label: "Strategy", value: 18 },
      { label: "Sports", value: 8 },
      { label: "RPG", value: 4 },
    ],
    chartLabel: "Player Share by Genre (%)",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["MAX", "MIN", "AVG", "GROUP BY"],
    challenge: {
      businessProblem:
        "🏆 The leaderboard team needs the top score, lowest score, and average score per game — to display the score range and set difficulty expectations for new players.",
      schema: [
        {
          name: "scores",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "game_id", type: "INT" },
            { name: "game_name", type: "VARCHAR" },
            { name: "score", type: "INT" },
            { name: "achieved_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1", "1001", "G1", "Pixel Racer", "48200", "2024-08-10 14:30"],
            ["2", "1002", "G1", "Pixel Racer", "12400", "2024-08-11 09:15"],
            ["3", "1003", "G2", "Word Blitz", "4920", "2024-08-11 10:00"],
          ],
        },
      ],
      starterQuery: `SELECT
  game_name,
  MAX(score) AS top_score,
  MIN(score) AS lowest_score,
  ROUND(AVG(score), 0) AS avg_score,
  COUNT(*) AS total_attempts
FROM scores
GROUP BY game_name
ORDER BY top_score DESC;`,
      solution: `SELECT
  game_name,
  MAX(score) AS top_score,
  MIN(score) AS lowest_score,
  ROUND(AVG(score), 0) AS avg_score,
  COUNT(*) AS total_attempts
FROM scores
GROUP BY game_name
ORDER BY top_score DESC;`,
      outputHeaders: ["game_name", "top_score", "lowest_score", "avg_score", "total_attempts"],
      outputRows: [
        ["Pixel Racer", "98,400", "800", "24,100", "184,200"],
        ["Dino Dash", "76,200", "1,200", "18,400", "92,100"],
        ["Word Blitz", "12,800", "100", "4,200", "241,800"],
        ["Chess Master", "5,200", "4,800", "5,010", "18,400"],
        ["Math Sprint", "9,100", "200", "3,800", "56,700"],
      ],
      hints: [
        "MAX(score) finds the single highest value in the group. MIN(score) finds the lowest. Both work with GROUP BY.",
        "Always add COUNT(*) alongside MAX/MIN — a huge score range with few attempts means fewer data points.",
      ],
      pmQuestion: "Chess Master has a tight score range (4,800–5,200). Pixel Racer's range is 800–98,400. What does this tell you about each game?",
      pmChoices: [
        { text: "Chess Master is more popular — tighter scores mean more players" },
        { text: "Chess Master has consistent difficulty; Pixel Racer has extreme skill variance or unfair mechanics" },
        { text: "Pixel Racer is better designed — higher ceiling means more room to grow" },
        { text: "Score range doesn't tell you anything meaningful about game design" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "A tight score range (Chess Master) means skill levels are clustered — consistent experience. A huge range (Pixel Racer: 800 to 98,400) signals extreme skill variance, possible pay-to-win mechanics, or exploits. Both are design signals worth investigating.",
      insightBreakdown: [
        "MAX - MIN = score range. A huge range can indicate skill gap, game imbalance, or cheating",
        "Chess Master has the fewest attempts (18,400) but tightest range — niche but consistent game",
        "Word Blitz has the most attempts (241,800) — high accessibility, though low avg score (4,200)",
      ],
      pmRecommendations: [
        "Flag games where MAX > 50× MIN for a fairness audit — could indicate exploits or pay-to-win",
        "Show new players the avg score (not max) to set realistic expectations and reduce early churn",
        "Add percentile brackets (Top 10%, Top 1%) so leaderboards feel achievable for casual players",
      ],
      stakeholderQuestion:
        "A top player says Pixel Racer is 'broken' because one user has 98,400 while the next is at 48,000. How do you investigate?",
    },
  },

  // ── 11. DISTINCT ──────────────────────────────────────────────────────────
  {
    id: "f-distinct",
    company: "LearnSphere",
    industry: "E-Learning",
    emoji: "📚",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/10",
    accentGlow: "shadow-sky-500/20",
    tagline: "E-Learning Enrollment Analytics",
    description: "DISTINCT removes duplicate values — essential for counting unique users, courses, or events.",
    sqlConcept: "DISTINCT",
    kpis: [
      { label: "Total Students", value: "84K", delta: "+12%", up: true },
      { label: "Courses Published", value: "800", delta: "+40", up: true },
      { label: "Courses With Students", value: "240", delta: "+18", up: true },
      { label: "Avg Completion Rate", value: "38%", delta: "-4%", up: false },
    ],
    chartData: [
      { label: "Jan", value: 62 },
      { label: "Feb", value: 68 },
      { label: "Mar", value: 74 },
      { label: "Apr", value: 72 },
      { label: "May", value: 79 },
      { label: "Jun", value: 84 },
    ],
    chartLabel: "Total Students (K)",
    chartType: "line",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["DISTINCT", "COUNT DISTINCT", "WHERE"],
    challenge: {
      businessProblem:
        "📖 Growth team wants to know how many unique courses have at least one enrolled student, and how many unique students are actively enrolled — not total enrollment rows.",
      schema: [
        {
          name: "enrollments",
          cols: [
            { name: "id", type: "INT" },
            { name: "student_id", type: "INT" },
            { name: "course_id", type: "INT" },
            { name: "course_name", type: "VARCHAR" },
            { name: "enrolled_at", type: "TIMESTAMP" },
            { name: "completed", type: "BOOLEAN" },
          ],
          sampleRows: [
            ["1", "S101", "C01", "SQL Basics", "2024-06-10 09:00", "1"],
            ["2", "S102", "C01", "SQL Basics", "2024-06-11 10:00", "0"],
            ["3", "S101", "C02", "Python for PMs", "2024-06-12 11:00", "0"],
          ],
        },
      ],
      starterQuery: `SELECT
  COUNT(DISTINCT course_id) AS unique_courses_with_students,
  COUNT(DISTINCT student_id) AS unique_enrolled_students,
  COUNT(*) AS total_enrollment_rows
FROM enrollments;`,
      solution: `SELECT
  COUNT(DISTINCT course_id) AS unique_courses_with_students,
  COUNT(DISTINCT student_id) AS unique_enrolled_students,
  COUNT(*) AS total_enrollment_rows
FROM enrollments;`,
      outputHeaders: ["unique_courses_with_students", "unique_enrolled_students", "total_enrollment_rows"],
      outputRows: [
        ["240", "84,000", "312,800"],
      ],
      hints: [
        "COUNT(DISTINCT column) counts only unique values — duplicates are ignored.",
        "total_enrollment_rows (312,800) is larger than unique students (84,000) because one student can enroll in multiple courses.",
      ],
      pmQuestion: "800 courses published, only 240 have students. What's the most likely cause of the 70% unused catalog?",
      pmChoices: [
        { text: "The unused 560 courses are too advanced — students aren't ready for them" },
        { text: "Discovery problem — students can't find these courses in search or recommendations" },
        { text: "Content quality is poor — students avoided them based on previews" },
        { text: "All three equally likely — need more data to distinguish" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "In most marketplaces, a 30% catalog utilization rate is primarily a discovery problem. Students enroll in what they find (search, homepage, recommendations) — not what they can't see. Before assuming quality issues, audit where enrollments come from (search vs recommended vs direct link).",
      insightBreakdown: [
        "DISTINCT eliminates duplicates — critical when one user can appear in multiple rows",
        "312,800 enrollment rows vs 84,000 unique students = avg 3.7 courses per student",
        "Only 30% of courses have any students — a classic long-tail catalog problem",
      ],
      pmRecommendations: [
        "Audit the enrollment source (search, recommendation, direct) — if >70% is search, fix discoverability",
        "Add a 'Similar Courses' recommendation widget to drive traffic to underserved catalog",
        "Track: % of published courses with ≥10 students as a catalog health metric",
      ],
      stakeholderQuestion:
        "Content team says 'we need to publish 200 more courses.' How do you respond given 560 existing courses have zero students?",
    },
  },

  // ── 12. GROUP BY ──────────────────────────────────────────────────────────
  {
    id: "f-group-by",
    company: "DineNow",
    industry: "Food Delivery",
    emoji: "🌆",
    accentBorder: "border-rose-500/30",
    accentText: "text-rose-400",
    accentBg: "bg-rose-500/10",
    accentGlow: "shadow-rose-500/20",
    tagline: "City-Level Delivery Analytics",
    description: "GROUP BY aggregates data by category — every PM dashboard query uses it.",
    sqlConcept: "GROUP BY",
    kpis: [
      { label: "Cities Active", value: "42", delta: "+3", up: true },
      { label: "Weekly Orders", value: "3.8M", delta: "+11%", up: true },
      { label: "Avg Order Value", value: "₹285", delta: "+₹12", up: true },
      { label: "City Expansion Rate", value: "1.2/mo", delta: "+0.3", up: true },
    ],
    chartData: [
      { label: "Mumbai", value: 920 },
      { label: "Delhi", value: 780 },
      { label: "Bangalore", value: 680 },
      { label: "Hyderabad", value: 420 },
      { label: "Chennai", value: 380 },
      { label: "Other", value: 620 },
    ],
    chartLabel: "Weekly Orders by City (K)",
    chartType: "bar",
    estimatedMinutes: 6,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["GROUP BY", "COUNT", "SUM", "ORDER BY"],
    challenge: {
      businessProblem:
        "🏙️ City managers need to see total orders and revenue per city to allocate next quarter's marketing budget. One row per city, sorted by revenue.",
      schema: [
        {
          name: "orders",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "order_value", type: "DECIMAL" },
            { name: "status", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1001", "501", "Mumbai", "320.00", "delivered", "2024-08-10 12:30"],
            ["1002", "502", "Delhi", "185.00", "delivered", "2024-08-10 13:00"],
            ["1003", "503", "Mumbai", "420.00", "cancelled", "2024-08-10 13:15"],
          ],
        },
      ],
      starterQuery: `SELECT
  city,
  COUNT(*) AS total_orders,
  ROUND(SUM(order_value), 2) AS total_revenue
FROM orders
WHERE status = 'delivered'
GROUP BY city
ORDER BY total_revenue DESC;`,
      solution: `SELECT
  city,
  COUNT(*) AS total_orders,
  ROUND(SUM(order_value), 2) AS total_revenue
FROM orders
WHERE status = 'delivered'
GROUP BY city
ORDER BY total_revenue DESC;`,
      outputHeaders: ["city", "total_orders", "total_revenue"],
      outputRows: [
        ["Mumbai", "920,410", "₹2,94,53,200"],
        ["Delhi", "780,120", "₹2,22,33,400"],
        ["Bangalore", "680,300", "₹1,94,16,550"],
        ["Hyderabad", "420,180", "₹1,19,75,130"],
        ["Chennai", "380,090", "₹1,08,35,660"],
      ],
      hints: [
        "GROUP BY city means one output row per city. Every non-aggregated column in SELECT must appear in GROUP BY.",
        "Add WHERE status = 'delivered' before GROUP BY so you only count completed orders.",
      ],
      pmQuestion: "Mumbai has 2x more revenue than Delhi. Should you increase Mumbai's marketing budget or invest in Delhi's growth?",
      pmChoices: [
        { text: "Increase Mumbai — ROI is already proven there" },
        { text: "Check if Mumbai is near saturation (high market share) and Delhi has more upside" },
        { text: "Split budget 50-50 across all top cities" },
        { text: "Invest in new cities — top 5 are already mature" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Revenue alone doesn't tell you where incremental marketing spend has the highest return. Mumbai may already have 60% market share with little room to grow. Delhi at lower penetration could give 3× more return per rupee. Always check market share and growth rate before budget allocation.",
      insightBreakdown: [
        "GROUP BY is the backbone of every business dashboard — revenue by city, orders by day, users by cohort",
        "Mumbai + Delhi = 59% of total revenue — high concentration risk",
        "Total revenue metric is lagging — add 'revenue vs last month' for each city to see momentum",
      ],
      pmRecommendations: [
        "Add ROUND(SUM(order_value) / COUNT(*), 2) AS avg_order_value to see city-level basket size",
        "Build a city health dashboard: orders, revenue, avg order value, and growth rate in one view",
        "Track: % of cities contributing >5% of revenue — diversification health signal",
      ],
      stakeholderQuestion:
        "Regional VP wants budget for Tier-2 cities (Jaipur, Kochi). You have data only for Tier-1. How do you decide?",
    },
  },

  // ── 13. HAVING ────────────────────────────────────────────────────────────
  {
    id: "f-having",
    company: "WorkFlow Pro",
    industry: "B2B SaaS",
    emoji: "⚡",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentGlow: "shadow-violet-500/20",
    tagline: "SaaS Power User Analytics",
    description: "HAVING filters aggregated results — WHERE filters rows, HAVING filters groups.",
    sqlConcept: "HAVING",
    kpis: [
      { label: "Total Users", value: "18,400", delta: "+6%", up: true },
      { label: "Power Users (15+ logins)", value: "280", delta: "+40", up: true },
      { label: "Avg Logins/Month", value: "8.2", delta: "+0.8", up: true },
      { label: "Churn Rate", value: "3.8%", delta: "-0.4%", up: true },
    ],
    chartData: [
      { label: "1-3", value: 42 },
      { label: "4-7", value: 31 },
      { label: "8-14", value: 18 },
      { label: "15-20", value: 6 },
      { label: "21+", value: 3 },
    ],
    chartLabel: "Users by Monthly Login Frequency (%)",
    chartType: "bar",
    estimatedMinutes: 7,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["HAVING", "GROUP BY", "COUNT", "WHERE vs HAVING"],
    challenge: {
      businessProblem:
        "⚡ CS team wants to identify power users (>15 logins in the last 30 days) to enroll them in a beta program. HAVING is needed because you can't use COUNT in a WHERE clause.",
      schema: [
        {
          name: "logins",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "logged_in_at", type: "TIMESTAMP" },
            { name: "device", type: "VARCHAR" },
          ],
          sampleRows: [
            ["1", "U101", "2024-08-01 09:00", "desktop"],
            ["2", "U101", "2024-08-02 10:30", "mobile"],
            ["3", "U202", "2024-08-01 14:00", "desktop"],
          ],
        },
      ],
      starterQuery: `SELECT
  user_id,
  COUNT(*) AS login_count
FROM logins
WHERE logged_in_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY user_id
-- Filter AFTER grouping: only users with > 15 logins
HAVING login_count > 15
ORDER BY login_count DESC;`,
      solution: `SELECT
  user_id,
  COUNT(*) AS login_count
FROM logins
WHERE logged_in_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY user_id
HAVING login_count > 15
ORDER BY login_count DESC;`,
      outputHeaders: ["user_id", "login_count"],
      outputRows: [
        ["U0842", "31"],
        ["U1204", "28"],
        ["U0091", "24"],
        ["U2841", "22"],
        ["U0441", "19"],
      ],
      hints: [
        "WHERE filters individual rows before grouping. HAVING filters the grouped results — you can use COUNT in HAVING, not in WHERE.",
        "The order is: WHERE → GROUP BY → HAVING → ORDER BY. Each step refines the previous.",
      ],
      pmQuestion: "280 power users identified. How do you use this list to improve retention for regular users?",
      pmChoices: [
        { text: "Give power users a discount to keep them from churning" },
        { text: "Interview power users to find which workflows drive their high engagement, then design onboarding around those patterns" },
        { text: "Feature power users on the platform as 'experts' for social proof" },
        { text: "Power users retain themselves — focus resources on low-engagement users instead" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Power users are the best signal of what a great product experience looks like. Their workflows, features used, and 'aha moment' sequences are a blueprint for onboarding new users. Mining power-user behavior is one of the highest-leverage PM research activities.",
      insightBreakdown: [
        "HAVING = 'WHERE for groups' — always comes after GROUP BY, before ORDER BY",
        "280 power users out of 18,400 = 1.5% — small but highly influential segment",
        "31 logins/month = >1 per day — these users have built a daily habit around the product",
      ],
      pmRecommendations: [
        "Build a 'Power User Playbook': which features they use, in which order, on which days",
        "Design onboarding to replicate the first week of a power user's behavior",
        "Track: % of new users who reach 'power user' login frequency within 90 days — as a leading retention metric",
      ],
      stakeholderQuestion:
        "CEO wants to feature power users in marketing materials. What do you need to confirm with Legal before doing so?",
    },
  },

  // ── 14. LIKE ──────────────────────────────────────────────────────────────
  {
    id: "f-like",
    company: "HireSpot",
    industry: "Job Board",
    emoji: "💼",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentGlow: "shadow-amber-500/20",
    tagline: "Job Board Search Analytics",
    description: "LIKE enables pattern matching on text — the SQL equivalent of a simple keyword search.",
    sqlConcept: "LIKE",
    kpis: [
      { label: "Active Job Listings", value: "42K", delta: "+8%", up: true },
      { label: "Daily Applications", value: "18K", delta: "+12%", up: true },
      { label: "Avg Time-to-Fill", value: "18 days", delta: "-2 days", up: true },
      { label: "JS/React Jobs", value: "1,230", delta: "+340", up: true },
    ],
    chartData: [
      { label: "React", value: 340 },
      { label: "Python", value: 890 },
      { label: "JavaScript", value: 890 },
      { label: "Java", value: 620 },
      { label: "SQL", value: 480 },
    ],
    chartLabel: "Job Listings by Skill",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["LIKE", "Wildcards %", "OR", "WHERE"],
    challenge: {
      businessProblem:
        "🔍 A recruiter wants all job listings that mention 'React' or 'JavaScript' in the title — to send to a batch of frontend developer candidates.",
      schema: [
        {
          name: "jobs",
          cols: [
            { name: "id", type: "INT" },
            { name: "title", type: "VARCHAR" },
            { name: "company", type: "VARCHAR" },
            { name: "location", type: "VARCHAR" },
            { name: "salary_lpa", type: "DECIMAL" },
            { name: "posted_at", type: "DATE" },
          ],
          sampleRows: [
            ["1", "Senior React Developer", "Razorpay", "Bangalore", "28.00", "2024-08-10"],
            ["2", "Python Backend Engineer", "Swiggy", "Bangalore", "32.00", "2024-08-11"],
            ["3", "JavaScript Full-Stack Dev", "Meesho", "Remote", "22.00", "2024-08-12"],
          ],
        },
      ],
      starterQuery: `SELECT title, company, location, salary_lpa
FROM jobs
WHERE title LIKE '%React%'
   OR title LIKE '%JavaScript%'
ORDER BY salary_lpa DESC;`,
      solution: `SELECT title, company, location, salary_lpa
FROM jobs
WHERE title LIKE '%React%'
   OR title LIKE '%JavaScript%'
ORDER BY salary_lpa DESC;`,
      outputHeaders: ["title", "company", "location", "salary_lpa"],
      outputRows: [
        ["Lead React Engineer", "Zepto", "Mumbai", "42.00"],
        ["Senior React Developer", "Razorpay", "Bangalore", "28.00"],
        ["JavaScript Full-Stack Dev", "Meesho", "Remote", "22.00"],
        ["Junior React Developer", "Startups.co", "Remote", "12.00"],
        ["JavaScript UI Developer", "TCS Digital", "Hyderabad", "10.00"],
      ],
      hints: [
        "% is a wildcard that matches any sequence of characters. '%React%' matches 'Senior React Developer', 'React Native Dev', etc.",
        "Use OR to combine multiple LIKE conditions — returns jobs matching EITHER pattern.",
      ],
      pmQuestion: "890 JavaScript jobs vs 340 React jobs. What does this tell you about the market trend?",
      pmChoices: [
        { text: "JavaScript is more popular — prioritize it in candidate skill recommendations" },
        { text: "React is a subset of JavaScript — the overlap means 340 React jobs are also JS jobs" },
        { text: "React is declining — fewer listings means less demand" },
        { text: "The data is misleading because LIKE is case-sensitive" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "React is a JavaScript framework — React jobs are a subset of JavaScript jobs. A job titled 'React Developer' will match both '%React%' and indirectly be a JS job. The PM insight is that React-specific roles (340) sit within the broader JS market (890), not competing with it.",
      insightBreakdown: [
        "% wildcard before AND after the term catches the keyword anywhere in the title",
        "LIKE is case-insensitive in most databases (MySQL), but LIKE BINARY is case-sensitive",
        "890 JS jobs + 340 React jobs likely overlap significantly — de-dup before reporting to candidates",
      ],
      pmRecommendations: [
        "Add a 'skills' column to jobs table so searches use exact match instead of fragile LIKE patterns",
        "Build a skills taxonomy that maps 'React' → JavaScript family, 'Pandas' → Python, etc.",
        "Use LIKE for quick exploration; move to full-text search (MATCH AGAINST) for production search",
      ],
      stakeholderQuestion:
        "Recruiter asks 'find all Python jobs too.' How does your query change, and what are the performance implications of many LIKE conditions?",
    },
  },

  // ── 15. IN ────────────────────────────────────────────────────────────────
  {
    id: "f-in",
    company: "JetBook",
    industry: "Travel Booking",
    emoji: "✈️",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentBg: "bg-sky-500/10",
    accentGlow: "shadow-sky-500/20",
    tagline: "Travel Booking Platform",
    description: "IN lets you match against a list of values — cleaner and faster than multiple OR conditions.",
    sqlConcept: "IN",
    kpis: [
      { label: "Bookings This Week", value: "84K", delta: "+9%", up: true },
      { label: "Pending / Failed", value: "420", delta: "+80", up: false },
      { label: "Avg Ticket Price", value: "₹8,200", delta: "+₹340", up: true },
      { label: "Refund Requests", value: "128", delta: "+24", up: false },
    ],
    chartData: [
      { label: "confirmed", value: 78 },
      { label: "pending", value: 12 },
      { label: "cancelled", value: 6 },
      { label: "failed", value: 3 },
      { label: "refunded", value: 1 },
    ],
    chartLabel: "Booking Status Distribution (%)",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["IN", "NOT IN", "WHERE", "ORDER BY"],
    challenge: {
      businessProblem:
        "📋 Customer support needs all bookings in 'pending' or 'failed' status from the last 7 days to process refunds and follow up with users.",
      schema: [
        {
          name: "bookings",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "flight_id", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" },
            { name: "amount", type: "DECIMAL" },
            { name: "booked_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["B001", "U101", "AI-202", "pending", "8200.00", "2024-08-14 10:00"],
            ["B002", "U102", "6E-441", "confirmed", "6800.00", "2024-08-14 10:30"],
            ["B003", "U103", "SG-101", "failed", "12400.00", "2024-08-14 11:00"],
          ],
        },
      ],
      starterQuery: `SELECT id, user_id, flight_id, status, amount, booked_at
FROM bookings
WHERE status IN ('pending', 'failed')
  AND booked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY booked_at DESC;`,
      solution: `SELECT id, user_id, flight_id, status, amount, booked_at
FROM bookings
WHERE status IN ('pending', 'failed')
  AND booked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY booked_at DESC;`,
      outputHeaders: ["id", "user_id", "flight_id", "status", "amount", "booked_at"],
      outputRows: [
        ["B8841", "U4012", "AI-808", "failed", "₹12,400", "2024-08-15 22:10"],
        ["B8820", "U3891", "6E-220", "pending", "₹8,200", "2024-08-15 21:48"],
        ["B8741", "U2104", "SG-441", "failed", "₹9,800", "2024-08-15 20:30"],
        ["B8690", "U1820", "AI-101", "pending", "₹6,500", "2024-08-15 19:15"],
        ["B8584", "U4521", "UK-910", "failed", "₹18,200", "2024-08-15 18:05"],
      ],
      hints: [
        "IN ('pending', 'failed') is cleaner than: status = 'pending' OR status = 'failed'. Same result, easier to read.",
        "NOT IN ('confirmed', 'refunded') would give the same result here — choose whichever is shorter.",
      ],
      pmQuestion: "420 pending/failed bookings — 70% are from mobile. Where do you look first?",
      pmChoices: [
        { text: "Assume it's a payment gateway issue and contact the payment provider" },
        { text: "Check if mobile booking flow has a UX or technical failure at the payment step" },
        { text: "Refund all 420 automatically to protect brand trust" },
        { text: "Send a 10% discount to all 420 users as compensation" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "70% mobile concentration is a strong signal. Mobile-specific payment failures often trace to: small tap targets on the payment page, 3D Secure redirect loops, or specific bank app compatibility issues. Check the mobile payment funnel drop-off before contacting the payment provider.",
      insightBreakdown: [
        "IN is cleaner than multiple OR statements and easier to extend (just add another value)",
        "15% pending/failed rate (420/2,800 weekly) is high for a booking platform — industry avg is 3-5%",
        "Failed bookings represent ₹58L+ in stuck revenue — high business urgency",
      ],
      pmRecommendations: [
        "Add a 'failure_reason' column to bookings so support can triage without needing to check logs",
        "Build an auto-retry for 'pending' bookings that time out after 30 minutes",
        "Track: failed booking rate by device type and payment method — weekly, with alerts if >5%",
      ],
      stakeholderQuestion:
        "Payment provider says 'our success rate is 98%.' But your data shows 15% failure. How do you reconcile this discrepancy?",
    },
  },

  // ── 16. BETWEEN ───────────────────────────────────────────────────────────
  {
    id: "f-between",
    company: "InboxAI",
    industry: "Email Marketing",
    emoji: "📧",
    accentBorder: "border-lime-500/30",
    accentText: "text-lime-400",
    accentBg: "bg-lime-500/10",
    accentGlow: "shadow-lime-500/20",
    tagline: "Email Marketing Analytics",
    description: "BETWEEN filters a range of values — dates, numbers, or anything ordered — inclusively.",
    sqlConcept: "BETWEEN",
    kpis: [
      { label: "Total Subscribers", value: "248K", delta: "+14%", up: true },
      { label: "Campaign Signups", value: "8,200", delta: "+40%", up: true },
      { label: "Avg Open Rate", value: "31%", delta: "+4%", up: true },
      { label: "Unsubscribe Rate", value: "0.8%", delta: "-0.1%", up: true },
    ],
    chartData: [
      { label: "Blog", value: 1200 },
      { label: "Social", value: 340 },
      { label: "Referral", value: 680 },
      { label: "Paid", value: 480 },
      { label: "Direct", value: 220 },
    ],
    chartLabel: "Campaign Signups by Source",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["BETWEEN", "DATE ranges", "GROUP BY", "COUNT"],
    challenge: {
      businessProblem:
        "📅 Marketing wants subscribers who signed up during the last campaign window (Jan 1 – Feb 28) — by source — to measure which channel drove the best signups.",
      schema: [
        {
          name: "subscribers",
          cols: [
            { name: "id", type: "INT" },
            { name: "email", type: "VARCHAR" },
            { name: "signup_source", type: "VARCHAR" },
            { name: "subscribed_at", type: "DATE" },
            { name: "is_active", type: "BOOLEAN" },
          ],
          sampleRows: [
            ["1", "a@mail.com", "blog", "2024-01-15", "1"],
            ["2", "b@mail.com", "social", "2024-01-20", "1"],
            ["3", "c@mail.com", "referral", "2024-02-05", "0"],
          ],
        },
      ],
      starterQuery: `SELECT
  signup_source,
  COUNT(*) AS signups
FROM subscribers
WHERE subscribed_at BETWEEN '2024-01-01' AND '2024-02-29'
  AND is_active = TRUE
GROUP BY signup_source
ORDER BY signups DESC;`,
      solution: `SELECT
  signup_source,
  COUNT(*) AS signups
FROM subscribers
WHERE subscribed_at BETWEEN '2024-01-01' AND '2024-02-29'
  AND is_active = TRUE
GROUP BY signup_source
ORDER BY signups DESC;`,
      outputHeaders: ["signup_source", "signups"],
      outputRows: [
        ["blog", "1,200"],
        ["referral", "680"],
        ["paid", "480"],
        ["social", "340"],
        ["direct", "220"],
      ],
      hints: [
        "BETWEEN x AND y is inclusive — it includes both x and y. Equivalent to: col >= x AND col <= y.",
        "For date ranges, always double-check if you want to include the end date. BETWEEN '2024-01-01' AND '2024-02-29' includes Feb 29.",
      ],
      pmQuestion: "Blog signups (1,200) beat Social (340) by 3.5×. What's the PM's next action?",
      pmChoices: [
        { text: "Cut the social budget and invest everything in blog content" },
        { text: "Analyze blog posts that drove signups — double down on those topics and formats" },
        { text: "The campaign is over — move on to next quarter planning" },
        { text: "Increase social spend — 340 signups just means it needs more budget" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Blog performing 3.5× better isn't a signal to cut social — it's a signal to understand WHY. Which blog posts drove most signups? Is it SEO, topic resonance, or CTA placement? Replicating what worked in blog content is higher-leverage than blindly increasing spend elsewhere.",
      insightBreakdown: [
        "BETWEEN is inclusive on both ends — '2024-01-01' AND '2024-02-29' includes both dates",
        "Blog at 41% of signups despite being 'organic' — high ROI channel worth investing in",
        "Paid ads at 16% — if CPA is high, this channel may be underperforming vs cost",
      ],
      pmRecommendations: [
        "Break down blog signups by post URL — find the top-3 posts driving signups and create similar content",
        "Add UTM tracking to all blog CTAs so you can attribute at post level, not just channel",
        "Calculate cost-per-signup for Paid vs Organic — budget based on blended CPA target",
      ],
      stakeholderQuestion:
        "CMO says 'let's measure the campaign one more week.' How do you explain why extending BETWEEN's end date could skew the results?",
    },
  },

  // ── 17. IS NULL ───────────────────────────────────────────────────────────
  {
    id: "f-is-null",
    company: "SalesPulse",
    industry: "CRM / Sales",
    emoji: "📞",
    accentBorder: "border-red-500/30",
    accentText: "text-red-400",
    accentBg: "bg-red-500/10",
    accentGlow: "shadow-red-500/20",
    tagline: "CRM Data Quality",
    description: "IS NULL finds missing data — critical for data quality audits, CRM hygiene, and alerts.",
    sqlConcept: "IS NULL / IS NOT NULL",
    kpis: [
      { label: "Total Leads", value: "14,200", delta: "+800", up: true },
      { label: "Missing Phone #", value: "1,800", delta: "+240", up: false },
      { label: "Contacted Rate", value: "62%", delta: "-4%", up: false },
      { label: "Conversion Rate", value: "8.4%", delta: "+0.6%", up: true },
    ],
    chartData: [
      { label: "Complete", value: 87 },
      { label: "No Phone", value: 13 },
    ],
    chartLabel: "Lead Data Completeness (%)",
    chartType: "bar",
    estimatedMinutes: 5,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["IS NULL", "IS NOT NULL", "WHERE", "ORDER BY"],
    challenge: {
      businessProblem:
        "📋 Sales ops wants all leads that have NO phone number — these can't be called and need data enrichment before the next outreach cycle.",
      schema: [
        {
          name: "leads",
          cols: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "email", type: "VARCHAR" },
            { name: "phone", type: "VARCHAR" },
            { name: "assigned_to", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1", "Riya Sharma", "riya@co.in", "NULL", "Arjun", "new", "2024-08-10"],
            ["2", "Ankit Patel", "ankit@co.in", "9876543210", "Priya", "contacted", "2024-08-11"],
            ["3", "Neha Joshi", "neha@co.in", "NULL", "NULL", "new", "2024-08-12"],
          ],
        },
      ],
      starterQuery: `SELECT id, name, email, status, created_at
FROM leads
WHERE phone IS NULL
  AND status != 'converted'
ORDER BY created_at DESC;`,
      solution: `SELECT id, name, email, status, created_at
FROM leads
WHERE phone IS NULL
  AND status != 'converted'
ORDER BY created_at DESC;`,
      outputHeaders: ["id", "name", "email", "status", "created_at"],
      outputRows: [
        ["14108", "Vikram Nair", "vikram@startup.in", "new", "2024-08-15"],
        ["14041", "Priya Sen", "priya@corp.in", "new", "2024-08-14"],
        ["13892", "Rohan Das", "rohan@biz.in", "contacted", "2024-08-13"],
        ["13801", "Meena Joshi", "meena@firm.in", "new", "2024-08-13"],
        ["13640", "Arun Kumar", "arun@tech.in", "new", "2024-08-12"],
      ],
      hints: [
        "IS NULL checks for missing values. You CANNOT use = NULL — it always returns false. Only IS NULL works.",
        "IS NOT NULL is the opposite — finds rows where the column has a value.",
      ],
      pmQuestion: "1,800 leads have no phone number. How do you decide which to prioritize for data enrichment?",
      pmChoices: [
        { text: "Enrich all 1,800 — data completeness is a universal goal" },
        { text: "Prioritize leads that also have a company email domain — easier to find phone via LinkedIn/company site" },
        { text: "Drop these leads — without a phone they're lower quality" },
        { text: "Prioritize the most recently created leads — they're freshest and more likely to convert" },
      ],
      correctPMIndex: 3,
      pmExplanation:
        "Recency matters in sales — a lead from today has higher intent than one from 6 months ago. Prioritizing recent leads for enrichment maximizes conversion potential per enrichment effort. Additionally, recent leads are more likely to still remember the trigger (ad, event, etc.) that brought them in.",
      insightBreakdown: [
        "IS NULL is the only correct way to check for missing values in SQL — = NULL never matches",
        "1,800 / 14,200 = 12.7% of leads uncallable — a significant data quality gap",
        "Contacted rate dropped 4% — uncallable leads may be a direct contributor",
      ],
      pmRecommendations: [
        "Add phone number as a required field in the lead capture form — prevent NULL at source",
        "Integrate a data enrichment service (e.g., Clearbit) to auto-fill missing phones from email",
        "Track: 'leads with complete contact info' as a CRM data quality KPI — alert if it drops below 90%",
      ],
      stakeholderQuestion:
        "Sales head says 'just delete leads with no phone.' How do you protect potentially high-value leads from being lost?",
    },
  },

  // ── 18. CASE WHEN ─────────────────────────────────────────────────────────
  {
    id: "f-case-when",
    company: "FlashDeliver",
    industry: "Last-Mile Delivery",
    emoji: "⚡",
    accentBorder: "border-yellow-500/30",
    accentText: "text-yellow-400",
    accentBg: "bg-yellow-500/10",
    accentGlow: "shadow-yellow-500/20",
    tagline: "Delivery Speed Categorization",
    description: "CASE WHEN creates conditional labels inside SQL — like an IF/ELSE within your query.",
    sqlConcept: "CASE WHEN",
    kpis: [
      { label: "Deliveries Today", value: "128K", delta: "+8%", up: true },
      { label: "Fast (<20 min)", value: "38%", delta: "+5%", up: true },
      { label: "Slow (>35 min)", value: "29%", delta: "+8%", up: false },
      { label: "Avg Delivery Time", value: "26 min", delta: "+3 min", up: false },
    ],
    chartData: [
      { label: "Mumbai", value: 12 },
      { label: "Delhi", value: 45 },
      { label: "Bangalore", value: 28 },
      { label: "Chennai", value: 18 },
      { label: "Hyderabad", value: 22 },
    ],
    chartLabel: "% Slow Deliveries by City",
    chartType: "bar",
    estimatedMinutes: 7,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["CASE WHEN", "TIMESTAMPDIFF", "GROUP BY", "COUNT"],
    challenge: {
      businessProblem:
        "🚚 Ops team wants to categorize every delivery as 'Fast' (<20 min), 'On Time' (20–35 min), or 'Slow' (>35 min) — then count deliveries per city per category.",
      schema: [
        {
          name: "deliveries",
          cols: [
            { name: "id", type: "INT" },
            { name: "order_id", type: "INT" },
            { name: "city", type: "VARCHAR" },
            { name: "pickup_time", type: "TIMESTAMP" },
            { name: "dropoff_time", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["1", "O101", "Mumbai", "2024-08-15 12:00", "2024-08-15 12:18"],
            ["2", "O102", "Delhi", "2024-08-15 12:05", "2024-08-15 12:52"],
            ["3", "O103", "Bangalore", "2024-08-15 12:10", "2024-08-15 12:38"],
          ],
        },
      ],
      starterQuery: `SELECT
  city,
  CASE
    WHEN TIMESTAMPDIFF(MINUTE, pickup_time, dropoff_time) < 20 THEN 'Fast'
    WHEN TIMESTAMPDIFF(MINUTE, pickup_time, dropoff_time) BETWEEN 20 AND 35 THEN 'On Time'
    ELSE 'Slow'
  END AS speed_category,
  COUNT(*) AS deliveries
FROM deliveries
GROUP BY city, speed_category
ORDER BY city, deliveries DESC;`,
      solution: `SELECT
  city,
  CASE
    WHEN TIMESTAMPDIFF(MINUTE, pickup_time, dropoff_time) < 20 THEN 'Fast'
    WHEN TIMESTAMPDIFF(MINUTE, pickup_time, dropoff_time) BETWEEN 20 AND 35 THEN 'On Time'
    ELSE 'Slow'
  END AS speed_category,
  COUNT(*) AS deliveries
FROM deliveries
GROUP BY city, speed_category
ORDER BY city, deliveries DESC;`,
      outputHeaders: ["city", "speed_category", "deliveries"],
      outputRows: [
        ["Bangalore", "On Time", "32,410"],
        ["Bangalore", "Fast", "18,200"],
        ["Bangalore", "Slow", "9,100"],
        ["Delhi", "Slow", "28,840"],
        ["Delhi", "On Time", "18,100"],
        ["Delhi", "Fast", "6,200"],
      ],
      hints: [
        "CASE WHEN condition THEN result WHEN condition THEN result ELSE fallback END — evaluated top to bottom, first match wins.",
        "You can GROUP BY the CASE expression alias (speed_category) or repeat the full CASE expression in GROUP BY.",
      ],
      pmQuestion: "Delhi shows 45% 'Slow' deliveries vs 15% for Bangalore. How do you frame this to your ops team?",
      pmChoices: [
        { text: "Delhi ops team is underperforming — escalate to management" },
        { text: "Check structural factors first: traffic density, average distance, order density in Delhi vs Bangalore" },
        { text: "Set Delhi's SLA to 45 min to match the reality on the ground" },
        { text: "Reduce orders accepted in Delhi during peak hours to protect the metrics" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Comparing raw % across cities ignores structural differences. Delhi has higher traffic density, longer inter-area distances, and potentially fewer delivery partners per km² than Bangalore. Diagnose the cause before assigning blame — then identify which structural factors are fixable.",
      insightBreakdown: [
        "CASE WHEN is SQL's way to create derived categories — avoids cluttering your data model with new columns",
        "Delhi 45% slow vs Bangalore 15% is a 3× gap — likely structural, not performance-based",
        "Grouping by CASE result lets you pivot the data into category distribution without a separate table",
      ],
      pmRecommendations: [
        "Add average distance per delivery to this query — high distance = expected slow, not an ops failure",
        "Set city-specific SLA targets (not one global threshold) based on structural benchmarks",
        "Track: % of 'Slow' deliveries week-over-week per city — trend matters more than absolute %",
      ],
      stakeholderQuestion:
        "CEO says 'every delivery should be Fast — that's our brand promise.' How do you set realistic, data-backed SLAs?",
    },
  },

  // ── 19. INNER JOIN ────────────────────────────────────────────────────────
  {
    id: "f-inner-join",
    company: "ShopNow",
    industry: "E-Commerce",
    emoji: "🔗",
    accentBorder: "border-blue-500/30",
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentGlow: "shadow-blue-500/20",
    tagline: "Order + Product Join",
    description: "INNER JOIN combines rows from two tables where a matching key exists — the most common JOIN.",
    sqlConcept: "INNER JOIN",
    kpis: [
      { label: "Orders This Week", value: "42K", delta: "+11%", up: true },
      { label: "Unique Products Sold", value: "8,400", delta: "+600", up: true },
      { label: "Avg Items/Order", value: "2.3", delta: "+0.2", up: true },
      { label: "Return Rate", value: "4.8%", delta: "+0.6%", up: false },
    ],
    chartData: [
      { label: "Electronics", value: 38 },
      { label: "Fashion", value: 26 },
      { label: "Home", value: 18 },
      { label: "Sports", value: 10 },
      { label: "Books", value: 8 },
    ],
    chartLabel: "Revenue Share by Category (%)",
    chartType: "bar",
    estimatedMinutes: 8,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Beginner",
    skills: ["INNER JOIN", "ON clause", "Aliases", "ORDER BY"],
    challenge: {
      businessProblem:
        "🔍 Analytics team needs product names alongside this week's orders — but the orders table only stores product_id. Use a JOIN to bring in product details.",
      schema: [
        {
          name: "orders",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "product_id", type: "INT" },
            { name: "quantity", type: "INT" },
            { name: "total_price", type: "DECIMAL" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["5001", "U101", "P201", "1", "8999.00", "2024-08-10 09:00"],
            ["5002", "U102", "P204", "2", "2998.00", "2024-08-10 09:30"],
            ["5003", "U103", "P201", "1", "8999.00", "2024-08-10 10:00"],
          ],
        },
        {
          name: "products",
          cols: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "category", type: "VARCHAR" },
            { name: "price", type: "DECIMAL" },
          ],
          sampleRows: [
            ["P201", "Pixel 8 Pro", "Electronics", "8999.00"],
            ["P204", "Running Shoes", "Sports", "1499.00"],
            ["P210", "Desk Lamp", "Home", "599.00"],
          ],
        },
      ],
      starterQuery: `SELECT
  o.id AS order_id,
  p.name AS product,
  p.category,
  o.quantity,
  o.total_price
FROM orders o
INNER JOIN products p ON o.product_id = p.id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY o.total_price DESC;`,
      solution: `SELECT
  o.id AS order_id,
  p.name AS product,
  p.category,
  o.quantity,
  o.total_price
FROM orders o
INNER JOIN products p ON o.product_id = p.id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY o.total_price DESC;`,
      outputHeaders: ["order_id", "product", "category", "quantity", "total_price"],
      outputRows: [
        ["5841", "MacBook Air M3", "Electronics", "1", "₹1,14,900"],
        ["5792", "iPhone 15 Pro", "Electronics", "1", "₹89,900"],
        ["5810", "Sony WH-1000XM5", "Electronics", "1", "₹28,990"],
        ["5724", "Pixel 8 Pro", "Electronics", "1", "₹8,999"],
        ["5689", "Running Shoes X", "Sports", "2", "₹5,998"],
      ],
      hints: [
        "INNER JOIN returns only rows that have a match in BOTH tables. If a product_id in orders doesn't exist in products, that order row is excluded.",
        "Use table aliases (o for orders, p for products) to keep column references short and readable.",
      ],
      pmQuestion: "Top 5 selling products are all Electronics. Should you use this to inform the homepage banner?",
      pmChoices: [
        { text: "Yes — show Electronics prominently since it drives the most revenue" },
        { text: "Check Electronics' margin first — high revenue with low margin may not deserve homepage real estate" },
        { text: "Rotate all categories equally on the homepage to avoid bias" },
        { text: "Feature the newest products, not the best-selling ones" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "Revenue is a top-line metric, not profitability. Electronics often has lower margins than Fashion or Home. Homepage real estate should be allocated based on contribution margin × conversion rate, not raw revenue. Always check margin before making placement decisions.",
      insightBreakdown: [
        "INNER JOIN only returns rows with a match in both tables — orders with orphan product_ids are excluded",
        "Electronics dominates revenue but category concentration is a risk — check margin mix",
        "ORDER BY total_price DESC shows the highest-value orders first — actionable for the merchandising team",
      ],
      pmRecommendations: [
        "Add a 'margin' column to products — then query revenue AND gross profit per category",
        "A/B test: Electronics banner vs personalized category banner — measure CVR, not just clicks",
        "Track: top-5 selling products week-over-week — flag if the same products dominate for >4 weeks (stale catalog?)",
      ],
      stakeholderQuestion:
        "Merchandising says 'Electronics always wins on revenue.' How do you make the case for showing other categories on the homepage?",
    },
  },

  // ── 20. LEFT JOIN ─────────────────────────────────────────────────────────
  {
    id: "f-left-join",
    company: "SocialHub",
    industry: "Social Media",
    emoji: "👥",
    accentBorder: "border-fuchsia-500/30",
    accentText: "text-fuchsia-400",
    accentBg: "bg-fuchsia-500/10",
    accentGlow: "shadow-fuchsia-500/20",
    tagline: "User Activity Gap Analysis",
    description: "LEFT JOIN keeps all rows from the left table even when there's no match — perfect for finding missing relationships.",
    sqlConcept: "LEFT JOIN",
    kpis: [
      { label: "Total Registered Users", value: "2.8M", delta: "+180K", up: true },
      { label: "Never Posted", value: "820K", delta: "+60K", up: false },
      { label: "DAU", value: "940K", delta: "+4%", up: true },
      { label: "Avg Posts/User/Month", value: "4.2", delta: "+0.4", up: true },
    ],
    chartData: [
      { label: "Daily", value: 12 },
      { label: "Weekly", value: 24 },
      { label: "Monthly", value: 35 },
      { label: "Rarely", value: 18 },
      { label: "Never", value: 11 },
    ],
    chartLabel: "User Posting Frequency (%)",
    chartType: "bar",
    estimatedMinutes: 8,
    sqlDifficulty: "Beginner",
    pmDifficulty: "Intermediate",
    skills: ["LEFT JOIN", "IS NULL", "WHERE", "ORDER BY"],
    challenge: {
      businessProblem:
        "🔍 Trust & Safety wants to find users who have NEVER posted — they could be bots, lurkers, or churned users who never activated. LEFT JOIN is the key technique.",
      schema: [
        {
          name: "users",
          cols: [
            { name: "id", type: "INT" },
            { name: "username", type: "VARCHAR" },
            { name: "email", type: "VARCHAR" },
            { name: "signup_date", type: "DATE" },
            { name: "country", type: "VARCHAR" },
          ],
          sampleRows: [
            ["1001", "riya_m", "riya@mail.com", "2024-01-15", "IN"],
            ["1002", "dev_ankit", "ankit@mail.com", "2024-02-20", "IN"],
            ["1003", "ghost_user", "ghost@mail.com", "2024-03-01", "US"],
          ],
        },
        {
          name: "posts",
          cols: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "content", type: "TEXT" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
          sampleRows: [
            ["P001", "1001", "Just finished a run!", "2024-08-10 07:30"],
            ["P002", "1001", "Amazing sunset today", "2024-08-12 18:45"],
            ["P003", "1002", "Anyone tried this recipe?", "2024-08-13 12:00"],
          ],
        },
      ],
      starterQuery: `SELECT
  u.id,
  u.username,
  u.signup_date,
  u.country
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE p.id IS NULL
ORDER BY u.signup_date DESC;`,
      solution: `SELECT
  u.id,
  u.username,
  u.signup_date,
  u.country
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE p.id IS NULL
ORDER BY u.signup_date DESC;`,
      outputHeaders: ["id", "username", "signup_date", "country"],
      outputRows: [
        ["2801042", "silent_leo", "2024-08-14", "IN"],
        ["2800891", "new_user_42", "2024-08-13", "US"],
        ["2799104", "ghost_acc_9", "2024-08-12", "BD"],
        ["2798241", "lurker_2024", "2024-08-11", "IN"],
        ["2797810", "anon_viewer", "2024-08-10", "PK"],
      ],
      hints: [
        "LEFT JOIN keeps ALL users even if they have no matching posts. For INNER JOIN, users with no posts would be excluded.",
        "After LEFT JOIN, rows with no post match have NULL in all post columns. Use WHERE p.id IS NULL to filter ONLY non-posters.",
      ],
      pmQuestion: "820K users have never posted. Before flagging as bots, what's your first check?",
      pmChoices: [
        { text: "Flag all 820K for bot review immediately — zero posts = suspicious" },
        { text: "Check signup age — recent signups (< 7 days) are normal lurkers; old accounts with no posts are the real concern" },
        { text: "Send all 820K a 'post your first update' notification" },
        { text: "Delete accounts with no posts to keep the platform clean" },
      ],
      correctPMIndex: 1,
      pmExplanation:
        "A user who signed up yesterday and hasn't posted is normal. A user who signed up 6 months ago and never posted is anomalous — either a bot, lurker with no intent, or a badly activated user. Segmenting by account age before flagging avoids false positives and preserves legitimate new users.",
      insightBreakdown: [
        "LEFT JOIN is the standard technique for 'find X with no Y' queries — always pair with WHERE right_table.id IS NULL",
        "INNER JOIN would have excluded all non-posters — you'd never see the gap",
        "29% of users (820K) never posted — a significant activation problem for a social platform",
      ],
      pmRecommendations: [
        "Segment non-posters by account age: <7d (normal), 7-30d (at-risk), >30d (likely inactive/bot)",
        "Build a 'first post' activation funnel: signup → profile complete → first post — find the drop-off",
        "Track: '% of new users who post within 7 days of signup' as your activation North Star metric",
      ],
      stakeholderQuestion:
        "Safety team wants to auto-ban all accounts with 0 posts and >30 days old. What false-positive rate should you estimate before agreeing?",
    },
  },
];
