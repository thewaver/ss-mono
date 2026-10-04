import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * A lens draws its content twice: once as itself, and once as a copy scaled up and shown only inside a window that
 * follows the pointer. The window is a mask on the layer holding the copy — the lens's image placed once — so where
 * the lens is can be read straight off that style: its position plus half its size is the lens's center, in the
 * lens's own layout pixels. No lens at all is a layer with no mask on it.
 *
 * Centers are compared as a fraction of the lens's width and height, because a pointer is aimed in window pixels and
 * the Playground scales its content to the window (see `playwright.config.ts`).
 *
 * The magnification is checked as a relationship between the two drawings of the same picture rather than as a
 * number written here: the copy comes out as many times wider than the original as the Zoom field says, and the
 * spot under the lens's center sits at the same fraction across both, which is what "the content under the pointer
 * stays under it" means.
 *
 * The keyboard route is Reveal's, and is checked the same way: focus reached by the keyboard opens the lens at the
 * center, the arrow keys move it by the step size, and leaving closes it.
 */
const PHOTO = `${demo("photo")} [role="group"]`;
const LAYER = `${PHOTO} > [aria-hidden="true"]`;
const ORIGINAL = `${PHOTO} > img`;
const COPY = `${LAYER} img`;

const MAX_TABS = 80;
const CLOSE = 0.02;
const RATIO_DIGITS = 2;

type Center = { x: number; y: number };

const lensOf = (page: Page): Promise<Center | undefined> =>
    page.locator(LAYER).evaluate((element) => {
        const layer = element as HTMLElement;
        const group = layer.closest('[role="group"]') as HTMLElement;
        const position = layer.style.getPropertyValue("mask-position");
        const size = layer.style.getPropertyValue("mask-size");

        if (!position || !size) return undefined;

        const [left, top] = position.trim().split(/\s+/).map(parseFloat);
        const [width, height] = size.trim().split(/\s+/).map(parseFloat);

        return { x: (left + width * 0.5) / group.offsetWidth, y: (top + height * 0.5) / group.offsetHeight };
    });

const isNear = async (page: Page, x: number, y: number) => {
    const lens = await lensOf(page);

    return lens !== undefined && Math.abs(lens.x - x) < CLOSE && Math.abs(lens.y - y) < CLOSE;
};

const stepRatio = async (page: Page) => {
    const step = Number(await page.locator(`${prop("stepSize")} input`).inputValue());
    const size = await page.locator(PHOTO).evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
    }));

    return { x: step / size.width, y: step / size.height };
};

const zoomOf = async (page: Page) => Number(await page.locator(`${prop("zoom")} input`).inputValue());

const drawings = (page: Page) =>
    page.evaluate(
        ([group, original, copy]) => {
            const box = document.querySelector(group)!.getBoundingClientRect();
            const layer = document.querySelector<HTMLElement>(`${group} > [aria-hidden="true"]`)!;
            const scale = box.width / (document.querySelector(group) as HTMLElement).offsetWidth;
            const [left, top] = layer.style.getPropertyValue("mask-position").trim().split(/\s+/).map(parseFloat);
            const [width, height] = layer.style.getPropertyValue("mask-size").trim().split(/\s+/).map(parseFloat);
            const center = { x: box.left + (left + width * 0.5) * scale, y: box.top + (top + height * 0.5) * scale };
            const toRect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();

            return { center, original: toRect(original), copy: toRect(copy) };
        },
        [PHOTO, ORIGINAL, COPY],
    );

const copyScale = async (page: Page) => {
    const { original, copy } = await drawings(page);

    return copy.width / original.width;
};

const isFocused = (page: Page, selector: string) =>
    page.evaluate((value) => document.activeElement === document.querySelector(value), selector);

const tabInto = async (page: Page, selector: string) => {
    for (let presses = 0; presses < MAX_TABS; presses++) {
        if (await isFocused(page, selector)) return;

        await page.keyboard.press("Tab");
    }

    throw new Error("the lens was never reached with Tab");
};

const pointAt = async (page: Page, ratioX: number, ratioY: number) => {
    const box = (await page.locator(PHOTO).boundingBox())!;

    return { x: box.x + box.width * ratioX, y: box.y + box.height * ratioY };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/lens");
    await expect(page.locator(PHOTO)).toBeVisible();
});

