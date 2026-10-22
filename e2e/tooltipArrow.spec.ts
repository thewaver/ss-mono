import { type Page, expect, test } from "@playwright/test";

import { demo, prop, revealProp } from "./helpers";

/**
 * The Tooltip page's Arrow setting draws the tooltip body with `Shape` and grows an arrow out of it with
 * `ShapeUtils.attachArrow`, aimed by `AnchorUtils.computeArrowAim`. Everything here is measured off the painted
 * contour itself — the `d` of the body's path — in the body's own pixels, which is the space the path is written
 * in and so needs no correction for the `Viewport` scale. The anchor is brought into that space once.
 *
 * Nothing is compared with a number written down here: the tip is checked against the side it should leave,
 * against the anchor it should line up with, and against the two size settings that were typed in.
 */
const ANCHOR = `${demo("default")} button`;
const TOOLTIP = '[role="tooltip"]';
const SETTLE_MS = 600;
const TOLERANCE_PX = 0.5;

type ArrowReading = {
    vertices: { x: number; y: number }[];
    size: { width: number; height: number };
    anchorMiddle: { x: number; y: number };
};

/**
 * Waits for the list to go before the next pick: a list that is still fading out holds options of the same names as
 * the next one, which is how two "center" options came to match at once in the Vue Playground.
 */
const pick = async (page: Page, key: string, name: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.getByRole("option", { name, exact: true }).click();
    await expect(page.getByRole("listbox")).toHaveCount(0);
};

const type = async (page: Page, key: string, value: number) => {
    await page.locator(`${prop(key)} input`).fill(String(value));
    await page.locator(`${prop(key)} input`).blur();
};

/** Hovers the anchor afresh and reads the body's contour once the tooltip has settled. */
const readArrow = async (page: Page): Promise<ArrowReading> => {
    await page.mouse.move(0, 0);
    await expect(page.locator(TOOLTIP)).toHaveCount(0);
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    return page.evaluate(
        ({ anchorSelector, tooltipSelector }) => {
            const tooltip = document.querySelector<HTMLElement>(tooltipSelector)!;
            const svg = tooltip.querySelector("svg")!;
            const path = svg.querySelector("path")!;
            const svgRect = svg.getBoundingClientRect();
            const scale = svgRect.width / Number(svg.getAttribute("width"));
            const anchorRect = document.querySelector(anchorSelector)!.getBoundingClientRect();
            const numbers = (path.getAttribute("d") ?? "").match(/-?\d+(\.\d+)?/g)!.map(Number);
            const vertices = [];

            for (let i = 0; i + 1 < numbers.length; i += 2) vertices.push({ x: numbers[i], y: numbers[i + 1] });

            return {
                vertices,
                size: { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
                anchorMiddle: {
                    x: (anchorRect.left + anchorRect.width * 0.5 - svgRect.left) / scale,
                    y: (anchorRect.top + anchorRect.height * 0.5 - svgRect.top) / scale,
                },
            };
        },
        { anchorSelector: ANCHOR, tooltipSelector: TOOLTIP },
    );
};

/** How far a point lies outside the body's box, `0` for a point inside it. */
const outside = (point: { x: number; y: number }, size: ArrowReading["size"]) =>
    Math.max(0, -point.x, point.x - size.width, -point.y, point.y - size.height);

/** The contour point standing furthest off the body, which is the tip whenever an arrow is drawn. */
const findTip = ({ vertices, size }: ArrowReading) =>
    vertices.reduce((best, vertex) => (outside(vertex, size) > outside(best, size) ? vertex : best));

test.beforeEach(async ({ page }) => {
    await page.goto("/tooltip");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("with no arrow picked, nothing is painted outside the tooltip's box", async ({ page }) => {
    const reading = await readArrow(page);

    expect(outside(findTip(reading), reading.size), "the contour stays on the box").toBeLessThan(TOLERANCE_PX);
    await expect(page.locator(prop("arrowWidth")), "the size settings wait for an arrow").toHaveCount(0);
});

test("above the anchor, the arrow leaves the bottom edge lined up with the anchor's middle", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await pick(page, "hPlacement", "center");
    await pick(page, "vPlacement", "top_out");

    const reading = await readArrow(page);
    const tip = findTip(reading);

    expect(tip.y, "below the body, towards the anchor").toBeGreaterThan(reading.size.height);
    expect(Math.abs(tip.x - reading.anchorMiddle.x), "lined up with the anchor").toBeLessThan(TOLERANCE_PX);
});

test("below the anchor, it leaves the top edge, still lined up", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await pick(page, "hPlacement", "left_in");
    await pick(page, "vPlacement", "bottom_out");

    const reading = await readArrow(page);
    const tip = findTip(reading);

    expect(tip.y, "above the body, towards the anchor").toBeLessThan(0);
    expect(Math.abs(tip.x - reading.anchorMiddle.x), "lined up with the anchor").toBeLessThan(TOLERANCE_PX);
});

test("beside the anchor, it leaves the facing side, lined up down the anchor", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await pick(page, "hPlacement", "right_out");
    await pick(page, "vPlacement", "center");

    const reading = await readArrow(page);
    const tip = findTip(reading);

    expect(tip.x, "left of the body, towards the anchor").toBeLessThan(0);
    expect(Math.abs(tip.y - reading.anchorMiddle.y), "lined up with the anchor").toBeLessThan(TOLERANCE_PX);
});

