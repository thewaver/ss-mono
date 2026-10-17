import { type Locator, type Page, expect, test } from "@playwright/test";

import { demo } from "./helpers";

/**
 * `FlyoutMenu` follows the W3C's fly-out menu tutorial: every entry is a link to its own page, and an entry with pages
 * under it has a toggle button after its link. Hover opens the entry's panel, the toggle opens and closes it from the
 * keyboard or a touch, and tabbing along the bar opens nothing. One panel serves the whole bar, so the toggles all
 * point at the same element and only the open entry's toggle says it is expanded.
 *
 * Entries and links are found by the text the page gives them and toggles by the name the library gives them, since
 * the toggle's name is what a screen reader hears; nothing here reads a colour or a size.
 */
const SHOP = demo("shop");
const NARROW = demo("narrow");

const linkIn = (page: Page, scope: string, name: string) =>
    page
        .locator(`${scope} a`)
        .filter({ hasText: new RegExp(`^${name}$`) })
        .first();

const toggleIn = (page: Page, scope: string, entry: string) =>
    page.locator(`${scope} button[aria-label="${entry} submenu"]`);

/** The panel a toggle controls, found through the toggle's own `aria-controls`, which only an open toggle carries. */
const panelOf = async (page: Page, toggle: Locator) => page.locator(`#${await toggle.getAttribute("aria-controls")}`);

const activeText = (page: Page) => page.evaluate(() => document.activeElement?.textContent?.trim() ?? "");

/** The bar's highlight marker. The panel's is portaled out of the example, so this finds the bar's alone. */
const barHighlightIn = (page: Page, scope: string) => page.locator(`${scope} [data-floater="highlight"]`);

/** Whether one element's box takes in the whole of another's, give or take a rounding pixel. */
const covers = async (outer: Locator, inner: Locator) => {
    const a = await outer.boundingBox();
    const b = await inner.boundingBox();

    if (!a || !b) return false;

    return (
        a.x <= b.x + 1 && a.y <= b.y + 1 && a.x + a.width >= b.x + b.width - 1 && a.y + a.height >= b.y + b.height - 1
    );
};

test.beforeEach(async ({ page }) => {
    await page.goto("/flyout-menu");
    await expect(linkIn(page, SHOP, "Clothing")).toBeVisible();
});

test("every entry is a link, and only an entry with pages under it has a toggle, named after it", async ({ page }) => {
    await expect(linkIn(page, SHOP, "Clothing"), "an entry is a link to its own page").toHaveAttribute("href", /.+/);
    await expect(toggleIn(page, SHOP, "Clothing"), "with a toggle beside it").toHaveCount(1);
    await expect(toggleIn(page, SHOP, "Clothing"), "which starts closed").toHaveAttribute("aria-expanded", "false");
    await expect(toggleIn(page, SHOP, "Sale"), "an entry with no pages under it has none").toHaveCount(0);
});

test("resting the pointer on an entry opens its panel, and its toggle says so", async ({ page }) => {
    const toggle = toggleIn(page, SHOP, "Clothing");

    await linkIn(page, SHOP, "Clothing").hover();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
        (await panelOf(page, toggle)).locator("a", { hasText: "Shirts" }),
        "the panel holds its links",
    ).toBeVisible();
});

/**
 * Moving to the next entry moves the one panel rather than opening a second: the toggles all control the same
 * element, so the first one's saying it is closed and the second one's panel holding the second entry's links is the
 * whole of it.
 */
test("moving the pointer to the next entry moves the one panel there", async ({ page }) => {
    await linkIn(page, SHOP, "Clothing").hover();
    await expect(toggleIn(page, SHOP, "Clothing")).toHaveAttribute("aria-expanded", "true");

    await linkIn(page, SHOP, "Homeware").hover();

    const homeware = toggleIn(page, SHOP, "Homeware");

    await expect(homeware, "the panel follows the pointer").toHaveAttribute("aria-expanded", "true");
    await expect(toggleIn(page, SHOP, "Clothing"), "and the first entry is no longer open").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    await expect((await panelOf(page, homeware)).locator("a", { hasText: "Kitchen" })).toBeVisible();
    await expect((await panelOf(page, homeware)).locator("a", { hasText: "Shirts" }), "with its own links").toHaveCount(
        0,
    );
});

/**
 * Someone who hovers an entry and then clicks its toggle means to open it, so the click must not close what the hover
 * opened: it keeps the panel and moves focus in, as a click on a closed toggle does.
 */
test("pressing the toggle of a panel that hover opened keeps it open and moves focus in", async ({ page }) => {
    const toggle = toggleIn(page, SHOP, "Clothing");

    await linkIn(page, SHOP, "Clothing").hover();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();

    await expect(toggle, "the panel stays open").toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => activeText(page), "and focus goes to its first link").toBe("Shirts");

    await toggle.click();

    await expect(toggle, "a second press closes it").toHaveAttribute("aria-expanded", "false");
});

