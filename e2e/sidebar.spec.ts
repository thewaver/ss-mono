import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

const PUSH = "push";
const OVERLAY = "overlay";
const HOVER = "hover";
const SETTLE_MS = 500;

const toggle = (page: Page, key: string) => page.locator(`${demo(key)} button[aria-controls]`);

const sidebar = async (page: Page, key: string) =>
    page.locator(`[id="${await toggle(page, key).getAttribute("aria-controls")}"]`);

const layoutWidth = async (page: Page, key: string) =>
    (await sidebar(page, key)).evaluate((element) => (element as HTMLElement).offsetWidth);

const neighborWidth = async (page: Page, key: string) =>
    (await sidebar(page, key)).evaluate(
        (element) =>
            ([...element.parentElement!.children].find((child) => child !== element) as HTMLElement).offsetWidth,
    );

const panelWidth = async (page: Page, key: string) =>
    (await sidebar(page, key)).evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

test.beforeEach(async ({ page }) => {
    await page.goto("/sidebar");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * Pushing is the sidebar taking the room it grows into from whatever sits beside it, so the thing to check is
 * the layout width, not the painted one: it has to grow, and the content beside it has to give that room up.
 */
test("a pushing sidebar takes the room it grows into", async ({ page }) => {
    const collapsedWidth = await layoutWidth(page, PUSH);
    const neighborBefore = await neighborWidth(page, PUSH);

    await toggle(page, PUSH).click();

    await expect(toggle(page, PUSH), "the owner's button reports the state it wrote").toHaveAttribute(
        "aria-expanded",
        "true",
    );
    await expect.poll(() => layoutWidth(page, PUSH), "the sidebar's own box grows").toBeGreaterThan(collapsedWidth);
    await expect
        .poll(() => neighborWidth(page, PUSH), "and the content beside it gives that room up")
        .toBeLessThan(neighborBefore);
});

/**
 * Overlaid, the sidebar never changes what the layout gives it; only the panel inside grows, over the
 * neighbor. So the box stays at its collapsed width while the panel does not.
 */
test("an overlaid sidebar grows over its neighbor and keeps its place in the layout", async ({ page }) => {
    const collapsedWidth = await layoutWidth(page, OVERLAY);

    await toggle(page, OVERLAY).click();

    await expect.poll(() => panelWidth(page, OVERLAY), "the panel grows").toBeGreaterThan(collapsedWidth);
    expect(await layoutWidth(page, OVERLAY), "while the box the layout sees does not").toBe(collapsedWidth);
});

/**
 * The contents are handed a phase rather than a bare open-or-shut, so a layout can wait for the growth to end
 * before it swaps. The example writes the phase out once it is past collapsed, so the settled word is visible.
 */
test("the contents are told when the sidebar has finished expanding", async ({ page }) => {
    await toggle(page, PUSH).click();

    await expect(page.locator(demo(PUSH)).getByText("expanded", { exact: true })).toBeVisible();
});

/**
 * Hover is a look, not a decision: it expands the panel without writing the owner's signal, so the button and
 * the readout keep saying collapsed. It also has to be dismissable without moving the pointer, which is what
 * Escape is for.
 */
test("hovering expands it without touching the owner's state, and Escape puts it back", async ({ page }) => {
    const collapsedWidth = await panelWidth(page, HOVER);

    await (await sidebar(page, HOVER)).hover();

    await expect.poll(() => panelWidth(page, HOVER), "resting on it expands it").toBeGreaterThan(collapsedWidth);
    await expect(toggle(page, HOVER), "the owner's state was not written").toHaveAttribute("aria-expanded", "false");
    expect(await readout(page, HOVER)).toContain("expanded: false");

    await page.keyboard.press("Escape");

    await expect.poll(() => panelWidth(page, HOVER), "Escape collapses it again").toBe(collapsedWidth);
});

/**
 * The button is drawn by the owner and survives the swap between the two layouts, so pressing it from the
 * keyboard leaves focus where it was instead of dropping it to the page.
 */
test("the owner's button keeps focus across the swap between layouts", async ({ page }) => {
    await toggle(page, PUSH).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(demo(PUSH)).getByText("expanded", { exact: true })).toBeVisible();
    await expect(toggle(page, PUSH)).toBeFocused();
});

/**
 * The Playground's menu can only be hidden on a window too narrow to hold it beside the page at full size, so the
 * tests that hide it run on one. Above that width the arrow stays where it is and does nothing.
 */
test("the menu's arrow is disabled on a window wide enough for the whole page", async ({ page }) => {
    const arrow = page.locator('#library-menu button[aria-controls="library-menu"]');
    const menuWidth = () =>
        page.locator("#library-menu").evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

    const openWidth = await menuWidth();

    await expect(arrow, "the arrow is drawn").toBeVisible();
    await expect(arrow, "and marked unavailable").toHaveAttribute("aria-disabled", "true");

    await arrow.click({ force: true });
    await page.waitForTimeout(SETTLE_MS);

    expect(await menuWidth(), "pressing it leaves the menu open").toBe(openWidth);
});

test.describe("on a window narrow enough to hide the menu", () => {
    test.use({ viewport: { width: 1000, height: 1200 } });

    /**
     * A popup opened from inside the sidebar is portaled out of it, so reaching it means the pointer leaves the
     * sidebar. The Playground's own menu is the case: hover-expanded, its settings pane open, the pointer on the
     * pane. The sidebar holds while something it opened is still open, and lets go on the next move outside once
     * that closes.
     */
    test("a popup opened from inside keeps a hover-expanded sidebar open", async ({ page }) => {
        const menuWidth = () =>
            page.locator("#library-menu").evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

        const openWidth = await menuWidth();

        await page.locator('#library-menu button[aria-controls="library-menu"]').click();
        await page.mouse.move(800, 600);

        await expect.poll(menuWidth, "auto-hide collapses the menu once the pointer is away").toBeLessThan(openWidth);
        await page.waitForTimeout(SETTLE_MS);

        const collapsedWidth = await menuWidth();

        await page.locator("#library-menu").hover();
        await expect.poll(menuWidth, "resting on the strip expands it").toBeGreaterThan(collapsedWidth);
        await page.waitForTimeout(SETTLE_MS);

        const expandedWidth = await menuWidth();

        await page.getByRole("button", { name: "Library settings" }).click();

        const pane = page.getByRole("dialog", { name: "Library settings" });

        await pane.hover();
        await page.mouse.move(800, 600, { steps: 5 });
        await page.waitForTimeout(SETTLE_MS);

        expect(await menuWidth(), "the menu holds while its settings pane is open").toBe(expandedWidth);

        await page.keyboard.press("Escape");
        await expect(pane).toBeHidden();
        await page.mouse.move(850, 650, { steps: 3 });

        await expect.poll(menuWidth, "and lets go on the next move once the pane has closed").toBe(collapsedWidth);
    });

    /**
     * The Playground's arrow is the whole auto-hide setting: pressed on the open menu it collapses it to the strip,
     * and it stays on the strip, where pressing it again keeps the menu open.
     */
    test("the menu's arrow switches auto-hide on and off", async ({ page }) => {
        const arrow = page.locator('#library-menu button[aria-controls="library-menu"]');
        const menuWidth = () =>
            page.locator("#library-menu").evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

        const openWidth = await menuWidth();

        await expect(arrow, "the arrow is there with the menu open").toHaveAttribute("aria-expanded", "true");

        await arrow.click();

        await expect(arrow, "pressing it hides the menu").toHaveAttribute("aria-expanded", "false");
        await expect.poll(menuWidth, "down to the strip").toBeLessThan(openWidth);
        await expect(arrow, "and the arrow stays on the strip, as the way back").toBeVisible();

        await arrow.click();

        await expect(arrow).toHaveAttribute("aria-expanded", "true");
        await expect.poll(menuWidth, "pressing it again keeps the menu open").toBe(openWidth);
    });

    /**
     * The arrow sits inside the menu, so pressing it leaves the pointer on the menu — and a menu that expands on hover
     * would take that pointer for a hover and grow straight back, undoing the press. So a collapse made under the
     * pointer pauses hover-expanding until the pointer has left once: the menu stays on the strip for longer than a
     * hover takes, and only a fresh arrival expands it again.
     */
    test("hiding the menu from its arrow is not undone by the pointer that pressed it", async ({ page }) => {
        const menu = page.locator("#library-menu");
        const arrow = page.locator('#library-menu button[aria-controls="library-menu"]');
        const menuWidth = () => menu.evaluate((element) => (element.firstElementChild as HTMLElement).offsetWidth);

        const openWidth = await menuWidth();

        await arrow.click();

        await expect(arrow, "pressing it hides the menu").toHaveAttribute("aria-expanded", "false");
        await expect.poll(menuWidth, "down to the strip").toBeLessThan(openWidth);
        expect(
            await menu.evaluate((element) => element.matches(":hover")),
            "with the pointer still on the menu, which is the case being tested",
        ).toBe(true);

        await page.waitForTimeout(SETTLE_MS);

        const collapsedWidth = await menuWidth();

        await page.waitForTimeout(SETTLE_MS);

        expect(await menuWidth(), "the resting pointer does not expand it again").toBe(collapsedWidth);

        await page.mouse.move(800, 600);
        await page.waitForTimeout(SETTLE_MS);

        expect(await menuWidth(), "moving away leaves it where it was").toBe(collapsedWidth);

        await menu.hover();

        await expect.poll(menuWidth, "and coming back expands it by hover again").toBeGreaterThan(collapsedWidth);
        await expect(arrow, "without touching the setting the press made").toHaveAttribute("aria-expanded", "false");
    });
});
