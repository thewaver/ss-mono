import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * The layout is arithmetic over a tree, so the checks are relationships between placed nodes — a parent
 * against the two it feeds from, a layer against the next one — rather than pixel positions, which are the
 * page's node size and gaps rather than the component's behavior.
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

test("a node sits centered between the two it feeds from", async ({ page }) => {
    const final = await nodeNamed(page, "Final");
    const first = await nodeNamed(page, "Semi 1");
    const second = await nodeNamed(page, "Semi 2");

    expect(final.top, "the final is halfway between its semis, whatever the gaps are").toBeCloseTo(
        (first.top + second.top) * 0.5,
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

    expect(final.left, "the root is now centered across the board rather than along it").toBeCloseTo(
        (first.left + second.left) * 0.5,
        1,
    );
    expect(final.top, "and the layers run down the page").toBeGreaterThan(first.top);
});

test("a parent lands between the outermost of the nodes it holds, however many there are", async ({ page }) => {
    const founder = await nodeNamed(page, "Founder", CHART);
    const product = await nodeNamed(page, "Product", CHART);
    const finance = await nodeNamed(page, "Finance", CHART);

    expect(founder.top, "three under one node and one under another still centers the parent").toBeCloseTo(
        (product.top + finance.top) * 0.5,
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
 * The reason the connectors stop at the edges rather than running from center to center: a node's box hides
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

    expect(final.top, "and the parent is still centered on the pair it feeds from").toBeCloseTo(
        (first.top + second.top) * 0.5,
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

const NODE_FACE = `${BOARD} li [role="button"] > div`;
const OTHER_FACES = `${CHART} li [role="button"] > div, ${CHAIN} li [role="button"] > div`;
const ROUTE = ["Ada", "Quarter 1", "Semi 1", "Final"];

const faceClasses = (page: Page, selector = NODE_FACE) =>
    page.evaluate(
        (value) =>
            [...document.querySelectorAll(value)].map((face) => ({
                text: (face.textContent ?? "").trim(),
                className: face.className,
            })),
        selector,
    );

/**
 * Each connector is matched to the node it runs from by the point where it arrives: the gradient a sample
 * painter draws runs from the parent's facing edge to the child's, so its far end sits on the child's box.
 * What is read back is the paint a connector was given — its width and its two stop colors — as one opaque
 * signature, so the check is that the route's connectors share one and differ from the rest, and never what
 * either one is.
 */
const connectorPaints = (page: Page) =>
    page.evaluate((value) => {
        const board = document.querySelector(`${value} svg`)!.parentElement!;
        const boxes = [...board.querySelectorAll("li")].map((item) => ({
            text: (item.textContent ?? "").trim(),
            left: Number.parseFloat(item.style.left),
            top: Number.parseFloat(item.style.top),
            width: Number.parseFloat(item.style.width),
            height: Number.parseFloat(item.style.height),
        }));
        const slack = 1;

        return [...board.querySelectorAll("svg > g")].map((group) => {
            const gradient = group.querySelector("linearGradient")!;
            const x = Number(gradient.getAttribute("x2"));
            const y = Number(gradient.getAttribute("y2"));
            const child = boxes.find(
                (box) =>
                    x >= box.left - slack &&
                    x <= box.left + box.width + slack &&
                    y >= box.top - slack &&
                    y <= box.top + box.height + slack,
            );

            return {
                child: child?.text ?? "",
                paint: [
                    group.querySelector("path")?.getAttribute("stroke-width"),
                    ...[...gradient.querySelectorAll("stop")].map((stop) => stop.getAttribute("style")),
                ].join("|"),
            };
        });
    }, BOARD);

const changedFaces = (before: Array<{ text: string; className: string }>, after: typeof before) =>
    after.filter((face, index) => face.className !== before[index].className).map((face) => face.text);

/**
 * The route is the focused node and every node between it and the root, marked for as long as the board holds
 * focus. "Marked" is read as a relationship: the faces whose classes changed are exactly the route, and they
 * gained a class in common that no other face carries. Which class that is, and what it draws, is the page's.
 */
test("focusing a node marks it and every node up to the root, and nothing else", async ({ page }) => {
    const resting = await faceClasses(page);
    const restingOthers = await faceClasses(page, OTHER_FACES);

    await page.locator(`${NODE} [role="button"]`, { hasText: /^Ada$/ }).click();

    const lit = await faceClasses(page);

    expect(changedFaces(resting, lit).sort(), "the faces that changed are the route and only the route").toEqual(
        [...ROUTE].sort(),
    );

    const gained = (text: string) => {
        const before = new Set(resting.find((face) => face.text === text)!.className.split(/\s+/));

        return lit
            .find((face) => face.text === text)!
            .className.split(/\s+/)
            .filter((name) => name && !before.has(name));
    };

    const shared = ROUTE.map(gained).reduce((common, names) => common.filter((name) => names.includes(name)));

    expect(shared.length, "every node on the route gained the same mark").toBeGreaterThan(0);
    expect(
        lit.filter((face) => !ROUTE.includes(face.text)).some((face) => face.className.includes(shared[0])),
        "and no node off the route carries it",
    ).toBe(false);
    expect(await faceClasses(page, OTHER_FACES), "the other boards on the page are untouched").toEqual(restingOthers);
});

test("the connectors on the route are drawn apart from the rest, and only those", async ({ page }) => {
    const resting = await connectorPaints(page);

    expect(
        new Set(resting.map((connector) => connector.paint)).size,
        "with nothing focused every connector is alike",
    ).toBe(1);

    await page.locator(`${NODE} [role="button"]`, { hasText: /^Ada$/ }).click();

    const lit = await connectorPaints(page);
    const onRoute = lit.filter((connector) => ROUTE.includes(connector.child));
    const offRoute = lit.filter((connector) => !ROUTE.includes(connector.child));

    expect(
        onRoute.map((connector) => connector.child).sort(),
        "one connector for each node on the route except the root, which feeds nothing",
    ).toEqual(ROUTE.filter((name) => name !== "Final").sort());
    expect(new Set(onRoute.map((connector) => connector.paint)).size, "the route's connectors share one look").toBe(1);
    expect(new Set(offRoute.map((connector) => connector.paint)).size, "and the rest share another").toBe(1);
    expect(onRoute[0].paint, "and the two differ").not.toBe(offRoute[0].paint);
    expect(offRoute[0].paint, "the connectors off the route kept the look they had at rest").toBe(resting[0].paint);
});

/**
 * The route means "holds focus", so it goes when focus goes and comes back when the board is tabbed into.
 * Tab sets nothing on the board itself, which is why the second half is worth pinning: a route that followed
 * the last click rather than focus would light on the click, stay lit after it, and stay dark on Tab.
 */
test("clicking away clears the route, and tabbing back in brings it back", async ({ page }) => {
    const resting = await faceClasses(page);

    await page.locator(`${NODE} [role="button"]`, { hasText: /^Ada$/ }).click();

    const lit = await faceClasses(page);

    await page.locator(`${BOARD} [data-readout]`).click();

    await expect.poll(() => faceClasses(page), { message: "with focus gone no node is marked" }).toEqual(resting);
    expect(new Set((await connectorPaints(page)).map((connector) => connector.paint)).size, "and no connector").toBe(1);

    await page.locator(`${BOARD} button`).first().focus();
    await page.keyboard.press("Tab");

    expect(
        await page.evaluate(() => (document.activeElement?.textContent ?? "").trim()),
        "Tab returns to the node that last held focus",
    ).toBe("Ada");
    await expect
        .poll(() => faceClasses(page), { message: "and the board reports the focus, so the same route lights" })
        .toEqual(lit);
});

/**
 * With headers, each layer is its own list named by its header, so a reader hears where one round ends. The
 * name is checked against the header's own text through `aria-labelledby` rather than against any wording, and
 * the counts are the draw's shape: every node feeds two, so each round holds twice the one after it.
 */
test("round headers make one list per round, each named by its header", async ({ page }) => {
    await expect(page.locator(`${BOARD} [role="group"]`), "the board becomes one named group").toHaveAccessibleName(
        /.+/,
    );

    const lists = page.locator(`${BOARD} ul`);
    const count = await lists.count();

    expect(count, "one list per layer, root to leaves").toBe(4);

    for (let layer = 0; layer < count; layer++) {
        const list = lists.nth(layer);
        const headerId = await list.getAttribute("aria-labelledby");

        expect(headerId, `layer ${layer} is labelled by something`).toBeTruthy();

        const header = page.locator(`[id="${headerId}"]`);
        const headerText = ((await header.textContent()) ?? "").trim();

        expect(headerText, `and that something is a header with text in it`).not.toBe("");
        await expect(list, "the list takes its header's text as its name").toHaveAccessibleName(headerText);
        await expect(list.locator("li"), "and holds that layer's nodes").toHaveCount(2 ** layer);
    }

    await expect(page.locator(`${CHART} [role="group"]`), "a board without headers is not split").toHaveCount(0);
    await expect(page.locator(`${CHART} ul`), "and keeps its single list").toHaveCount(1);
    await expect(page.locator(`${CHART} ul`), "named by the board's label").toHaveAccessibleName(/.+/);
});

test("each header is one layer long and sits in its layer, whichever way the board runs", async ({ page }) => {
    const alignment = () =>
        page.evaluate((value) => {
            const read = (element: HTMLElement) => ({
                left: Number.parseFloat(element.style.left),
                top: Number.parseFloat(element.style.top),
                width: Number.parseFloat(element.style.width),
                height: Number.parseFloat(element.style.height),
            });

            return [...document.querySelectorAll(`${value} ul[aria-labelledby]`)].map((list) => ({
                header: read(document.getElementById(list.getAttribute("aria-labelledby")!)!),
                nodes: [...list.querySelectorAll("li")].map((item) => read(item as HTMLElement)),
            }));
        }, BOARD);

    for (const { header, nodes } of await alignment()) {
        for (const node of nodes) {
            expect(header.left, "across the page, a header shares its layer's column").toBeCloseTo(node.left, 1);
            expect(header.width, "and is as wide as a node").toBeCloseTo(node.width, 1);
            expect(header.top + header.height, "along the top, clear of the nodes").toBeLessThanOrEqual(node.top + 0.5);
        }
    }

    await pick(page, "orientation", "vertical");

    for (const { header, nodes } of await alignment()) {
        for (const node of nodes) {
            expect(header.top, "down the page, a header shares its layer's row").toBeCloseTo(node.top, 1);
            expect(header.height, "and is as tall as a node").toBeCloseTo(node.height, 1);
            expect(header.left + header.width, "down the left, clear of the nodes").toBeLessThanOrEqual(
                node.left + 0.5,
            );
        }
    }
});

/**
 * `onActivate` hands over the node's placement beside its value, because a winner's value repeats in every
 * round it advances through and the value alone cannot say which of those was picked. The page's readout
 * reports the placement's id and layer, and that is what is read back: the layer against the list the node sits
 * in, and two nodes against each other.
 */
test("activating a node reports where it is, not only what it holds", async ({ page }) => {
    const reported = async () => {
        const match = /node (\S+) in layer (\d+)/.exec(await readout(page, "knockout"));

        return match ? { id: match[1], layer: Number(match[2]) } : undefined;
    };

    const lists = page.locator(`${BOARD} ul`);
    const seen = new Set<string>();

    for (let layer = 0; layer < (await lists.count()); layer++) {
        await lists.nth(layer).locator('li [role="button"]').first().click();

        const placement = await reported();

        expect(placement, "the page was told the placement").toBeDefined();
        expect(placement!.layer, "counted from the root, so it matches the round the node sits in").toBe(layer);

        seen.add(placement!.id);
    }

    await page.locator(`${BOARD} li [role="button"]`, { hasText: /^Ada$/ }).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    const byKey = await reported();

    expect(byKey, "Enter reports a placement too").toBeDefined();
    expect(seen.has(byKey!.id), "and a different node reports a different id").toBe(false);
});