/**
 * An entry is two tab stops but reads as one thing, so one marker sits behind both its link and its toggle rather
 * than each lighting its own background.
 */
test("the bar's highlight sits behind the hovered entry's link and toggle together", async ({ page }) => {
    const highlight = barHighlightIn(page, SHOP);

    await toggleIn(page, SHOP, "Homeware").hover();

    await expect.poll(() => covers(highlight, linkIn(page, SHOP, "Homeware")), "it covers the link").toBe(true);
    await expect.poll(() => covers(highlight, toggleIn(page, SHOP, "Homeware")), "and the toggle").toBe(true);
    expect(await covers(highlight, linkIn(page, SHOP, "Clothing")), "and not the entry beside it").toBe(false);
});

test("tabbing along the bar stops on each link and toggle and opens nothing", async ({ page }) => {
    await linkIn(page, SHOP, "Clothing").focus();
    await page.keyboard.press("Tab");

    expect(await toggleIn(page, SHOP, "Clothing").evaluate((element) => element === document.activeElement)).toBe(true);

    await page.keyboard.press("Tab");

    expect(await activeText(page), "the next stop is the next entry's link").toBe("Homeware");
    await expect(page.locator(`${SHOP} button[aria-expanded="true"]`), "and nothing opened on the way").toHaveCount(0);
});

test("pressing a toggle opens the panel onto its first link, and Escape brings focus back to the toggle", async ({
    page,
}) => {
    const toggle = toggleIn(page, SHOP, "Garden");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => activeText(page), "a press moves focus into the panel").toBe("Tools");

    await page.keyboard.press("Escape");

    await expect(toggle, "Escape closes it").toHaveAttribute("aria-expanded", "false");
    await expect
        .poll(() => toggle.evaluate((element) => element === document.activeElement), "and focus is back on the toggle")
        .toBe(true);
});

/**
 * The panel is portaled to the end of the page, so Tab past its last link would otherwise land wherever the portal
 * sits. It carries on from the entry instead, and the panel closes once focus has left it.
 */
test("Tab past the panel's last link goes on to the next entry and closes the panel", async ({ page }) => {
    const toggle = toggleIn(page, SHOP, "Clothing");

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => activeText(page)).toBe("Shirts");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    await expect.poll(() => activeText(page), "focus carries on along the bar").toBe("Homeware");
    await expect(toggle, "and the panel it left has closed").toHaveAttribute("aria-expanded", "false");
});

test("while focus is inside the panel, the pointer passing over another entry does not move it", async ({ page }) => {
    const toggle = toggleIn(page, SHOP, "Clothing");

    await toggle.click();
    await expect.poll(() => activeText(page)).toBe("Shirts");

    await linkIn(page, SHOP, "Homeware").hover();
    await page.waitForTimeout(600);

    await expect(toggle, "the panel the keyboard is in stays").toHaveAttribute("aria-expanded", "true");
    await expect(toggleIn(page, SHOP, "Homeware")).toHaveAttribute("aria-expanded", "false");
    expect(await activeText(page), "and focus was not dropped").toBe("Shirts");
});

/**
 * Inside the overflow panel each collapsed entry keeps its link and its toggle, and the toggle opens its links in
 * place rather than in a second panel. Which entries collapse depends on the room, so the case is found from the
 * panel rather than named: the first collapsed entry that has a toggle of its own.
 */
test("entries that do not fit collapse into a last entry, each keeping its link and its toggle", async ({ page }) => {
    const more = page.locator(`${NARROW} button[aria-expanded]:not([aria-label])`);

    await expect(more, "the narrow bar has an entry holding what did not fit").toBeVisible();

    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "true");

    const panel = await panelOf(page, more);
    const nested = panel.locator("button[aria-label$=' submenu']").first();

    await expect(nested, "a collapsed entry with pages under it keeps its toggle").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    expect(await nested.getAttribute("aria-controls"), "and its links are not shown until asked for").toBeNull();

    await nested.click();

    await expect(nested, "its toggle opens them in place").toHaveAttribute("aria-expanded", "true");
    await expect(
        page
            .locator(`#${await nested.getAttribute("aria-controls")}`)
            .locator("a")
            .first(),
    ).toBeVisible();
});

test("following a link marks it as the current page", async ({ page }) => {
    const toggle = toggleIn(page, SHOP, "Clothing");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await (await panelOf(page, toggle)).locator("a", { hasText: "Shoes" }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const shoes = (await panelOf(page, toggle)).locator("a", { hasText: "Shoes" });

    await expect(shoes).toHaveAttribute("aria-current", "page");
    await expect((await panelOf(page, toggle)).locator("a[aria-current]"), "and nothing else is").toHaveCount(1);
});
