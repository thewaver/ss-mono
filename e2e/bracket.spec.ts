import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * The layout is arithmetic over a tree, so the checks are relationships between placed nodes — a parent
 * against the two it feeds from, a layer against the next one — rather than pixel positions, which are the
 * page's node size and gaps rather than the component's behaviour.
 *
 * Every node is one item of a list, and the connectors are one drawing laid over the lot with nothing in it
 * for a screen reader, which is why the counts below read the list and not the picture.
 */
const BOARD = example("knockout");
const CHART = example("orgChart");
const CHAIN = example("skillTree");
const CONNECTOR_SAMPLES = ["flat", "rounded", "curved", "ballAndArrow"];
const NODE = `${BOARD} li`;
const CONNECTOR = `${BOARD} svg path`;

const SETTLE_MS = 150;

const pick = async (page: Page, key: string, option: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: option }).first().click();
    await page.waitForTimeout(SETTLE_MS);
};

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(`${prop(key)} input`).fill(value);
    await page.locator(`${prop(key)} input`).blur();
    await page.waitForTimeout(SETTLE_MS);
};

const readNodes = (page: Page, scope = BOARD) =>
    page.evaluate((value) => {
        const items = [...document.querySelectorAll(`${value} li`)] as HTMLElement[];

        return items.map((item) => ({
            text: (item.textContent ?? "").trim(),
            left: Number.parseFloat(item.style.left),
            top: Number.parseFloat(item.style.top),
        }));
    }, scope);

const nodeNamed = async (page: Page, text: string, scope = BOARD) =>
    (await readNodes(page, scope)).find((node) => node.text === text)!;

test.beforeEach(async ({ page }) => {
    await page.goto("/bracket");
    await expect(page.locator(NODE).first()).toBeVisible();
});

test("a node sits centred between the two it feeds from", async ({ page }) => {
    const final = await nodeNamed(page, "Final");
    const first = await nodeNamed(page, "Semi 1");
    const second = await nodeNamed(page, "Semi 2");

    expect(final.top, "the final is halfway between its semis, whatever the gaps are").toBeCloseTo(
        (first.top + second.top) / 2,
        1,
    );
});

test("a layer is one step across from the next, and the root is on the side it was told", async ({ page }) => {
    const final = await nodeNamed(page, "Final");
    const semi = await nodeNamed(page, "Semi 1");
    const quarter = await nodeNamed(page, "Quarter 1");

    expect(final.left, "the root is furthest along when it is at the end").toBeGreaterThan(semi.left);
    expect(semi.left, "and every layer is the same step from the next").toBeGreaterThan(quarter.left);
    expect(final.left - semi.left, "the same step").toBeCloseTo(semi.left - quarter.left, 1);

    await pick(page, "rootSide", "start");

    expect((await nodeNamed(page, "Final")).left, "and putting the root first turns the board round").toBeLessThan(
        (await nodeNamed(page, "Semi 1")).left,
    );
});

test("turning the board upright swaps the axes without changing the tree", async ({ page }) => {
    const across = await readNodes(page);

    await pick(page, "orientation", "vertical");

    const down = await readNodes(page);

    expect(down.length, "the same nodes are on the board").toBe(across.length);

    const final = await nodeNamed(page, "Final");
    const first = await nodeNamed(page, "Semi 1");
    const second = await nodeNamed(page, "Semi 2");

    expect(final.left, "the root is now centred across the board rather than along it").toBeCloseTo(
        (first.left + second.left) / 2,
        1,
    );
    expect(final.top, "and the layers run down the page").toBeGreaterThan(first.top);
});

test("a parent lands between the outermost of the nodes it holds, however many there are", async ({ page }) => {
    const founder = await nodeNamed(page, "Founder", CHART);
    const product = await nodeNamed(page, "Product", CHART);
    const finance = await nodeNamed(page, "Finance", CHART);

    expect(founder.top, "three under one node and one under another still centres the parent").toBeCloseTo(
        (product.top + finance.top) / 2,
        1,
    );
});

test("a chain of single children sits level all the way down", async ({ page }) => {
    const adept = await nodeNamed(page, "Ember", CHAIN);
    const only = await nodeNamed(page, "Spark", CHAIN);

    expect(adept.top, "a node with one child is level with it, which is what a bye looks like").toBeCloseTo(
        only.top,
        1,
    );
});

test("there is one connector for every node that feeds another", async ({ page }) => {
    const nodes = await readNodes(page);

    expect(await page.locator(CONNECTOR).count(), "every node but the root is joined to what it feeds").toBe(
        nodes.length - 1,
    );
});

/**
 * The reason the connectors stop at the edges rather than running from centre to centre: a node's box hides
 * whatever is under it only while it is fully opaque, so a line crossing a half-faded node shows through it.
 * This walks every point of every path against every node's rectangle.
 */
