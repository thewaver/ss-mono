import { type Page, expect, test } from "@playwright/test";

/**
 * The React `FlipCard`, over the React `Barrel`. The cases follow `e2e/flipCard.spec.ts`, which covers the Solid one:
 * which of the two sides is reachable, which axis the card turns about, how successive turns add up, and that a lean
 * never changes the side that counts as showing. The story owns the edge buttons, the lean slider and the axis choice,
 * as the Playground page does, and they are looked up by id.
 *
 * Every angle is read off the front face's own inline transform, which is the target of the turn, so nothing here
 * waits for an animation to finish, and only how angles relate to each other is asserted.
 */
const STORY = "Exotics/FlipCard/Pressed";

const CARD = '[aria-roledescription="flip card"]';
const FACES = '[aria-roledescription="face"]';
const face = (name: string) => `${FACES}[aria-label="${name}"]`;
const PEEK = 'input[type="range"]';
const READOUT = '[data-readout="side"]';

const transformOf = (page: Page, selector: string) =>
    page.locator(selector).evaluate((element) => (element as HTMLElement).style.transform);

const angleOf = async (page: Page) =>
    Number(/rotate[XY]\((-?[\d.]+)deg\)/.exec(await transformOf(page, face("Front")))?.[1]);

test("the card and both of its sides say what they are, beyond what their roles convey", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(CARD)).toHaveAttribute("role", "group");
    await expect(page.locator(CARD)).toHaveAttribute("aria-label", "Queen of spades");
    await expect(page.locator(FACES), "two sides, no more").toHaveCount(2);
    await expect(page.locator(face("Front"))).toBeAttached();
    await expect(page.locator(face("Back"))).toBeAttached();
});

test("the side turned away is out of reach, rather than merely out of sight", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(face("Front"))).not.toHaveAttribute("inert");
    await expect(page.locator(face("Back"))).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(face("Back"))).toHaveAttribute("inert", "");
});

test("turning the card swaps which side is the reachable one", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator("#press-forward").click();

    await expect(page.locator(face("Back"))).not.toHaveAttribute("inert");
    await expect(page.locator(face("Front"))).toHaveAttribute("inert", "");
    await expect(page.locator(READOUT)).toContainText("back");

    await page.locator("#press-forward").click();

    await expect(page.locator(face("Front")), "and it comes back").not.toHaveAttribute("inert");
});

test("the axis decides which way the card turns, and nothing else about it changes", async ({ page, mount }) => {
    await mount(STORY);

    expect(await transformOf(page, face("Front")), "a row card turns about the upright axis").toContain("rotateY(");

    await page.getByTestId("axis").selectOption("column");

    expect(await transformOf(page, face("Front")), "and a column card about the horizontal one").toContain("rotateX(");

    await page.locator("#press-forward").click();

    await expect(page.locator(face("Back"))).not.toHaveAttribute("inert");
});

test("pressing the same edge twice keeps the card going the same way round", async ({ page, mount }) => {
    await mount(STORY);

    const start = await angleOf(page);

    await page.locator("#press-forward").click();
    await expect(page.locator(face("Back"))).not.toHaveAttribute("inert");
    const once = await angleOf(page);

    await page.locator("#press-forward").click();
    await expect(page.locator(face("Front"))).not.toHaveAttribute("inert");
    const twice = await angleOf(page);

    expect(once, "a press turns the card").not.toBe(start);
    expect(Math.sign(twice - once), "the second turn goes the same way as the first").toBe(Math.sign(once - start));
    expect(Math.abs(twice - start), "so the angle adds up rather than returning").toBe(2 * Math.abs(once - start));
});

test("the two edges turn the card opposite ways", async ({ page, mount }) => {
    await mount(STORY);

    const start = await angleOf(page);

    await page.locator("#press-forward").click();
    await expect(page.locator(face("Back"))).not.toHaveAttribute("inert");
    const forward = (await angleOf(page)) - start;

    await page.locator("#press-backward").click();
    await expect(page.locator(face("Front"))).not.toHaveAttribute("inert");
    const backward = (await angleOf(page)) - start - forward;

    expect(Math.sign(backward)).toBe(-Math.sign(forward));
    expect(await angleOf(page), "which lands it where it started").toBe(start);

    await page.locator("#press-backward").click();
    await expect(page.locator(face("Back"))).not.toHaveAttribute("inert");

    expect(Math.sign((await angleOf(page)) - start), "and it goes on that way rather than rocking back").toBe(
        Math.sign(backward),
    );
});

test("leaning the card never changes which side counts as showing", async ({ page, mount }) => {
    await mount(STORY);

    const resting = await angleOf(page);

    await page.locator(PEEK).focus();
    await page.keyboard.press("End");

    await expect.poll(() => angleOf(page), { message: "the slider leans the card" }).not.toBe(resting);
    await expect(page.locator(face("Front"))).not.toHaveAttribute("inert");
    await expect(page.locator(face("Back"))).toHaveAttribute("inert", "");
    await expect(page.locator(READOUT)).toHaveText(/^front\b/);

    await page.keyboard.press("Home");

    await expect.poll(() => angleOf(page), { message: "let go, it settles back flat" }).toBe(resting);
});

test("a lean goes the way the last turn went, with the transition off while it follows", async ({ page, mount }) => {
    await mount(STORY);

    const durationOf = () =>
        page.locator(face("Front")).evaluate((element) => (element as HTMLElement).style.transitionDuration);

    const restingDuration = await durationOf();

    for (const edge of ["#press-forward", "#press-backward"]) {
        const before = await angleOf(page);

        await page.locator(edge).click();
        await expect.poll(() => angleOf(page)).not.toBe(before);
        const turned = await angleOf(page);

        await page.locator(PEEK).focus();
        await page.keyboard.press("ArrowRight");

        await expect.poll(() => angleOf(page)).not.toBe(turned);
        expect(Math.sign((await angleOf(page)) - turned), "the lean heads the way the turn just did").toBe(
            Math.sign(turned - before),
        );
        expect(await durationOf(), "so the card follows the slider directly").not.toBe(restingDuration);

        await page.keyboard.press("Home");

        await expect.poll(durationOf, { message: "and settles over its duration once at rest" }).toBe(restingDuration);
    }
});
