import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Die`, over the framework-free `DieUtils.createRoller`. The cases follow `e2e/die.spec.ts`, which covers
 * the Solid one: every sample shape is built with its faces, a roll lands on the face the page chose, only that face
 * is offered to a screen reader, the result is said aloud, and while a roll runs the die is busy and the page's Roll
 * button — which reads the controller through its `subscribe` — refuses another.
 *
 * Most cases mount with a roll duration of zero, which is what the Playground hands the die under reduced motion, so a
 * roll lands at once.
 */
const STORY = "Exotics/Die/Tabletop";

const DIE = '[aria-roledescription="die"]';
const FACE = '[aria-roledescription="face"]';
const SHOWING = `${FACE}:not([aria-hidden="true"])`;
const ROLL = "#dieRoll";
const ANNOUNCER = '[aria-live="polite"]';
const MOTION_ROLL_MS = 1400;

const shownNumber = async (page: Page) =>
    ((await page.locator('[data-readout="die"]').textContent()) ?? "").match(/^showing (\d+) of/)![1];

test("every die is built with the faces it should have", async ({ page, mount }) => {
    await mount(STORY);

    for (const [key, count] of [
        ["d4", 4],
        ["d6", 6],
        ["d8", 8],
        ["d10", 10],
        ["d12", 12],
        ["d20", 20],
        ["d100", 100],
    ] as const) {
        await page.getByTestId("shape").selectOption(key);
        await expect(page.locator(FACE), key).toHaveCount(count);
    }
});

test("a roll lands on the face the page chose, and only that face is offered to a screen reader", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await page.locator(ROLL).click();

    await expect(page.locator(SHOWING)).toHaveCount(1);
    await expect(page.locator(SHOWING)).toHaveAttribute("aria-label", await shownNumber(page));
});

test("the face that came up is said aloud", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(ROLL).click();

    await expect(page.locator(ANNOUNCER)).toContainText(await shownNumber(page));
});

test("with motion on, the die is busy, shows no face and refuses a second roll until it lands", async ({
    page,
    mount,
}) => {
    await mount(STORY, { rollDurationMs: MOTION_ROLL_MS });
    await page.locator(ROLL).click();

    await expect(page.locator(DIE)).toHaveAttribute("aria-busy", "true");
    await expect(page.locator(ROLL)).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(SHOWING), "no face is showing while the die turns").toHaveCount(0);

    await expect(page.locator(DIE), "and lands").not.toHaveAttribute("aria-busy", "true", { timeout: 5000 });
    await expect(page.locator(ROLL)).not.toHaveAttribute("aria-disabled");
    await expect(page.locator(SHOWING)).toHaveAttribute("aria-label", await shownNumber(page));
});

test("the die turns about the middle of the faces it is made of", async ({ page, mount }) => {
    await mount(STORY);

    const offsets = await page.locator(DIE).evaluate((die) => {
        const body = die.firstElementChild!.firstElementChild as HTMLElement;

        return [...body.children].map((face) => {
            const element = face as HTMLElement;

            return element.offsetLeft + element.offsetWidth * 0.5 - body.offsetWidth * 0.5;
        });
    });

    offsets.forEach((offset) => expect(Math.abs(offset)).toBeLessThan(1));
});
