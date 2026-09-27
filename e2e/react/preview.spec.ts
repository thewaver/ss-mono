import { type Page, expect, test } from "@playwright/test";

import { offsetHeight, scrollTop } from "../helpers";

/**
 * The React `Preview`. The cases follow `e2e/preview.spec.ts`, which covers the Solid one, so the two frameworks are
 * held to the same behavior: content cut to the height it was given, a trigger wired to the box it opens, nothing
 * hidden from a screen reader, no control at all for content that already fits, and the scroll back on collapse.
 */
const STORY = "Essentials/Preview";
const COLLAPSED_HEIGHT = 120;
const TRANSITION_TIMEOUT_MS = 5_000;
const SETTLE_MS = 500;

const trigger = "button[aria-expanded]";

const contentBox = async (page: Page) => {
    const id = await page.locator(trigger).getAttribute("aria-controls");

    return page.locator(`[id="${id}"]`);
};

test("content taller than the height it was given is cut to it", async ({ page, mount }) => {
    await mount(`${STORY}/Long`);

    const box = await contentBox(page);

    expect(await offsetHeight(box), "the box is exactly the height the consumer asked for").toBe(COLLAPSED_HEIGHT);
    expect(
        await offsetHeight(box.locator("> *").first()),
        "while the content inside it is taller, which is what there is to open",
    ).toBeGreaterThan(COLLAPSED_HEIGHT);
    await expect(page.getByTestId("fade"), "and the fade over the cut edge is drawn").toHaveCount(1);
});

test("nothing is hidden from a screen reader, because the opening lines are on screen", async ({ page, mount }) => {
    await mount(`${STORY}/Long`);

    const box = await contentBox(page);

    await expect(box, "the box is never inert").not.toHaveAttribute("inert");
    await expect(box, "and the text past the cut is still in the document").toContainText("The east tower was added");
});

test("the control opens it the rest of the way and says which state it is in", async ({ page, mount }) => {
    await mount(`${STORY}/Long`);

    const box = await contentBox(page);
    const target = await offsetHeight(box.locator("> *").first());

    await expect(page.locator(trigger), "closed to begin with").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(trigger)).toContainText("Read more");

    await page.locator(trigger).click();

    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => offsetHeight(box), { timeout: TRANSITION_TIMEOUT_MS }).toBe(target);
    await expect(page.locator('[data-readout="expanded"]'), "and the owner's own boolean is what moved").toHaveText(
        "expanded: true",
    );

    await page.locator(trigger).click();

    await expect.poll(() => offsetHeight(box), { timeout: TRANSITION_TIMEOUT_MS }).toBe(COLLAPSED_HEIGHT);
});

test("a preview left to itself keeps its own state, starting collapsed", async ({ page, mount }) => {
    await mount(`${STORY}/Uncontrolled`);

    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "false");

    await page.locator(trigger).click();

    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "true");
});

test("content that already fits gets no control at all", async ({ page, mount }) => {
    await mount(`${STORY}/Short`);

    await expect(page.locator(trigger), "no control").toHaveCount(0);
    await expect(page.getByTestId("fade"), "and no fade").toHaveCount(0);

    const box = page.locator('[data-testid="short"] > * > * > * > *').first();

    expect(
        await offsetHeight(box),
        "and the box takes its content's height rather than the one it was given",
    ).toBeLessThan(COLLAPSED_HEIGHT);
});

test("closing brings the control back rather than leaving the reader further down", async ({ page, mount }) => {
    await mount(`${STORY}/Scrolled`);

    const scrollBox = page.locator("[data-scroll-box]");

    await page.locator(trigger).click();
    await page.waitForTimeout(SETTLE_MS);

    await scrollBox.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
    });
    await page.waitForTimeout(SETTLE_MS);

    expect(await scrollTop(scrollBox), "the reader is at the end of the opened text").toBeGreaterThan(0);

    await page.locator(trigger).click();
    await page.waitForTimeout(SETTLE_MS);

    const box = (await scrollBox.boundingBox())!;
    const pressed = (await page.locator(trigger).boundingBox())!;

    expect(pressed.y, "the control they pressed is still inside the box").toBeGreaterThanOrEqual(box.y - 2);
    expect(pressed.y + pressed.height, "and not past the bottom of it either").toBeLessThanOrEqual(
        box.y + box.height + 2,
    );
});
