import { type Locator, type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * Corner Pin warps its content so that its four corners sit on four grips the person can move. Every grip carries two
 * visually hidden range inputs, one per axis, whose values are the corner's place as a fraction of the box, so the
 * inputs are what these specs read: they are the keyboard's way in and also the honest report of where a corner is.
 * Nothing here pins a coordinate, a color or a size. What is compared is where the pointer went against where the
 * corner says it is, and where the drawn content ended up against where the corner says it is.
 */
const CARD = demo("card");
const ROOT = `${CARD} [role="group"][aria-roledescription="corner pin"]`;

const NAMES = {
    top_left: "Top left corner",
    top_right: "Top right corner",
    bottom_right: "Bottom right corner",
    bottom_left: "Bottom left corner",
};

type Corner = keyof typeof NAMES;
type Point = { x: number; y: number };

const ORDER: Corner[] = ["top_left", "top_right", "bottom_right", "bottom_left"];

const axisInput = (page: Page, corner: Corner, axis: "across" | "down") =>
    page.locator(`${ROOT} input[type="range"][aria-label="${NAMES[corner]}, ${axis}"]`);

const gripOf = (page: Page, corner: Corner) => axisInput(page, corner, "across").locator("xpath=..");

const pointOf = async (page: Page, corner: Corner): Promise<Point> => ({
    x: Number(await axisInput(page, corner, "across").inputValue()),
    y: Number(await axisInput(page, corner, "down").inputValue()),
});

const cornersOf = async (page: Page) => {
    const points: Record<string, Point> = {};

    for (const corner of ORDER) points[corner] = await pointOf(page, corner);

    return points as Record<Corner, Point>;
};

const centerOf = async (locator: Locator) => {
    const box = (await locator.boundingBox())!;

    return { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
};

const rootBox = async (page: Page) => (await page.locator(ROOT).boundingBox())!;

const atFraction = async (page: Page, fraction: Point) => {
    const box = await rootBox(page);

    return { x: box.x + box.width * fraction.x, y: box.y + box.height * fraction.y };
};

const dragGrip = async (page: Page, corner: Corner, to: Point) => {
    const from = await centerOf(gripOf(page, corner));

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 8 });
    await page.mouse.up();
};

/**
 * Where the drawn content's own top-left corner ends up, as a fraction of the box. The surface turns about its own
 * top-left, so applying its computed matrix to `(0, 0)` and dividing by the perspective term is where that corner is
 * drawn. A fraction cancels the Playground's scaling, which a pixel would not.
 */
const surfaceTopLeft = (page: Page) =>
    page.locator(ROOT).evaluate((root) => {
        const surface = root.firstElementChild as HTMLElement;
        const matrix = new DOMMatrix(getComputedStyle(surface).transform);
        const mapped = matrix.transformPoint(new DOMPoint(0, 0, 0, 1));

        const box = root as HTMLElement;

        return { x: mapped.x / mapped.w / box.offsetWidth, y: mapped.y / mapped.w / box.offsetHeight };
    });

const gripFractionOf = async (page: Page, corner: Corner) => {
    const box = await rootBox(page);
    const center = await centerOf(gripOf(page, corner));

    return { x: (center.x - box.x) / box.width, y: (center.y - box.y) / box.height };
};

const expectNear = (actual: Point, expected: Point, tolerance: number, message: string) => {
    expect(Math.abs(actual.x - expected.x), `${message} (across)`).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(actual.y - expected.y), `${message} (down)`).toBeLessThanOrEqual(tolerance);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/corner-pin");
    await expect(page.locator(ROOT)).toBeVisible();
    await page.locator(ROOT).scrollIntoViewIfNeeded();
});

