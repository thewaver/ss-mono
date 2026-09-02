import { type Page, expect, test } from "@playwright/test";

import { accessibleText, demo, example, prop } from "./helpers";

/**
 * The component replaces what a position shows while it is churning, which makes almost everything about it
 * a relationship between two moments rather than a value anybody could write down. So nothing here spells
 * out the example's copy: the settled text is read off the page and used as the yardstick for the churning
 * text, and a spec that stayed literal would answer "has somebody reworded the demo" in the same red as
 * "has the splitting broken".
 *
 * A character is a span holding a leaf span — the one carrying the character it will settle on — with the
 * noise glyph added over it while it churns. Each word is a span around its characters, so that a line can
 * only break where a space was, and the two are told apart by whether the first child has children of its
 * own. That structure is what the queries below go by, and the
 * paragraph test is the guard on it: if the selector ever matched something that is not a character, the
 * count would stop agreeing with the text the page reads out.
 *
 * Every test starts from a component that has finished, because a restart is refused while a run is going.
 * `beforeEach` therefore drives the settle right down, waits for the mounting run to end, and then puts it
 * back up so that "while it is churning" is a state the browser can be caught in.
 */
const HEADLINE = example("headline");
const SEQUENTIAL = example("sequential");
const SWAP = example("swap");

const RESTART = "#runItAgain";
const REVEAL_AGAIN = "#revealAgain";
const NEXT_STATUS = "#nextStatus";
const NOISE = "[aria-hidden]";

const SLOW_SETTLE_MS = 6000;
const PART_WAY_SETTLE_MS = 2000;
const QUICK_SETTLE_MS = 60;
const PART_WAY_MS = 900;

const numberField = (key: string) => `${prop(key)} input`;

const setSettleDuration = async (page: Page, value: number) => {
    await page.locator(numberField("settleDurationMs")).fill(String(value));
    await page.locator(numberField("settleDurationMs")).blur();
};

const readCharacters = (page: Page, selector: string) =>
    page.evaluate(
        (value) =>
            [...document.querySelectorAll(`${value.scope} [data-demo] span`)]
                .filter((element) => element.firstElementChild?.childElementCount === 0)
                .map((character) => ({
                    settling: (character.firstElementChild?.textContent ?? "").trim(),
                    noise: (character.querySelector(value.noise)?.textContent ?? "").trim(),
                    isChurning: !!character.querySelector(value.noise),
                    width: (character as HTMLElement).offsetWidth,
                })),
        { scope: selector, noise: NOISE },
    );

const churningCount = async (page: Page, selector: string) =>
    (await readCharacters(page, selector)).filter((character) => character.isChurning).length;

const settle = async (page: Page, selector: string) => {
    await setSettleDuration(page, QUICK_SETTLE_MS);
    await expect.poll(() => churningCount(page, selector)).toBe(0);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/scramble-text");
    await expect(page.locator(HEADLINE)).toBeVisible();
    await settle(page, HEADLINE);
    await setSettleDuration(page, SLOW_SETTLE_MS);
});

test("a screen reader is given the settled text the whole way through, and never the noise", async ({ page }) => {
    await page.locator(RESTART).click();

    const churning = await accessibleText(page.locator(demo("headline")));

    expect(
        await churningCount(page, HEADLINE),
        "the run has to still be going for this to mean anything",
    ).toBeGreaterThan(0);

    await settle(page, HEADLINE);

    expect(churning, "the noise is decoration and the real string is the content").toBe(
        await accessibleText(page.locator(demo("headline"))),
    );
});

test("the glyph a position churns through is never the character it is going to settle on", async ({ page }) => {
    await page.locator(RESTART).click();

    const churning = (await readCharacters(page, HEADLINE)).filter((character) => character.isChurning);

    expect(churning.length, "the run has to still be going for this to mean anything").toBeGreaterThan(0);
    expect(
        churning.filter((character) => character.noise === character.settling),
        "a position showing its own answer reads as settled a beat before it is",
    ).toEqual([]);
});

