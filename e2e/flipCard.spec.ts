import { expect, test } from "@playwright/test";

import { demo, prop, readout } from "./helpers";

/**
 * The card draws no control of its own: the page owns the button and the two share a signal. That is as much
 * what these checks pin as the turn itself — a component that renders no button cannot promise one is
 * reachable or named, so the page's button is the thing that has to be real, and it is looked up by its id.
 *
 * Both sides are in the document at all times, back to back with no depth between them, which is why every
 * assertion here is about which of the two is *reachable* rather than about which one is painted.
 */
const CARD = demo("default");

const card = `${CARD} [aria-roledescription="flip card"]`;
const faces = `${CARD} [aria-roledescription="face"]`;
const face = (name: string) => `${faces}[aria-label="${name}"]`;

const FLIP = "#flip";
const AXIS_FIELD = `${prop("axis")} [role="combobox"]`;
const SETTLE_MS = 800;

const transformOf = (page: import("@playwright/test").Page, selector: string) =>
    page.locator(selector).evaluate((element) => (element as HTMLElement).style.transform);

test.beforeEach(async ({ page }) => {
    await page.goto("/flip-card");
    await expect(page.locator(card)).toBeVisible();
});

test("the card and both of its sides say what they are, beyond what their roles convey", async ({ page }) => {
    await expect(page.locator(card)).toHaveAttribute("role", "group");
    await expect(page.locator(card)).toHaveAttribute("aria-label", "Nine of hearts");

    await expect(page.locator(faces), "two sides, no more").toHaveCount(2);
    await expect(page.locator(face("Front"))).toBeAttached();
    await expect(page.locator(face("Back"))).toBeAttached();
});

test("the side turned away is out of reach, rather than merely out of sight", async ({ page }) => {
    await expect(page.locator(face("Front"))).not.toHaveAttribute("inert");
    await expect(page.locator(face("Back")), "the reverse is hidden from a reader").toHaveAttribute(
        "aria-hidden",
        "true",
    );
    await expect(page.locator(face("Back")), "and out of the tab order with it").toHaveAttribute("inert", "");
});

test("turning the card swaps which side is the reachable one", async ({ page }) => {
    await page.locator(FLIP).click();
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.locator(face("Back")), "the side asked for is the one in reach").not.toHaveAttribute("inert");
    await expect(page.locator(face("Front"))).toHaveAttribute("inert", "");

    expect(await readout(page, "default"), "and the page is told which side it is showing").toContain("back");

    await page.locator(FLIP).click();
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.locator(face("Front")), "and it comes back the way it went").not.toHaveAttribute("inert");
});

test("the axis decides which way the card turns, and nothing else about it changes", async ({ page }) => {
    expect(await transformOf(page, face("Front")), "a row card turns about the upright axis").toContain("rotateY(");

    await page.locator(AXIS_FIELD).click();
    await expect(page.locator(AXIS_FIELD)).toHaveAttribute("aria-activedescendant", /.+/);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await transformOf(page, face("Front")), "and a column card about the horizontal one").toContain("rotateX(");

    await page.locator(FLIP).click();
    await page.waitForTimeout(SETTLE_MS);

    await expect(
        page.locator(face("Back")),
        "which side is in reach is the same question either way",
    ).not.toHaveAttribute("inert");
});