/**
 * The triangle is typed in rather than left at the page's default, so this does not depend on what the page starts
 * on. Out of a corner along the diagonal, a side leaning 45° or more from the arrow's middle line runs parallel to,
 * or away from, the edge it is extended towards and never meets it (`backlog.md`, _"A wide arrow vanishes at a corner"_). What this checks is the
 * direction.
 */
test("off a corner of the anchor, it leaves the nearest corner along that corner's diagonal", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await type(page, "arrowWidth", 12);
    await type(page, "arrowLength", 12);
    await pick(page, "hPlacement", "left_out");
    await pick(page, "vPlacement", "bottom_out");

    const reading = await readArrow(page);
    const tip = findTip(reading);
    const { width, height } = reading.size;
    const across = Math.max(-tip.x, tip.x - width);
    const down = Math.max(-tip.y, tip.y - height);

    expect(across, "past a side edge").toBeGreaterThan(0);
    expect(down, "and past a top or bottom edge, so out of a corner").toBeGreaterThan(0);
    expect(Math.abs(across - down), "by as much across as down, which is the diagonal").toBeLessThan(TOLERANCE_PX);
    expect(
        Math.sign(tip.x - width * 0.5) === Math.sign(reading.anchorMiddle.x - width * 0.5) &&
            Math.sign(tip.y - height * 0.5) === Math.sign(reading.anchorMiddle.y - height * 0.5),
        "the corner it leaves is the one facing the anchor, wherever a fallback put the tooltip",
    ).toBe(true);
});

test("overlapping its anchor, the tooltip has nothing to point at and draws no arrow", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await pick(page, "hPlacement", "left_in");
    await pick(page, "vPlacement", "bottom_in");

    const reading = await readArrow(page);

    expect(outside(findTip(reading), reading.size), "the contour stays on the box").toBeLessThan(TOLERANCE_PX);
});

test("the tip stands off by the length typed in, and the base is as wide as the width", async ({ page }) => {
    await pick(page, "arrow", "Triangle");
    await pick(page, "hPlacement", "center");
    await pick(page, "vPlacement", "top_out");

    for (const [width, length] of [
        [12, 6],
        [24, 14],
    ]) {
        await type(page, "arrowWidth", width);
        await type(page, "arrowLength", length);

        const reading = await readArrow(page);
        const tip = findTip(reading);
        const base = reading.vertices.filter((vertex) => Math.abs(vertex.y - reading.size.height) < TOLERANCE_PX);
        const left = Math.max(...base.filter((vertex) => vertex.x < tip.x).map((vertex) => vertex.x));
        const right = Math.min(...base.filter((vertex) => vertex.x > tip.x).map((vertex) => vertex.x));

        expect(Math.abs(tip.y - reading.size.height - length), `stands off by ${length}`).toBeLessThan(TOLERANCE_PX);
        expect(Math.abs(right - left - width), `spans ${width} at the base`).toBeLessThan(TOLERANCE_PX);
    }
});

test("the lightning bolt keeps its lean: its tip on the anchor, its base wholly to one side", async ({ page }) => {
    await pick(page, "arrow", "Lightning bolt");
    await pick(page, "hPlacement", "center");
    await pick(page, "vPlacement", "top_out");

    const reading = await readArrow(page);
    const tip = findTip(reading);
    const base = reading.vertices.filter((vertex) => Math.abs(vertex.y - reading.size.height) < TOLERANCE_PX);
    const nearest = [...base].sort((a, b) => Math.abs(a.x - tip.x) - Math.abs(b.x - tip.x)).slice(0, 2);

    expect(tip.y, "below the body").toBeGreaterThan(reading.size.height);
    expect(Math.abs(tip.x - reading.anchorMiddle.x), "tip lined up with the anchor").toBeLessThan(TOLERANCE_PX);
    expect(
        nearest.every((vertex) => vertex.x < tip.x),
        "both base corners on the same side of the tip",
    ).toBe(true);
});

