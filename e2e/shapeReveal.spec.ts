import { type Page, expect, test } from "@playwright/test";

import { demo, prop, readout } from "./helpers";

/**
 * `ShapeRevealUtils.reveal` makes a change and shows the result through a shape growing over the page as it was.
 * The change is the part every browser must get, so the specs ask first that it happened — the panel turned over,
 * the theme class moved — and then that the helper's promise settled, which the page reports in its readout once it
 * does. What the shape looks like is the browser's to paint and is not asked about; what is asked, where the browser
 * has view transitions, is that the new page's snapshot carries a running animation while the reveal is under way,
 * and which property it moves, since a clip and a mask are the two ways the helper draws an edge.
 */
const SWITCH = "#shapeRevealSwitch";
const NEW_SNAPSHOT = "::view-transition-new(root)";

const hasViewTransitions = (page: Page) => page.evaluate(() => typeof document.startViewTransition === "function");

const newSnapshotKeyframes = (page: Page) =>
    page.evaluate(
        (pseudoElement) =>
            document
                .getAnimations()
                .filter((animation) => (animation.effect as KeyframeEffect | null)?.pseudoElement === pseudoElement)
                .flatMap((animation) => (animation.effect as KeyframeEffect).getKeyframes()),
        NEW_SNAPSHOT,
    );

const pickOption = async (page: Page, key: string, name: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/shape-reveal");
    await expect(page.locator(SWITCH)).toBeVisible();
});

test("Switch turns the panel over, and the readout reports once the helper has settled", async ({ page }) => {
    const before = await page.locator(demo("switch")).textContent();

    await page.locator(SWITCH).click();

    await expect.poll(() => readout(page, "switch")).toMatch(/^showing dusk, (revealed|switched)/);
    expect(await page.locator(demo("switch")).textContent(), "the panel's contents changed").not.toBe(before);

    await page.locator(SWITCH).click();

    await expect.poll(() => readout(page, "switch"), "and back again").toMatch(/^showing dawn, /);
    expect(await page.locator(demo("switch")).textContent()).toBe(before);
});

/**
 * The snapshot's animation is sampled every 20ms while it runs, and a parallel sweep can starve that sampling past the
 * animation's end; it passes every time on its own, hence `@solo`.
 */
test(
    "with view transitions, the new page is uncovered by an animation on its snapshot",
    { tag: "@solo" },
    async ({ page }) => {
        test.skip(!(await hasViewTransitions(page)), "this browser has no view transitions");

        await page.locator(SWITCH).click();

        await expect
            .poll(async () => (await newSnapshotKeyframes(page)).some((frame) => frame.clipPath !== undefined), {
                intervals: [20],
            })
            .toBe(true);
        await expect.poll(() => readout(page, "switch")).toMatch(/^showing dusk, revealed through a /);
        await expect.poll(() => newSnapshotKeyframes(page), "nothing is left running afterwards").toEqual([]);
    },
);

test("a blurred edge is drawn with a mask rather than a clip", async ({ page }) => {
    test.skip(!(await hasViewTransitions(page)), "this browser has no view transitions");

    await page.locator(`${prop("blur")} input`).fill("20");
    await page.locator(`${prop("blur")} input`).blur();
    await page.locator(SWITCH).click();

    await expect
        .poll(async () => (await newSnapshotKeyframes(page)).some((frame) => frame.maskImage !== undefined), {
            intervals: [20],
        })
        .toBe(true);
    await expect.poll(() => readout(page, "switch")).toMatch(/^showing dusk, revealed through a /);
});

test("every shape and every starting spot reveals the change", async ({ page }) => {
    await pickOption(page, "computePoints", "hexagon-pointy-top");
    await pickOption(page, "origin", "the bottom-right corner");
    await page.locator(SWITCH).click();

    await expect.poll(() => readout(page, "switch")).toMatch(/^showing dusk, /);

    if (await hasViewTransitions(page)) {
        expect(await readout(page, "switch")).toContain("hexagon-pointy-top growing from the bottom-right corner");
    }
});

test("under reduced motion the panel simply switches", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(SWITCH).click();

    await expect.poll(() => readout(page, "switch")).toMatch(/^showing dusk, switched with nothing revealed/);
});

test("the playground's theme switch changes the theme through the helper", async ({ page }) => {
    const themeClass = () => page.evaluate(() => document.documentElement.className);
    const before = await themeClass();

    await page.getByRole("button", { name: "Library settings" }).click();
    await page.locator("#playgroundTheme").click();
    await page.getByRole("option", { selected: false }).first().click();

    await expect.poll(themeClass, "the theme class on the page moved").not.toBe(before);
});
