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

/**
 * Given a path, a painted text is set along it with SVG's own `<textPath>`, so the browser places every letter. Each
 * paint layer is drawn twice, the second copy one whole path length behind the first, which is what brings text that
 * slides past the end round from the start. These read every `<text>` holding a `<textPath>` in the drawing — the
 * hidden layout copy the component measures from sits in a drawing with no `<defs>`, so it is never among them — and
 * the length of the path they all point at.
 */
const PATH_SVG = "svg:has(> defs > path[id])";
const SLIDE_WAIT_MS = 400;
const SAMPLE_GAP_MS = 300;
const SAMPLE_COUNT = 3;
const PIXEL_SLACK = 1;

const readPathTexts = (page: Page, key: string) =>
    page.locator(`${demo(key)} ${PATH_SVG}`).evaluate((svg) => {
        const painted = svg.parentElement as HTMLElement;
        const source = painted.querySelector(":scope > [inert]") as HTMLElement;
        const texts = [...svg.querySelectorAll(":scope > text")].filter((text) =>
            text.querySelector(":scope > textPath"),
        );
        const hrefs = texts.map((text) => text.querySelector("textPath")?.getAttribute("href") ?? "");
        const path = svg.querySelector(`defs > path${hrefs[0] ?? ""}`) as SVGPathElement | null;
        const viewBox = (svg.getAttribute("viewBox") ?? "").split(" ").map(Number);

        return {
            source: (source.textContent ?? "").replace(/\s+/g, " ").trim(),
            hrefs,
            pathLength: path?.getTotalLength() ?? 0,
            viewBox: { x: viewBox[0], y: viewBox[1], width: viewBox[2], height: viewBox[3] },
            texts: texts.map((text) => {
                const element = text as SVGTextElement;
                const drawn = Array.from({ length: element.getNumberOfChars() }, (_unused, index) =>
                    element.getExtentOfChar(index),
                ).filter((extent) => extent.width > 0);
                const left = Math.min(...drawn.map((extent) => extent.x));
                const top = Math.min(...drawn.map((extent) => extent.y));
                const box = drawn.length
                    ? {
                          x: left,
                          y: top,
                          width: Math.max(...drawn.map((extent) => extent.x + extent.width)) - left,
                          height: Math.max(...drawn.map((extent) => extent.y + extent.height)) - top,
                      }
                    : { x: 0, y: 0, width: 0, height: 0 };

                return {
                    isReadable: !text.hasAttribute("aria-hidden"),
                    paint: `${text.getAttribute("fill")} ${text.getAttribute("stroke")}`,
                    content: (text.textContent ?? "").replace(/\s+/g, " ").trim(),
                    startOffset: Number(text.querySelector("textPath")?.getAttribute("startOffset")),
                    textLength: text.getAttribute("textLength"),
                    box: { x: box.x, y: box.y, width: box.width, height: box.height },
                };
            }),
        };
    });

/** Whether a path text's readable copy moves along its path over a short wait. */
const readIsSliding = (page: Page, key: string) =>
    page.locator(`${demo(key)} ${PATH_SVG}`).evaluate(async (svg, waitMs) => {
        const readOffset = () =>
            svg.querySelector(":scope > text:not([aria-hidden]) > textPath")?.getAttribute("startOffset") ?? "";
        const before = readOffset();

        await new Promise((resolve) => setTimeout(resolve, waitMs));

        return readOffset() !== before;
    }, SLIDE_WAIT_MS);

test("on a path, the text is set along the path, and exactly one copy of it is read out", async ({ page }) => {
    await expect(page.locator(`${demo("circle")} ${PATH_SVG}`)).toBeVisible();

    const drawing = await readPathTexts(page, "circle");
    const readable = drawing.texts.filter((text) => text.isReadable);

    expect(drawing.pathLength, "the path the text points at is in the drawing").toBeGreaterThan(0);
    expect(new Set(drawing.hrefs).size, "every copy follows the same path").toBe(1);
    expect(readable, "one copy is read out").toHaveLength(1);
    expect(readable[0].content, "and it says what the consumer wrote").toBe(drawing.source);
});

/**
 * Text slides by moving where it starts along its path, so whatever passes the end has to show again at the start.
 * It is drawn once per layer along the consumer's path traced twice, end to end, so it carries on along the second
 * lap rather than being handed to a second copy at a seam. What is read back is that each layer is one copy, and
 * that the path it follows is the same line on the page for its second half as for its first.
 */
test("on a path, each layer is drawn once along the path traced twice, so nothing slides off into a gap", async ({
    page,
}) => {
    await expect(page.locator(`${demo("circle")} ${PATH_SVG}`)).toBeVisible();

    const drawing = await readPathTexts(page, "circle");
    const layers = [...Map.groupBy(drawing.texts, (text) => text.paint).values()];

    expect(layers.length, "the text is painted at all").toBeGreaterThan(0);

    for (const copies of layers) expect(copies, "one copy per layer").toHaveLength(1);

    const laps = await page.locator(`${demo("circle")} ${PATH_SVG}`).evaluate((svg, href) => {
        const path = svg.querySelector(`defs > path${href}`) as SVGPathElement;
        const lapLength = path.getTotalLength() * 0.5;

        return [0.1, 0.35, 0.6, 0.85].map((share) => {
            const first = path.getPointAtLength(lapLength * share);
            const second = path.getPointAtLength(lapLength * (1 + share));

            return Math.hypot(first.x - second.x, first.y - second.y);
        });
    }, drawing.hrefs[0]);

    for (const gap of laps) expect(gap, "the second lap runs over the first").toBeLessThan(0.5);
});

