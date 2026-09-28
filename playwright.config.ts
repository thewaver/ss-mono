import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * `Viewport` scales its content to the window, and the scale is almost never 1: it is 1 only when the
 * window's **height** equals the Playground's viewport anchor (the screen's height, unless the library
 * settings say otherwise), since the derived viewport always
 * matches the window's aspect ratio and `RectUtils.fit` scales up as readily as down. So a client rect
 * measured here — `boundingBox`, `getBoundingClientRect` — is the layout value times that factor, which
 * reads as a component measuring itself wrong. **Assert geometry in layout space** (`offsetWidth`,
 * `offsetHeight`, an inline style the component wrote) and the size of this window stops mattering.
 */
const WINDOW_SIZE = { width: 1600, height: 1200 };

/**
 * A handful of tests measure something the machine's load can move — a scroll that has to settle, a drum
 * whose painted box is read mid-turn — and they fail perhaps one run in three under a full parallel sweep
 * while passing every time on their own. That is the load, not the code, and a red from it costs more than
 * it is worth: it trains everybody to re-run rather than to look.
 *
 * So they carry this tag, the main project leaves them out, and a second project runs them afterwards one
 * at a time with nothing else in flight. **Tag a test only after watching it pass alone and fail in a
 * sweep** — a test that fails both ways is broken and belongs in neither project.
 */
const SOLO_TAG = /@solo/;

/**
 * A few Playground cases check something only one framework produces — the type text its docs table shows, the
 * name its warning uses, a placement quirk one of them has and the other does not. Each such case exists once per
 * framework, tagged with the framework it is about, and each Playground's projects leave out the other's tag.
 */
const SOLID_TAG = /@solid\b/;
const REACT_TAG = /@react\b/;

/**
 * The Playground specs run twice, once against each Playground: `chromium` and `solo` against the Solid one,
 * `react-playground` and `react-playground-solo` against the React one, which mirrors it page for page and key for
 * key. Each build is told where the other is, so the switch on every page can be followed from one to the other.
 */
const REACT_PORT = 4175;
const REACT_URL = `http://127.0.0.1:${REACT_PORT}`;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 2 : undefined,
    reporter: [["list"]],
    use: {
        baseURL: BASE_URL,
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            grepInvert: [SOLO_TAG, REACT_TAG],
            use: { ...devices["Desktop Chrome"], viewport: WINDOW_SIZE },
        },
        {
            name: "solo",
            grep: SOLO_TAG,
            grepInvert: REACT_TAG,
            workers: 1,
            fullyParallel: false,
            dependencies: ["chromium"],
            use: { ...devices["Desktop Chrome"], viewport: WINDOW_SIZE },
        },
        {
            name: "react-playground",
            grepInvert: [SOLO_TAG, SOLID_TAG],
            use: { ...devices["Desktop Chrome"], viewport: WINDOW_SIZE, baseURL: REACT_URL },
        },
        {
            name: "react-playground-solo",
            grep: SOLO_TAG,
            grepInvert: SOLID_TAG,
            workers: 1,
            fullyParallel: false,
            dependencies: ["react-playground"],
            use: { ...devices["Desktop Chrome"], viewport: WINDOW_SIZE, baseURL: REACT_URL },
        },
    ],
    /**
     * `--host 127.0.0.1` rather than the default: `vite preview` otherwise binds the IPv6 loopback
     * alone, and a readiness probe of `127.0.0.1` is then refused outright, which looks like a server
     * that never came up. `--strictPort` makes a second run fail loudly instead of quietly serving a
     * stale build from a preview server somebody left running.
     */
    webServer: [
        {
            command: `npm run build -w playground-solid && npx vite preview --config ./playground-solid/vite.config.ts --port ${PORT} --strictPort --host 127.0.0.1`,
            env: { VITE_OTHER_PLAYGROUND_URL: `${REACT_URL}/` },
            url: BASE_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 180_000,
        },
        {
            command: `npm run build -w playground-react && npx vite preview --config ./playground-react/vite.config.ts --port ${REACT_PORT} --strictPort --host 127.0.0.1`,
            env: { VITE_OTHER_PLAYGROUND_URL: `${BASE_URL}/` },
            url: REACT_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 180_000,
        },
    ],
});
