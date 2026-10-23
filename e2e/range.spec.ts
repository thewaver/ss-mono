import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, attributesOf, demo, inputValue, readout, tabIndex, turnDegrees } from "./helpers";

const DEFAULT = demo("default");
const STEPPED = demo("stepped");
const PAIR = demo("pair");
const DISABLED = demo("disabled");
const DISABLED_PAIR = demo("disabledPair");
const REACHABLE = demo("reachable");
const ERRORED = demo("errored");
const KNOB = demo("knob");

const thumbs = (scope: string) => `${scope} input[type="range"]`;

const valueOf = async (locator: Locator) => Number(await inputValue(locator));

/**
 * A pair of thumbs is two native inputs stacked over one painter, so nothing in the markup says which one
 * a pointer would reach — that is decided by the `z-index` `raiseNearestThumb` sets on `pointermove`,
 * before any button is held. Driving it therefore has to move the mouse first and press second, which is
 * the sequence a hand makes anyway and the one a `click` at a point would skip.
 */
const dragFrom = async (page: Page, locator: Locator, from: number, to: number) => {
    const box = (await locator.boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: 5 });
    await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/range");
    await expect(page.locator(thumbs(DEFAULT))).toBeVisible();
});

test("one thumb is one native input and a pair is two, each naming itself", async ({ page }) => {
    await expect(page.locator(thumbs(DEFAULT)), "a single value is one input").toHaveCount(1);
    await expect(page.locator(thumbs(PAIR)), "and a pair is the same case rendered twice").toHaveCount(2);

    expect(await attributesOf(page, thumbs(PAIR), "aria-label"), "each thumb carries its own name").toEqual([
        "Lowest price",
        "Highest price",
    ]);
    expect(
        await attributesOf(page, thumbs(DEFAULT), "aria-label"),
        "while a single thumb falls back to the control's",
    ).toEqual(["Volume"]);
});

test("no range uses the native disabled attribute, and only the reachable one keeps its tab stop", async ({ page }) => {
    await expect(page.locator("input[disabled]"), "disabled is aria-disabled here and never the attribute").toHaveCount(
        0,
    );
    await expect(page.locator(thumbs(DISABLED))).toHaveAttribute("aria-disabled", "true");

    expect(await tabIndex(page.locator(thumbs(DISABLED))), "a disabled range is out of the tab order").toBe(-1);
    expect(
        await tabIndex(page.locator(thumbs(REACHABLE))),
        "while a reachable one stays in it, so its tooltip can be read",
    ).toBe(0);
});

test("crossing is prevented by the inputs' own bounds rather than by a guard", async ({ page }) => {
    const low = page.locator(thumbs(PAIR)).first();
    const high = page.locator(thumbs(PAIR)).last();

    await expect(low, "the low thumb's ceiling is the high thumb's current value").toHaveAttribute("max", "80");
    await expect(high, "and the high thumb's floor is the low thumb's").toHaveAttribute("min", "20");

    await low.focus();
    await page.keyboard.press("End");

    expect(await valueOf(low), "so End stops at the neighbor rather than at the end of the scale").toBe(80);
    expect(await readout(page, "pair"), "and the owner sees the clamped value").toContain("start: 80 | end: 80");
    await expect(high, "with the neighbor's floor following it up").toHaveAttribute("min", "80");
});

test("two thumbs on the same value are not stuck, because the pointer's side breaks the tie", async ({ page }) => {
    const low = page.locator(thumbs(PAIR)).first();
    const high = page.locator(thumbs(PAIR)).last();

    await low.focus();
    await page.keyboard.press("End");
    expect(await readout(page, "pair"), "drive both thumbs onto one value").toContain("start: 80 | end: 80");

    await dragFrom(page, high, 0.4, 0.2);

    expect(await valueOf(low), "pressing below the pile and dragging left frees the low thumb").toBeLessThan(80);
    expect(await valueOf(high), "and leaves the high one where it was").toBe(80);
});

test("stepping honors the step and stops at both ends of the scale", async ({ page }) => {
    const input = page.locator(thumbs(STEPPED));

    await input.focus();
    await page.keyboard.press("Home");

    expect(await valueOf(input), "Home is the floor").toBe(1);
    expect(await readout(page, "stepped"), "which the owner sees in its own units").toContain("value: 1 of 5");

    await page.keyboard.press("ArrowRight");
    expect(await valueOf(input), "one press moves one step, not one unit of the scale").toBe(2);

    await page.keyboard.press("End");
    await page.keyboard.press("ArrowRight");
    expect(await valueOf(input), "and the ceiling is a wall rather than a wrap").toBe(5);
});

test("a vertical range puts the low value at the bottom", async ({ page }) => {
    const input = page.locator("#verticalVolume");

    await input.focus();

    const before = await valueOf(input);

    await page.keyboard.press("ArrowUp");
    expect(
        await valueOf(input),
        "up is more — which is the whole of what direction: rtl buys on top of the writing mode",
    ).toBeGreaterThan(before);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    expect(await valueOf(input), "and down is less").toBeLessThan(before);
});

