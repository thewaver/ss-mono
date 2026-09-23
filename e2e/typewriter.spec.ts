import { type Page, expect, test } from "@playwright/test";

import { example, prop } from "./helpers";

const COMPLEX = example("complex");
const MEASURE_COPY = `${COMPLEX} [inert]`;

const SOURCE_TEXT = "This is a bit of text that appearsonesingle text character at a time,and hasescaped characters.";

const outputText = (selector: string) => (selector: string) => {
    const measured = document.querySelector(selector);

    return (measured?.nextElementSibling?.textContent ?? "").replace(/\s+/g, " ").trim();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/type-writer");
    await expect(page.locator(MEASURE_COPY)).toBeAttached();
});

/**
 * The component renders the source twice: once to measure, once as the per-character output it animates.
 * The measuring copy is the accessibility hazard — left readable, a screen reader would announce the
 * whole text and then every character of it again.
 */
test("the measuring copy is hidden from assistive technology and from the tab order", async ({ page }) => {
    await expect(page.locator(MEASURE_COPY), "the measuring copy is hidden from a screen reader").toHaveAttribute(
        "aria-hidden",
        "true",
    );
    await expect(
        page.locator(MEASURE_COPY),
        "and inert, so nothing inside it can be tabbed to or clicked",
    ).toHaveAttribute("inert", "");
    await expect(page.locator(`${MEASURE_COPY} a`), "even though it contains a real link").toHaveCount(1);
});

test("the typed output carries the source text exactly", async ({ page }) => {
    const text = await page.evaluate(outputText(MEASURE_COPY), MEASURE_COPY);

    expect(text, "a splitter that drops or repeats a character is invisible on the page and obvious here").toBe(
        SOURCE_TEXT,
    );
});

test("the output is split per character rather than left as one run", async ({ page }) => {
    const spans = await page.locator(`${COMPLEX} [inert] + div span`).count();

    expect(spans, "each animated element needs its own box to be staggered").toBeGreaterThan(5);
});

test("structure survives the split but presentation is flattened onto the spans", async ({ page }) => {
    const output = page.locator(`${COMPLEX} [inert] + div`);

    await expect(output.locator("a[href]"), "a link stays a link, so the text is still usable").toHaveCount(1);
    await expect(output.locator("img"), "and an image stays an image").toHaveCount(1);
    await expect(
        output.locator("b"),
        "while bold is not re-emitted as a tag — it arrives as weight on the spans instead",
    ).toHaveCount(0);

    const inheritedWeight = await page.evaluate(() => getComputedStyle(document.body).fontWeight);

    const weights = await output
        .locator("span")
        .evaluateAll((spans) => [...new Set(spans.map((span) => getComputedStyle(span).fontWeight))].sort());

    expect(weights, "the plain run carries the weight the page hands it, whatever the theme sets that to").toContain(
        inheritedWeight,
    );
    expect(
        weights.some((weight) => Number(weight) > Number(inheritedWeight)),
        "and the bold run survives flattening as a heavier weight than its surroundings",
    ).toBe(true);
});

test("re-laying out the container leaves the text intact", async ({ page }) => {
    const width = page.locator(`${prop("textContainerWidth")} input`);

    await width.fill("320");
    await width.blur();

    await expect
        .poll(() => page.evaluate(outputText(MEASURE_COPY), MEASURE_COPY), {
            message: "a re-measure re-splits the text, and must not lose any of it on the way",
        })
        .toBe(SOURCE_TEXT);
});

/**
 * The phrases example owns a loop of its own: a run's end either holds the phrase and switches the component to
 * erasing, or — once an erase has ended — moves to the next phrase and types it. So the loop is read the way a
 * visitor sees it, from the phrase in the measuring copy, whether a run is playing (the output is split into a
 * box per character only while one is), and whether the text at rest is showing: an erased text rests hidden.
 *
 * The caret is the one `aria-hidden` element inside the output, which is how the example marks it.
 */
const PHRASES = example("phrases");
const PHRASES_COPY = `${PHRASES} [inert]`;
const PAUSE = "#pausePhrases";
const LOOP_TIMEOUT_MS = 15_000;
const PAUSED_WATCH_MS = 3_000;
const CARET_SAMPLES = 6;

type PhraseState = { phrase: string; isPlaying: boolean; isShowing: boolean };

const phraseState = (page: Page): Promise<PhraseState> =>
    page.evaluate((copySelector) => {
        const copy = document.querySelector(copySelector)!;
        const output = copy.nextElementSibling;
        const texts = output ? [...output.children].filter((child) => (child.textContent ?? "").trim() !== "") : [];

        return {
            phrase: (copy.textContent ?? "").trim(),
            isPlaying: !!output?.querySelector(":scope > span > span"),
            isShowing: texts.some((text) => text.checkVisibility({ visibilityProperty: true })),
        };
    }, PHRASES_COPY);

