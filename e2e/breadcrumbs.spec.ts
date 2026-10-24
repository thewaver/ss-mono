import { expect, test } from "@playwright/test";

import { attributesOf, prop, tagName } from "./helpers";

/**
 * The Breadcrumbs page is the Docs view: its first live example takes the knobs for the trail (separator,
 * disabled), and its second is the same trail as links, with a knob for the link component. Each is found by the
 * key of a knob it holds. The Docs view is in the Solid Playground only so far, which is what the `@solid` in the title
 * keeps the other three from running against.
 */
const BASIC = `[data-docs-example]:has(${prop("separator")}) [data-demo]`;
const LINKS = `[data-docs-example]:has(${prop("hasLinkComponent")}) [data-demo]`;

const crumb = (scope: string) => `${scope} nav[aria-label] ol > li`;

test.describe("the Breadcrumbs' docs @solid", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/breadcrumbs/docs");
        await expect(page.locator(`${BASIC} nav`)).toBeVisible();
    });

    /**
     * The markup is the feature here, so it is what gets asserted rather than a behavior. A trail is a
     * navigation landmark holding an ordered list: the landmark is what lets someone jump straight to it,
     * and the list is what makes "four of these, in this order" true for a screen reader rather than only
     * visually. A `<div>` of links reads as neither, which is the whole reason this is a component instead
     * of a loop in the consumer's page.
     */
    test("a trail is a named landmark around an ordered list", async ({ page }) => {
        await expect(page.locator(`${BASIC} nav`), "the trail is a landmark and names itself").toHaveAttribute(
            "aria-label",
            /\S/,
        );
        await expect(page.locator(`${BASIC} nav > ol`), "the crumbs are an ordered list inside it").toHaveCount(1);
        await expect(
            page.locator(crumb(BASIC)),
            "one list entry per crumb: each holds a control, or is the current page",
        ).toHaveCount((await page.locator(`${BASIC} ol > li button`).count()) + 1);
    });

    /**
     * The last crumb is the page you are already on, so pressing it would go nowhere. It is therefore not a
     * link and not a button — it is a plain element carrying `aria-current="page"`, which is what a screen
     * reader announces as "current page". Every crumb before it stays interactive.
     *
     * Both halves matter: an implementation that made the last one a disabled link would still be in the tab
     * order, and one that dropped `aria-current` would leave a listener unable to tell where the trail ends.
     */
    test("the last crumb is the current page, and is not a control", async ({ page }) => {
        const entries = page.locator(`${BASIC} [aria-current]`);

        await expect(entries, "exactly one crumb claims to be the current page").toHaveCount(1);
        await expect(entries, "and it says which kind of current it is").toHaveAttribute("aria-current", "page");

        expect(await tagName(entries), "the current crumb is not a control at all").toBe("SPAN");
        expect(
            await tagName(page.locator(`${BASIC} button`).first()),
            "while the crumbs before it are still pressable",
        ).toBe("BUTTON");

        await expect(
            entries,
            "and being no control, it is out of the tab order rather than a stop that does nothing",
        ).not.toHaveAttribute("tabindex", "0");
    });

    /**
     * The example keeps its own path, as an app would: pressing an earlier crumb goes back to that page, so the
     * crumbs after it leave the trail. The current crumb is where you already are, so pressing it changes
     * nothing, and the restore button is the way forward again.
     */
    test("pressing a crumb goes back to it, and the restore button brings the trail back", async ({ page }) => {
        const entries = page.locator(crumb(BASIC));
        const restore = page.locator("#basicReset");
        const full = await entries.count();

        await expect(restore, "a full trail has nothing to restore").toHaveAttribute("aria-disabled", "true");

        await page.locator(`${BASIC} button`).nth(1).click();

        await expect(entries, "pressing the second crumb leaves a trail of two").toHaveCount(2);
        expect(full, "and the trail was longer before").toBeGreaterThan(2);

        await page.locator(`${BASIC} [aria-current]`).click();

        await expect(entries, "while the current crumb is inert, so the trail stands").toHaveCount(2);
        await expect(restore, "a shortened trail can be restored").not.toHaveAttribute("aria-disabled", "true");

        await restore.click();

        await expect(entries, "restoring brings every crumb back").toHaveCount(full);
    });

    /**
     * A separator is decoration: it is drawn between crumbs and must never be announced, or the trail reads
     * as "Home slash Library slash Inputs". It is also optional, which the knob proves — a consumer who wants
     * the gap alone passes no separator and gets no empty element either.
     */
    test("separators are hidden from assistive technology, and are optional", async ({ page }) => {
        const separators = page.locator(`${BASIC} ol [aria-hidden="true"]`);

        await expect(separators, "a separator sits between each pair, so one fewer than the crumbs").toHaveCount(
            (await page.locator(crumb(BASIC)).count()) - 1,
        );

        await page.locator(`${prop("separator")} [role="combobox"]`).click();
        await page.locator('[role="listbox"]').getByRole("option", { name: ">", exact: true }).click();

        await expect(
            separators.first(),
            "the slot is the consumer's, so the glyph it draws is theirs to pick",
        ).toHaveText(">");

        await page.locator(`${prop("separator")} [role="combobox"]`).click();
        await page.locator('[role="listbox"]').getByRole("option", { name: "none", exact: true }).click();

        await expect(separators, "a trail with no separator slot renders nothing between the crumbs").toHaveCount(0);
    });

    test("an href makes a crumb an anchor, and a link component replaces the element", async ({ page }) => {
        expect(await tagName(page.locator(`${LINKS} a`).first()), "an href turns the crumb into a real link").toBe("A");
        expect(
            await attributesOf(page, `${LINKS} a`, "href"),
            "and the address is the consumer's, passed through untouched",
        ).toContain("#breadcrumb-home");

        await expect(
            page.locator(`${LINKS} [data-link-component]`),
            "without a link component the plain anchor is used",
        ).toHaveCount(0);

        await page.locator(`${prop("hasLinkComponent")} input`).click();

        await expect(
            page.locator(`${LINKS} [data-link-component]`),
            "and a consumer's own link component renders in place of the anchor",
        ).not.toHaveCount(0);
    });

    /**
     * Disabling follows the house rule rather than the native one: the crumb refuses the press and says it is
     * disabled, without the native attribute that would take it out of the tab order and hide it from a reader.
     */
    test("a disabled crumb refuses the press", async ({ page }) => {
        await page.locator(`${prop("isDisabled")} input`).check();

        const first = page.locator(`${BASIC} button`).first();
        const before = await page.locator(crumb(BASIC)).count();

        await expect(first, "the crumb says it is disabled without the native attribute").toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await expect(page.locator(`${BASIC} button[disabled]`), "and no crumb carries the native one").toHaveCount(0);

        await first.click({ force: true });

        await expect(page.locator(crumb(BASIC)), "pressing it moves nothing").toHaveCount(before);
    });
});