test("no position changes width between churning and settled, so the line cannot rewrap", async ({ page }) => {
    await page.locator(RESTART).click();

    const churning = (await readCharacters(page, HEADLINE)).map((character) => character.width);

    await settle(page, HEADLINE);

    const settled = (await readCharacters(page, HEADLINE)).map((character) => character.width);

    expect(churning.length, "the same positions are being compared").toBe(settled.length);
    expect(churning, "a position is sized by the character it will become, not by the glyph sitting on it").toEqual(
        settled,
    );
});

test("the gaps between the words are left alone, so only the characters are wrapped", async ({ page }) => {
    const counted = await page.evaluate(
        (value) => {
            const characters = [...document.querySelectorAll(`${value.scope} [data-demo] span`)].filter(
                (element) => element.firstElementChild?.childElementCount === 0,
            );
            const clone = characters[0]?.parentElement?.parentElement?.cloneNode(true) as HTMLElement;

            for (const hidden of clone.querySelectorAll(value.noise)) hidden.remove();

            return { boxes: characters.length, letters: (clone.textContent ?? "").replace(/\s/g, "").length };
        },
        { scope: HEADLINE, noise: NOISE },
    );

    expect(counted.letters, "the text has something in it to count").toBeGreaterThan(0);
    expect(
        counted.boxes,
        "a space stays a text node rather than becoming a box, which is what keeps a line able to break",
    ).toBe(counted.letters);
});

test("with the default order the settled positions are a prefix, never a scatter", async ({ page }) => {
    await setSettleDuration(page, PART_WAY_SETTLE_MS);
    await page.locator(RESTART).click();
    await page.waitForTimeout(PART_WAY_MS);

    const flags = (await readCharacters(page, HEADLINE)).map((character) => !character.isChurning);
    const firstChurning = flags.indexOf(false);

    expect(firstChurning, "the sample landed before anything had settled, so it says nothing").toBeGreaterThan(0);
    expect(
        flags.slice(firstChurning).some((isSettled) => isSettled),
        "left to right means everything before the churn has finished and nothing after it has",
    ).toBe(false);
});

test("the controller refuses a restart while a run is going, and takes one once it has finished", async ({ page }) => {
    await page.locator(RESTART).click();
    expect(await churningCount(page, HEADLINE), "the first press started a run").toBeGreaterThan(0);

    await page.locator(RESTART).click();
    expect(await churningCount(page, HEADLINE), "a second press mid-run does not start it over").toBeGreaterThan(0);

    await settle(page, HEADLINE);
    await setSettleDuration(page, SLOW_SETTLE_MS);
    await page.locator(RESTART).click();

    expect(
        await churningCount(page, HEADLINE),
        "an idle component takes the restart it was refusing a moment ago",
    ).toBeGreaterThan(0);
});

/**
 * The reason this component reserves the space rather than growing into it. A word revealed a character at a
 * time is narrower than the word will be, so a browser laying out the narrow version puts more on the line
 * than will fit once the rest arrives — and the word jumps to the next line while it is being revealed. The
 * check is a word's own line position at the start of the run against the same word once it has finished.
 */
test("a word holds its whole width from the first frame, so no word changes line as the reveal passes it", async ({
    page,
}) => {
    await settle(page, SEQUENTIAL);
    await setSettleDuration(page, SLOW_SETTLE_MS);

    const wordTops = () =>
        page.evaluate((value) => {
            const words = [...document.querySelectorAll(`${value} [data-demo] span`)].filter(
                (element) => element.firstElementChild?.childElementCount !== 0 && element.children.length > 0,
            );

            return words.map((word) => (word as HTMLElement).offsetTop);
        }, SEQUENTIAL);

    await page.locator(REVEAL_AGAIN).click();

    const atStart = await wordTops();

    expect(atStart.length, "the line has words on more than one row to be worth checking").toBeGreaterThan(1);
    expect(new Set(atStart).size, "and it really does wrap").toBeGreaterThan(1);

    await settle(page, SEQUENTIAL);

    expect(await wordTops(), "every word is on the row it started on").toEqual(atStart);
});

test("changing the text is what starts a run, with nothing asking for one", async ({ page }) => {
    await settle(page, SWAP);
    await setSettleDuration(page, SLOW_SETTLE_MS);

    await page.locator(NEXT_STATUS).click();

    expect(
        await churningCount(page, SWAP),
        "no controller is held here, so the new string is the only thing that could have started it",
    ).toBeGreaterThan(0);
});