/**
 * One frame's reading of a run in progress, taken inside an animation frame so that every character's own
 * `animationstart` for that frame has already been handled: which characters have begun arriving, which way
 * the run is playing, where the caret sits among the characters, and the caret's box beside the box of the
 * character it follows.
 */
const runFrame = (page: Page) =>
    page.evaluate(
        (copySelector) =>
            new Promise<{
                direction: string;
                delays: number[];
                started: boolean[];
                caretCount: number;
                caretAfter: number;
                caret: { top: number; bottom: number; left: number } | null;
                before: { top: number; bottom: number; right: number } | null;
            } | null>((resolve) =>
                requestAnimationFrame(() => {
                    const output = document.querySelector(copySelector)!.nextElementSibling;
                    const characters = output
                        ? [...output.querySelectorAll(":scope > span > span:not([aria-hidden])")]
                        : [];
                    const animations = characters.map((character) => character.getAnimations()[0]);

                    if (!output || characters.length === 0 || animations.some((animation) => !animation)) {
                        return resolve(null);
                    }

                    const carets = [...output.querySelectorAll("[aria-hidden]")];
                    const caret = carets[0];
                    const caretAfter = caret ? characters.indexOf(caret.previousElementSibling!) : -1;
                    const caretRect = caret?.getBoundingClientRect();
                    const beforeRect = caretAfter >= 0 ? characters[caretAfter].getBoundingClientRect() : undefined;
                    const delayOf = (animation: Animation) => Number(animation.effect!.getTiming().delay ?? 0);

                    resolve({
                        direction: String(animations[0].effect!.getComputedTiming().direction),
                        delays: animations.map(delayOf),
                        started: animations.map(
                            (animation) => Number(animation.currentTime ?? -1) >= delayOf(animation),
                        ),
                        caretCount: carets.length,
                        caretAfter,
                        caret: caretRect
                            ? { top: caretRect.top, bottom: caretRect.bottom, left: caretRect.left }
                            : null,
                        before: beforeRect
                            ? { top: beforeRect.top, bottom: beforeRect.bottom, right: beforeRect.right }
                            : null,
                    });
                }),
            ),
        PHRASES_COPY,
    );

const typingFrame = async (page: Page, direction = "normal") => {
    let frame: Awaited<ReturnType<typeof runFrame>> = null;

    await expect
        .poll(
            async () => {
                frame = await runFrame(page);

                return frame?.direction === direction;
            },
            { message: `a run playing ${direction} is caught`, timeout: LOOP_TIMEOUT_MS, intervals: [50] },
        )
        .toBe(true);

    return frame!;
};

const pickArrivalOrder = async (page: Page, key: string) => {
    await page.locator(`${prop("arrivalOrder")} [role="combobox"]`).click();
    await page.getByRole("option", { name: key, exact: true }).click();
};

const isIncreasing = (values: number[]) => values.every((value, index) => index === 0 || value > values[index - 1]);

const isDecreasing = (values: number[]) => values.every((value, index) => index === 0 || value < values[index - 1]);

test("the phrase erases and the next one types in, with nobody pressing anything", async ({ page }) => {
    const first = (await phraseState(page)).phrase;

    await typingFrame(page, "reverse");

    expect((await phraseState(page)).phrase, "the phrase on screen is the one being erased").toBe(first);

    await expect
        .poll(async () => (await phraseState(page)).phrase, {
            message: "once the erase ends the loop moves on to another phrase",
            timeout: LOOP_TIMEOUT_MS,
        })
        .not.toBe(first);

    await expect
        .poll(async () => (await phraseState(page)).isShowing, {
            message: "and types it in, where it rests showing",
            timeout: LOOP_TIMEOUT_MS,
        })
        .toBe(true);
});

/**
 * WCAG 2.2.2 Pause, Stop, Hide: the loop starts on its own and runs on past five seconds, so it needs a way to
 * stop it. A pause lets the run already playing finish and then holds whatever is on screen, so the check is
 * that once the text is at rest it stays exactly as it is for longer than the loop would ever wait, and that
 * resuming sets it going again.
 *
 * The pause is pressed while a phrase is being erased, because that is the one place the loop ever rests on an
 * erased text — unpaused, the next phrase starts typing the moment an erase ends. An erased text rests hidden.
 * If the press lands only after that erase has finished, the next phrase is already typing and the rest is that
 * phrase showing, so which of the two to expect is read off the phrase.
 */
