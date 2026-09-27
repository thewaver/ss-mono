import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, attributesOf, inlineStyle } from "../helpers";

/**
 * The React `RadioGroup` and `Radio`. The cases follow `e2e/radioGroup.spec.ts` and the `RadioGroup` block of
 * `e2e/rightToLeft.spec.ts`, which cover the Solid ones, so the two frameworks are held to the same behavior. Each
 * story puts its group inside a box keyed by `data-testid`, standing in for the Playground's example keys, and every
 * radio is found by the name it announces rather than by the caption painted beside it.
 */
const STORY = "Essentials/RadioGroup";

const scope = (key: string) => `[data-testid="${key}"]`;
const option = (key: string, label: string) => `${scope(key)} input[aria-label="${label}"]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="value"]`).textContent();

const FLOATER_TIMEOUT_MS = 5_000;

const box = async (locator: Locator) => {
    const measured = await locator.boundingBox();

    if (!measured) throw new Error("the element has no box to measure");

    return { ...measured, centerX: measured.x + measured.width * 0.5 };
};

test("a group is named on its own element and uses no native disabled", async ({ page, mount }) => {
    await mount(`${STORY}/Default`);

    await expect(
        page.locator(`${scope("default")} [role="radiogroup"]`),
        "the group is named on its own element",
    ).toHaveAttribute("aria-label", "Default size");
    await expect(page.locator("input[disabled]"), "no radio carries the native disabled attribute").toHaveCount(0);
});

test("a group is one tab stop that travels with the selection", async ({ page, mount }) => {
    await mount(`${STORY}/Default`);

    await expect
        .poll(() => attributesOf(page, `${scope("default")} input`, "tabindex"), {
            message: "a group is one tab stop, and it starts on the first navigable radio",
        })
        .toEqual(["0", "-1", "-1"]);

    await page.locator(option("default", "Small")).focus();
    await page.keyboard.press("ArrowRight");

    expect(await readout(page, "default"), "an arrow both moves and selects").toContain("value: medium");
    expect(await activeMatches(page, option("default", "Medium")), "and focus follows the selection").toBe(true);
    await expect
        .poll(() => attributesOf(page, `${scope("default")} input`, "tabindex"), {
            message: "the single tab stop moves with it",
        })
        .toEqual(["-1", "0", "-1"]);
});

test("the walk wraps and honors the edge keys", async ({ page, mount }) => {
    await mount(`${STORY}/Default`);

    await page.locator(option("default", "Small")).focus();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect(await readout(page, "default"), "the walk wraps around the end").toContain("value: small");

    await page.keyboard.press("End");
    expect(await readout(page, "default"), "End jumps to the last radio").toContain("value: large");

    await page.keyboard.press("Home");
    expect(await readout(page, "default"), "Home jumps back to the first").toContain("value: small");
});

test("a wholly disabled group has no tab stop at all", async ({ page, mount }) => {
    await mount(`${STORY}/Disabled`);

    await expect
        .poll(() => attributesOf(page, `${scope("disabled")} input`, "tabindex"), {
            message: "a group whose every radio is disabled has no tab stop at all",
        })
        .toEqual(["-1", "-1", "-1"]);
});

test("the walk stops on a reachable disabled radio without selecting it", async ({ page, mount }) => {
    await mount(`${STORY}/Reachable`);

    await page.locator(option("reachable", "Small")).focus();
    await page.keyboard.press("ArrowRight");
    expect(
        await activeMatches(page, option("reachable", "Medium")),
        "the walk stops on a disabled radio that is reachable, so its tooltip can be read",
    ).toBe(true);
    expect(await readout(page, "reachable"), "and refuses to select it while it is there").toContain("value: small");

    await page.keyboard.press("ArrowRight");
    expect(await readout(page, "reachable"), "carrying on from it selects the next enabled radio").toContain(
        "value: large",
    );

    await page.locator(option("reachable", "Medium")).click({ force: true });
    expect(
        await readout(page, "reachable"),
        "clicking a reachable disabled radio leaves the value alone too",
    ).toContain("value: large");
});

/**
 * The floater is the group's, not the painter's: the group measures the selected radio's wrapper and writes the box
 * as inline `left` and the rest, and the consumer only paints inside it. So the measurement is read off the wrapper
 * the library positions. A group with no `renderFloater` runs no observer at all, which is why only the segmented
 * group has a box to find; the plain one is checked for its absence so that the guard cannot quietly stop guarding.
 */
