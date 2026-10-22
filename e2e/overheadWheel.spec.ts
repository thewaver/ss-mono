import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * An overhead wheel draws each wedge in a full-size square that is turned to its angle, so the squares' corners
 * reach past the round wheel and over their neighbors. None of that may take a press: the squares and the wheel's
 * own box let presses through, a round disc the size of the wheel takes the wheel's own, and ordinary controls a
 * consumer puts in a wedge take theirs. Painting is untouched, so a glow or anything else drawn past a wedge's edge
 * still shows.
 *
 * Every point is worked out from the wheel's own box rather than written down, so the spec holds at any size.
 */
const OVERHEAD = example("overhead");
const WHEEL = `${OVERHEAD} [aria-roledescription="wheel"]`;
const WEDGE = `${OVERHEAD} [aria-roledescription="wedge"]`;

const DURATION_MS = 500;
const SPIN_TOTAL_MS = 6000;

const setDuration = async (page: Page, key: string, value: number) => {
    await page.locator(`${prop(key)} input`).fill(String(value));
    await page.locator(`${prop(key)} input`).blur();
};

/** Whether a press at a point, given as a share of the wheel's radius out from its middle, lands on the wheel. */
const landsOnWheel = async (page: Page, across: number, down: number) => {
    const box = (await page.locator(WHEEL).boundingBox())!;
    const radius = box.width * 0.5;

    return page.evaluate(
        ({ x, y, selector }) => document.querySelector(selector)!.contains(document.elementFromPoint(x, y)),
        { x: box.x + radius + across * radius, y: box.y + radius + down * radius, selector: WHEEL },
    );
};

test.beforeEach(async ({ page }) => {
    await page.goto("/overhead-wheel");
    await expect(page.locator(WHEEL)).toBeVisible();
});

test("a press on the wheel lands on it, and one beside it falls through to the page", async ({ page }) => {
    expect(await landsOnWheel(page, 0.5, 0), "halfway out from the middle").toBe(true);
    expect(await landsOnWheel(page, 0.95, 0), "just inside the rim").toBe(true);
    expect(await landsOnWheel(page, 0.8, 0.8), "past the rim, towards the corner of the wheel's box").toBe(false);
    expect(await landsOnWheel(page, 0.97, 0.97), "in the corner of the box itself").toBe(false);
});

test("the wedge under the marker is drawn over the others, so nothing it paints past its edge is covered", async ({
    page,
}) => {
    await setDuration(page, "spinDurationMs", DURATION_MS);
    await setDuration(page, "settleDurationMs", DURATION_MS);

    await page.locator("#overheadSpin").click();
    await expect
        .poll(() => page.locator("#overheadSpin").getAttribute("aria-disabled"), { timeout: SPIN_TOTAL_MS })
        .toBe(null);

    const marked = /under the marker: (.+?) —/.exec(await readout(page, "overhead"))?.[1];
    const layers = await page.locator(WEDGE).evaluateAll((wedges) =>
        wedges.map((wedge) => ({
            name: wedge.getAttribute("aria-label") ?? "",
            layer: Number(getComputedStyle(wedge).zIndex) || 0,
        })),
    );
    const top = Math.max(...layers.map((wedge) => wedge.layer));

    expect(marked, "the wheel has come to rest on a wedge").toBeTruthy();
    expect(
        layers.filter((wedge) => wedge.layer === top).map((wedge) => wedge.name.split(",")[0]),
        "that wedge alone is on top",
    ).toEqual([marked]);
});
