import { type Page, expect, test } from "@playwright/test";

import { demo } from "./helpers";

/**
 * Every letter plays its keyframes held at how near the point is, so what a letter is doing is read off its own
 * animation's timing — `0` at rest, `1` under the point — and never off what it looks like. The letters drawn are
 * the first set inside the demo; a second, hidden set at rest is what nearness is measured against, and sits after
 * it.
 */
const POINTER = demo("pointer");

const visibleLetters = (page: Page) =>
    page.locator(POINTER).evaluate((root) => {
        const lines = root.querySelector("[inert] + div") as HTMLElement;

        return [...lines.querySelectorAll("span span")].map((letter) => ({
            progress: Number((letter as HTMLElement).getAnimations()[0]?.effect?.getComputedTiming().progress ?? -1),
            top: (letter as HTMLElement).offsetTop,
            text: letter.textContent,
        }));
    });

/** Which letters start a line, as the list of letter counts per line, which is what a moved break would change. */
const lineLengths = (letters: { top: number }[]) =>
    letters.reduce<number[]>((lengths, letter, index) => {
        if (index === 0 || letter.top !== letters[index - 1].top) lengths.push(0);

        lengths[lengths.length - 1]++;

        return lengths;
    }, []);

test.beforeEach(async ({ page }) => {
    await page.goto("/proximity-text");
    await page.mouse.move(0, 0);
    await expect(page.locator(`${POINTER} [inert] + div span span`).first()).toBeAttached();
});

test("a letter under the pointer is held further through its keyframes than one far from it", async ({ page }) => {
    const first = page.locator(`${POINTER} [inert] + div span span`).first();
    const box = (await first.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);

    await expect
        .poll(
            async () => {
                const letters = await visibleLetters(page);

                return letters[0].progress > 0.9 && letters.at(-1)!.progress === 0;
            },
            { message: "the first letter swells and the last, a paragraph away, rests" },
        )
        .toBe(true);
});

test("swelling letters never move a line break", async ({ page }) => {
    const before = lineLengths(await visibleLetters(page));
    const first = page.locator(`${POINTER} [inert] + div span span`).nth(3);
    const box = (await first.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);

    await expect.poll(async () => (await visibleLetters(page))[3].progress).toBeGreaterThan(0.9);

    expect(lineLengths(await visibleLetters(page)), "every line holds the same letters it did at rest").toEqual(before);
});

/**
 * With `PaintedText` inside, the letters are drawn as SVG, one `text` element each in the first painted layer. They
 * grow and push the rest of their line along as plain text does, so a letter after the pointer on its line is drawn
 * further right than it was at rest; the baselines it sits on, which are the line breaks, stay where they were.
 * A baseline is read to the whole pixel: swelling letters move it by a few hundred-thousandths, which is no line
 * moving, and a line that did move would move by a whole line's height.
 */
const PAINTED = demo("painted");

const paintedLetters = (page: Page) =>
    page
        .locator(`${PAINTED} svg g`)
        .first()
        .evaluate((layer) =>
            [...layer.querySelectorAll("text")].map((letter) => ({
                x: Number(letter.getAttribute("x")),
                baseline: Math.round(Number(letter.getAttribute("y"))),
            })),
        );

test("painted letters push the rest of their line along, and the line breaks stay put", async ({ page }) => {
    await expect(page.locator(`${PAINTED} svg g text`).first()).toBeAttached();

    await page.locator(`${PAINTED} svg`).scrollIntoViewIfNeeded();

    const rest = await paintedLetters(page);
    const box = (await page.locator(`${PAINTED} svg`).boundingBox())!;

    await page.mouse.move(box.x + 4, box.y + 4);

    await expect
        .poll(
            async () => {
                const near = await paintedLetters(page);
                const lastOnFirstLine = near.filter((letter) => letter.baseline === rest[0].baseline).length - 1;

                return near[lastOnFirstLine].x - rest[lastOnFirstLine].x;
            },
            { message: "the end of the first line is pushed right by the letters swelling before it" },
        )
        .toBeGreaterThan(1);

    expect(
        (await paintedLetters(page)).map((letter) => letter.baseline),
        "every letter sits on the line it sat on at rest",
    ).toEqual(rest.map((letter) => letter.baseline));
});

/**
 * The barrel example measures nearness up and down only, so the point — the middle of a scrolling box — acts as a line
 * across the text: every letter on one line answers it alike, the line at the middle is held furthest through its
 * keyframes, and scrolling moves which line that is. Read off each letter's own animation, as above.
 */
const BARREL = demo("barrel");
const BARREL_BOX = "#barrelScrollBox";

const barrelLines = (page: Page) =>
    page.locator(BARREL).evaluate((root) => {
        const lines = root.querySelector("[inert] + div") as HTMLElement;
        const byLine = new Map<number, number[]>();

        for (const letter of lines.querySelectorAll("span span") as NodeListOf<HTMLElement>) {
            const progress = Number(letter.getAnimations()[0]?.effect?.getComputedTiming().progress ?? -1);

            byLine.set(letter.offsetTop, [...(byLine.get(letter.offsetTop) ?? []), progress]);
        }

        return [...byLine.entries()].sort(([first], [second]) => first - second).map(([, progresses]) => progresses);
    });

const strongestLine = (lines: number[][]) =>
    lines.reduce((best, line, index) => (line[0] > lines[best][0] ? index : best), 0);

const scrollBarrelTo = (page: Page, share: number) =>
    page.locator(BARREL_BOX).evaluate((box, value) => {
        box.scrollTop = (box.scrollHeight - box.clientHeight) * value;
    }, share);

test("measured up and down only, every letter on a line answers the point alike", async ({ page }) => {
    await page.locator(BARREL_BOX).scrollIntoViewIfNeeded();
    await scrollBarrelTo(page, 0.5);

    await expect
        .poll(
            async () => {
                const lines = await barrelLines(page);

                return (
                    lines.every((line) => Math.max(...line) - Math.min(...line) < 0.01) &&
                    lines.some((line) => line[0] > 0.9) &&
                    lines.some((line) => line[0] === 0)
                );
            },
            { message: "each line held at one point of its keyframes, the middle one far through and others at rest" },
        )
        .toBe(true);
});

test("scrolling the barrel moves which line is held furthest", async ({ page }) => {
    await page.locator(BARREL_BOX).scrollIntoViewIfNeeded();
    await scrollBarrelTo(page, 0.25);
    await expect.poll(async () => Math.max(...(await barrelLines(page)).map((line) => line[0]))).toBeGreaterThan(0.9);

    const before = strongestLine(await barrelLines(page));

    await scrollBarrelTo(page, 0.75);

    await expect
        .poll(async () => strongestLine(await barrelLines(page)), { message: "a line further down the text" })
        .toBeGreaterThan(before);
});