test("the floater is measured from the selected radio and moves with it", async ({ page, mount }) => {
    await mount(`${STORY}/Segmented`);

    await expect(
        page.locator(`${scope("default")} [data-floater]`),
        "a group that passes no floater renders none, and runs no observer for one",
    ).toHaveCount(0);

    const floaterBox = page.locator(`${scope("segmented")} [data-floater]`).locator("..");

    await expect(floaterBox).toHaveCount(1);

    const before = await inlineStyle(floaterBox, "left");

    expect(before, "the floater is placed off a real measurement rather than left at zero").not.toBe("");

    await page.locator(option("segmented", "Large")).click();

    await expect.poll(() => inlineStyle(floaterBox, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before);
    expect(await readout(page, "segmented"), "and the value moved with it").toContain("value: large");
});

test("each group generates its own name", async ({ page, mount }) => {
    await mount(`${STORY}/Page`);

    const names = await attributesOf(page, "input[type='radio']", "name");

    expect(new Set(names).size, "each group generates its own name, so the browser cannot mix two of them").toBe(
        await page.locator('[role="radiogroup"]').count(),
    );
});

/**
 * The arc rating is the same radios as the row rating, with a layout function added and nothing else changed. A
 * group takes children rather than a list of records, so each `Radio` asks the group's context for its own
 * placement, keyed on the entry it registered — and these check that the answer arrives and that the group's own
 * behavior is untouched by it.
 */
const placedBox = (key: string) => `${scope(key)} [role="presentation"][style*="left"]`;

const star = (key: string, count: number) =>
    `${scope(key)} input[aria-label="${count === 1 ? "1 star" : `${count} stars`}"]`;

test("every radio in a laid-out group gets a box, and one in a row gets none", async ({ page, mount }) => {
    await mount(`${STORY}/Ratings`);

    await expect(page.locator(placedBox("arc"))).toHaveCount(await page.locator(`${scope("arc")} input`).count());
    await expect(page.locator(placedBox("rating")), "the row rating places nothing").toHaveCount(0);
});

test("a placed radio is still a radio: the walk, the single tab stop and the selection all hold", async ({
    page,
    mount,
}) => {
    await mount(`${STORY}/Ratings`);

    await expect
        .poll(() => attributesOf(page, `${scope("arc")} input`, "tabindex"), {
            message: "one tab stop, sitting on the selected star",
        })
        .toEqual(["-1", "-1", "0", "-1", "-1"]);

    await page.locator(star("arc", 3)).focus();
    await page.keyboard.press("ArrowRight");

    expect(await readout(page, "arc"), "an arrow round the arc both moves and selects").toContain("value: 4");
    expect(await activeMatches(page, star("arc", 4)), "and focus follows it").toBe(true);
});

test("a placed radio is clicked where it is drawn, not where the row would have put it", async ({ page, mount }) => {
    await mount(`${STORY}/Ratings`);

    await page.locator(star("arc", 1)).click();

    expect(await readout(page, "arc"), "the first star sits at one end of the arc and takes the press").toContain(
        "value: 1",
    );

    await page.locator(star("arc", 5)).click();

    expect(await readout(page, "arc"), "and the last at the other").toContain("value: 5");
});

/**
 * A radio group answers both pairs of arrows, and only one pair has a side to it. Under right-to-left the horizontal
 * pair trades places, since the next radio is drawn to the left; the vertical pair keeps its meaning. The group is
 * told nothing — it has to read the direction off the box it sits in — and pressing all four in one walk is what
 * separates a flip of the horizontal pair from a flip of everything.
 */
test("under right-to-left the horizontal arrows flip and the vertical ones do not", async ({ page, mount }) => {
    await mount(`${STORY}/RightToLeft`);

    expect(
        (await box(page.locator(option("rightToLeft", "Medium")))).centerX,
        "the second radio is drawn to the left of the first",
    ).toBeLessThan((await box(page.locator(option("rightToLeft", "Small")))).centerX);

    await page.locator(option("rightToLeft", "Small")).focus();

    await page.keyboard.press("ArrowLeft");
    expect(await readout(page, "rightToLeft"), "ArrowLeft moves to the next radio").toContain("value: medium");
    await expect(page.locator(option("rightToLeft", "Medium")), "and focus goes with it").toBeFocused();

    await page.keyboard.press("ArrowRight");
    expect(await readout(page, "rightToLeft"), "ArrowRight to the previous one").toContain("value: small");

    await page.keyboard.press("ArrowDown");
    expect(await readout(page, "rightToLeft"), "ArrowDown still moves forward").toContain("value: medium");

    await page.keyboard.press("ArrowUp");
    expect(await readout(page, "rightToLeft"), "and ArrowUp back").toContain("value: small");
});
