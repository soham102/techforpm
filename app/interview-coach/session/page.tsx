"use client";

import { useState, useRef, useEffect } from "react";

/* ── Types ── */
type Sender = "ai" | "user";
interface Message {
  id: number;
  sender: Sender;
  text: string;
  ts: string;
}

interface ScoreMetric {
  label: string;
  score: number;
  max: number;
  color: string;
  tip: string;
}

/* ── Static seed data ── */
const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Welcome! I'm your AI interview coach for today. Let's run a product sense round.\n\nHere's your question:",
    ts: "0:00",
  },
  {
    id: 2,
    sender: "ai",
    text: "Design a feature for Uber that helps college students commute more affordably.",
    ts: "0:05",
  },
];

const INITIAL_SCORES: ScoreMetric[] = [
  {
    label: "Product Sense",
    score: 0,
    max: 10,
    color: "violet",
    tip: "Clarity of user understanding & problem framing",
  },
  {
    label: "Communication",
    score: 0,
    max: 10,
    color: "indigo",
    tip: "Structure, conciseness, and articulation",
  },
  {
    label: "Structure",
    score: 0,
    max: 10,
    color: "purple",
    tip: "Use of frameworks and logical flow",
  },
];

const AI_FOLLOWUPS = [
  "Good start! Can you walk me through how you'd prioritise this feature against other Uber initiatives?",
  "Interesting. How would you define success metrics for this feature? What's your north star?",
  "Let's pressure test this — what are the biggest risks to launching this, and how would you mitigate them?",
];

const FEEDBACK_AFTER: Record<number, Partial<Record<string, number>>> = {
  1: { "Product Sense": 5, Communication: 4, Structure: 5 },
  2: { "Product Sense": 7, Communication: 6, Structure: 7 },
  3: { "Product Sense": 8, Communication: 8, Structure: 9 },
};

function now(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ════════════════════════════════════════ */
export default function SessionPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [scores, setScores] = useState<ScoreMetric[]>(INITIAL_SCORES);
  const [userTurn, setUserTurn] = useState(0); // how many user msgs sent
  const [aiTyping, setAiTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Timer */
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || aiTyping) return;

    const newId = messages.length + 1;
    const turnIdx = userTurn + 1;

    setMessages((m) => [
      ...m,
      { id: newId, sender: "user", text, ts: now(elapsed) },
    ]);
    setInput("");
    setUserTurn(turnIdx);
    setAiTyping(true);

    /* Simulate AI response delay */
    setTimeout(() => {
      const followup = AI_FOLLOWUPS[Math.min(turnIdx - 1, AI_FOLLOWUPS.length - 1)];
      setMessages((m) => [
        ...m,
        {
          id: m.length + 1,
          sender: "ai",
          text: followup,
          ts: now(elapsed + 8),
        },
      ]);
      setAiTyping(false);

      /* Update scores */
      const updates = FEEDBACK_AFTER[Math.min(turnIdx, 3)];
      if (updates) {
        setScores((prev) =>
          prev.map((s) =>
            updates[s.label] !== undefined
              ? { ...s, score: updates[s.label]! }
              : s
          )
        );
      }
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/8 bg-[#0a0a0f]/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/20">
            <span className="text-xs font-bold text-violet-400">PM</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">PMVerse AI Interview</h1>
            <p className="text-[10px] text-zinc-500 mt-0.5">Product Sense Round</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-600/10 px-3 py-1 text-xs font-medium text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Product Manager
          </span>

          {/* Timer */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
            <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            {now(elapsed)}
          </div>

          {/* Sidebar toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white xl:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Exit */}
          <a
            href="/interview-coach"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Exit
          </a>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── CHAT COLUMN ── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}

            {aiTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/8 bg-[#0a0a0f]/60 px-4 py-4 backdrop-blur-sm sm:px-8">
            <div className="relative flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition focus-within:border-violet-500/40 focus-within:bg-white/5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer… (Shift+Enter for new line)"
                rows={3}
                className="flex-1 resize-none bg-transparent text-sm text-white placeholder-zinc-600 outline-none leading-relaxed"
              />
              <div className="flex flex-col gap-2 pb-0.5">
                {/* Voice btn */}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-600/10 hover:text-violet-400"
                  title="Voice input (coming soon)"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
                {/* Send btn */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || aiTyping}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/30 transition-all hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-700">
              Responses are AI-generated for practice purposes · PMVerse
            </p>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside
          className={`absolute inset-y-0 right-0 z-30 flex w-72 flex-col gap-4 border-l border-white/8 bg-[#0a0a0f]/90 px-4 py-6 backdrop-blur-md transition-transform duration-300 xl:relative xl:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Live Feedback</h2>
              <p className="text-[10px] text-zinc-600 mt-0.5">Updates after each answer</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 xl:hidden"
            >
              ✕
            </button>
          </div>

          {/* Score cards */}
          <div className="flex flex-col gap-3">
            {scores.map((s) => (
              <ScoreCard key={s.label} metric={s} />
            ))}
          </div>

          {/* Session info */}
          <div className="mt-2 rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-3">Session Info</p>
            <div className="flex flex-col gap-2">
              <InfoRow icon="◈" label="Round" value="Product Sense" />
              <InfoRow icon="◉" label="Difficulty" value="Senior PM" />
              <InfoRow icon="◎" label="Q&A" value={`${userTurn} / 3 answered`} />
              <InfoRow icon="⏱" label="Time" value={now(elapsed)} />
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-violet-500/15 bg-violet-600/8 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500 mb-2">Coach Tip</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {userTurn === 0
                ? "Start by clarifying goals and users before jumping to solutions."
                : userTurn === 1
                ? "Quantify your impact — attach numbers to your success metrics."
                : "Great depth! Make sure to address trade-offs explicitly."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function ChatBubble({ msg }: { msg: Message }) {
  const isAI = msg.sender === "ai";
  return (
    <div className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}>
      {isAI && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/20 text-[10px] font-bold text-violet-400">
          AI
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
          isAI
            ? "rounded-tl-sm bg-white/[0.04] border border-white/8 text-zinc-200"
            : "rounded-tr-sm bg-violet-600/20 border border-violet-500/20 text-violet-100"
        }`}
      >
        {msg.text}
        <p className="mt-1.5 text-[10px] text-zinc-600">{msg.ts}</p>
      </div>
      {!isAI && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-white/10 text-[10px] font-bold text-zinc-400">
          You
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/20 text-[10px] font-bold text-violet-400">
        AI
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/8 bg-white/[0.04] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-zinc-500"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function ScoreCard({ metric }: { metric: ScoreMetric }) {
  const pct = (metric.score / metric.max) * 100;
  const colorMap: Record<string, string> = {
    violet: "bg-violet-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
  };
  const textMap: Record<string, string> = {
    violet: "text-violet-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
  };
  const borderMap: Record<string, string> = {
    violet: "border-violet-500/20",
    indigo: "border-indigo-500/20",
    purple: "border-purple-500/20",
  };

  return (
    <div className={`rounded-xl border ${borderMap[metric.color]} bg-white/[0.02] p-3.5`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-zinc-300">{metric.label}</p>
        <span className={`text-sm font-bold tabular-nums ${textMap[metric.color]}`}>
          {metric.score}
          <span className="text-[10px] text-zinc-600">/{metric.max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorMap[metric.color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-zinc-600">{metric.tip}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-zinc-600">{icon}</span>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <span className="text-xs font-medium text-zinc-300">{value}</span>
    </div>
  );
}
