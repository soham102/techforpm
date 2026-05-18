import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AnimatedFlow, type FlowNode } from "@/components/animated-flow";
import { InfoCard } from "@/components/ui/info-card";
import { Quiz } from "@/components/quiz";
import { ModuleSidebar, type ModuleStep } from "@/components/module-sidebar";
import { AuthConceptMap } from "@/components/auth/auth-concept-map";
import { LoginPlayground } from "@/components/auth/login-playground";
import { TokenSessionViz } from "@/components/auth/token-session-viz";
import { AuthMethods } from "@/components/auth/auth-methods";
import { SecurityConcepts } from "@/components/auth/security-concepts";
import { AUTH_INSIGHTS, AUTH_QUIZ } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Authentication for Product Managers — PMverse",
  description:
    "Understand authentication visually: an airport-security analogy, how QuickBite logs users in, an interactive login simulator, tokens & sessions, auth methods, and why it matters for product.",
};

const steps: ModuleStep[] = [
  { id: "analogy", label: "Real-World Analogy" },
  { id: "product", label: "How QuickBite Logs You In" },
  { id: "playground", label: "Login Playground" },
  { id: "tokens", label: "Tokens & Sessions" },
  { id: "methods", label: "Auth Methods" },
  { id: "security", label: "Security, Simplified" },
  { id: "why", label: "Why PMs Should Care" },
  { id: "quiz", label: "Scenario Quiz" },
];

const airportFlow: FlowNode[] = [
  { id: "p", label: "Passenger", icon: "user" },
  { id: "pp", label: "Shows Passport", icon: "passport" },
  { id: "sec", label: "Security Verifies", icon: "shield", accent: "brand" },
  { id: "gate", label: "Access Granted", icon: "lockOpen" },
];

const authArch: FlowNode[] = [
  {
    id: "fe",
    label: "Frontend App",
    icon: "phone",
    detail: {
      title: "The QuickBite app",
      body: "Rahul types his email and password into the login screen. The app never decides if he's allowed in — it just forwards the credentials.",
    },
  },
  {
    id: "api",
    label: "Authentication API",
    icon: "shield",
    accent: "brand",
    detail: {
      title: "The authentication server",
      body: "The gatekeeper. It receives the credentials and is the only thing allowed to decide whether this person is who they claim to be.",
    },
  },
  {
    id: "db",
    label: "User Database",
    icon: "database",
    detail: {
      title: "The user database",
      body: "Stores every account and its encrypted password. The auth server checks the typed password against this — without ever reading the real stored one.",
    },
  },
  {
    id: "tok",
    label: "Token Generated",
    icon: "key",
    detail: {
      title: "Token generation",
      body: "Identity confirmed. A signed token is created that proves “this is Rahul” for a limited time, so he doesn't re-enter his password constantly.",
    },
  },
  {
    id: "ok",
    label: "Access Granted",
    icon: "lockOpen",
    detail: {
      title: "Logged in",
      body: "The app stores the token and unlocks protected screens — order history, addresses, payments. Rahul is now logged in.",
    },
  },
];

export default function AuthenticationPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28">
      <div className="flex gap-12 pt-10">
        <ModuleSidebar steps={steps} />

        <div className="min-w-0 flex-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            All concepts
          </Link>

          <header className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Module 03 · Intermediate · 14 min
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Authentication for Product Managers
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              How does QuickBite know it's really Rahul — and keep remembering
              him without asking for his password every tap? Let's see how
              login actually works, visually.
            </p>
          </header>

          <Section
            id="analogy"
            eyebrow="Section 1"
            title="Authentication is Like Security at an Airport"
            description="You can't board a flight just by claiming who you are. You show proof, an officer verifies it, and you get a pass that lets you through. Apps do exactly the same thing."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={airportFlow} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Show proof → get verified → receive a pass → walk through the
                gate. Swap the airport for an app and you already understand
                authentication.
              </p>
            </div>
            <div className="mt-6">
              <AuthConceptMap />
            </div>
          </Section>

          <Section
            id="product"
            eyebrow="Section 2"
            title="How QuickBite Logs You In"
            description="When Rahul enters his email and password, here's the journey those credentials take. Tap each stage to see what really happens."
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
              <AnimatedFlow nodes={authArch} />
              <p className="mt-7 text-sm leading-relaxed text-muted">
                The app only collects credentials — a separate auth server
                decides access, the database confirms identity, and a token is
                what keeps Rahul logged in afterwards.
              </p>
            </div>
          </Section>

          <Section
            id="playground"
            eyebrow="Section 3"
            title="Interactive Login Playground"
            description="Pick a scenario, press Log in, and watch the request travel through verification, token creation and session — including what failure actually looks like."
          >
            <LoginPlayground />
          </Section>

          <Section
            id="tokens"
            eyebrow="Section 4"
            title="Tokens & Sessions — the part everyone confuses"
            description="This is where most people get lost. A session is the app remembering you; a token is the proof it holds. Here's the difference, visually."
          >
            <TokenSessionViz />
          </Section>

          <Section
            id="methods"
            eyebrow="Section 5"
            title="Authentication Methods"
            description="There's no single “best” login — each option trades convenience, security and user friction differently. That trade-off is a product decision."
          >
            <AuthMethods />
          </Section>

          <Section
            id="security"
            eyebrow="Section 6"
            title="Security Concepts, Simplified"
            description="Two ideas worth understanding — without the cryptography. How passwords are protected, and why some logins ask for a second step."
          >
            <SecurityConcepts />
          </Section>

          <Section
            id="why"
            eyebrow="Section 7"
            title="Why this matters for product managers"
            description="Authentication is the very first experience every user has — and one of the biggest levers on conversion, trust and retention."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AUTH_INSIGHTS.map((card, i) => (
                <InfoCard key={card.title} data={card} index={i} />
              ))}
            </div>
          </Section>

          <Section
            id="quiz"
            eyebrow="Section 8"
            title="Test your instinct"
            description="A real complaint from QuickBite users. What would a strong PM suspect first?"
          >
            <Quiz
              scenario={AUTH_QUIZ.scenario}
              question={AUTH_QUIZ.question}
              options={AUTH_QUIZ.options}
            />
          </Section>

          <div className="mt-10 rounded-2xl border border-border bg-brand-soft p-8 text-center">
            <h3 className="text-lg font-semibold">Module complete</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              You can now explain how apps verify users, what tokens and
              sessions really are, and how auth decisions shape conversion and
              trust.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Back to all concepts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
