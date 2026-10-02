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

test("a stroke alone leaves the letters hollow", async ({ page }) => {
    await pick(page, "Fill", "None");
    await pick(page, "Stroke", "Timed gradient");

    const fills = await page
        .locator(`${demo("heading")} ${LAYERS}`)
        .evaluateAll((layers) => layers.map((layer) => layer.getAttribute("fill")));

    expect(fills.length, "the stroke is drawn").toBeGreaterThan(0);
    expect(new Set(fills), "and nothing fills the letters").toEqual(new Set(["none"]));
});

test("no paint at all draws the text in its own color rather than not at all", async ({ page }) => {
    await pick(page, "Fill", "None");
    await pick(page, "Stroke", "None");

    const fills = await page
        .locator(`${demo("heading")} ${LAYERS}`)
        .evaluateAll((layers) => layers.map((layer) => layer.getAttribute("fill")));

    expect(fills).toEqual(["currentColor"]);
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
