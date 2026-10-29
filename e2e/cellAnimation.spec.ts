import { expect, test } from "@playwright/test";

import { demo, prop, revealProp, useElementRenderer } from "./helpers";

/**
 * The three motion components have Playground pages and no specs, because what they produce is movement over
 * time and a DOM-reading suite cannot see it — that is an accepted limit rather than a gap. This spec is
 * deliberately not about the motion: it drives the one thing about a cell that *is* in the DOM, which is what
 * each cell is filled with, and it exists because a source that is drawn rather than photographed carries
 * parentheses that CSS refuses inside an unquoted `url()`. The cells would paint nothing and the box would
 * still size itself correctly, which is the failure that looks like the animation having gone wrong.
 */
test.beforeEach(async ({ page }) => {
    await useElementRenderer(page);
    await page.goto("/cell-animation");
    await expect(page.locator("img").first()).toBeVisible();
});

const cellSources = (page: import("@playwright/test").Page, scope: string) =>
    page.evaluate((selector) => {
        const root = document.querySelector(selector)!;
        const cells = [...root.querySelectorAll("div")].map((element) => getComputedStyle(element).backgroundImage);

        return {
            drawn: cells.filter((image) => image.startsWith('url("data:image/svg+xml')).length,
            filed: cells.filter((image) => image.startsWith("url(") && !image.includes("data:image/svg+xml")).length,
        };
    }, scope);

/** Switches the picture the first example's cells are cut from, through the page's own picker. */
const pickSource = async (page: import("@playwright/test").Page, kind: "image" | "gradient" | "pattern") => {
    await page.locator(`${prop("sourceKind")} [role="combobox"]`).click();
    await page.getByRole("option", { name: kind, exact: true }).click();
};

const sourceOf = async (page: import("@playwright/test").Page) =>
    decodeURIComponent(
        (await page.locator(`${demo("source")} img`).getAttribute("src"))!.replace("data:image/svg+xml,", ""),
    );

test("each kind of source reaches the cells", async ({ page }) => {
    await expect(page.locator(`${demo("source")} img`), "the page opens on a file").toHaveAttribute("src", /\.webp/);

    const image = await cellSources(page, demo("source"));

    expect(image.filed, "the photograph reaches the cells").toBeGreaterThan(10);
    expect(image.drawn, "and nothing drawn does").toBe(0);

    await pickSource(page, "gradient");
    await expect(page.locator(`${demo("source")} img`), "a Shape gradient, serialized").toHaveAttribute(
        "src",
        /^data:image\/svg\+xml,.*linearGradient/,
    );
    expect(
        (await cellSources(page, demo("source"))).drawn,
        "the drawn gradient reaches the cells, which an unquoted url would have dropped",
    ).toBeGreaterThan(10);

    await pickSource(page, "pattern");
    await expect(page.locator(`${demo("source")} img`), "a Shape pattern").toHaveAttribute(
        "src",
        /^data:image\/svg\+xml,.*pattern/,
    );
    expect((await cellSources(page, demo("source"))).drawn, "and so does the drawn pattern").toBeGreaterThan(10);
});

/**
 * Markup that parses is not markup that paints — a def serialized without the element it refers to would
 * still load as a blank image, and the cells would slice nothing while looking entirely healthy. So this
 * draws each source and counts what came out.
 */
