import { type Page, expect, test } from "@playwright/test";

import { demo, prop, revealProp } from "./helpers";

/**
 * `PaintedText` redraws the consumer's text as SVG: one `<text>` per paint layer, each holding one `<tspan>` per
 * run of words, placed where the browser laid the same words out in a hidden copy. Images and icons are carried
 * across as SVG elements of their own, sitting between the runs.
 *
 * Nothing here spells out the example's copy or a coordinate. Every check is a relationship the drawing has to
 * keep whatever the words, the font or the window: a run ends where the next one starts, unless something whole
 * sits between them, and then the gap is exactly that thing's width. That is also what catches a page scaled by
 * the Playground's `Viewport` — a rect read on screen and written into the SVG unconverted places every run a
 * fraction of where it belongs, and the runs overlap.
 *
 * Solid places an image straight into the SVG; React, Vue and Svelte cannot hand an existing element to their
 * renderer, so each sits inside a `<g>` of its own. The queries accept either.
 */
const PAINTED_SVG = "svg:has(> text)";
const LAYERS = `${PAINTED_SVG} > text`;
const ATOMICS = ":scope > :is(image, svg, foreignObject), :scope > g > :is(image, svg, foreignObject)";

/**
 * A list closes with a short animation, and Vue's stays in the page until it ends — so opening the next one at
 * once leaves two lists offering the same option. Each pick therefore waits for its own list to be gone.
 */
const pick = async (page: Page, label: string, option: string) => {
    await page.getByRole("combobox", { name: label, exact: true }).click();
    await page.getByRole("option", { name: option, exact: true }).click();
    await expect(page.getByRole("listbox")).toHaveCount(0);
};

const readLines = (page: Page, key: string) =>
    page.locator(demo(key)).evaluate(
        (root, selectors) => {
            const svg = root.querySelector(selectors.svg) as SVGSVGElement;
            const layer = [...svg.querySelectorAll(":scope > text")].find(
                (text) => !text.hasAttribute("aria-hidden"),
            ) as SVGTextElement;
            const atomics = [...svg.querySelectorAll(selectors.atomics)].map((atomic) => ({
                x: Number(atomic.getAttribute("x")),
                width: Number(atomic.getAttribute("width")),
            }));

            return [...layer.querySelectorAll(":scope > tspan")].map((run) => {
                const tspan = run as SVGTSpanElement;
                const x = Number(tspan.getAttribute("x"));

                return {
                    text: tspan.textContent ?? "",
                    y: tspan.getAttribute("y"),
                    start: x,
                    end: x + tspan.getComputedTextLength(),
                    drawn: tspan.getNumberOfChars(),
                    written: (tspan.textContent ?? "").length,
                    atomics,
                };
            });
        },
        { svg: PAINTED_SVG, atomics: ATOMICS },
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/painted-text");
    await expect(page.locator(`${demo("paragraph")} ${PAINTED_SVG}`)).toBeVisible();
});

test("every run draws all of its characters, leading and trailing spaces included", async ({ page }) => {
    const runs = await readLines(page, "paragraph");

    expect(runs.length, "the paragraph is drawn as runs at all").toBeGreaterThan(1);

    for (const run of runs) {
        expect(run.drawn, "a space at either end of a run is drawn, not collapsed").toBe(run.written);
    }
});

type Run = Awaited<ReturnType<typeof readLines>>[number];

const expectRunsToMeet = (runs: Run[]) => {
    for (let index = 1; index < runs.length; index++) {
        const previous = runs[index - 1];
        const next = runs[index];

        if (previous.y !== next.y) continue;

        const between = next.atomics
            .filter((atomic) => atomic.x >= previous.end - 1 && atomic.x + atomic.width <= next.start + 1)
            .reduce((sum, atomic) => sum + atomic.width, 0);

        expect(next.start - previous.end, "neither overlapping nor drifting apart").toBeCloseTo(between, 0);
    }
};

const drawnLines = (runs: Run[]) =>
    [...Map.groupBy(runs, (run) => run.y).values()].map((line) => line.map((run) => run.text).join(""));

test("the runs on a line meet end to end, or leave exactly the room an image or icon takes", async ({ page }) => {
    expectRunsToMeet(await readLines(page, "paragraph"));
});

