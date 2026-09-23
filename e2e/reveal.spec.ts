import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * A reveal is a cover with a hole cut in it, and the hole is a mask the component hands to the consumer's
 * cover as an inline style: one full-coverage layer, then the hole's image placed at a position and a size.
 * So where the hole is can be read straight off that style — the second layer's position plus half its size
 * is the hole's center, in the reveal's own layout pixels — and no hole at all is a cover with no mask on it.
 * What the hole looks like is not read anywhere; only where it is, and whether it exists.
 *
 * The hole's center is compared as a fraction of the reveal's width and height, because a pointer is aimed in
 * window pixels and the Playground scales its content to the window (see `playwright.config.ts`).
 *
 * The keyboard route is the reason this spec exists: without one, a sighted keyboard user cannot see under the
 * cover at all. Focus reached by the keyboard opens the hole at the center, the arrow keys move it by the step
 * size, and leaving closes it. A click also focuses the element, and must not throw the hole to the center
 * while the pointer is somewhere else.
 */
const TORCH = `${demo("torch")} [role="group"]`;
const COVER = `${TORCH} > div:last-child > div`;

const MAX_TABS = 80;
const CLOSE = 0.02;

type Hole = { x: number; y: number };

const holeOf = (page: Page): Promise<Hole | undefined> =>
    page.locator(COVER).evaluate((element) => {
        const cover = element as HTMLElement;
        const group = cover.closest('[role="group"]') as HTMLElement;
        const positions = cover.style.getPropertyValue("mask-position").split(",");
        const sizes = cover.style.getPropertyValue("mask-size").split(",");

        if (positions.length < 2 || sizes.length < 2) return undefined;

        const [left, top] = positions[1].trim().split(/\s+/).map(parseFloat);
        const [width, height] = sizes[1].trim().split(/\s+/).map(parseFloat);

        return { x: (left + width / 2) / group.offsetWidth, y: (top + height / 2) / group.offsetHeight };
    });

const isNear = async (page: Page, x: number, y: number) => {
    const hole = await holeOf(page);

    return hole !== undefined && Math.abs(hole.x - x) < CLOSE && Math.abs(hole.y - y) < CLOSE;
};

const stepRatio = async (page: Page) => {
    const step = Number(await page.locator(`${prop("stepSize")} input`).inputValue());
    const size = await page.locator(TORCH).evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
    }));

    return { x: step / size.width, y: step / size.height };
};

const isFocused = (page: Page, selector: string) =>
    page.evaluate((value) => document.activeElement === document.querySelector(value), selector);

const tabInto = async (page: Page, selector: string) => {
    for (let presses = 0; presses < MAX_TABS; presses++) {
        if (await isFocused(page, selector)) return;

        await page.keyboard.press("Tab");
    }

    throw new Error("the reveal was never reached with Tab");
};

const pointAt = async (page: Page, ratioX: number, ratioY: number) => {
    const box = (await page.locator(TORCH).boundingBox())!;

    return { x: box.x + box.width * ratioX, y: box.y + box.height * ratioY };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/reveal");
    await expect(page.locator(TORCH)).toBeVisible();
});

test("the reveal is one named Tab stop, with nothing inside it to stop at", async ({ page }) => {
    await expect(page.locator(TORCH), "a focusable thing with no name is announced as nothing").toHaveAccessibleName(
        /\S/,
    );

    const innerStops = await page
        .locator(TORCH)
        .evaluate(
            (element) =>
                [...element.querySelectorAll("*")].filter((inner) => (inner as HTMLElement).tabIndex >= 0).length,
        );

    expect(innerStops, "the content and the cover are paint, not controls").toBe(0);

    await tabInto(page, TORCH);
    await page.keyboard.press("Tab");

    expect(await isFocused(page, TORCH), "one press takes focus straight out again").toBe(false);
    expect(
        await page.locator(TORCH).evaluate((element) => element.contains(document.activeElement)),
        "and not to anything inside it",
    ).toBe(false);
});

test("reaching it with the keyboard opens the hole at the center, and leaving closes it", async ({ page }) => {
    expect(await holeOf(page), "at rest the cover is whole").toBeUndefined();

    await tabInto(page, TORCH);

    const opened = await holeOf(page);

    expect(opened, "keyboard focus cut a hole").toBeDefined();
    expect(opened!.x).toBeCloseTo(0.5, 2);
    expect(opened!.y).toBeCloseTo(0.5, 2);

    await page.keyboard.press("Tab");

    expect(await holeOf(page), "focus moved on, and the cover is whole again").toBeUndefined();
});

test("the arrow keys move the hole by the step size, and hold it inside the box", async ({ page }) => {
    const step = await stepRatio(page);

    await tabInto(page, TORCH);
    await page.keyboard.press("ArrowRight");

    let hole = (await holeOf(page))!;

    expect(hole.x, "Right moves it one step right").toBeCloseTo(0.5 + step.x, 2);
    expect(hole.y).toBeCloseTo(0.5, 2);

    await page.keyboard.press("ArrowDown");
    hole = (await holeOf(page))!;

    expect(hole.y, "Down moves it one step down").toBeCloseTo(0.5 + step.y, 2);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    hole = (await holeOf(page))!;

    expect(hole, "Up and Left undo them").toEqual({ x: expect.closeTo(0.5, 2), y: expect.closeTo(0.5, 2) });

    for (let presses = 0; presses < Math.ceil(1 / step.x); presses++) await page.keyboard.press("ArrowLeft");

    hole = (await holeOf(page))!;

    expect(hole.x, "however often Left is pressed, the hole stops at the edge").toBeCloseTo(0, 2);
});

test("an arrow with a modifier held is left to the browser", async ({ page }) => {
    await tabInto(page, TORCH);

    const before = await holeOf(page);

    await page.keyboard.press("Alt+ArrowRight");

    expect(await holeOf(page), "Alt with an arrow does not move the hole").toEqual(before);
});

test("a click does not throw the hole to the center, since the pointer is somewhere else", async ({ page }) => {
    const target = await pointAt(page, 0.2, 0.3);

    await page.mouse.click(target.x, target.y);

    expect(await isFocused(page, TORCH), "the click did focus it").toBe(true);

    await expect
        .poll(() => isNear(page, 0.2, 0.3), {
            message: "the hole is where the pointer is, and stays there rather than jumping to the center",
        })
        .toBe(true);
});

test("the pointer and the keyboard hand the hole back and forth", async ({ page }) => {
    await tabInto(page, TORCH);

    const target = await pointAt(page, 0.25, 0.25);

    await page.mouse.move(target.x, target.y, { steps: 4 });

    await expect
        .poll(() => isNear(page, 0.25, 0.25), { message: "moving the pointer over it takes the hole back" })
        .toBe(true);

    const step = await stepRatio(page);

    await page.keyboard.press("ArrowRight");

    expect(
        await isNear(page, 0.25 + step.x, 0.25),
        "and an arrow picks it up from where the pointer left it, not from the center",
    ).toBe(true);
});