test("a serialized def paints, rather than merely loading", async ({ page }) => {
    const inspect = (selector: string) =>
        page.evaluate(async (selector) => {
            const img = new Image();

            img.src = document.querySelector<HTMLImageElement>(selector)!.src;
            await img.decode().catch(() => undefined);

            const canvas = document.createElement("canvas");

            canvas.width = 40;
            canvas.height = 40;

            const context = canvas.getContext("2d")!;

            context.drawImage(img, 0, 0, 40, 40);

            const data = context.getImageData(0, 0, 40, 40).data;
            const seen = new Set<string>();

            for (let i = 0; i < data.length; i += 4) {
                seen.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`);
            }

            return { loaded: img.naturalWidth, distinct: seen.size };
        }, selector);

    await pickSource(page, "gradient");
    await expect(page.locator(`${demo("source")} img`)).toHaveAttribute("src", /linearGradient/);

    const gradient = await inspect(`${demo("source")} img`);

    await pickSource(page, "pattern");
    await expect(page.locator(`${demo("source")} img`)).toHaveAttribute("src", /pattern/);

    const pattern = await inspect(`${demo("source")} img`);
    const drawn = { gradient, pattern };

    expect(drawn.gradient.loaded, "the gradient source has an intrinsic size, so it can anchor the box").toBe(1200);
    expect(drawn.gradient.distinct, "and it is a spread of colors rather than one flat fill").toBeGreaterThan(10);
    expect(drawn.pattern.loaded).toBe(1200);
    expect(drawn.pattern.distinct, "the pattern paints its cells rather than an empty box").toBeGreaterThan(10);
});

/**
 * An image source runs no script, and the library's animate defs deliberately begin on one — a ref works out
 * the document's current time and sets `begin` from it, so that the iteration patterns can be sequenced. Left
 * alone that is a still. Writing the begin into the markup at serialization is what starts them, and it is
 * only correct because the source is a document nothing will ever drive.
 */
test("a serialized gradient keeps animating, having had its begin written in", async ({ page }) => {
    await pickSource(page, "gradient");
    await expect(page.locator(`${demo("source")} img`)).toHaveAttribute("src", /linearGradient/);

    const moved = await page.evaluate(
        async (selector) => {
            const sample = async (uri: string) => {
                const img = new Image();

                img.src = uri;
                img.style.cssText = "position:fixed;left:0;top:0;width:100px;height:100px;opacity:0.01";
                document.body.appendChild(img);
                await img.decode().catch(() => undefined);

                const read = () => {
                    const canvas = document.createElement("canvas");

                    canvas.width = 20;
                    canvas.height = 20;

                    const context = canvas.getContext("2d")!;

                    context.drawImage(img, 0, 0, 20, 20);

                    return [...context.getImageData(0, 0, 20, 20).data].join(",");
                };

                const first = read();

                await new Promise((resolve) => setTimeout(resolve, 700));

                const changed = first !== read();

                img.remove();

                return changed;
            };

            const live = document.querySelector<HTMLImageElement>(selector)!.src;
            const frozen = `data:image/svg+xml,${encodeURIComponent(
                decodeURIComponent(live.replace("data:image/svg+xml,", "")).replace(
                    /begin="[^"]*"/g,
                    'begin="indefinite"',
                ),
            )}`;

            return { live: await sample(live), frozen: await sample(frozen) };
        },
        `${demo("source")} img`,
    );

    expect(moved.live, "the source the page builds is moving").toBe(true);
    expect(moved.frozen, "and the same markup with the begin put back is not, which is what it was doing before").toBe(
        false,
    );
});

/** The pattern sample's own choice, and the one length here that no knob on the panel decides. */
const PATTERN_CYCLE_MULTIPLE = 4;

/**
 * What the cells are handed for one iteration, worked out from the panel rather than written down. Three
 * knobs decide it: a pass that comes back — stack or pipe — runs out and back with the hold parked between the
 * legs, so its iteration is twice the duration plus the hold, and a pass that does not is the duration alone.
 * The duration field is always the one-way trip.
 */
const cycleMs = async (page: import("@playwright/test").Page) => {
    const durationMs = Number(await page.locator(`${prop("animationDurationMs")} input`).inputValue());
    const holdMs = Number(await page.locator(`${prop("holdMs")} input`).inputValue());
    const dir = ((await page.locator(`${prop("playbackDir")} [role="combobox"]`).textContent()) ?? "").trim();

    return /^(stack|pipe)/.test(dir) ? durationMs * 2 + holdMs : durationMs;
};

/**
 * A drawn source is built from the same registry the Shape page reads, so the two should not be able to drift
 * apart on the things a viewer would notice: the palette is the samples' own, and the animation lasts as long
 * as the cell animation it is being sliced by rather than a length of its own.
 *
 * Every length below is asked of the panel first and compared second, because a literal here cannot tell a
 * break from somebody changing their mind: switching the page's opening direction from `normal` to
 * `stack` more than doubles every duration in the source without anything having gone wrong. What is
 * asserted is the relationship — the source runs for exactly one cell iteration, whatever the knobs currently
 * make that — and the direction is flipped at the end so the rule is exercised both ways rather than only in
 * whichever state the page happens to open in.
 */
test("a drawn source takes its palette from the samples and its duration from the page", async ({ page }) => {
    const delayMs = Number(await page.locator(`${prop("animationIterationDelayMs")} input`).inputValue());
    const opening = await cycleMs(page);

    await pickSource(page, "gradient");
    await expect.poll(() => sourceOf(page), { message: "the Shape palette, not a second one" }).toContain("#FFFF00");
    expect(await sourceOf(page), "and the iteration the panel currently describes").toContain(`dur="${opening}ms"`);
    expect(
        await sourceOf(page),
        "the pause between repeats is the page's too, expressed as a begin that refers to the animation's own end",
    ).toMatch(new RegExp(`begin="0s;[^"]+\\.end\\+${delayMs}ms"`));

    await pickSource(page, "pattern");
    await expect
        .poll(() => sourceOf(page), {
            message: "a pattern sample is free to run at a multiple of what it is given, and this one takes four times",
        })
        .toContain(`dur="${opening * PATTERN_CYCLE_MULTIPLE}ms"`);
    expect(
        await sourceOf(page),
        "a repeating fill has no beat to be out of step with, so it flows on without the pause",
    ).not.toContain(".end+");

    const duration = page.locator(`${prop("animationDurationMs")} input`);

    await duration.fill("3000");
    await duration.press("Enter");

    const stretched = await cycleMs(page);

    expect(stretched, "the knob moved, so there is something to see").not.toBe(opening);

    await expect
        .poll(() => sourceOf(page), {
            message: "changing the duration rebuilds the source, and the multiple follows it",
        })
        .toContain(`dur="${stretched * PATTERN_CYCLE_MULTIPLE}ms"`);

    await pickSource(page, "gradient");
    await expect
        .poll(() => sourceOf(page), { message: "and the gradient is built at the new length" })
        .toContain(`dur="${stretched}ms"`);

    await page.locator(`${prop("playbackDir")} [role="combobox"]`).click();
    await page.getByRole("option", { name: "normal", exact: true }).click();

    const oneWay = await cycleMs(page);

    expect(oneWay, "a pass that does not come back drops the return leg and the hold with it").toBeLessThan(stretched);

    await expect
        .poll(() => sourceOf(page), {
            message: "and the source is rebuilt at the leg rather than the round trip",
        })
        .toContain(`dur="${oneWay}ms"`);
});

/**
 * A pause between repeats is the one thing a source cannot express the way the component does — the component
 * waits on a timer between runs, and a document nothing drives has no timer. SMIL can say it declaratively:
 * one repeat, and a begin that starts again at its own end plus the pause. At a delay of zero there is nothing
 * to say, so the simpler continuous form comes back.
 */
test("a delay of zero puts the source back to a continuous loop", async ({ page }) => {
    await pickSource(page, "gradient");

    const delay = page.locator(`${prop("animationIterationDelayMs")} input`);

    await delay.fill("0");
    await delay.press("Enter");

    await expect
        .poll(() => sourceOf(page), { message: "no pause to express, so nothing refers to its own end" })
        .not.toContain(".end+");
});

/**
 * Two clocks: the cells run on the page's frame loop, the drawn source on the image's own timeline, which
 * starts when the image loads. Rebuilding the source hands it a new timeline while the cells carry on, so the
 * offset between them becomes whatever the cells happened to be doing — which is why picking a different
 * gradient used to leave a sweep visibly out of step with the slicing. The cells now treat a new picture as a
 * reason to start over, which puts both back at zero together.
 */
test("a new picture starts the cell timeline over", async ({ page }) => {
    const progressOf = (scope: string) =>
        page.evaluate((selector) => {
            const cells = [...document.querySelectorAll<HTMLElement>(`${selector} div`)].filter(
                (element) => element.style.transform.length > 0,
            );

            return cells.map((cell) => cell.style.transform).join("|");
        }, scope);

    await pickSource(page, "gradient");
    await expect.poll(() => progressOf(demo("source")), { message: "the cells are mid-assembly" }).not.toBe("");

    await page.locator(`${prop("gradient")} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: "orbit_async_3" }).first().click();

    const afterPick = await progressOf(demo("source"));

    await expect
        .poll(() => progressOf(demo("source")), { message: "and they are running again from the start" })
        .not.toBe(afterPick);
});

test("picking another def rebuilds the source", async ({ page }) => {
    await pickSource(page, "pattern");
    await expect(page.locator(`${demo("source")} img`)).toHaveAttribute("src", /pattern/);

    const before = await page.locator(`${demo("source")} img`).getAttribute("src");

    await page.locator(`${prop("pattern")} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: "triangle_t_2" }).first().click();

    await expect
        .poll(() => page.locator(`${demo("source")} img`).getAttribute("src"), {
            message: "the source is rebuilt from the def the dropdown names",
        })
        .not.toBe(before);
});

