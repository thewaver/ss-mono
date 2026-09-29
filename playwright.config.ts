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
 * A few Playground cases check something only some of the frameworks produce — the type text its docs table shows,
 * the name its warning uses. Each such case is tagged with the frameworks it is about, as many as it holds for, and
 * each Playground's projects leave out a case that carries a framework tag but not its own. So `@solid @react` runs
 * against those two and nowhere else, and an untagged case runs against all four.
 */
const FRAMEWORKS = ["solid", "react", "vue", "svelte"] as const;

type Framework = (typeof FRAMEWORKS)[number];

const notFor = (framework: Framework) => new RegExp(`^(?!.*@${framework}\\b).*@(${FRAMEWORKS.join("|")})\\b`);

/**
 * The Playground specs run four times, once against each Playground: `chromium` and `solo` against the Solid one,
 * and a `<framework>-playground` and `<framework>-playground-solo` pair against each of the React, Vue and Svelte
 * ones, which mirror it page for page and key for key. Every build is told where all four are, so the switch on
 * every page can be followed from any one of them to the other three.
 */
const PORTS: Record<Framework, number> = { solid: PORT, react: 4175, vue: 4177, svelte: 4179 };

const URLS = Object.fromEntries(
    FRAMEWORKS.map((framework) => [framework, `http://127.0.0.1:${PORTS[framework]}`]),
) as Record<Framework, string>;

const PLAYGROUND_URLS = JSON.stringify(
    Object.fromEntries(FRAMEWORKS.map((framework) => [framework, `${URLS[framework]}/`])),
);

const DESKTOP = { ...devices["Desktop Chrome"], viewport: WINDOW_SIZE };

const playgroundProjects = (framework: Exclude<Framework, "solid">) => {
    const name = `${framework}-playground`;
    const use = { ...DESKTOP, baseURL: URLS[framework] };

    return [
        { name, grepInvert: [SOLO_TAG, notFor(framework)], use },
        {
            name: `${name}-solo`,
            grep: SOLO_TAG,
            grepInvert: notFor(framework),
            workers: 1,
            fullyParallel: false,
            dependencies: [name],
            use,
        },
    ];
};

/**
 * `--host 127.0.0.1` rather than the default: `vite preview` otherwise binds the IPv6 loopback
 * alone, and a readiness probe of `127.0.0.1` is then refused outright, which looks like a server
 * that never came up. `--strictPort` makes a second run fail loudly instead of quietly serving a
 * stale build from a preview server somebody left running.
 */
const playgroundServer = (framework: Framework) => ({
    command: `npm run build -w playground-${framework} && npx vite preview --config ./playground-${framework}/vite.config.ts --port ${PORTS[framework]} --strictPort --host 127.0.0.1`,
    env: { VITE_PLAYGROUND_URLS: PLAYGROUND_URLS },
    url: URLS[framework],
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
});

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
            grepInvert: [SOLO_TAG, notFor("solid")],
            use: DESKTOP,
        },
        {
            name: "solo",
            grep: SOLO_TAG,
            grepInvert: notFor("solid"),
            workers: 1,
            fullyParallel: false,
            dependencies: ["chromium"],
            use: DESKTOP,
        },
        ...playgroundProjects("react"),
        ...playgroundProjects("vue"),
        ...playgroundProjects("svelte"),
    ],
    webServer: FRAMEWORKS.map(playgroundServer),
});