/**
 * "Every arrow at once" draws eight tooltips round one anchor, one per side and corner, with their own knobs. The
 * corner ones are what the joining rule used to get wrong: their arrows spread down both edges as long slivers, and one
 * at least twice as wide as it is long vanished. With the sharp box picked the painted contour is straight lines only,
 * so every number pair in the path is a corner of it, and each corner tooltip is read in its own pixels.
 */
const ARROW_BED = demo("arrows");

const readArrowBed = (page: Page) =>
    page.locator(`${ARROW_BED} svg`).evaluateAll((svgs) =>
        svgs.map((svg) => {
            const numbers = (svg.querySelector("path")?.getAttribute("d") ?? "").match(/-?\d+(\.\d+)?/g) ?? [];
            const vertices = [];

            for (let i = 0; i + 1 < numbers.length; i += 2) {
                vertices.push({ x: Number(numbers[i]), y: Number(numbers[i + 1]) });
            }

            return {
                vertices,
                size: { width: Number(svg.getAttribute("width")), height: Number(svg.getAttribute("height")) },
            };
        }),
    );

test("a corner arrow is drawn however wide it is, and its base starts half its width down each edge", async ({
    page,
}) => {
    const width = 30;
    const length = 10;

    await revealProp(page, "arrowBedShape", "arrows");
    await pick(page, "arrowBedShape", "box");
    await type(page, "arrowBedWidth", width);
    await type(page, "arrowBedLength", length);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(SETTLE_MS);

    const readings = await readArrowBed(page);
    const corners = readings.filter((reading) => {
        const tip = findTip(reading as ArrowReading);

        return Math.max(-tip.x, tip.x - reading.size.width) > 0 && Math.max(-tip.y, tip.y - reading.size.height) > 0;
    });

    expect(corners, "all four corner tooltips draw an arrow, three times as wide as it is long").toHaveLength(4);

    for (const reading of corners) {
        const tip = findTip(reading as ArrowReading);
        const corner = {
            x: tip.x > reading.size.width * 0.5 ? reading.size.width : 0,
            y: tip.y > reading.size.height * 0.5 ? reading.size.height : 0,
        };
        const base = reading.vertices.filter(
            (vertex) =>
                Math.abs(vertex.x - corner.x) < TOLERANCE_PX !== Math.abs(vertex.y - corner.y) < TOLERANCE_PX &&
                Math.hypot(vertex.x - corner.x, vertex.y - corner.y) <
                    Math.min(reading.size.width, reading.size.height),
        );

        expect(base, "one base point on each edge beside the corner").toHaveLength(2);

        for (const vertex of base) {
            expect(
                Math.abs(Math.hypot(vertex.x - corner.x, vertex.y - corner.y) - width * 0.5),
                "half the arrow's width from the corner, rather than spread down the edge",
            ).toBeLessThan(TOLERANCE_PX);
        }
    }
});

/**
 * "An arrow going round" aims one tooltip's arrow at a point that travels round its outline as the slider moves, so
 * every position — the middle of each side, each corner, and everywhere between — can be reached. Wherever the slider
 * is, an arrow is drawn, and it leaves on the side the slider's angle faces.
 */
const CIRCLING = demo("circling");

test("the arrow going round is drawn at every position, on the side its angle faces", async ({ page }) => {
    const slider = page.locator(`${CIRCLING} input[type="range"]`);

    for (const degrees of [0, 26, 45, 90, 153, 180, 207, 270, 333]) {
        await slider.fill(String(degrees));
        await expect(page.locator(`${CIRCLING} svg`)).toHaveCount(1);
        await page.waitForTimeout(100);

        const [reading] = await page.locator(`${CIRCLING} svg`).evaluateAll((svgs) =>
            svgs.map((svg) => {
                const numbers = (svg.querySelector("path")?.getAttribute("d") ?? "").match(/-?\d+(\.\d+)?/g) ?? [];
                const vertices = [];

                for (let i = 0; i + 1 < numbers.length; i += 2) {
                    vertices.push({ x: Number(numbers[i]), y: Number(numbers[i + 1]) });
                }

                return {
                    vertices,
                    size: { width: Number(svg.getAttribute("width")), height: Number(svg.getAttribute("height")) },
                };
            }),
        );
        const tip = findTip(reading as ArrowReading);
        const radians = (degrees * Math.PI) / 180;

        expect(outside(tip, reading.size), `an arrow is drawn at ${degrees}°`).toBeGreaterThan(TOLERANCE_PX);

        for (const [offset, along] of [
            [tip.x - reading.size.width * 0.5, Math.cos(radians)],
            [tip.y - reading.size.height * 0.5, Math.sin(radians)],
        ]) {
            if (Math.abs(along) > 0.2) {
                expect(Math.sign(offset), `and it leaves on the side ${degrees}° faces`).toBe(Math.sign(along));
            }
        }
    }
});