/**
 * The source picker heads its own group on the page, and each kind brings the knobs that describe it: a file for the
 * photograph, a def and a ratio for a drawn source. Nothing belonging to another kind stays behind.
 */
test("each source brings its own knobs and takes the others away", async ({ page }) => {
    await expect(page.locator('input[type="file"]'), "the photograph brings a file picker").toHaveCount(1);
    await expect(page.locator(prop("gradient")), "and no def").toHaveCount(0);
    await expect(page.locator(prop("sourceRatio")), "and no ratio, since a file has its own").toHaveCount(0);

    await pickSource(page, "gradient");
    await expect(page.locator(prop("gradient")), "a gradient brings its def").toBeVisible();
    await expect(page.locator(prop("sourceRatio")), "and a ratio").toBeVisible();
    await expect(page.locator('input[type="file"]'), "and takes the file picker away").toHaveCount(0);

    await pickSource(page, "pattern");
    await expect(page.locator(prop("pattern")), "a pattern brings its own def").toBeVisible();
    await expect(page.locator(prop("gradient")), "in place of the gradient's").toHaveCount(0);
    await expect(page.locator(prop("sourceRatio")), "and keeps the ratio").toBeVisible();
});

/**
 * Paused, the example holds its frame, and scrubbing moves its cells — on a drawn source as on the photograph. The
 * colors inside a drawn source animate on the source's own clock and are not read.
 */
