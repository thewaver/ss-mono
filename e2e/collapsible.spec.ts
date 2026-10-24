import { expect, test } from "@playwright/test";

import { activeText, offsetHeight, prop } from "./helpers";

/**
 * `Accordion` is a set of `Collapsible`s, and the split is what each layer states about the page rather than
 * how either opens: the disclosure owns `aria-expanded`, `aria-controls` and the measured height, while the
 * heading element, the panel's `region` role and the arrow-key walk are the accordion's, because those are
 * claims about a section belonging to a set. A "show more" in the middle of a paragraph is none of those
 * things, so it must be able to have none of them — which is what these assert.
 *
 * The Collapsible has no examples of its own: its page is the Docs view. The first live example takes the knob for
 * the transition; the others are found by something only they hold — the button that writes the open state from
 * outside, and the line saying whether the panel has been built.
 */
const BASIC = `[data-docs-example]:has(${prop("transitionDurationMs")}) [data-demo]`;
const CONTROLLED = '[data-docs-example]:has-text("Toggle from here") [data-demo]';
const DEFERRED = '[data-docs-example]:has-text("Panel built") [data-demo]';

test.describe("the Collapsible's docs", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/collapsible/docs");
        await expect(page.locator(`${BASIC} button`)).toBeVisible();
    });

    test("a lone Collapsible is a trigger and a panel and nothing else", async ({ page }) => {
        const trigger = page.locator(`${BASIC} button`);

        await expect(trigger, "collapsed to begin with").toHaveAttribute("aria-expanded", "false");
        await expect(trigger, "and pointing at the panel it controls").toHaveAttribute("aria-controls", /.+/);

        await expect(
            page.locator(`${BASIC} h1, ${BASIC} h2, ${BASIC} h3, ${BASIC} h4`),
            "no heading element, because a show-more is not a section of the document",
        ).toHaveCount(0);
        await expect(
            page.locator(`${BASIC} [role="region"]`),
            "and no region landmark either, for the same reason",
        ).toHaveCount(0);
    });

    test("it opens and closes itself, and the page writing the same boolean moves it too", async ({ page }) => {
        const trigger = page.locator(`${CONTROLLED} button[aria-expanded]`);
        const fromHere = page.locator(CONTROLLED).getByRole("button", { name: "Toggle from here" });

        await trigger.click();

        await expect(trigger, "pressing the trigger opens it").toHaveAttribute("aria-expanded", "true");

        await fromHere.click();

        await expect(trigger, "the page writing the boolean closes it").toHaveAttribute("aria-expanded", "false");

        await fromHere.click();

        await expect(trigger, "and writing it again opens it").toHaveAttribute("aria-expanded", "true");
    });

    test("the panel animates to its content's measured height, and is inert while closed", async ({ page }) => {
        const panelId = await page.locator(`${BASIC} button`).getAttribute("aria-controls");
        const panelLocator = page.locator(`#${panelId}`);

        await expect(panelLocator, "a closed panel is out of the tab order and the accessibility tree").toHaveAttribute(
            "inert",
            "",
        );
        expect(await offsetHeight(panelLocator), "and has no height").toBe(0);

        const contentHeight = await offsetHeight(panelLocator.locator("> *"));

        expect(contentHeight, "while its content is still built, and measurable").toBeGreaterThan(0);

        await page.locator(`${BASIC} button`).click();

        await expect
            .poll(() => offsetHeight(panelLocator), { message: "opening animates the panel to that measured height" })
            .toBe(contentHeight);
        await expect(panelLocator, "and it stops being inert").not.toHaveAttribute("inert", "");
    });

    test("arrow keys do nothing to a lone panel, because it is not part of a set", async ({ page }) => {
        const trigger = page.locator(`${BASIC} button`);

        await trigger.focus();
        await page.keyboard.press("ArrowDown");

        expect(await activeText(page), "focus stays where it was rather than walking to a sibling").toContain(
            "Show more",
        );
    });

    test("a panel built on first open is built when opened, and kept once it is", async ({ page }) => {
        const trigger = page.locator(`${DEFERRED} button`);

        await expect(page.locator(DEFERRED), "nothing is built to begin with").toContainText("Panel built: not yet");

        await trigger.click();

        await expect(page.locator(DEFERRED), "opening builds it").toContainText("Panel built: yes");

        await trigger.click();

        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator(DEFERRED), "and closing it does not discard what was built").toContainText(
            "Panel built: yes",
        );
    });
});
