import type { DocsAlertSeverity } from "./DocsAlert.types";

export const ALERT_SEVERITY_ICON: Record<DocsAlertSeverity, string> = {
    alert: "⚠",
    error: "⚠",
    info: "🛈",
    success: "🛈",
};

export const WCAG_URLS = {
    "2.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    "2.2.2": "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
    "2.5.7": "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
};
