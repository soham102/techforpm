import posthog from "posthog-js";

/** Canonical analytics event names — keep PostHog dashboards consistent. */
export const AUTH_EVENTS = {
  loginStarted: "login_started",
  loginSuccess: "login_success",
  logout: "logout",
  authError: "auth_error",
} as const;

type AuthEvent = (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS];

/** Thin wrapper so analytics never throws if PostHog isn't ready. */
export function track(event: AuthEvent, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    /* analytics is best-effort */
  }
}

export function identifyUser(
  id: string,
  traits?: Record<string, unknown>
) {
  try {
    posthog.identify(id, traits);
  } catch {
    /* noop */
  }
}

export function resetAnalytics() {
  try {
    posthog.reset();
  } catch {
    /* noop */
  }
}