test("a disabled range refuses both the write and the focus", async ({ page }) => {
    const input = page.locator(thumbs(DISABLED));
    const box = (await input.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.5);

    expect(
        await valueOf(input),
        "the browser moves a range before it reports, so the sync writes state back over it",
    ).toBe(25);
    expect(await readout(page, "disabled"), "and the owner never hears about it").toContain("value: 25");
    expect(await activeMatches(page, thumbs(DISABLED)), "the mousedown refusal also keeps focus off it").toBe(false);
});

/**
 * `InteractionWrapper` is handed one control element and does everything about disabled to that one, so a
 * pair's second thumb used to keep the native `tabIndex` of 0 and take focus from a click while the whole
 * control was disabled — tab-reachable, focusable, and refusing to move. Only the first thumb was covered
 * because only the first is the wrapper's. Both are asserted here, because the one that was wrong is the
 * one no other variant on the page can show.
 */
test("a disabled pair takes both of its thumbs out of the tab order, not just the wrapper's own", async ({ page }) => {
    const low = page.locator(thumbs(DISABLED_PAIR)).first();
    const high = page.locator(thumbs(DISABLED_PAIR)).last();

    expect(await tabIndex(low), "the thumb the wrapper holds is skipped").toBe(-1);
    expect(await tabIndex(high), "and so is the one it never saw").toBe(-1);

    const box = (await high.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.5);

    expect(await activeMatches(page, thumbs(DISABLED_PAIR)), "neither thumb takes focus from a click").toBe(false);
    expect(await readout(page, "disabledPair"), "and the value is where it started").toContain("start: 35 | end: 65");
});