test("one copy of the text reaches a screen reader, and it carries the link and the image's name", async ({ page }) => {
    const root = page.locator(demo("paragraph"));
    const readable = root.locator(`${LAYERS}:not([aria-hidden])`);

    await expect(readable, "exactly one layer is read out").toHaveCount(1);
    await expect(readable.locator("a[href]"), "the link survives in the copy that is read").toHaveCount(1);
    expect(
        await readable
            .locator("a")
            .first()
            .evaluate((link) => link.namespaceURI),
        "and it is an SVG link, which is the only kind that works inside SVG text",
    ).toBe("http://www.w3.org/2000/svg");
    await expect(root.locator(`${PAINTED_SVG} image[aria-label]`), "the image keeps its alt as its name").toHaveCount(
        1,
    );
});

/**
 * "Solid" paints a slot in the flat color the samples are built from, the background's for a fill and the border's
 * for a stroke, so the two are each a single color and never the same one.
 */
test("Solid paints the letters and the stroke each in one flat color of its own", async ({ page }) => {
    await pick(page, "Fill", "Solid");
    await pick(page, "Stroke", "Solid");

    const layers = page.locator(`${demo("heading")} ${LAYERS}`);
    const fills = await layers.evaluateAll((all) =>
        all.filter((layer) => !layer.hasAttribute("stroke")).map((layer) => layer.getAttribute("fill")),
    );
    const strokes = await layers.evaluateAll((all) =>
        all.filter((layer) => layer.hasAttribute("stroke")).map((layer) => layer.getAttribute("stroke")),
    );

    expect(fills.length, "the letters are filled").toBe(1);
    expect(strokes.length, "and stroked").toBe(1);
    expect(fills[0], "with a color rather than a sample's url").not.toMatch(/^url\(/);
    expect(strokes[0], "and the stroke likewise").not.toMatch(/^url\(/);
    expect(fills[0], "and the two are different colors").not.toBe(strokes[0]);
});

test("a stroke outside or inside the letters is masked, and one straddling the edge is not", async ({ page }) => {
    await pick(page, "Stroke", "Timed gradient");

    const strokeMasks = () =>
        page
            .locator(`${demo("heading")} ${LAYERS}[stroke]`)
            .evaluateAll((layers) => layers.map((layer) => layer.getAttribute("mask")));

    for (const alignment of ["outside", "inside"]) {
        await pick(page, "Stroke alignment", alignment);

        const masks = await strokeMasks();

        expect(masks.length, `${alignment}: the stroke is drawn`).toBeGreaterThan(0);
        expect(
            masks.every((mask) => !!mask?.startsWith("url(#")),
            `${alignment}: half of it is masked away`,
        ).toBe(true);
    }

    await pick(page, "Stroke alignment", "center");

    expect(
        (await strokeMasks()).every((mask) => mask === null),
        "center: all of it is drawn",
    ).toBe(true);
});

test("what is typed into the box is what is painted, line for line", async ({ page }) => {
    const typed = ["A first line", "and a second"];

    await page.getByRole("textbox", { name: "Custom text", exact: true }).fill(typed.join("\n"));

    await expect.poll(async () => drawnLines(await readLines(page, "customInput"))).toEqual(typed);
});

test("a change to the text's own font lays it out again, so nothing overlaps", async ({ page }) => {
    await revealProp(page, "fontWeight", "heading");

    const weight = page.locator(`${prop("fontWeight")} input`);
    const before = drawnLines(await readLines(page, "heading"));

    for (const value of ["100", "900"]) {
        await weight.fill(value);
        await weight.blur();

        await expect
            .poll(async () => drawnLines(await readLines(page, "heading")).join(""), "every word is still drawn")
            .toBe(before.join(""));
        expectRunsToMeet(await readLines(page, "heading"));
    }
});

/**
 * Inside a Typewriter or a ScrambleText, a painted text draws each letter as a `<text>` of its own while the run
 * plays, gathered in one `<g>` per paint layer, and joins them back into runs once it ends. These read the state of
 * every painted text in an example: whether it is drawing letters, what its readable layer says, what its hidden
 * source says, and when each of its letters is due to start.
 */
const readDrawers = (page: Page, key: string) =>
    page.locator(demo(key)).evaluate(
        (root, svgSelector) =>
            [...root.querySelectorAll(svgSelector)].map((svg) => {
                const painted = svg.parentElement as HTMLElement;
                const source = painted.querySelector(":scope > [inert]") as HTMLElement;
                const readable = [...svg.querySelectorAll(":scope > text")].find(
                    (text) => !text.hasAttribute("aria-hidden"),
                );
                const letters = [...svg.querySelectorAll(":scope > g[aria-hidden] > text")];
                const firstLayer = letters.filter((letter) => letter.parentElement === letters[0]?.parentElement);

                return {
                    isPerLetter: letters.length > 0,
                    readable: (readable?.textContent ?? "").replace(/\s+/g, " ").trim(),
                    source: (source.textContent ?? "").replace(/\s+/g, " ").trim(),
                    drawnLetters: firstLayer.map((letter) => letter.textContent ?? "").join(""),
                    startsMs: firstLayer.map((letter) => parseFloat(getComputedStyle(letter).animationDelay) * 1000),
                };
            }),
        `${PAINTED_SVG}, svg:has(> g > text)`,
    );

test("a Typewriter types two painted texts one after the other, then joins their letters back into lines", async ({
    page,
}) => {
    await page.locator(`${demo("typed")} #typeAgain`).click();

    await expect
        .poll(async () => (await readDrawers(page, "typed")).every((drawer) => drawer.isPerLetter), "drawing letters")
        .toBe(true);

    const [heading, body] = await readDrawers(page, "typed");

    expect(heading.startsMs.length).toBeGreaterThan(0);
    expect(body.startsMs.length).toBeGreaterThan(0);
    expect(Math.min(...body.startsMs), "the second text starts after the first has ended").toBeGreaterThan(
        Math.max(...heading.startsMs),
    );

    await expect
        .poll(async () => (await readDrawers(page, "typed")).some((drawer) => drawer.isPerLetter), {
            message: "back to runs",
            timeout: 15_000,
        })
        .toBe(false);

    for (const drawer of await readDrawers(page, "typed")) {
        expect(drawer.readable).toBe(drawer.source);
    }
});

test("a ScrambleText paints noise in a painted text's letters, then settles on its own words", async ({ page }) => {
    await page.locator(`${demo("scrambled")} #scrambleAgain`).click();

    await expect
        .poll(async () => {
            const [drawer] = await readDrawers(page, "scrambled");

            return drawer.isPerLetter && drawer.drawnLetters.replace(/\s/g, "") !== drawer.source.replace(/\s/g, "");
        }, "a letter shows a glyph other than its own")
        .toBe(true);

    await expect
        .poll(async () => (await readDrawers(page, "scrambled"))[0].isPerLetter, {
            message: "back to runs",
            timeout: 15_000,
        })
        .toBe(false);

    const [drawer] = await readDrawers(page, "scrambled");

    expect(drawer.readable).toBe(drawer.source);
});

/**
 * A painted text lays every gradient it builds across its whole block, rather than across each element the gradient
 * paints. That is what lets the separate letters of a run share one gradient, each showing the part where it sits.
 * Asked as a relationship: the gradient's units are the drawing's own, and the area it is stretched over is exactly
 * the size of the drawing it sits in, whatever that size is.
 */
test("a painted text's gradients are laid across its whole block", async ({ page }) => {
    const gradients = await page.locator(`${demo("heading")} ${PAINTED_SVG}`).evaluate((svg) =>
        [...svg.querySelectorAll("defs linearGradient, defs radialGradient")].map((gradient) => ({
            units: gradient.getAttribute("gradientUnits"),
            transform: gradient.getAttribute("gradientTransform") ?? "",
            size: `${svg.getAttribute("width")} ${svg.getAttribute("height")}`,
        })),
    );

    expect(gradients.length, "the starting fill is a gradient").toBeGreaterThan(0);

    for (const gradient of gradients) {
        expect(gradient.units).toBe("userSpaceOnUse");
        expect(gradient.transform).toContain(`translate(0 0) scale(${gradient.size})`);
    }
});

/**
 * The Typed example's caret blinks for as long as it is on screen, the user's call, which WCAG 2.2.2 allows only
 * because the example offers a way to stop it. So the two are checked together: the blink has no end, and the
 * toggle beside it takes the blink away and gives it back. The caret is the wrapper's, placed by the painted text
 * in a box after its drawing.
 */
test("the typed caret blinks without end, and the toggle stops it and starts it again", async ({ page }) => {
    const caret = page.locator(`${demo("typed")} svg ~ div > span`);
    const toggle = page.locator(`${demo("typed")} #toggleBlink`);
    const readBlink = () =>
        caret.evaluate((element) =>
            element.getAnimations().map((animation) => animation.effect?.getComputedTiming().endTime),
        );

    await expect(caret).toBeAttached();
    await expect.poll(readBlink, "one blink that never ends").toEqual([Infinity]);

    await toggle.click();
    await expect.poll(readBlink, "stopped").toEqual([]);

    await toggle.click();
    await expect.poll(readBlink, "started again").toEqual([Infinity]);
});
