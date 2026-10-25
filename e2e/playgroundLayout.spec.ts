import { type Locator, expect, test } from "@playwright/test";

import { centerDistance, docsSettled } from "./helpers";

test.beforeEach(async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator("[data-docs-example]").first()).toBeVisible();
    await docsSettled(page);
});

/**
 * On a window wider than the Playground's cap, the left menu's content and the page are one block centered in the
 * window, while the menu's dark panel still runs out to the window's left edge. The block ends with the page's own
 * margin on its right, so the room right of the page body is measured past that margin, read off the page column
 * rather than written down. Everything is compared in the window's own pixels, so the scale the `Viewport` applies
 * cancels out of both sides, and nothing here says how wide the block is.
 */
test.describe("on a window much wider than the page", () => {
    test.use({ viewport: { width: 2800, height: 1200 } });

    test("the menu's content and the page body are centered together, with the panel reaching the left edge", async ({
        page,
    }) => {
        const layout = await page.evaluate(() => {
            const nav = document.querySelector("#library-menu nav")!;
            const main = document.querySelector("main")!;
            const navRect = nav.getBoundingClientRect();
            const scale = navRect.width / (nav as HTMLElement).offsetWidth;

            const isDrawn = (rect: DOMRect) => rect.width > 0 && rect.height > 0;

            const contentLeft = Math.min(
                ...[...nav.querySelectorAll("*")]
                    .map((element) => element.getBoundingClientRect())
                    .filter(isDrawn)
                    .map((rect) => rect.left),
            );
            const bodyRight = Math.max(
                ...[...main.children]
                    .map((element) => element.getBoundingClientRect())
                    .filter(isDrawn)
                    .map((rect) => rect.right),
            );
            const pageMargin = parseFloat(getComputedStyle(main).paddingRight) * scale;

            return {
                panelLeft: navRect.left,
                spaceLeft: contentLeft,
                spaceRight: document.documentElement.clientWidth - bodyRight - pageMargin,
            };
        });

        expect(layout.panelLeft, "the dark panel runs out to the window's left edge").toBeCloseTo(0, 0);
        expect(layout.spaceLeft, "the menu's content does not start at the edge with it").toBeGreaterThan(0);
        expect(
            Math.abs(layout.spaceLeft - layout.spaceRight),
            `the room left of the block matches the room right of it (left ${layout.spaceLeft}, right ${layout.spaceRight})`,
        ).toBeLessThan(2);
    });
});

/**
 * About, Getting started and Gallery sit above the menu's tree rather than in it, and carry a hover track of their
 * own: one highlight floater that follows the link under the pointer and goes once the pointer leaves the three. The
 * links are found by the routes they lead to, and the floater's box is checked against the link's, never against a
 * position.
 */
test("the page links above the menu share one highlight that follows the pointer", async ({ page }) => {
    const about = page.locator('#library-menu a[href="/"]');
    const gallery = page.locator('#library-menu a[href="/gallery"]');
    const highlight = about.locator("..").locator('[data-floater="highlight"]');
    const markOf = (link: Locator) => centerDistance(highlight.locator(".."), link);

    await expect(highlight, "nothing is hovered yet").toHaveCount(0);

    await about.hover();
    await expect.poll(() => markOf(about), "hovering About draws the highlight over it").toBeLessThan(2);

    await gallery.hover();
    await expect.poll(() => markOf(gallery), "moving to Gallery carries it there").toBeLessThan(2);
    await expect(highlight, "it is the one highlight, not a second").toHaveCount(1);

    const box = (await page.locator("main").boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    await expect(highlight, "leaving the links lets it play out and go").toHaveCount(0);
});

test("the menu search clears from its own button, which is there only while there is something to clear", async ({
    page,
}) => {
    const search = page.getByRole("textbox", { name: "Search components" });
    const clear = page.getByRole("button", { name: "Clear search" });

    await expect(clear, "an empty search has nothing to clear").toHaveCount(0);

    await search.click();
    await page.keyboard.type("Tree");
    await clear.click();

    await expect(search, "pressing it empties the search").toHaveValue("");
    await expect(search, "and hands focus back to it").toBeFocused();
    await expect(clear, "and the button goes with the text").toHaveCount(0);
});