test("the owner's error reaches the element as ARIA, and leaves when the owner's rule stops holding", async ({
    page,
}) => {
    const input = page.locator(thumbs(ERRORED));

    await expect(input, "the error state is published rather than only painted").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await input.focus();
    await page.keyboard.press("Home");

    await expect(input, "and it clears when the value stops breaking the consumer's rule").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

/**
 * The knob's travel as the example sets it: the lowest value at 135° (down and to the left, with 0° pointing
 * right and angles growing clockwise) and 270° of sweep from there, so straight up is the middle of the
 * scale and straight right is five sixths of it. A point is named by where it sits on the knob's box, and
 * the box is read from the native input, which is laid over the knob edge to edge and is the rectangle the
 * component itself measures.
 */
const knobPoint = async (page: Page, where: "top" | "right" | "left") => {
    const box = (await page.locator(thumbs(KNOB)).boundingBox())!;
    const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
    const reach = Math.min(box.width, box.height) * 0.4;

    if (where === "top") return { x: center.x, y: center.y - reach };

    return { x: center.x + (where === "right" ? reach : -reach), y: center.y };
};

const KNOB_POINTER = `${KNOB} [style*="rotate("]`;

test("the knob is still one named slider the keyboard steps", async ({ page }) => {
    const input = page.locator(thumbs(KNOB));

    await expect(input, "a knob is the same native range input underneath").toHaveCount(1);
    await expect(input, "named for a screen reader").toHaveAttribute("aria-label", "Gain");
    expect(await valueOf(input), "starting where the owner put it").toBe(30);

    await input.focus();
    await page.keyboard.press("ArrowRight");

    expect(await valueOf(input), "and the arrow keys still step it").toBe(31);
    expect(await readout(page, "knob"), "which the owner hears").toContain("value: 31");
});

/**
 * With `computeValueAtPoint` given, `Range` cancels the press so the browser never moves its own thumb,
 * and follows the pointer by the angle round the center instead. The points below are picked so the two
 * readings disagree: a native horizontal range pressed at the right edge would jump to its top end and at
 * the left edge to its bottom, while the knob reads five sixths and one sixth of the way round.
 */
test("pressing the knob reads the pointer's angle, not the native thumb's position", async ({ page }) => {
    const input = page.locator(thumbs(KNOB));
    const right = await knobPoint(page, "right");

    await page.mouse.move(right.x, right.y);
    await page.mouse.down();

    expect(await valueOf(input), "a press at the right reads five sixths of the way round").toBe(83);
    expect(await readout(page, "knob"), "and the owner is told at once").toContain("value: 83");
    await expect(input, "the press takes focus, so the keyboard carries on from there").toBeFocused();

    await page.mouse.up();

    expect(await valueOf(input), "letting go leaves it where the angle said").toBe(83);
});

test("dragging round the knob turns it, and the browser's own thumb never wins", async ({ page }) => {
    const input = page.locator(thumbs(KNOB));
    const top = await knobPoint(page, "top");
    const left = await knobPoint(page, "left");
    const turnedBefore = await turnDegrees(page.locator(KNOB_POINTER));

    await page.mouse.move(top.x, top.y);
    await page.mouse.down();

    expect(await valueOf(input), "straight up is the middle of the scale").toBe(50);
    expect(await turnDegrees(page.locator(KNOB_POINTER)), "and the painted pointer turns with it").toBeGreaterThan(
        turnedBefore,
    );

    await page.mouse.move(left.x, left.y, { steps: 8 });

    expect(await valueOf(input), "dragging anticlockwise to the left turns it down to one sixth").toBe(17);
    expect(await readout(page, "knob"), "and the owner follows every move").toContain("value: 17");

    await page.mouse.up();

    expect(await valueOf(input), "letting go keeps the value the drag ended on").toBe(17);
    expect(await readout(page, "knob")).toContain("value: 17");
});

const RIGHT_TO_LEFT = demo("rightToLeft");

/**
 * The thumbs the Playground's painter draws, as screen boxes. They are the painter's, with no hook of their own, so
 * they are found by where they sit — the painted layer beside the two native inputs, after its track and fill — and
 * which value each stands for is never assumed from its place in the markup: the tests below move one value and see
 * which drawn thumb follows.
 */
const drawnThumbs = (page: Page, scope: string) =>
    page
        .locator(`${scope} div:has(> input[type="range"]) > div:first-child > div:nth-child(n+3)`)
        .evaluateAll((thumbs) =>
            thumbs.map((thumb) => {
                const rect = thumb.getBoundingClientRect();

                return { x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.5 };
            }),
        );

/**
 * In a right-to-left box the track runs from the right, so the lower value is the thumb on the right. Raising the
 * lower value by the keyboard is how the spec learns which drawn thumb is the lower one: the thumb that moves is it,
 * and it has to move leftward, toward the higher one, and still sit to the right of it. The up arrow raises a native
 * range in either direction, where the right arrow follows the screen and lowers it here.
 */
test("in a right-to-left range the thumb drawn for the lower value sits to the right of the higher one", async ({
    page,
}) => {
    const low = page.locator(thumbs(RIGHT_TO_LEFT)).first();

    await low.scrollIntoViewIfNeeded();

    const before = await drawnThumbs(page, RIGHT_TO_LEFT);

    expect(before, "the painter draws a thumb for each value").toHaveLength(2);

    const high = page.locator(thumbs(RIGHT_TO_LEFT)).last();
    const lowBefore = await valueOf(low);
    const highBefore = await valueOf(high);

    await low.focus();
    for (let press = 0; press < 5; press++) await page.keyboard.press("ArrowUp");

    expect(await valueOf(low), "the up arrow raises the lower value whatever the direction").toBeGreaterThan(lowBefore);
    expect(await valueOf(high), "and leaves the higher one alone").toBe(highBefore);

    const after = await drawnThumbs(page, RIGHT_TO_LEFT);
    const movedIndex = after.findIndex((point, index) => Math.abs(point.x - before[index].x) > 1);
    const otherIndex = 1 - movedIndex;

    expect(movedIndex, "exactly one drawn thumb moved").toBeGreaterThanOrEqual(0);
    expect(after[otherIndex].x, "the other stayed where it was").toBeCloseTo(before[otherIndex].x, 0);
    expect(after[movedIndex].x, "a higher value is further left").toBeLessThan(before[movedIndex].x);
    expect(after[movedIndex].x, "and the lower value's thumb is still the one on the right").toBeGreaterThan(
        after[otherIndex].x,
    );
});

/**
 * The drawn thumbs and the native inputs must agree on where each value sits, or pressing the thumb that looks low
 * moves the high one — which the symmetric starting values (20 and 80) would hide if only one end were pressed. So
 * each drawn thumb is pressed on its middle and nudged a little toward the other, and only the value it was drawn for
 * may change.
 */
test("in a right-to-left range, pressing a drawn thumb moves that thumb's value and not the other", async ({
    page,
}) => {
    const low = page.locator(thumbs(RIGHT_TO_LEFT)).first();
    const high = page.locator(thumbs(RIGHT_TO_LEFT)).last();
    const NUDGE_PX = 20;

    await low.scrollIntoViewIfNeeded();

    const nudge = async (from: { x: number; y: number }, dx: number) => {
        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await page.mouse.move(from.x + dx, from.y, { steps: 5 });
        await page.mouse.up();
    };

    const [rightmost, leftmost] = (await drawnThumbs(page, RIGHT_TO_LEFT)).toSorted((a, b) => b.x - a.x);
    const lowBefore = await valueOf(low);
    const highBefore = await valueOf(high);

    await nudge(rightmost, -NUDGE_PX);

    expect(await valueOf(low), "the thumb drawn on the right is the lower value, and it moved").not.toBe(lowBefore);
    expect(await valueOf(high), "while the higher value did not").toBe(highBefore);

    const lowAfter = await valueOf(low);

    await nudge(leftmost, NUDGE_PX);

    expect(await valueOf(high), "the thumb drawn on the left is the higher value, and it moved").not.toBe(highBefore);
    expect(await valueOf(low), "while the lower value did not").toBe(lowAfter);
});
