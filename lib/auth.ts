import type { IconName } from "./icons";

export const APP_NAME = "QuickBite";

/* ---------- Section 1: airport analogy ---------- */

export interface AuthAnalogyPair {
  real: string;
  app: string;
  icon: IconName;
  plain: string;
}

export const AUTH_ANALOGY: AuthAnalogyPair[] = [
  {
    real: "Passport",
    app: "Username & password",
    icon: "passport",
    plain:
      "What you present to prove who you are. Anyone can claim to be you — the passport is the proof.",
  },
  {
    real: "Security officer",
    app: "Authentication server",
    icon: "shield",
    plain:
      "Checks your proof against records. If it doesn't match, you don't get through.",
  },
  {
    real: "Boarding pass",
    app: "Session token",
    icon: "badge",
    plain:
      "Once verified, you get a pass. You don't re-show your passport at every step — you flash the pass.",
  },
  {
    real: "Gate access",
    app: "App access",
    icon: "lockOpen",
    plain:
      "The pass unlocks the gate. In an app, it unlocks your orders, addresses and payments.",
  },
];

/* ---------- Section 2: login architecture ---------- */

export const CREDENTIALS = {
  email: "rahul@quickbite.com",
  password: "quickbite123",
};

/* ---------- Section 3: login pipeline steps ---------- */

export interface PipelineStep {
  key: string;
  label: string;
  icon: IconName;
  detail: string;
}

export const LOGIN_PIPELINE: PipelineStep[] = [
  {
    key: "request",
    label: "Request sent",
    icon: "phone",
    detail: "The app packages the email + password and sends it securely.",
  },
  {
    key: "verify",
    label: "Database check",
    icon: "database",
    detail: "The auth server looks up the user and checks the password.",
  },
  {
    key: "token",
    label: "Token generated",
    icon: "key",
    detail: "Identity confirmed — a signed token is created for this user.",
  },
  {
    key: "session",
    label: "Session created",
    icon: "badge",
    detail: "The app stores the token so it remembers the user.",
  },
  {
    key: "granted",
    label: "Access granted",
    icon: "lockOpen",
    detail: "Protected screens unlock. The user is logged in.",
  },
];

export type LoginOutcome =
  | "success"
  | "wrong-password"
  | "expired"
  | "server-error";

export const OUTCOME_RESPONSE: Record<LoginOutcome, object> = {
  success: {
    status: 200,
    message: "Login successful",
    token: "qb_jwt_token_92x...",
  },
  "wrong-password": {
    status: 401,
    error: "Unauthorized",
    message: "Email or password is incorrect",
  },
  expired: {
    status: 401,
    error: "Session expired",
    message: "Please log in again",
  },
  "server-error": {
    status: 500,
    error: "Internal Server Error",
    message: "Auth service is temporarily unavailable",
  },
};

/* ---------- Section 4: protected routes ---------- */

export interface ProtectedRoute {
  label: string;
  icon: IconName;
}

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  { label: "Order History", icon: "receipt" },
  { label: "Saved Addresses", icon: "mapPin" },
  { label: "Payment Methods", icon: "tag" },
];

/* ---------- Section 5: auth methods ---------- */

export interface AuthMethod {
  name: string;
  icon: IconName;
  convenience: number; // 1-5
  security: number; // 1-5
  friction: number; // 1-5 (higher = more friction)
  insight: string;
}

export const AUTH_METHODS: AuthMethod[] = [
  {
    name: "Password Login",
    icon: "key",
    convenience: 3,
    security: 3,
    friction: 4,
    insight:
      "Familiar to everyone, but forgotten passwords are a top reason users drop off at login.",
  },
  {
    name: "OTP Login",
    icon: "mail",
    convenience: 4,
    security: 4,
    friction: 3,
    insight:
      "No password to remember — OTP login reduces password friction and recovers lost users.",
  },
  {
    name: "Google Login",
    icon: "chrome",
    convenience: 5,
    security: 4,
    friction: 1,
    insight:
      "One tap, no form — social login measurably improves signup conversion.",
  },
  {
    name: "Biometric Login",
    icon: "fingerprint",
    convenience: 5,
    security: 5,
    friction: 1,
    insight:
      "Fastest and most secure on supported devices, but needs a fallback for everyone else.",
  },
];

/* ---------- Section 7: PM insights ---------- */

export interface AuthInsight {
  icon: IconName;
  title: string;
  body: string;
}

export const AUTH_INSIGHTS: AuthInsight[] = [
  {
    icon: "trendingDown",
    title: "Login friction kills onboarding",
    body: "Every extra field or step at signup loses users. Auth is the first thing a new user touches — make it effortless.",
  },
  {
    icon: "shield",
    title: "Weak auth destroys trust",
    body: "One visible breach and users stop entering payment details. Security is a growth feature, not just an engineering concern.",
  },
  {
    icon: "timer",
    title: "Session expiry hurts retention",
    body: "Logging users out too often feels hostile; never expiring is unsafe. The balance is a product decision.",
  },
  {
    icon: "wrench",
    title: "Auth failures flood support",
    body: "“Can't log in” is one of the highest-volume support tickets in most apps. Better flows cut support cost directly.",
  },
  {
    icon: "gauge",
    title: "Security decisions shape growth",
    body: "2FA, password rules and device checks all trade friction for safety. PMs own that trade-off.",
  },
];

/* ---------- Section 8: quiz ---------- */

export const AUTH_QUIZ = {
  scenario:
    "QuickBite users complain they are being logged out too frequently — they have to re-enter their password several times a day.",
  question: "What is most likely happening?",
  options: [
    {
      id: "a",
      label: "Session tokens are expiring too quickly",
      correct: true,
      rationale:
        "Frequent forced logins almost always mean the session/token lifetime is set too short (or isn't refreshing). It's an auth configuration trade-off — and a retention problem worth raising.",
    },
    {
      id: "b",
      label: "The restaurant database is slow",
      correct: false,
      rationale:
        "A slow restaurant database affects browsing speed, not whether a user stays logged in.",
    },
    {
      id: "c",
      label: "Delivery partners are offline",
      correct: false,
      rationale:
        "Driver availability has nothing to do with the user's login session.",
    },
    {
      id: "d",
      label: "The app UI is too colorful",
      correct: false,
      rationale:
        "Visual design doesn't control authentication or session length.",
    },
  ],
};
