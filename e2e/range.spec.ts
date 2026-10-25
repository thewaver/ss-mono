import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, attributesOf, docsDemo, docsSettled, inputValue, prop, tabIndex, turnDegrees } from "./helpers";

const DOCS = "/src/App/Pages/RangePage/Docs";

const DEFAULT = docsDemo(DOCS, "Basic");
const STEPPED = docsDemo(DOCS, "Stepping");
const PAIR = docsDemo(DOCS, "Pair");
const TOOLTIP = docsDemo(DOCS, "Tooltip");
const KNOB = docsDemo(DOCS, "Knob");
const RIGHT_TO_LEFT = docsDemo(DOCS, "RightToLeft");

const thumbs = (scope: string) => `${scope} input[type="range"]`;

const valueOf = async (locator: Locator) => Number(await inputValue(locator));

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/** The example's own readout, which shows what the owner holds. */
const readoutOf = async (page: Page, scope: string) =>
    ((await page.locator(`${scope} [data-readout]`).textContent()) ?? "").trim();

/** The numbers a readout shows, in order. */
const numbersIn = async (page: Page, scope: string) =>
    ((await readoutOf(page, scope)).match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

const chooseOrientation = async (page: Page, name: string) => {
    await page.locator(`${prop("orientation")} [role="combobox"]`).click();
    await page.locator('[role="listbox"]').getByRole("option", { name, exact: true }).click();
};

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
    await page.goto("/range/docs");
    await expect(page.locator(thumbs(DEFAULT))).toBeVisible();
    await docsSettled(page);
});

test("one thumb is one native input and a pair is two, each naming itself", async ({ page }) => {
    await expect(page.locator(thumbs(DEFAULT)), "a single value is one input").toHaveCount(1);
    await expect(page.locator(thumbs(PAIR)), "and a pair is the same case rendered twice").toHaveCount(2);

    const pairNames = await attributesOf(page, thumbs(PAIR), "aria-label");

    expect(pairNames[0], "each thumb carries a name").toBeTruthy();
    expect(pairNames[1]).toBeTruthy();
    expect(pairNames[0], "of its own").not.toBe(pairNames[1]);
    expect(
        (await attributesOf(page, thumbs(DEFAULT), "aria-label"))[0],
        "while a single thumb falls back to the control's",
    ).toBeTruthy();
});

test("no range uses the native disabled attribute, and only the reachable one keeps its tab stop", async ({ page }) => {
    await knob(page, "isDisabled").click();
    await knob(page, "tooltipIsReachableWhenDisabled").click();
    await knob(page, "tooltipIsDisabled").click();

    await expect(page.locator("input[disabled]"), "disabled is aria-disabled here and never the attribute").toHaveCount(
        0,
    );
    await expect(page.locator(thumbs(DEFAULT))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(thumbs(TOOLTIP))).toHaveAttribute("aria-disabled", "true");

    expect(await tabIndex(page.locator(thumbs(DEFAULT))), "a disabled range is out of the tab order").toBe(-1);
    expect(
        await tabIndex(page.locator(thumbs(TOOLTIP))),
        "while a reachable one stays in it, so its tooltip can be read",
    ).toBe(0);

    await page.locator(thumbs(TOOLTIP)).hover({ force: true });
    await expect(page.locator('[role="tooltip"]'), "and hovering it shows that tooltip").toBeVisible();
});

test("crossing is prevented by the inputs' own bounds rather than by a guard", async ({ page }) => {
    const low = page.locator(thumbs(PAIR)).first();
    const high = page.locator(thumbs(PAIR)).last();

    const lowValue = await inputValue(low);
    const highValue = await inputValue(high);

    await expect(low, "the low thumb's ceiling is the high thumb's current value").toHaveAttribute("max", highValue);
    await expect(high, "and the high thumb's floor is the low thumb's").toHaveAttribute("min", lowValue);

    await low.focus();
    await page.keyboard.press("End");

    expect(await valueOf(low), "so End stops at the neighbor rather than at the end of the scale").toBe(
        Number(highValue),
    );
    expect(await numbersIn(page, PAIR), "and the owner sees the clamped value").toEqual([
        Number(highValue),
        Number(highValue),
    ]);
    await expect(high, "with the neighbor's floor following it up").toHaveAttribute("min", highValue);
});

test("two thumbs on the same value are not stuck, because the pointer's side breaks the tie", async ({ page }) => {
    const low = page.locator(thumbs(PAIR)).first();
    const high = page.locator(thumbs(PAIR)).last();

    const pile = await valueOf(high);

    await low.focus();
    await page.keyboard.press("End");
    expect(await valueOf(low), "drive both thumbs onto one value").toBe(pile);

    await dragFrom(page, high, 0.4, 0.2);

    expect(await valueOf(low), "pressing below the pile and dragging left frees the low thumb").toBeLessThan(pile);
    expect(await valueOf(high), "and leaves the high one where it was").toBe(pile);
});

