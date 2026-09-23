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

/**
 * The second card is turned by two edge buttons rather than one, and each press names the way it turns, so
 * the card's angle stops retracing and starts accumulating. The angle is read off the front face's own
 * transform — the inline value is the target of the turn, written the moment the side changes, so nothing
 * here has to wait for the animation to finish. What is asserted is how successive angles relate to one
 * another, never what any of them is.
 */
const PRESSED = demo("pressed");

const pressedFace = (name: string) => `${PRESSED} [aria-roledescription="face"][aria-label="${name}"]`;
const PEEK = `${PRESSED} input[type="range"]`;

const angleOf = async (page: import("@playwright/test").Page, selector: string) =>
    Number(/rotate[XY]\((-?[\d.]+)deg\)/.exec(await transformOf(page, selector))?.[1]);

const pressedAngle = (page: import("@playwright/test").Page) => angleOf(page, pressedFace("Front"));

test("unset, the card rocks back the way it came rather than going on round", async ({ page }) => {
    const start = await angleOf(page, face("Front"));

    await page.locator(FLIP).click();
    const turned = await angleOf(page, face("Front"));

    await page.locator(FLIP).click();

    expect(turned, "a turn moves the card").not.toBe(start);
    expect(await angleOf(page, face("Front")), "and the turn back undoes it").toBe(start);
});

test("pressing the same edge twice keeps the card going the same way round", async ({ page }) => {
    const start = await pressedAngle(page);

    await page.locator("#press-forward").click();
    const once = await pressedAngle(page);

    await expect(page.locator(pressedFace("Back")), "the first press turns it over").not.toHaveAttribute("inert");

    await page.locator("#press-forward").click();
    const twice = await pressedAngle(page);

    await expect(page.locator(pressedFace("Front")), "and the second brings the front round again").not.toHaveAttribute(
        "inert",
    );

    expect(once, "a press turns the card").not.toBe(start);
    expect(Math.sign(twice - once), "the second turn goes the same way as the first").toBe(Math.sign(once - start));
    expect(Math.abs(twice - start), "so the angle adds up rather than returning").toBe(2 * Math.abs(once - start));
});

test("the two edges turn the card opposite ways", async ({ page }) => {
    const start = await pressedAngle(page);

    await page.locator("#press-forward").click();
    const forward = (await pressedAngle(page)) - start;

    await page.locator("#press-backward").click();
    const backward = (await pressedAngle(page)) - start - forward;

    expect(Math.sign(backward), "the far edge sends it back the other way").toBe(-Math.sign(forward));
    expect(await pressedAngle(page), "which lands it where it started").toBe(start);

    await page.locator("#press-backward").click();

    expect(
        Math.sign((await pressedAngle(page)) - start),
        "and pressed again from the start, it goes on that way rather than rocking back",
    ).toBe(Math.sign(backward));
});

test("leaning the card never changes which side counts as showing", async ({ page }) => {
    const resting = await pressedAngle(page);

    await page.locator(PEEK).focus();
    await page.keyboard.press("End");

    expect(await pressedAngle(page), "the slider leans the card").not.toBe(resting);
    await expect(
        page.locator(pressedFace("Front")),
        "yet even leaned all the way, the front is the side in reach",
    ).not.toHaveAttribute("inert");
    await expect(page.locator(pressedFace("Back"))).toHaveAttribute("inert", "");
    expect(await readout(page, "pressed"), "and the page still reads the front").toMatch(/^front\b/);

    await page.keyboard.press("Home");

    expect(await pressedAngle(page), "let go, it settles back flat").toBe(resting);
});

test("a lean goes the way the last turn went, with the transition off while it follows", async ({ page }) => {
    const durationOf = () =>
        page.locator(pressedFace("Front")).evaluate((element) => (element as HTMLElement).style.transitionDuration);

    const restingDuration = await durationOf();

    for (const edge of ["#press-forward", "#press-backward"]) {
        const before = await pressedAngle(page);

        await page.locator(edge).click();
        const turned = await pressedAngle(page);

        await page.locator(PEEK).focus();
        await page.keyboard.press("ArrowRight");

        expect(Math.sign((await pressedAngle(page)) - turned), "the lean heads the same way the turn just did").toBe(
            Math.sign(turned - before),
        );
        expect(await durationOf(), "so the card follows the slider directly").not.toBe(restingDuration);

        await page.keyboard.press("Home");

        expect(await durationOf(), "and settles over the page's duration once back at rest").toBe(restingDuration);
    }
});
