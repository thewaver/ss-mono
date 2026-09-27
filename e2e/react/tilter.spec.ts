import { type Locator, expect, test } from "@playwright/test";

/**
 * The React `Tilter`. There is no Solid spec for it to follow, so these cases state what it does: its surface lies
 * flat with nothing pointing at it, turns towards a pointer near one edge — about the upright axis for a pointer to
 * the side — and hands its painter the state it drew from, so a sheen can follow it. Turned off, it lies flat.
 */
const STORY = "Exotics/Tilter/Default";
const SURFACE = '[data-testid="frame"] > div > div';

const turnOf = async (surface: Locator) => {
    const transform = await surface.evaluate((element) => (element as HTMLElement).style.transform);
    const [x, y] = (/rotateX\((-?[\d.e-]+)deg\) rotateY\((-?[\d.e-]+)deg\)/.exec(transform) ?? []).slice(1).map(Number);

    return { x, y };
};

test("it lies flat with nothing pointing at it, and says so to the sheen", async ({ mount }) => {
    const component = await mount(STORY);
    const turn = await turnOf(component.locator(SURFACE).first());

    expect(Math.abs(turn.x)).toBe(0);
    expect(Math.abs(turn.y)).toBe(0);
    await expect(component.getByTestId("sheen")).toHaveAttribute("data-resting", "true");
});

test("a pointer near the right edge turns it about the upright axis, and the sheen is told", async ({
    page,
    mount,
}) => {
    const component = await mount(STORY);
    const surface = component.locator(SURFACE).first();
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.5);

    await expect
        .poll(async () => (await turnOf(surface)).y, { message: "it turns towards the right" })
        .toBeGreaterThan(0);
    await expect(component.getByTestId("sheen")).toHaveAttribute("data-resting", "false");
    await expect(component.getByTestId("sheen")).toHaveAttribute("data-strength", "1.00");

    await page.mouse.move(box.x + box.width * 0.05, box.y + box.height * 0.5);

    await expect
        .poll(async () => (await turnOf(surface)).y, { message: "and the other way on the left" })
        .toBeLessThan(0);
});

test("turned off, it stays flat", async ({ page, mount }) => {
    const component = await mount(STORY, { isDisabled: true });
    const box = (await component.getByTestId("surface").boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.5);
    await page.waitForTimeout(100);

    expect(Math.abs((await turnOf(component.locator(SURFACE).first())).y)).toBe(0);
});

test("with no sheen painter, nothing is drawn over the content", async ({ mount }) => {
    const component = await mount("Exotics/Tilter/Bare");

    await expect(component.locator(`${SURFACE} > *`)).toHaveCount(1);
});
