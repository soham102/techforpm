export default function InterviewCoachPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">
      {/* Background gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Claude AI
        </span>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            PMVerse AI
          </span>
          <br />
          <span className="bg-gradient-to-br from-violet-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Interview Coach
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed">
          Practice PM interviews with AI-powered feedback. Get instant,
          structured critiques on your answers — from product sense to execution
          frameworks.
        </p>

        {/* CTA */}
        <a
          href="/interview-coach/session"
          className="group relative inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          Get Started
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {[
            "Product Sense",
            "Execution & Metrics",
            "Behavioral",
            "Estimation",
            "Strategy",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/4 px-3.5 py-1 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom divider hint */}
      <div className="relative z-10 mt-24 flex flex-col items-center gap-2 text-zinc-700">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <p className="text-xs tracking-widest uppercase">PMVerse</p>
      </div>
    </main>
  );
}