test("stepping honors the step and stops at both ends of the scale", async ({ page }) => {
    const input = page.locator(thumbs(STEPPED));
    const min = Number(await input.getAttribute("min"));
    const max = Number(await input.getAttribute("max"));
    const step = Number(await input.getAttribute("step"));

    expect(max, "the example's scale has room for more than one step").toBeGreaterThan(min + step);

    await input.focus();
    await page.keyboard.press("Home");

    expect(await valueOf(input), "Home is the floor").toBe(min);
    expect(await numbersIn(page, STEPPED), "which the owner sees").toEqual([min]);

    await page.keyboard.press("ArrowRight");
    expect(await valueOf(input), "one press moves one step").toBe(min + step);

    await page.keyboard.press("End");
    await page.keyboard.press("ArrowRight");
    expect(await valueOf(input), "and the ceiling is a wall rather than a wrap").toBe(max);
});

test("a vertical range puts the low value at the bottom", async ({ page }) => {
    await chooseOrientation(page, "vertical");

    const input = page.locator(thumbs(DEFAULT));

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
    await knob(page, "isDisabled").click();

    const input = page.locator(thumbs(DEFAULT));
    const before = await valueOf(input);
    const heard = await readoutOf(page, DEFAULT);
    const box = (await input.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.5);

    expect(
        await valueOf(input),
        "the browser moves a range before it reports, so the sync writes state back over it",
    ).toBe(before);
    expect(await readoutOf(page, DEFAULT), "and the owner never hears about it").toBe(heard);
    expect(await activeMatches(page, thumbs(DEFAULT)), "the mousedown refusal also keeps focus off it").toBe(false);
});

/**
 * `InteractionWrapper` is handed one control element and does everything about disabled to that one, so a
 * pair's second thumb used to keep the native `tabIndex` of 0 and take focus from a click while the whole
 * control was disabled — tab-reachable, focusable, and refusing to move. Only the first thumb was covered
 * because only the first is the wrapper's. Both are asserted here, because the one that was wrong is the
 * one no other variant on the page can show.
 */
test("a disabled pair takes both of its thumbs out of the tab order, not just the wrapper's own", async ({ page }) => {
    await knob(page, "pairIsDisabled").click();

    const low = page.locator(thumbs(PAIR)).first();
    const high = page.locator(thumbs(PAIR)).last();
    const before = await readoutOf(page, PAIR);

    expect(await tabIndex(low), "the thumb the wrapper holds is skipped").toBe(-1);
    expect(await tabIndex(high), "and so is the one it never saw").toBe(-1);

    const box = (await high.boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.5);

    expect(await activeMatches(page, thumbs(PAIR)), "neither thumb takes focus from a click").toBe(false);
    expect(await readoutOf(page, PAIR), "and the value is where it started").toBe(before);
});

test("the owner's error reaches the element as ARIA, and leaves when the owner clears it", async ({ page }) => {
    const input = page.locator(thumbs(DEFAULT));

    await expect(input, "no error is claimed before the owner sets one").not.toHaveAttribute("aria-invalid", "true");

    await knob(page, "hasError").click();

    await expect(input, "the error state is published rather than only painted").toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await knob(page, "hasError").click();

    await expect(input, "and it clears when the owner clears it").not.toHaveAttribute("aria-invalid", "true");
});

/**
 * The knob's travel as the example sets it: the lowest value at 135° (down and to the left, with 0° pointing
 * right and angles growing clockwise) and 270° of sweep from there, so straight up is the middle of the
 * scale and straight right is five sixths of it. A point is named by where it sits on the knob's box, and
 * the box is read from the native input, which is laid over the knob edge to edge and is the rectangle the
 * component itself measures. The knob sits far down the Docs page, so it is scrolled on screen first: a mouse
 * press below the window lands nowhere.
 */
const knobPoint = async (page: Page, where: "top" | "right" | "left") => {
    await page.locator(thumbs(KNOB)).scrollIntoViewIfNeeded();

    const box = (await page.locator(thumbs(KNOB)).boundingBox())!;
    const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
    const reach = Math.min(box.width, box.height) * 0.4;

    if (where === "top") return { x: center.x, y: center.y - reach };

    return { x: center.x + (where === "right" ? reach : -reach), y: center.y };
};

const KNOB_POINTER = `${KNOB} [style*="rotate("]`;

/** The knob prints its own value, and that print is hidden from screen readers, which hear the input's value. */
const knobPrint = async (page: Page) =>
    Number(((await page.locator(`${KNOB} [aria-hidden="true"]`).last().textContent()) ?? "").trim());

test("the knob is still one named slider the keyboard steps", async ({ page }) => {
    const input = page.locator(thumbs(KNOB));

    await expect(input, "a knob is the same native range input underneath").toHaveCount(1);
    expect(await input.getAttribute("aria-label"), "named for a screen reader").toBeTruthy();

    const before = await valueOf(input);

    expect(await knobPrint(page), "the knob prints the value the input holds").toBe(before);

    await input.focus();
    await page.keyboard.press("ArrowRight");

    expect(await valueOf(input), "and the arrow keys still step it").toBe(before + 1);
    expect(await knobPrint(page), "which the knob shows").toBe(before + 1);
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
    expect(await knobPrint(page), "and the knob shows it at once").toBe(83);
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
    expect(await knobPrint(page), "and the knob follows every move").toBe(17);

    await page.mouse.up();

    expect(await valueOf(input), "letting go keeps the value the drag ended on").toBe(17);
    expect(await knobPrint(page)).toBe(17);
});

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