test("the lens is one named Tab stop, and its magnified copy is hidden from screen readers and from Tab", async ({
    page,
}) => {
    await expect(page.locator(PHOTO), "a focusable thing with no name is announced as nothing").toHaveAccessibleName(
        /\S/,
    );

    expect(await page.locator(`${PHOTO} img`).count(), "the picture is in the document twice").toBe(2);
    await expect(
        page.locator(PHOTO).getByRole("img"),
        "and a screen reader meets it once, since the copy is hidden",
    ).toHaveCount(1);
    await expect(page.locator(LAYER), "the copy cannot be reached or operated").toHaveJSProperty("inert", true);

    await tabInto(page, PHOTO);
    await page.keyboard.press("Tab");

    expect(await isFocused(page, PHOTO), "one press takes focus straight out again").toBe(false);
    expect(
        await page.locator(PHOTO).evaluate((element) => element.contains(document.activeElement)),
        "and not to anything inside it",
    ).toBe(false);
});

test("reaching it with the keyboard opens the lens at the center, and leaving closes it", async ({ page }) => {
    expect(await lensOf(page), "at rest there is no lens").toBeUndefined();

    await tabInto(page, PHOTO);

    const opened = await lensOf(page);

    expect(opened, "keyboard focus opened the lens").toBeDefined();
    expect(opened!.x).toBeCloseTo(0.5, RATIO_DIGITS);
    expect(opened!.y).toBeCloseTo(0.5, RATIO_DIGITS);

    await page.keyboard.press("Tab");

    expect(await lensOf(page), "focus moved on, and the lens closed").toBeUndefined();
});

test("the arrow keys move the lens by the step size, and hold it inside the box", async ({ page }) => {
    const step = await stepRatio(page);

    await tabInto(page, PHOTO);
    await page.keyboard.press("ArrowRight");

    let lens = (await lensOf(page))!;

    expect(lens.x, "Right moves it one step right").toBeCloseTo(0.5 + step.x, RATIO_DIGITS);
    expect(lens.y).toBeCloseTo(0.5, RATIO_DIGITS);

    await page.keyboard.press("ArrowDown");
    lens = (await lensOf(page))!;

    expect(lens.y, "Down moves it one step down").toBeCloseTo(0.5 + step.y, RATIO_DIGITS);

    for (let presses = 0; presses < Math.ceil(1 / step.x) + 1; presses++) await page.keyboard.press("ArrowLeft");

    lens = (await lensOf(page))!;

    expect(lens.x, "however often Left is pressed, the lens stops at the edge").toBeCloseTo(0, RATIO_DIGITS);
});

test("the copy is drawn as many times larger as the zoom says, and follows the field", async ({ page }) => {
    expect(await copyScale(page), "the copy is the zoom times as wide as the original").toBeCloseTo(
        await zoomOf(page),
        RATIO_DIGITS,
    );

    const next = (await zoomOf(page)) + 1;

    await page.locator(`${prop("zoom")} input`).fill(String(next));

    await expect
        .poll(() => copyScale(page), { message: "a new zoom redraws the copy at the new scale" })
        .toBeCloseTo(next, RATIO_DIGITS);
});

test("the spot under the lens's center is the same spot in the copy, wherever the lens is", async ({ page }) => {
    const target = await pointAt(page, 0.3, 0.6);

    await page.mouse.move(target.x, target.y, { steps: 4 });

    await expect.poll(() => isNear(page, 0.3, 0.6), { message: "the lens followed the pointer" }).toBe(true);

    const { center, original, copy } = await drawings(page);

    expect(
        (center.x - copy.left) / copy.width,
        "the copy is scaled about the lens's center, so the fraction across it there is the original's",
    ).toBeCloseTo((center.x - original.left) / original.width, RATIO_DIGITS);
    expect((center.y - copy.top) / copy.height).toBeCloseTo((center.y - original.top) / original.height, RATIO_DIGITS);
});

test("the pointer and the keyboard hand the lens back and forth", async ({ page }) => {
    await tabInto(page, PHOTO);

    const target = await pointAt(page, 0.25, 0.25);

    await page.mouse.move(target.x, target.y, { steps: 4 });

    await expect
        .poll(() => isNear(page, 0.25, 0.25), { message: "moving the pointer over it takes the lens back" })
        .toBe(true);

    const step = await stepRatio(page);

    await page.keyboard.press("ArrowRight");

    expect(
        await isNear(page, 0.25 + step.x, 0.25),
        "and an arrow picks it up from where the pointer left it, not from the center",
    ).toBe(true);
});