test("no connector passes under a node, whichever way the consumer draws them", async ({ page }) => {
    for (const sample of CONNECTOR_SAMPLES) {
        if (sample !== CONNECTOR_SAMPLES[0]) await pick(page, "connector", sample);

        for (const scope of [BOARD, CHART, CHAIN]) {
            const crossings = await page.evaluate((value) => {
                const board = document.querySelector(`${value} svg`)!.parentElement!;
                const origin = board.getBoundingClientRect();
                const boxes = [...board.querySelectorAll("li")].map((item) => {
                    const rect = item.getBoundingClientRect();

                    return {
                        text: (item.textContent ?? "").trim(),
                        left: rect.left - origin.left,
                        top: rect.top - origin.top,
                        right: rect.right - origin.left,
                        bottom: rect.bottom - origin.top,
                    };
                });

                const inset = 1;

                return [...board.querySelectorAll("svg path")].flatMap((path) => {
                    const points = (path.getAttribute("d") ?? "")
                        .split(/[ML]/)
                        .map((part) => part.trim())
                        .filter(Boolean)
                        .map((part) => part.split(/\s+/).map(Number));

                    return points.flatMap(([x, y]) =>
                        boxes
                            .filter(
                                (box) =>
                                    x > box.left + inset &&
                                    x < box.right - inset &&
                                    y > box.top + inset &&
                                    y < box.bottom - inset,
                            )
                            .map((box) => `${box.text} at ${Math.round(x)},${Math.round(y)}`),
                    );
                });
            }, scope);

            expect(crossings, `no path point is inside a node on ${scope} drawn as ${sample}`).toEqual([]);
        }
    }
});

test("the consumer decides what a connector is, and the component only says where it goes", async ({ page }) => {
    const drawn = () =>
        page.evaluate((value) => {
            const svg = document.querySelector(`${value} svg`)!;

            return {
                circles: svg.querySelectorAll("circle").length,
                polygons: svg.querySelectorAll("polygon").length,
                curved: [...svg.querySelectorAll("path")].some((path) => /[QC]/.test(path.getAttribute("d") ?? "")),
            };
        }, BOARD);

    const flat = await drawn();

    expect(flat, "the plain sample is corners and nothing else").toEqual({
        circles: 0,
        polygons: 0,
        curved: false,
    });

    await pick(page, "connector", "rounded");
    expect((await drawn()).curved, "the rounded one takes the corners off").toBe(true);

    await pick(page, "connector", "ballAndArrow");

    const decorated = await drawn();

    expect(decorated.circles, "and a sample can put something at the end the component never drew").toBeGreaterThan(0);
    expect(decorated.polygons, "at either end").toBeGreaterThan(0);
});

test("widening the row gap moves the leaves apart and takes their parents with them", async ({ page }) => {
    const before = await readNodes(page);
    const beforeSpread = Math.max(...before.map((node) => node.top)) - Math.min(...before.map((node) => node.top));

    await setField(page, "crossGap", "40");

    const after = await readNodes(page);
    const afterSpread = Math.max(...after.map((node) => node.top)) - Math.min(...after.map((node) => node.top));

    expect(afterSpread, "the board grows down the page").toBeGreaterThan(beforeSpread);

    const final = await nodeNamed(page, "Final");
    const first = await nodeNamed(page, "Semi 1");
    const second = await nodeNamed(page, "Semi 2");

    expect(final.top, "and the parent is still centred on the pair it feeds from").toBeCloseTo(
        (first.top + second.top) / 2,
        1,
    );
});

test("the board is one tab stop, and the arrows walk a layer and step between layers", async ({ page }) => {
    await page.locator(`${BOARD} button`).first().focus();
    await page.keyboard.press("Tab");

    const entered = await page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

    expect(entered, "focus lands on a node rather than passing the board by").not.toBe("");

    await page.keyboard.press("ArrowLeft");

    const inward = await page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

    expect(inward, "left steps away from the root, into the layer that feeds it").not.toBe(entered);

    await page.keyboard.press("ArrowDown");

    const moved = await page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

    expect(moved, "down moves within that layer").not.toBe(inward);

    await page.keyboard.press("ArrowRight");

    const back = await page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

    expect(back, "and right steps back to what this one feeds").toBe(entered);
});

test("a node that cannot be picked is not one of the stops", async ({ page }) => {
    await page.locator(`${BOARD} button`).first().focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("End");

    const last = await page.evaluate(() => (document.activeElement?.textContent ?? "").trim());

    expect(last, "the end of the deepest layer is the seed after the withdrawn one").not.toBe("Withdrawn");
});

test("picking a node reports the value it was given, not the text on it", async ({ page }) => {
    await page.locator(`${NODE} [role="button"]`).first().click();

    expect(await readout(page, "knockout"), "the page was told which node it was").not.toContain("nothing picked");
});
