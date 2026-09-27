import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Sidebar`. The cases follow `e2e/sidebar.spec.ts`, which covers the Solid one, so the two frameworks are
 * held to the same behavior: a pushing sidebar takes room from its neighbor, an overlaid one grows over it, the
 * contents are told the phase, hover expands without writing the owner's state, and a popup opened from inside holds
 * a hover-expanded sidebar open. The Playground's own library menu is furniture and has no counterpart; the story's
 * settings button, pointing at an element outside the sidebar, stands in for the popup it opens.
 */
const STORY = "Essentials/Sidebar/Default";
const EXPANDED_WIDTH = 200;
const SETTLE_MS = 500;
const AWAY = { x: 1000, y: 700 };

const sidebar = async (page: Page) =>
    page.locator(`[id="${await page.getByTestId("toggle").getAttribute("aria-controls")}"]`);

const layoutWidth = async (page: Page) =>
    (await sidebar(page)).evaluate((element) => (element as HTMLElement).offsetWidth);

const panelWidth = async (page: Page) =>
    (await sidebar(page)).evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

const neighborWidth = (page: Page) =>
    page.getByTestId("neighbor").evaluate((element) => (element as HTMLElement).offsetWidth);

test("a pushing sidebar takes the room it grows into", async ({ page, mount }) => {
    await mount(STORY);

    const collapsedWidth = await layoutWidth(page);
    const neighborBefore = await neighborWidth(page);

    await page.getByTestId("toggle").click();

    await expect(page.getByTestId("toggle"), "the owner's button reports the state it wrote").toHaveAttribute(
        "aria-expanded",
        "true",
    );
    await expect.poll(() => layoutWidth(page), "the sidebar's own box grows").toBeGreaterThan(collapsedWidth);
    await expect
        .poll(() => neighborWidth(page), "and the content beside it gives that room up")
        .toBeLessThan(neighborBefore);
});

test("an overlaid sidebar grows over its neighbor and keeps its place in the layout", async ({ page, mount }) => {
    await mount(STORY, { layout: "overlay" });

    const collapsedWidth = await layoutWidth(page);
    const neighborBefore = await neighborWidth(page);

    await page.getByTestId("toggle").click();

    await expect.poll(() => panelWidth(page), "the panel grows").toBeGreaterThan(collapsedWidth);
    expect(await layoutWidth(page), "while the box the layout sees does not").toBe(collapsedWidth);
    expect(await neighborWidth(page), "and the neighbor keeps its room").toBe(neighborBefore);
    expect(
        await (await sidebar(page)).evaluate((element) => getComputedStyle(element.firstElementChild!).zIndex),
        "the growing panel is raised over what it covers",
    ).not.toBe("auto");
});

test("the contents are told when the sidebar has finished expanding, and collapsing", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator('[data-readout="phase"]')).toHaveText("collapsed");

    await page.getByTestId("toggle").click();
    await expect(page.locator('[data-readout="phase"]')).toHaveText("expanded");

    await page.getByTestId("toggle").click();
    await expect(page.locator('[data-readout="phase"]')).toHaveText("collapsed");
});

test("a sidebar that starts expanded appears expanded without growing into place", async ({ page, mount }) => {
    await mount(STORY, { isInitiallyExpanded: true });

    expect(await panelWidth(page), "it is at its expanded width from the first frame").toBe(EXPANDED_WIDTH);
    await expect(page.locator('[data-readout="phase"]')).toHaveText("expanded");
});

test("hovering expands it without touching the owner's state, and Escape puts it back", async ({ page, mount }) => {
    await mount(STORY, { isExpandedOnHover: true });

    const collapsedWidth = await panelWidth(page);

    await (await sidebar(page)).hover();

    await expect.poll(() => panelWidth(page), "resting on it expands it").toBeGreaterThan(collapsedWidth);
    await expect(page.getByTestId("toggle"), "the owner's state was not written").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    await expect(page.locator('[data-readout="expanded"]')).toHaveText("expanded: false");

    await page.keyboard.press("Escape");

    await expect.poll(() => panelWidth(page), "Escape collapses it again").toBe(collapsedWidth);
});

test("hovering does nothing when it was not asked for", async ({ page, mount }) => {
    await mount(STORY);

    const collapsedWidth = await panelWidth(page);

    await (await sidebar(page)).hover();
    await page.waitForTimeout(SETTLE_MS);

    expect(await panelWidth(page)).toBe(collapsedWidth);
});

test("the owner's button keeps focus as the sidebar expands", async ({ page, mount }) => {
    await mount(STORY);

    await page.getByTestId("toggle").focus();
    await page.keyboard.press("Enter");

    await expect(page.locator('[data-readout="phase"]')).toHaveText("expanded");
    await expect(page.getByTestId("toggle")).toBeFocused();
});

test("a popup opened from inside keeps a hover-expanded sidebar open", async ({ page, mount }) => {
    await mount(STORY, { isExpandedOnHover: true });

    const collapsedWidth = await panelWidth(page);

    await (await sidebar(page)).hover();
    await expect.poll(() => panelWidth(page)).toBe(EXPANDED_WIDTH);

    await page.getByTestId("popupTrigger").click();
    await expect(page.getByTestId("popup")).toBeVisible();

    await page.getByTestId("popup").hover();
    await page.mouse.move(AWAY.x, AWAY.y, { steps: 5 });
    await page.waitForTimeout(SETTLE_MS);

    expect(await panelWidth(page), "the sidebar holds while the popup it opened is open").toBe(EXPANDED_WIDTH);

    await page.getByTestId("closePopup").click();
    await expect(page.getByTestId("popup")).toHaveCount(0);
    await page.mouse.move(AWAY.x + 50, AWAY.y + 50, { steps: 3 });

    await expect
        .poll(() => panelWidth(page), "and lets go on the next move once the popup has closed")
        .toBe(collapsedWidth);
});

test("collapsing it while a popup from inside is open waits for that popup to close", async ({ page, mount }) => {
    await mount(STORY);

    const collapsedWidth = await panelWidth(page);

    await page.getByTestId("toggle").click();
    await expect.poll(() => panelWidth(page)).toBe(EXPANDED_WIDTH);

    await page.getByTestId("popupTrigger").click();
    await page.getByTestId("toggle").click();
    await expect(page.locator('[data-readout="expanded"]')).toHaveText("expanded: false");
    await page.waitForTimeout(SETTLE_MS);

    expect(await panelWidth(page), "the owner collapsed it, but the popup is still hanging off it").toBe(
        EXPANDED_WIDTH,
    );

    await page.getByTestId("closePopup").click();
    await page.mouse.move(AWAY.x, AWAY.y, { steps: 3 });

    await expect.poll(() => panelWidth(page), "the next move away once it has closed lets go").toBe(collapsedWidth);
});
