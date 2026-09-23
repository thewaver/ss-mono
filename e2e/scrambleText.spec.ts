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
 * Every test starts from a component that has finished, so that nothing it reads is left over from the run
 * that played on mount. `beforeEach` therefore drives the settle right down, waits for the mounting run to end, and then puts it
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

/**
 * A restart asked for mid-run is not refused: it throws away the run in progress and plays again from the start.
 * Part-way through a run the left-hand characters have already landed, so the sign of a replay is that the
 * number still churning goes up again once the button is pressed.
 */
test("a restart asked for mid-run replays from the start, and an idle component takes one too", async ({ page }) => {
    await setSettleDuration(page, PART_WAY_SETTLE_MS);
    await page.locator(RESTART).click();
    await page.waitForTimeout(PART_WAY_MS);

    const partWay = await churningCount(page, HEADLINE);
    const total = (await readCharacters(page, HEADLINE)).length;

    expect(partWay, "the run has to still be going for this to mean anything").toBeGreaterThan(0);
    expect(partWay, "and some of it has to have landed already").toBeLessThan(total);

    await page.locator(RESTART).click();

    expect(
        await churningCount(page, HEADLINE),
        "the characters that had landed are churning again, because the run started over",
    ).toBeGreaterThan(partWay);

    await settle(page, HEADLINE);
    await setSettleDuration(page, SLOW_SETTLE_MS);
    await page.locator(RESTART).click();

    expect(await churningCount(page, HEADLINE), "an idle component takes a restart as well").toBeGreaterThan(0);
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

/**
 * `changedOnly` compares the new text with the old one and scrambles only what is new, so the reading here is
 * which characters churn after a text change, taken against both texts as the page shows them. The texts are
 * read off the characters themselves — the letters without the spaces, which stay plain text — so nothing
 * below names the example's builds.
 *
 * The comparison is a longest common subsequence: every character of the old text that survives in order into
 * the new one is carried over settled, and only the rest churns. So the number left settled is the length of
 * that subsequence, and the settled characters read in order are a piece of the old text.
 */
const CHANGED_ONLY = example("changedOnly");
const NEXT_BUILD = "#nextBuild";

const settledText = async (page: Page, selector: string) =>
    (await readCharacters(page, selector)).map((character) => character.settling).join("");

const commonSubsequenceLength = (a: string, b: string) => {
    const lengths = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
            lengths[i][j] =
                a[i - 1] === b[j - 1] ? lengths[i - 1][j - 1] + 1 : Math.max(lengths[i - 1][j], lengths[i][j - 1]);

    return lengths[a.length][b.length];
};

const isSubsequence = (part: string, whole: string) => {
    let at = 0;

    for (const character of whole) if (character === part[at]) at++;

    return at === part.length;
};

/**
 * Every position can read as settled a tick before the run has actually ended, and a run still going takes a
 * new duration on board — so putting the slow duration back in that gap stretches the old run and its
 * characters churn again. The settle is therefore repeated until the slow duration goes back in and the text
 * stays at rest, which is the only state a text change can be measured from.
 */
const nextBuildFromRest = async (page: Page) => {
    await expect
        .poll(
            async () => {
                await settle(page, CHANGED_ONLY);
                await setSettleDuration(page, SLOW_SETTLE_MS);

                return churningCount(page, CHANGED_ONLY);
            },
            { message: "the text is at rest before it is changed" },
        )
        .toBe(0);

    const before = await settledText(page, CHANGED_ONLY);

    await page.locator(NEXT_BUILD).click();

    return { before, characters: await readCharacters(page, CHANGED_ONLY) };
};

test("after a text change only the characters that changed churn, and the rest stay settled", async ({ page }) => {
    const { before, characters } = await nextBuildFromRest(page);
    const after = characters.map((character) => character.settling).join("");
    const settled = characters.filter((character) => !character.isChurning).map((character) => character.settling);

    expect(after, "the button really did change the text").not.toBe(before);
    expect(characters.filter((character) => character.isChurning).length, "what changed is churning").toBeGreaterThan(
        0,
    );
    expect(settled.length, "exactly the characters carried over from the old text are left settled").toBe(
        commonSubsequenceLength(before, after),
    );
    expect(isSubsequence(settled.join(""), before), "and each of them is one the old text already had").toBe(true);
});

/**
 * The case a position-by-position comparison gets wrong: an insertion moves everything after it along, and a
 * comparison by position would scramble all of that. The builds are stepped through until one is a pure
 * insertion — the old text is the new one's start and end with something added between — and then the start
 * and the end must be settled and only the added middle churns.
 */
test("the characters an insertion pushes along stay settled, and only the inserted ones churn", async ({ page }) => {
    for (let press = 0; press < 8; press++) {
        const { before, characters } = await nextBuildFromRest(page);
        const after = characters.map((character) => character.settling).join("");

        let prefix = 0;

        while (prefix < before.length && before[prefix] === after[prefix]) prefix++;

        const suffix = before.length - prefix;
        const isInsertion = after.length > before.length && after.endsWith(before.slice(prefix));

        if (!isInsertion) continue;

        const flags = characters.map((character) => character.isChurning);
        const insertedEnd = after.length - suffix;

        expect(flags.slice(0, prefix), "what comes before the insertion is untouched").not.toContain(true);
        expect(flags.slice(prefix, insertedEnd), "the inserted characters churn").not.toContain(false);
        expect(
            flags.slice(insertedEnd),
            "and what the insertion pushed along stays settled, though every one of them moved",
        ).not.toContain(true);

        return;
    }

    throw new Error("no press of the button made a pure insertion, so there was nothing to check");
});

/**
 * A character counts as carried over only if it had settled when the text changed, so a change made mid-run
 * cannot let a character that was still churning jump straight to its answer. The run started by one press is
 * still going when the second press lands, so the second change must leave no more characters settled than
 * were settled the moment before it — a carried character that was churning keeps churning.
 */
test("a text changed mid-run does not settle a carried character that was still churning", async ({ page }) => {
    const { characters } = await nextBuildFromRest(page);
    const churningBefore = characters.filter((character) => character.isChurning).length;

    expect(churningBefore, "the first change's run has to still be going for this to mean anything").toBeGreaterThan(0);

    const settledBefore = (await readCharacters(page, CHANGED_ONLY)).filter(
        (character) => !character.isChurning,
    ).length;

    await page.locator(NEXT_BUILD).click();

    const settledAfter = (await readCharacters(page, CHANGED_ONLY)).filter((character) => !character.isChurning).length;

    expect(settledAfter, "a second change settles nothing that had not settled already").toBeLessThanOrEqual(
        settledBefore,
    );
});
