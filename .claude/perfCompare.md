# Comparing animation performance between two versions

The user will name two versions — commits, branches or tags — and ask for a before-and-after on this machine. Follow
these steps exactly; everything in `CLAUDE.md` still holds (no git writes, temporary files in `.scratch/`, nothing
installed without asking).

**If the user names no versions**, compare `ba65aa1d` (before) with `b7b52df7` (after): the commit before the
performance work on the animations and particles, and the commit holding it. Run `git pull` first if either is
missing.

## What it measures

The Solid Playground's stress tests, in a real Chrome window on this machine's graphics card: each test three times on
each version, the middle result kept, the first 100 ms of each recording left out as a warm-up. Per test: frames a
second, and the main thread's busy time per frame. **The cell and scanline tests run in constant motion**: the
script sets the iteration delay (and the cells' hold) to 0, so every frame redraws everything, and a page left at its
defaults pauses between passes and reads far higher on its counter — 168 against 98 for the same 2D zoom on the
Radeon. Compare a hand-opened page with the script's numbers only after zeroing those knobs. The
dissolve is measured only by its 20-card stress test at 4 px cells — a larger cell size does not load the browser
enough to mean anything, and the user dropped the single-Card test as pointless.

## Stored results for `ba65aa1d`

The user asked for the old version's results to be kept so it need not be measured again. **When "before" is
`ba65aa1d` and the graphics card the script prints matches one below, skip exporting, building and serving the
"before" side** and run the script with `ONLY_BUILD=after`; take the "before" column from here. On any other card, or
another "before" ref, measure both sides as usual and add the new card's results here. They hold only for the script
below as it stands, with `ba65aa1d` patched as step 2 says; a change to either means measuring again.

**AMD Radeon RX 7900 XTX** (`ANGLE (AMD, AMD Radeon RX 7900 XTX (0x0000744C) Direct3D11 vs_5_0 ps_5_0, D3D11)`) —
the user's machine. Frames a second, middle of three runs; Cells blur from a rerun after a 17% spread.

| Test               | Average | 90th percentile | Main thread, ms a frame |
| ------------------ | ------- | --------------- | ----------------------- |
| Cells, 2D zoom     | 34.5    | 27.0            | 29.4                    |
| Cells, fade        | 6.2     | 5.1             | 170.9                   |
| Cells, blur        | 2.0     | 1.2             | 709.9                   |
| Cells, 3D cube     | 0.9     | 0.5             | 1090.1                  |
| Scanlines, moves   | 39.2    | 33.2            | 25.7                    |
| Scanlines, filters | 6.5     | 5.2             | 160.6                   |
| Spawners, 72       | 28.5    | 17.1            | 34.4                    |
| Fields, 72         | 8.5     | 4.5             | 121.7                   |
| Dissolve, 20 cards | 3.9     | 1.4             | 272.4                   |

**Apple M3 Pro** (`ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro, Unspecified Version)`) — the user's laptop.
Frames a second, middle of three runs; Cells blur, Spawners, Fields and Dissolve from a rerun. Measured before the
script took main-thread time, so that column is empty. The slowest tests spread past 15% even on the rerun, at rates
under 6 frames a second.

| Test               | Average | 90th percentile | Main thread, ms a frame |
| ------------------ | ------- | --------------- | ----------------------- |
| Cells, 2D zoom     | 43.9    | 27.7            | —                       |
| Cells, fade        | 5.3     | 3.5             | —                       |
| Cells, blur        | 0.5     | 0.4             | —                       |
| Cells, 3D cube     | 1.7     | 0.9             | —                       |
| Scanlines, moves   | 52.3    | 49.5            | —                       |
| Scanlines, filters | 5.2     | 3.6             | —                       |
| Spawners, 72       | 15.8    | 5.3             | —                       |
| Fields, 72         | 5.0     | 2.4             | —                       |
| Dissolve, 20 cards | 4.9     | 1.8             | —                       |

## Steps

1. **Check the machine.** `npm install` must have been run, and Playwright's Chromium must be present
   (`npx playwright install chromium` — ask the user first if it is missing). Ports 4191 and 4192 must be free; if
   either is taken, say so and stop rather than killing anything.
2. **Export both versions** into the scratch folder. `git archive` only reads from git:

    ```bash
    for side in before after; do
        ref=$([ "$side" = before ] && echo "<BEFORE_REF>" || echo "<AFTER_REF>")
        mkdir -p .scratch/perf/$side
        git archive "$ref" utils components components-solid playground playground-solid tsconfig.base.json tsconfig.json package.json \
            | tar -x -C .scratch/perf/$side
    done
    ```

    If the user says "after" is the working copy, skip exporting it and build from the repo itself in step 3.

    **An old version needs patching in its export for parity with the latest**, or some tests are missing or measure
    something else: `ba65aa1d` has no dissolve stress test (add `stressTest`, `STRESS_CELL_SIZE` and `STRESS_ITEMS` to
    its `ParticleDissolvePage.const.ts`, and today's `StressCard` and `StressTestWrapper` to its Solid page, drawn with
    its own `renderParticle` and `computeAshAnimation`), its card badge lacks the `marginTop` that makes the card 200 px
    tall rather than 190, and its spawner stress test is 96 boxes of 120 × 80 rather than 72 squares of 120 in a
    `PageMeasureBox`. Diff the export's Playground against the latest for anything newer before trusting a result.
    **The old version keeps its own stress-test backdrop and modal styling** — the user's call: its blurred
    `ModalOverlay`, `ModalPanel` and `DrawerPanel` stay, and today's opaque overlay is not ported.

3. **Build each** (run in the background; each takes about a minute):

    ```bash
    npx vite build --config ./.scratch/perf/before/playground-solid/vite.config.ts --outDir "$PWD/.scratch/perf/before-dist" --emptyOutDir
    npx vite build --config ./.scratch/perf/after/playground-solid/vite.config.ts --outDir "$PWD/.scratch/perf/after-dist" --emptyOutDir
    ```

    A version whose build fails cannot be compared: report the error and stop. The repo's installed packages must suit
    both versions; a very old version may need packages this checkout no longer has.

4. **Serve each**, in the background:

    ```bash
    npx vite preview --config ./playground-solid/vite.config.ts --outDir "$PWD/.scratch/perf/before-dist" --port 4191 --strictPort --host 127.0.0.1
    npx vite preview --config ./playground-solid/vite.config.ts --outDir "$PWD/.scratch/perf/after-dist" --port 4192 --strictPort --host 127.0.0.1
    ```

5. **Tell the user a Chrome window is about to open** and run for 15–20 minutes: they can keep working in other
   windows, but must not minimize it (a hidden page stops drawing), should not type into it, and should avoid heavy
   load meanwhile. Then save the script below as `.scratch/perf/compare.mjs` and run `node .scratch/perf/compare.mjs`
   in the background.
6. **Check for outliers.** The script prints every run. Where the three runs of one test on one version spread by more
   than about 15%, rerun just that test (`ONLY="Cells, blur"`, several names separated by `|`) and use the rerun.
7. **Report** the table the script prints and the graphics card it names. **The user wants both the average and the
   90th-percentile frame rate, each with its change written as a multiple, never a percentage** — `x2` where a
   percentage would say +100%, `x0.8` for a slowdown. The script takes the 90th percentile from the sorted gaps
   between frame stamps (`1000 / gaps[floor(0.9 × count)]`). `ARGS` carries `--disable-gpu-vsync` and
   `--disable-frame-rate-limit`, or every fast result stops at the screen's refresh rate; Chromium honored both as of
   this writing (a single dissolving card once measured 3,000 frames a second). Say which tests were rerun and why. If a knob or button a test needs is
   missing on one version, the script says so: report that test as not comparable rather than guessing.
8. **Clean up**: stop both preview servers (stopping the background task may leave the `node` process listening —
   check the ports and stop only the `vite preview` processes you started) and delete `.scratch/perf`.

## The script

```js
import { chromium } from "@playwright/test";

const ALL_BUILDS = { before: "http://127.0.0.1:4191", after: "http://127.0.0.1:4192" };
const BUILDS = process.env.ONLY_BUILD ? { [process.env.ONLY_BUILD]: ALL_BUILDS[process.env.ONLY_BUILD] } : ALL_BUILDS;
const ARGS = [
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--ignore-gpu-blocklist",
    "--disable-gpu-vsync",
    "--disable-frame-rate-limit",
];
const WARM_UP_MS = 100;
const prop = (key) => `[data-prop][data-testid="${key}"]`;

class MissingControl extends Error {}

const setNumber = async (page, key, value) => {
    const input = page.locator(`${prop(key)} input`).first();
    if ((await input.count()) === 0) throw new MissingControl(`no "${key}" knob`);
    await input.fill(String(value));
    await input.press("Tab");
    await page.waitForTimeout(200);
};

const pick = async (page, key, name) => {
    const box = page.locator(`${prop(key)} [role="combobox"]`).first();
    if ((await box.count()) === 0) throw new MissingControl(`no "${key}" picker`);
    await box.click();
    await page.getByRole("option", { name, exact: true }).click();
    await page.waitForTimeout(300);
};

const press = async (page, label) => {
    const button = page.getByRole("button", { name: label, exact: true });
    if ((await button.count()) === 0) throw new MissingControl(`no "${label}" button`);
    await button.click();
    await page.waitForTimeout(2500);
};

const cell = (animation) => ({
    route: "/cell-animation",
    setup: async (page) => {
        await setNumber(page, "animationIterationDelayMs", 0);
        await setNumber(page, "holdMs", 0);
        if (animation) await pick(page, "animationType", animation);
        await press(page, "Render 72 items");
    },
});

const scan = (kind) => ({
    route: "/scanline-animation",
    setup: async (page) => {
        await setNumber(page, "animationIterationDelayMs", 0);
        await press(page, `Render 72 ${kind} items`);
    },
});

const SCENARIOS = {
    "Cells, 2D zoom": cell(),
    "Cells, fade": cell("fade_in_linear"),
    "Cells, blur": cell("blur_default"),
    "Cells, 3D cube": cell("cube_left"),
    "Scanlines, moves": scan("transform"),
    "Scanlines, filters": scan("filter"),
    "Spawners, 72": { route: "/particle-spawner", setup: (page) => press(page, "Render 72 spawners") },
    "Fields, 72": {
        route: "/particle-field",
        setup: async (page) => {
            await setNumber(page, "iterationDelayMs", 0);
            await press(page, "Render 72 fields");
        },
    },
    "Dissolve, 20 cards": { route: "/particle-dissolve", setup: (page) => press(page, "Render 20 cards") },
};

const runOnce = async (browser, base, scenario) => {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1200 } });
    const page = await context.newPage();

    try {
        await page.goto(`${base}${scenario.route}`);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1000);
        await scenario.setup(page);
        await page.waitForTimeout(WARM_UP_MS);

        const client = await context.newCDPSession(page);
        await client.send("Performance.enable");
        const busy = async () =>
            (await client.send("Performance.getMetrics")).metrics.find((m) => m.name === "TaskDuration").value;

        const busyBefore = await busy();
        const recording = page.evaluate(
            (ms) =>
                new Promise((resolve) => {
                    const stamps = [];
                    const start = performance.now();
                    const loop = (t) => {
                        stamps.push(t);
                        if (t - start < ms) requestAnimationFrame(loop);
                        else resolve(stamps);
                    };
                    requestAnimationFrame(loop);
                }),
            scenario.measureMs ?? 5000,
        );
        if (scenario.action) await scenario.action(page);
        const stamps = await recording;
        const busyAfter = await busy();
        const frames = stamps.length - 1;
        const gaps = stamps
            .slice(1)
            .map((t, i) => t - stamps[i])
            .sort((a, b) => a - b);

        return {
            fps: (frames / (stamps.at(-1) - stamps[0])) * 1000,
            p90: 1000 / gaps[Math.floor(0.9 * gaps.length)],
            busyMs: ((busyAfter - busyBefore) * 1000) / frames,
        };
    } finally {
        await context.close();
    }
};

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const only = process.env.ONLY?.split("|");
const browser = await chromium.launch({ headless: false, args: ARGS });

const probe = await browser.newPage();
await probe.goto(Object.values(BUILDS)[0]);
const renderer = await probe.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "unknown";
});
await probe.close();
console.log(`Graphics: ${renderer}\n`);

const table = [
    "| Test | Before avg | After avg | Change | Before p90 | After p90 | Change |",
    "|---|---|---|---|---|---|---|",
];
const shift = (from, to) => {
    const times = to / from;
    return `x${times < 10 ? times.toFixed(1) : times.toFixed(0)}`;
};

for (const [name, scenario] of Object.entries(SCENARIOS)) {
    if (only && !only.includes(name)) continue;

    const result = {};

    try {
        for (const [build, base] of Object.entries(BUILDS)) {
            const runs = [];
            for (let i = 0; i < 3; i++) runs.push(await runOnce(browser, base, scenario));
            result[build] = {
                fps: median(runs.map((r) => r.fps)),
                p90: median(runs.map((r) => r.p90)),
                busyMs: median(runs.map((r) => r.busyMs)),
            };
            console.log(
                `${name} — ${build}: runs ${runs.map((r) => r.fps.toFixed(1)).join(", ")} fps avg; p90 ${runs.map((r) => r.p90.toFixed(1)).join(", ")} fps; median main thread ${result[build].busyMs.toFixed(1)} ms a frame`,
            );
        }
    } catch (error) {
        if (!(error instanceof MissingControl)) throw error;
        console.log(`${name}: not comparable — ${error.message}`);
        table.push(`| ${name} | — | — | not comparable | — | — | — |`);
        continue;
    }

    const { before, after } = result;
    if (!before || !after) continue;
    table.push(
        `| ${name} | ${before.fps.toFixed(1)} | ${after.fps.toFixed(1)} | ${shift(before.fps, after.fps)} | ${before.p90.toFixed(1)} | ${after.p90.toFixed(1)} | ${shift(before.p90, after.p90)} |`,
    );
}

await browser.close();
if (table.length > 2) console.log(`\n${table.join("\n")}`);
```
