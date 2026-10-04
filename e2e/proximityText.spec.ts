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
 */
const PAINTED = demo("painted");

const paintedLetters = (page: Page) =>
    page
        .locator(`${PAINTED} svg g`)
        .first()
        .evaluate((layer) =>
            [...layer.querySelectorAll("text")].map((letter) => ({
                x: Number(letter.getAttribute("x")),
                baseline: Number(letter.getAttribute("y")),
            })),
        );

test("painted letters push the rest of their line along, and the line breaks stay put", async ({ page }) => {
    await expect(page.locator(`${PAINTED} svg g text`).first()).toBeAttached();

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
