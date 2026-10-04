import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * A die is a convex solid turned so one face is towards the viewer. The geometry is arithmetic the unit tests hold;
 * what is checked here is the roll — that it lands on the face the page chose, that only that face is offered to a
 * screen reader, that the result is said aloud — and that every tabletop shape is built with the faces it should have.
 *
 * Most tests run with reduced motion, which the page answers with a roll duration of zero, so a roll lands at once.
 */
const TABLETOP = example("tabletop");
const FACE = `${TABLETOP} [aria-roledescription="face"]`;
const SHOWING = `${FACE}:not([aria-hidden="true"])`;
const ROLL = "#dieRoll";
const ANNOUNCER = '[aria-live="polite"]';
const SETTLE_MS = 150;

const pickShape = async (page: Page, key: string) => {
    await page.locator(`${prop("shape")} [role="combobox"]`).click();
    await page.getByRole("option", { name: key, exact: true }).click();
    await page.waitForTimeout(SETTLE_MS);
};

const shownNumber = async (page: Page) => (await readout(page, "tabletop")).match(/^showing (\d+) of/)![1];

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/die");
    await expect(page.locator(FACE).first()).toBeAttached();
});

test("every die is built with the faces it should have", async ({ page }) => {
    for (const [key, count] of [
        ["d4", 4],
        ["d6", 6],
        ["d8", 8],
        ["d10", 10],
        ["d12", 12],
        ["d20", 20],
        ["d100", 100],
    ] as const) {
        await pickShape(page, key);
        await expect(page.locator(FACE), key).toHaveCount(count);
    }
});

test("a roll lands on the face the page chose, and only that face is offered to a screen reader", async ({ page }) => {
    await page.locator(ROLL).click();

    const shown = await shownNumber(page);

    await expect(page.locator(SHOWING)).toHaveCount(1);
    await expect(page.locator(SHOWING)).toHaveAttribute("aria-label", shown);
});

test("the face that came up is said aloud", async ({ page }) => {
    await page.locator(ROLL).click();

    await expect(page.locator(ANNOUNCER)).toContainText(await shownNumber(page));
});

test("with motion on, the die is busy, shows no face and refuses a second roll until it lands", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator(ROLL).click();

    await expect(page.locator(`${TABLETOP} [aria-roledescription="die"]`)).toHaveAttribute("aria-busy", "true");
    await expect(page.locator(ROLL)).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(SHOWING), "no face is showing while the die turns").toHaveCount(0);

    await expect(page.locator(`${TABLETOP} [aria-roledescription="die"]`), "and lands").not.toHaveAttribute(
        "aria-busy",
        "true",
        { timeout: 5000 },
    );
    await expect(page.locator(SHOWING)).toHaveAttribute("aria-label", await shownNumber(page));
});

/**
 * The frame a die reserves is smaller than the box its faces are laid out in, because the die sits its own radius
 * behind the screen and perspective draws it smaller than life. The box is a flex item inside that frame, and a flex
 * item shrinks to fit by default — which squeezed it, moved the point it turns about off the faces' center, and made
 * the die wander as it spun. Every face is laid out around the middle of the box, so the box keeping its width is
 * what keeps the die turning in place.
 */
test("the die turns about the middle of the faces it is made of", async ({ page }) => {
    const offsets = await page.locator(`${TABLETOP} [aria-roledescription="die"]`).evaluate((die) => {
        const body = die.firstElementChild!.firstElementChild as HTMLElement;

        return [...body.children].map((face) => {
            const element = face as HTMLElement;

            return element.offsetLeft + element.offsetWidth * 0.5 - body.offsetWidth * 0.5;
        });
    });

    offsets.forEach((offset) => expect(Math.abs(offset)).toBeLessThan(1));
});

/**
 * Switching to a die with fewer faces than the number showing pulls the number back to the last face, which asks the
 * die to turn there — and the shape changes in the same breath. The turn has to be worked out on the new shape, from
 * wherever the die is drawn, so it arrives upright; the alternatives were snapping straight onto the face, or
 * finishing on the old shape's angle and resting crooked. A turn shows no face until it lands, so seeing none just
 * after the switch is what tells a turn from a snap. It rolls until the number is past the smaller die's faces and then
 * waits on a timed turn, which a parallel sweep can starve; it passes every time on its own, hence `@solo`.
 */
test(
    "switching to a smaller die turns it onto its last face rather than snapping there",
    { tag: "@solo" },
    async ({ page }) => {
        await pickShape(page, "d100");

        while (Number(await shownNumber(page)) <= 4) await page.locator(ROLL).click();

        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.locator(`${prop("shape")} [role="combobox"]`).click();
        await page.getByRole("option", { name: "d4", exact: true }).click();

        await expect(page.locator(SHOWING), "no face is showing while the die turns").toHaveCount(0);
        await expect(page.locator(SHOWING), "and it lands on the last face").toHaveAttribute("aria-label", "4", {
            timeout: 5000,
        });
    },
);