test("Pause holds the loop where it is, an erased phrase rests hidden, and resuming sets it going again", async ({
    page,
}) => {
    await typingFrame(page, "reverse");

    const erasing = (await phraseState(page)).phrase;

    await page.locator(PAUSE).click();

    await expect
        .poll(async () => (await phraseState(page)).isPlaying, {
            message: "the run that was playing is allowed to finish",
            timeout: LOOP_TIMEOUT_MS,
        })
        .toBe(false);

    const held = await phraseState(page);

    expect(
        held.isShowing,
        held.phrase === erasing ? "the erased phrase rests hidden" : "the phrase typed in rests showing",
    ).toBe(held.phrase !== erasing);

    await page.waitForTimeout(PAUSED_WATCH_MS);

    expect(await phraseState(page), "nothing types, erases or changes phrase while paused").toEqual(held);

    await page.locator(PAUSE).click();

    await expect
        .poll(() => phraseState(page), { message: "resuming picks the loop up again", timeout: LOOP_TIMEOUT_MS })
        .not.toEqual(held);
});

/**
 * The caret is moved by each character's own `animationstart`, so at any frame of a typing run it sits right
 * after the last character to have begun arriving: everything before it has started and nothing after it has.
 * It is placed inline, after that character, so it shares that character's line and sits to its right —
 * wherever the text has wrapped to.
 */
test("while typing, the caret sits right after the most recent arrival, on that character's line", async ({ page }) => {
    const samples: NonNullable<Awaited<ReturnType<typeof runFrame>>>[] = [];

    while (samples.length < CARET_SAMPLES) {
        const frame = await typingFrame(page);

        if (frame.caretAfter >= 0) samples.push(frame);
    }

    for (const frame of samples) {
        expect(frame.caretCount, "there is exactly one caret while a run plays").toBe(1);
        expect(
            frame.started.slice(0, frame.caretAfter + 1),
            "every character up to the caret has begun arriving",
        ).not.toContain(false);
        expect(frame.started.slice(frame.caretAfter + 1), "and none after it has").not.toContain(true);

        const middle = (frame.caret!.top + frame.caret!.bottom) / 2;

        expect(middle, "the caret is on the line of the character it follows").toBeGreaterThanOrEqual(
            frame.before!.top,
        );
        expect(middle, "the caret is on the line of the character it follows").toBeLessThanOrEqual(
            frame.before!.bottom,
        );
        expect(frame.caret!.left, "and just to its right").toBeGreaterThanOrEqual(frame.before!.right - 1);
    }
});

/**
 * Once a phrase has typed in, the caret rests after the whole text — so it is on the line the text ends on,
 * to the right of the last character.
 */
test("at rest after typing, the caret sits after the last character, on its line", async ({ page }) => {
    const readRest = () =>
        page.evaluate((copySelector) => {
            const output = document.querySelector(copySelector)!.nextElementSibling;
            const caret = output?.querySelector("[aria-hidden]");
            const text = output
                ? [...output.children].filter((child) => (child.textContent ?? "").trim() !== "").at(-1)
                : undefined;

            if (!caret || !text || output!.querySelector(":scope > span > span")) return null;
            if (!text.checkVisibility({ visibilityProperty: true })) return null;

            const caretRect = caret.getBoundingClientRect();
            const range = document.createRange();

            range.selectNodeContents(text);

            const lastLine = [...range.getClientRects()].at(-1)!;

            return {
                caretMiddle: (caretRect.top + caretRect.bottom) / 2,
                caretLeft: caretRect.left,
                lineTop: lastLine.top,
                lineBottom: lastLine.bottom,
                lineRight: lastLine.right,
            };
        }, PHRASES_COPY);

    let rest: Awaited<ReturnType<typeof readRest>> = null;

    await expect
        .poll(
            async () => {
                rest = await readRest();

                return rest !== null;
            },
            { message: "a typed phrase is caught at rest", timeout: LOOP_TIMEOUT_MS, intervals: [50] },
        )
        .toBe(true);

    expect(rest!.caretMiddle, "the caret is on the line the text ends on").toBeGreaterThanOrEqual(rest!.lineTop);
    expect(rest!.caretMiddle, "the caret is on the line the text ends on").toBeLessThanOrEqual(rest!.lineBottom);
    expect(rest!.caretLeft, "and after its last character").toBeGreaterThanOrEqual(rest!.lineRight - 1);
});

/**
 * `computeCharacterWeights` decides the order the characters arrive in, and the page's "Arrival order" knob
 * hands it one of the sample orders. The order is read as each character's start delay, compared with its
 * neighbours' — left to right means every character starts after the one before it, right to left means every
 * one starts before it — and erasing plays the same order backwards.
 */
test("the arrival order decides which characters arrive first, and erasing runs it backwards", async ({ page }) => {
    const leftToRight = await typingFrame(page);

    expect(leftToRight.delays.length, "the phrase has characters to order").toBeGreaterThan(1);
    expect(isIncreasing(leftToRight.delays), "by default each character starts after the one before it").toBe(true);

    await pickArrivalOrder(page, "rightToLeft");

    const rightToLeft = await typingFrame(page);

    expect(isDecreasing(rightToLeft.delays), "right to left, each character starts before the one before it").toBe(
        true,
    );

    const erasing = await typingFrame(page, "reverse");

    expect(isIncreasing(erasing.delays), "and erasing takes them away in the opposite order").toBe(true);
});