test("the example pauses and scrubs whatever its source", async ({ page }) => {
    const readFrame = () =>
        page
            .locator(demo("source"))
            .evaluate((root) =>
                [...root.querySelectorAll<HTMLElement>("div")]
                    .map((element) => `${element.style.transform}|${element.style.filter}|${element.style.opacity}`)
                    .join(";"),
            );

    await page.locator("#cellAnimationPlayback").click();
    await expect(page.locator("#cellAnimationPlayback")).toHaveAccessibleName("Play");

    for (const kind of ["gradient", "pattern"] as const) {
        await pickSource(page, kind);
        await expect(page.locator("#cellAnimationPlayback"), "a new source leaves it paused").toHaveAccessibleName(
            "Play",
        );

        await page.locator("#cellAnimationProgress").focus();
        await page.keyboard.press("Home");

        const start = await readFrame();

        for (let i = 0; i < 50; i++) await page.keyboard.press("ArrowRight");

        await expect.poll(readFrame, { message: `${kind} moves when scrubbed` }).not.toBe(start);

        const middle = await readFrame();

        await page.waitForTimeout(300);

        expect(await readFrame(), `${kind} holds while paused`).toBe(middle);
    }
});

/**
 * A cell's fade is written to its `opacity`, not as an `opacity()` inside its `filter`, and a filter function at the
 * value where it changes nothing is left out — so a cell that has finished its turn carries no filter at all.
 * `blur_default` fades and blurs at once, so it shows both: a cell partway through its turn has an opacity between
 * nothing and whole and no `opacity()` in its filter, and a cell at the end of its turn has neither a filter nor an
 * opacity left.
 *
 * Paused and scrubbed from start to end, the example is read at even steps, each read two frames after the scrub so
 * the cells have been drawn. Where in the pass the cells rest at the end of their turn depends on the playback
 * direction, so the steps are read together rather than one of them being named.
 */
test("a cell fades through its opacity, and carries no filter once its turn is over", async ({ page }) => {
    const STEP_PERCENT = 5;

    const readCells = () =>
        page.locator(demo("source")).evaluate(async (root) => {
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            return [...root.querySelectorAll<HTMLElement>("div")]
                .filter((element) => getComputedStyle(element).backgroundImage.startsWith("url("))
                .map((element) => ({ filter: element.style.filter, opacity: element.style.opacity }));
        });

    await page.locator("#cellAnimationPlayback").click();
    await expect(page.locator("#cellAnimationPlayback")).toHaveAccessibleName("Play");

    await revealProp(page, "animationType");
    await page.locator(`${prop("animationType")} [role="combobox"]`).click();
    await page.getByRole("option", { name: "blur_default", exact: true }).click();

    await page.locator("#cellAnimationProgress").focus();
    await page.keyboard.press("Home");

    const start = await readCells();

    expect(start.length, "the example has cells").toBeGreaterThan(0);
    expect(
        start.every((cell) => cell.filter !== ""),
        "every cell starts its turn blurred",
    ).toBe(true);

    const frames = [start];

    for (let percent = STEP_PERCENT; percent <= 100; percent += STEP_PERCENT) {
        for (let i = 0; i < STEP_PERCENT; i++) await page.keyboard.press("ArrowRight");

        frames.push(await readCells());
    }

    const cells = frames.flat();

    expect(
        cells.filter((cell) => cell.filter.includes("opacity(")),
        "no fade is written into a filter",
    ).toEqual([]);
    expect(
        cells.some((cell) => cell.opacity !== "" && Number(cell.opacity) > 0 && Number(cell.opacity) < 1),
        "a cell partway through its turn carries its fade as its opacity",
    ).toBe(true);
    expect(
        frames.some((frame) => frame.every((cell) => cell.filter === "" && cell.opacity === "")),
        "once every cell has finished its turn, none carries a filter or an opacity",
    ).toBe(true);
});
