import { expect, test } from "@playwright/test";

import { demo } from "./helpers";

const ANCHOR = `${demo("decorated")} button`;
const OTHER = `${demo("default")} button`;
const TOOLTIP = '[role="tooltip"]';

/** Comfortably past the 200ms fade, so a tooltip that had been withdrawn is unmounted rather than fading. */
const FADE_SETTLED_MS = 600;

/**
 * `Tooltip` now has a page of its own, but this run stays on the `Button` page: what is under test here
 * is the `tooltipDefs` route into it, where a control asks for a tooltip rather than being handed one, and
 * the `Button` page is where both a plain tooltip and a disabled control's explanation live.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("nothing is announced before anything is hovered", async ({ page }) => {
    await expect(page.locator(TOOLTIP), "nothing is in the tree before anything is hovered").toHaveCount(0);
    await expect(page.locator(ANCHOR), "and the anchor claims no description it does not yet have").not.toHaveAttribute(
        "aria-describedby",
    );
});

test("hovering portals a tooltip and points the anchor at it", async ({ page }) => {
    await page.locator(ANCHOR).hover();

    await expect(page.locator(TOOLTIP), "hovering the anchor shows it").toBeVisible();
    expect(
        await page.evaluate(
            (selector) => !document.querySelector(selector)!.contains(document.querySelector('[role="tooltip"]')),
            ANCHOR,
        ),
        "portalled out of the anchor rather than nested inside it",
    ).toBe(true);
    expect(
        await page.evaluate((selector) => {
            const described = document.querySelector(selector)?.getAttribute("aria-describedby");
            const tooltip = document.querySelector('[role="tooltip"]');

            return !!described && !!tooltip && described.split(/\s+/).includes(tooltip.id);
        }, ANCHOR),
        "and pointed at by aria-describedby, which is how it is announced at all",
    ).toBe(true);
});

test("a top-out placement lands the whole tooltip above the anchor", async ({ page }) => {
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    const anchorBox = (await page.locator(ANCHOR).boundingBox())!;
    const tooltipBox = (await page.locator(TOOLTIP).boundingBox())!;

    expect(
        tooltipBox.y + tooltipBox.height <= anchorBox.y,
        "a top-out placement puts the whole tooltip above the anchor, not overlapping it",
    ).toBe(true);
});

test("moving the pointer away withdraws both the tooltip and the description", async ({ page }) => {
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    await page.locator(OTHER).hover();
    await expect(page.locator(TOOLTIP), "moving the pointer away hides it").toHaveCount(0);
    await expect(
        page.locator(ANCHOR),
        "and the description is withdrawn rather than left pointing at a node that has gone",
    ).not.toHaveAttribute("aria-describedby");
});

test("Escape dismisses it while the pointer is still over the anchor", async ({ page }) => {
    await page.locator(ANCHOR).focus();
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP), "it is showing").toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
        page.locator(TOOLTIP),
        "Escape dismisses it while the pointer is still over the anchor, so it can be got out of the way",
    ).toHaveCount(0);
});

/**
 * Success criterion 1.4.13 asks that content shown on hover can itself be hovered: somebody reading at
 * magnification, or with an unsteady hand, has to be able to bring the pointer onto the tooltip without it
 * vanishing on the way. Two things had to be true for that. The tooltip takes pointer events while it is
 * shown, where it used to be `pointer-events: none` throughout; and the offset that holds it clear of its
 * anchor is bridged, because that gap is dead space the pointer would otherwise have to cross — leaving the
 * anchor for nothing and taking the tooltip with it.
 *
 * Two things about the shape of this one, both learned by watching weaker versions of it pass against the
 * unfixed component. It **rests in the gap** rather than crossing it in one movement: a pointer that crosses
 * in a few milliseconds is inside the fade the whole way, so the tooltip is withdrawn and re-shown without
 * the run ever noticing, which is precisely what a slow or unsteady hand would not get away with. And it
 * counts nodes after the fade would have finished rather than asking whether the tooltip is visible, because
 * a withdrawn tooltip stays mounted and on screen for the length of its fade — `toBeVisible` answers yes to
 * one that is already on its way out.
 */
test("the pointer can be walked off the anchor onto the tooltip without losing it", async ({ page }) => {
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    const anchorBox = (await page.locator(ANCHOR).boundingBox())!;
    const tooltipBox = (await page.locator(TOOLTIP).boundingBox())!;

    const midX = anchorBox.x + anchorBox.width / 2;
    const gapMidY = (anchorBox.y + tooltipBox.y + tooltipBox.height) / 2;

    await page.mouse.move(midX, gapMidY);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(TOOLTIP), "resting in the gap between the two does not lose it").toHaveCount(1);

    await page.mouse.move(tooltipBox.x + tooltipBox.width / 2, tooltipBox.y + tooltipBox.height / 2);
    await page.waitForTimeout(FADE_SETTLED_MS);
    await expect(page.locator(TOOLTIP), "and neither does arriving on the tooltip itself").toHaveCount(1);

    await page.locator(OTHER).hover();
    await expect(page.locator(TOOLTIP), "and leaving it for good still takes it away").toHaveCount(0);
});

/**
 * The other half of the same criterion: a tooltip has to be dismissible without moving the pointer off it,
 * since moving away is the one mechanism the criterion does not count. Escape used to be bound to the
 * anchor's own `keydown`, which only ever reached it when the anchor had focus — so a reader using a pointer
 * alone, who is exactly who the hoverable half was fixed for, had no way to put the thing away. `Tooltip`
 * now registers with `Dismisser` like every other floating layer, so Escape reaches it from wherever focus
 * happens to be. The anchor is deliberately never focused here; focusing it is the case that already worked.
 */
test("Escape dismisses a tooltip that was only ever hovered, with focus somewhere else entirely", async ({ page }) => {
    await page.locator(ANCHOR).hover();
    await expect(page.locator(TOOLTIP), "it is showing on hover alone").toBeVisible();

    expect(
        await page.evaluate((selector) => document.activeElement === document.querySelector(selector), ANCHOR),
        "and the anchor never took focus, so the old anchor-bound handler could not have heard this",
    ).toBe(false);

    await page.keyboard.press("Escape");
    await expect(page.locator(TOOLTIP), "Escape still puts it away").toHaveCount(0);
});