test("dragging a grip takes its corner to the pointer, and the content follows", async ({ page }) => {
    const target = { x: 0.2, y: 0.15 };

    await dragGrip(page, "top_left", await atFraction(page, target));

    expectNear(await pointOf(page, "top_left"), target, 0.02, "the corner is where the pointer went");

    const box = await rootBox(page);
    const drawn = await surfaceTopLeft(page);
    const grip = await gripFractionOf(page, "top_left");
    const pixels = Math.hypot((drawn.x - grip.x) * box.width, (drawn.y - grip.y) * box.height);

    expect(pixels, "the content's own corner is drawn under the grip").toBeLessThanOrEqual(2);
});

/**
 * A press that never moves is a tap: it picks the grip up instead of dragging it, and the next press anywhere in the
 * box is where the corner goes.
 */
test("tapping a grip and then a point puts the corner there", async ({ page }) => {
    const target = { x: 0.3, y: 0.4 };
    const grip = await centerOf(gripOf(page, "top_left"));

    await page.mouse.click(grip.x, grip.y);

    const where = await atFraction(page, target);

    await page.mouse.click(where.x, where.y);

    expectNear(await pointOf(page, "top_left"), target, 0.02, "the corner went to the second tap");
});

test("arrow keys step a corner, and the content moves with it", async ({ page }) => {
    const across = axisInput(page, "top_left", "across");
    const step = Number((await across.getAttribute("step")) ?? "0");
    const before = await pointOf(page, "top_left");
    const drawnBefore = await surfaceTopLeft(page);

    expect(step).toBeGreaterThan(0);

    await across.focus();
    await page.keyboard.press("ArrowRight");

    const after = await pointOf(page, "top_left");

    expect(after.x - before.x, "one press is one step").toBeCloseTo(step, 5);
    expect(after.y, "and the other axis stays").toBeCloseTo(before.y, 5);

    const drawnAfter = await surfaceTopLeft(page);

    expect(drawnAfter.x - drawnBefore.x, "the drawn content moved by the same amount").toBeCloseTo(step, 3);
});

test("a corner cannot be taken past the reach", async ({ page }) => {
    const reach = page.locator(`${prop("reachRatio")} input`);

    await reach.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("0");
    await reach.blur();

    const box = await rootBox(page);
    const room = Math.max(1, Math.min(box.x, box.y, 80) - 1);

    await dragGrip(page, "top_left", { x: box.x - room, y: box.y - room });
    await dragGrip(page, "bottom_right", { x: box.x + box.width + room, y: box.y + box.height + room });

    const corners = await cornersOf(page);

    for (const corner of ORDER) {
        expect(corners[corner].x, `${corner} across stays in the box`).toBeGreaterThanOrEqual(-0.001);
        expect(corners[corner].x, `${corner} across stays in the box`).toBeLessThanOrEqual(1.001);
        expect(corners[corner].y, `${corner} down stays in the box`).toBeGreaterThanOrEqual(-0.001);
        expect(corners[corner].y, `${corner} down stays in the box`).toBeLessThanOrEqual(1.001);
    }
});

test("a corner cannot fold the shape", async ({ page }) => {
    await dragGrip(page, "top_left", await atFraction(page, { x: 1.3, y: 1.3 }));

    const corners = await cornersOf(page);
    const turns = ORDER.map((corner, index) => {
        const a = corners[corner];
        const b = corners[ORDER[(index + 1) % ORDER.length]];
        const c = corners[ORDER[(index + 2) % ORDER.length]];

        return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    });
    const EPSILON = 1e-6;

    expect(
        turns.some((turn) => turn > EPSILON) && turns.some((turn) => turn < -EPSILON),
        "no two corners turn opposite ways",
    ).toBe(false);
});

test("reset puts every corner back where it started", async ({ page }) => {
    const start = await cornersOf(page);

    await dragGrip(page, "top_left", await atFraction(page, { x: 0.3, y: 0.3 }));

    expect((await pointOf(page, "top_left")).x, "the drag did move it").not.toBeCloseTo(start.top_left.x, 1);

    await page.locator("#cornerPinReset").click();

    const after = await cornersOf(page);

    for (const corner of ORDER) expectNear(after[corner], start[corner], 0.001, `${corner} is back`);
});
