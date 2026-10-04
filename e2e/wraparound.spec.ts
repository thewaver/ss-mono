import { type Locator, type Page, expect, test } from "@playwright/test";

import { demo, readout, waitUntilStill } from "./helpers";

/**
 * A `Wraparound` draws its content once for real and as inert copies everywhere else. The window is the region;
 * inside it one plane carries every tile, so how far the content has moved is read off the plane's own transform,
 * and which tile is real is read off which one is not inert — never off what the content looks like.
 */
const GRID = demo("grid");
const MOSAIC = demo("mosaic");

const region = (scope: string) => `${scope} [role="region"]`;
const plane = (scope: string) => `${region(scope)} > div`;
const original = (scope: string) => `${plane(scope)} > div:not([inert])`;
const copies = (scope: string) => `${plane(scope)} > div[inert]`;

const planeOffset = (page: Page, scope: string) =>
    page.locator(plane(scope)).evaluate((element) => {
        const matrix = new DOMMatrix(getComputedStyle(element).transform);

        return { x: matrix.m41, y: matrix.m42 };
    });

/** Whether an element's box lies wholly inside another's, to the pixel. */
const isInside = async (inner: Locator, outer: Locator) => {
    const [a, b] = await Promise.all([inner.boundingBox(), outer.boundingBox()]);

    return (
        !!a &&
        !!b &&
        a.x >= b.x - 1 &&
        a.y >= b.y - 1 &&
        a.x + a.width <= b.x + b.width + 1 &&
        a.y + a.height <= b.y + b.height + 1
    );
};

test.beforeEach(async ({ page }) => {
    await page.goto("/wraparound");
    await expect(page.locator(copies(GRID)).first()).toBeAttached();
});

test("the window is a named region with one real copy of the content, and the rest are hidden from everyone", async ({
    page,
}) => {
    await expect(page.locator(region(GRID)), "the region carries a name").toHaveAttribute("aria-label", /.+/);
    await expect(page.locator(region(GRID)), "and is a stop the keys can move").toHaveAttribute("tabindex", "0");
    await expect(page.locator(original(GRID)), "one tile is real").toHaveCount(1);
    expect(
        await page.locator(copies(GRID)).count(),
        "content smaller than the window is copied to fill it",
    ).toBeGreaterThan(1);

    for (const copy of await page.locator(copies(GRID)).all()) {
        await expect(copy, "a copy is hidden from a screen reader").toHaveAttribute("aria-hidden", "true");
    }

    const realButtons = await page.locator(`${original(GRID)} button`).count();

    await expect(
        page.locator(GRID).getByRole("button"),
        "only the real tile's buttons are reachable at all",
    ).toHaveCount(realButtons);
});

test("pressing a copy presses the matching real button", async ({ page }) => {
    const copyButton = page.locator(`${copies(GRID)} button`).nth(4);
    const name = (await copyButton.textContent())!.trim();
    const box = (await copyButton.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

    expect(await readout(page, "grid"), "the readout names the button the copy showed").toContain(`pressed: ${name} `);
});

/**
 * The coast takes its speed from the pointer's last 100ms before it lets go, and the simulated drag sends its moves
 * further apart than that once a parallel sweep loads the machine — so in a sweep the content reads as having been
 * held still before release, and correctly does not coast. It passes every time on its own, hence `@solo`.
 */
test(
    "a drag moves the content and lets it coast on, and does not press what it started on",
    { tag: "@solo" },
    async ({ page }) => {
        const before = await planeOffset(page, GRID);
        const box = (await page.locator(region(GRID)).boundingBox())!;

        await page.mouse.move(box.x + 40, box.y + 40);
        await page.mouse.down();
        await page.mouse.move(box.x + 140, box.y + 80, { steps: 5 });
        await page.mouse.up();

        const released = await planeOffset(page, GRID);

        expect(released.x - before.x, "the content followed the pointer across").toBeGreaterThan(90);

        await waitUntilStill(page.locator(plane(GRID)));

        expect((await planeOffset(page, GRID)).x, "and kept going after it let go").toBeGreaterThan(released.x);
        expect(await readout(page, "grid"), "a drag is not a press").toContain("pressed: nothing yet");
    },
);

test("the wheel moves the content", async ({ page }) => {
    const before = await planeOffset(page, GRID);
    const box = (await page.locator(region(GRID)).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.wheel(30, 60);

    await expect.poll(async () => (await planeOffset(page, GRID)).y).toBeLessThan(before.y);
});

test("with the window focused the arrows move the content the way a page scrolls, and Home brings it back", async ({
    page,
}) => {
    await page.locator(region(GRID)).focus();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await waitUntilStill(page.locator(plane(GRID)));

    const moved = await planeOffset(page, GRID);

    expect(moved.x, "the right arrow shows more of what is to the right").toBeLessThan(0);
    expect(moved.y, "the down arrow shows more of what is below").toBeLessThan(0);

    await page.keyboard.press("Home");
    await waitUntilStill(page.locator(plane(GRID)));

    const realBox = (await page.locator(original(GRID)).boundingBox())!;
    const windowBox = (await page.locator(region(GRID)).boundingBox())!;

    expect(Math.abs(realBox.x - windowBox.x), "Home puts a tile's corner back on the window's").toBeLessThan(1);
    expect(Math.abs(realBox.y - windowBox.y)).toBeLessThan(1);
});

test("tabbing into the content brings the focused item itself into view", async ({ page }) => {
    await page.locator(region(GRID)).focus();

    for (let index = 0; index < 8; index++) await page.keyboard.press("ArrowLeft");

    await waitUntilStill(page.locator(plane(GRID)));

    for (let index = 0; index < 3; index++) {
        await page.keyboard.press("Tab");

        const focused = page.locator(`${original(GRID)} button:focus`);

        await expect(focused, "focus lands on a real button").toHaveCount(1);
        await waitUntilStill(page.locator(plane(GRID)));
        expect(await isInside(focused, page.locator(region(GRID))), "wholly inside the window").toBe(true);
    }
});

test("a mosaic inside walks with its own keys, and each tile it walks to is brought into view", async ({ page }) => {
    await page.locator(region(MOSAIC)).focus();
    await page.keyboard.press("Tab");

    const focused = page.locator(`${original(MOSAIC)} :focus`);

    await expect(focused, "Tab enters the real mosaic").toHaveCount(1);

    for (let index = 0; index < 4; index++) {
        await page.keyboard.press("ArrowRight");
        await waitUntilStill(page.locator(plane(MOSAIC)));
        expect(await isInside(focused, page.locator(region(MOSAIC))), "every step is in view").toBe(true);
    }
});
