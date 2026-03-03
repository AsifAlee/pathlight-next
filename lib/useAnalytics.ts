"use client";

/**
 * useAnalytics — lightweight fire-and-forget event tracking hook.
 * Reads user info from localStorage and posts to /api/analytics/event.
 * Never throws errors to the caller.
 */
export function useAnalytics() {
    const trackEvent = (event: string, metadata: Record<string, unknown> = {}) => {
        try {
            const userData = typeof window !== "undefined"
                ? localStorage.getItem("user")
                : null;
            const user = userData ? JSON.parse(userData) : null;

            fetch("/api/analytics/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event,
                    userId: user?._id || user?.id || null,
                    userEmail: user?.email || null,
                    metadata,
                }),
            }).catch(() => {
                // Silently ignore network errors — analytics must never break the app
            });
        } catch {
            // Silently ignore any errors
        }
    };

    return { trackEvent };
}
