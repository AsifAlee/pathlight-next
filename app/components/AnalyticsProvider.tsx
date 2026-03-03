"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/lib/useAnalytics";

/**
 * AnalyticsProvider — placed in the root layout.
 * Fires a `page_view` event every time the pathname changes.
 */
export default function AnalyticsProvider() {
    const pathname = usePathname();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        trackEvent("page_view", { path: pathname });
    }, [pathname]);

    return null;
}
