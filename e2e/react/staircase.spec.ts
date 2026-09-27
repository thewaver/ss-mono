import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Staircase`. The cases follow `e2e/staircase.spec.ts`, which covers the Solid one, so the two frameworks
 * are held to the same behavior: the indent function is direction-blind, and the component gets the upward reading by
 * handing it the steps back to front, so the two readings are each other's mirror.
 *
 * The step wrappers are found by their inline `padding-left`, as the Solid spec finds them. The Playground's knobs are
 * story props, each read on a fresh mount.
 */
const STORY = "Exotics/Staircase/Default";
const STEP = '[data-testid="default"] div[style*="padding-left"]';

const indents = (page: Page) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].map((element) =>
                Math.round(parseFloat(getComputedStyle(element).paddingLeft)),
            ),
        STEP,
    );

test("a step is indented by the function's answer for its own index", async ({ page, mount }) => {
    await mount(STORY, { stepCount: 5, indent: 20 });

    await expect
        .poll(() => indents(page), { message: "the default function is one indent per step" })
        .toEqual([0, 20, 40, 60, 80]);
});

test("both sides of a step are indented, so the content narrows rather than shifting", async ({ page, mount }) => {
    await mount(STORY);

    const sides = await page.evaluate((selector) => {
        const style = getComputedStyle(document.querySelectorAll(selector)[2] as HTMLElement);

        return { left: style.paddingLeft, right: style.paddingRight };
    }, STEP);

    expect(sides.left).not.toBe("0px");
    expect(sides.left).toBe(sides.right);
});

test("the direction hands the steps back to front rather than changing the function", async ({ page, mount }) => {
    await mount(STORY, { stepCount: 5 });

    const down = await indents(page);

    await mount(STORY, { stepCount: 5, dir: "up" });

    await expect
        .poll(() => indents(page), { message: "the ascending staircase is the descending one read backwards" })
        .toEqual([...down].reverse());
});

test("a different indent function reshapes the staircase", async ({ page, mount }) => {
    await mount(STORY, { stepCount: 5, indent: 20, indentKey: "hourglass" });

    await expect
        .poll(() => indents(page), {
            message: "widest at both ends and narrowest in the middle, which no linear function can produce",
        })
        .toEqual([0, 40, 80, 40, 0]);
});

test("the gap between steps is the consumer's number and nothing else", async ({ page, mount }) => {
    await mount(STORY, { gap: 24 });

    const gap = await page.evaluate(
        (selector) => getComputedStyle((document.querySelector(selector) as HTMLElement).parentElement!).rowGap,
        STEP,
    );

    expect(gap).toBe("24px");
});
