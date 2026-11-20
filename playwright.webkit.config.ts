import { defineConfig, devices } from "@playwright/test";

import base, { SCREEN_SIZE, SOLO_TAG, WINDOW_SIZE, notFor, playgroundServer } from "./playwright.config";

/**
 * The same suite in Safari's engine, run only when asked (`npm run verify:dom:webkit`) and never by `verify:dom`.
 * It drives the Solid Playground alone: what differs between engines lives in the shared core and the browser, not in
 * the framework wrapping it, so one Playground answers the question at a quarter of the cost. Firefox has no such run,
 * because Playwright's Firefox build does not start on the user's Mac.
 */
const DESKTOP_SAFARI = { ...devices["Desktop Safari"], viewport: WINDOW_SIZE, screen: SCREEN_SIZE };

export default defineConfig({
    ...base,
    projects: [
        {
            name: "webkit",
            grepInvert: [SOLO_TAG, notFor("solid")],
            use: DESKTOP_SAFARI,
        },
        {
            name: "webkit-solo",
            grep: SOLO_TAG,
            grepInvert: notFor("solid"),
            workers: 1,
            fullyParallel: false,
            dependencies: ["webkit"],
            use: DESKTOP_SAFARI,
        },
    ],
    webServer: [playgroundServer("solid")],
});