test("the Pause button stops the text sliding along its path, and pressing it again starts it", async ({ page }) => {
    await expect(page.locator(`${demo("circle")} ${PATH_SVG}`)).toBeVisible();

    const toggle = page.locator(`${demo("circle")} #circlePlayback`);
    const wasSliding = await readIsSliding(page, "circle");

    await toggle.click();
    await expect.poll(() => readIsSliding(page, "circle"), "the press flipped it").toBe(!wasSliding);

    await toggle.click();
    await expect.poll(() => readIsSliding(page, "circle"), "and the second press flipped it back").toBe(wasSliding);
});

test("text fitted to its path is spaced to run the path's whole length once, and is not once unfitted", async ({
    page,
}) => {
    await expect(page.locator(`${demo("circle")} ${PATH_SVG}`)).toBeVisible();

    const fitted = await readPathTexts(page, "circle");

    for (const text of fitted.texts) {
        expect(Number(text.textLength), "the text is as long as one lap of the path").toBeCloseTo(
            fitted.pathLength * 0.5,
            1,
        );
    }

    await revealProp(page, "isFittedToPath", "circle");
    await page.locator(`${prop("isFittedToPath")} input`).uncheck();

    await expect
        .poll(async () => (await readPathTexts(page, "circle")).texts.every((text) => text.textLength === null))
        .toBe(true);
});

/**
 * The box a path text takes is the path's own box grown by how far its letters reach, so whichever way the letters
 * are turned and wherever they have slid to, every drawn copy stays inside the drawing. Read a few times while the
 * text slides, since a box sized to one moment would hold at that moment only.
 *
 * Each copy's box is the union of the letters it actually places. A letter slid past either end of the path is not
 * drawn, but Chrome still counts it into the `<text>`'s own `getBBox`, as a glyph standing at the drawing's origin —
 * so a copy wholly off the path would read as a box poking out of the top-left corner with nothing painted there.
 */
test("on a path, the drawing's box holds every letter wherever the text has slid to", async ({ page }) => {
    for (const key of ["circle", "wave"]) {
        await expect(page.locator(`${demo(key)} ${PATH_SVG}`)).toBeVisible();

        for (let sample = 0; sample < SAMPLE_COUNT; sample++) {
            const drawing = await readPathTexts(page, key);

            for (const text of drawing.texts.filter((copy) => copy.box.width > 0)) {
                expect(text.box.x, `${key}: inside on the left`).toBeGreaterThanOrEqual(
                    drawing.viewBox.x - PIXEL_SLACK,
                );
                expect(text.box.y, `${key}: inside at the top`).toBeGreaterThanOrEqual(drawing.viewBox.y - PIXEL_SLACK);
                expect(text.box.x + text.box.width, `${key}: inside on the right`).toBeLessThanOrEqual(
                    drawing.viewBox.x + drawing.viewBox.width + PIXEL_SLACK,
                );
                expect(text.box.y + text.box.height, `${key}: inside at the bottom`).toBeLessThanOrEqual(
                    drawing.viewBox.y + drawing.viewBox.height + PIXEL_SLACK,
                );
            }

            await page.waitForTimeout(SAMPLE_GAP_MS);
        }
    }
});

/**
 * A paint that loops forever with no delay has no start anybody can see, only a phase, so it runs on the page's
 * clock: it is written to begin at its drawing's time zero, and every drawing holding one has its clock set to the
 * page's. Two drawings of the same loop then show the same moment of it, and one put in the page later carries the
 * loop on rather than restarting it. Read here as each drawing's clock against the page's, at one instant.
 */
test("a paint that loops forever runs on the page's clock, whichever drawing it is in", async ({ page }) => {
    const readClocks = () =>
        page.evaluate(() => {
            const nowS = performance.now() / 1000;
            const loops = [...document.querySelectorAll("animate, animateTransform, animateMotion")].filter(
                (element) => element.getAttribute("repeatCount") === "indefinite",
            ) as SVGAnimationElement[];
            const outermost = (element: SVGElement) => {
                let svg = element.ownerSVGElement;

                while (svg?.ownerSVGElement) svg = svg.ownerSVGElement;

                return svg;
            };

            return {
                begins: [...new Set(loops.map((element) => element.getAttribute("begin")))],
                lagsS: [...new Set(loops.map(outermost))].map((svg) => Math.abs(svg!.getCurrentTime() - nowS)),
            };
        });

    await expect.poll(async () => (await readClocks()).lagsS.length, "the page paints some loop").toBeGreaterThan(0);

    const { begins, lagsS } = await readClocks();

    expect(begins, "every endless loop begins at its drawing's time zero").toEqual(["0s"]);

    for (const lagS of lagsS) expect(lagS, "and its drawing's clock reads the page's").toBeLessThan(0.1);
});
