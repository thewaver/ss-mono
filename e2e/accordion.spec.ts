import { type Page, expect, test } from "@playwright/test";

import { activeText, isScrolling, offsetHeight, prop, scrollTop, tabIndex, waitUntilStill } from "./helpers";

/**
 * The Accordion has no examples of its own: its page is the Docs view, where each behavior has a live example. The
 * first takes the knobs for how many sections may be open; the others are found by something only they hold — the
 * "Add a line" button, the line saying what has been built, the box that scrolls, the sections side by side. The Docs
 * view is in the Solid Playground only so far, which is what the `@solid` in the title keeps the other three from
 * running against.
 */
const BASIC = `[data-docs-example]:has(${prop("policy")}) [data-demo]`;
const GROWING = "[data-docs-example]:has(#addALine) [data-demo]";
const DEFERRED = '[data-docs-example]:has-text("Built so far") [data-demo]';
const SCROLLED = "[data-docs-example]:has([data-scroll-box]) [data-demo]";
const ROW = '[data-docs-example]:has-text("Mountains") [data-demo]';

/**
 * The panel is measured through two boxes on purpose: the one carrying `role="region"` is the constrained
 * box the library animates, and its only child is the unconstrained content the height is animated
 * towards. Comparing the two is the whole contract, and it is why a collapsed panel still has content
 * with a height.
 */
const header = (scope: string) => `${scope} button[aria-expanded]`;
const panel = (scope: string) => `${scope} [role="region"]`;

const TRANSITION_TIMEOUT_MS = 5_000;

const choosePolicy = async (page: Page, name: string) => {
    await page.locator(`${prop("policy")} [role="combobox"]`).click();
    await page.locator('[role="listbox"]').getByRole("option", { name, exact: true }).click();
};

const offsetWidthOf = (page: Page, selector: string, index: number) =>
    page
        .locator(selector)
        .nth(index)
        .evaluate((element) => (element as HTMLElement).offsetWidth);

test.describe("the Accordion's docs @solid", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/accordion/docs");
        await expect(page.locator(header(BASIC)).first()).toBeVisible();
    });

    test("each section is a heading, a button and a region wired to each other", async ({ page }) => {
        await expect(
            page.locator(`${BASIC} h3`),
            "every header sits in a heading, so the page keeps an outline",
        ).toHaveCount(4);

        const first = page.locator(header(BASIC)).first();
        const controls = await first.getAttribute("aria-controls");
        const headerId = await first.getAttribute("id");
        const labelledBy = await page.locator(`#${controls}`).getAttribute("aria-labelledby");

        expect(
            await page.locator(`#${controls}`).getAttribute("role"),
            "the header points at the region it opens",
        ).toBe("region");
        expect(labelledBy, "and the region points back at the header that names it").toBe(headerId);
    });

    test("a collapsed panel is inert and takes no height, while its content stays measurable", async ({ page }) => {
        await expect(
            page.locator(panel(BASIC)).nth(1),
            "a collapsed panel is inert, so nothing in it is reachable",
        ).toHaveAttribute("inert", "");
        expect(await offsetHeight(page.locator(panel(BASIC)).nth(1)), "and it takes no height").toBe(0);
        expect(
            await offsetHeight(page.locator(panel(BASIC)).nth(1).locator("> *")),
            "but the content inside it still has one, which is what the panel animates towards",
        ).toBeGreaterThan(0);
    });

    test("opening a section animates it to its content's own height", async ({ page }) => {
        const target = await offsetHeight(page.locator(panel(BASIC)).nth(1).locator("> *"));

        await page.locator(header(BASIC)).nth(1).click();

        await expect(page.locator(header(BASIC)).nth(1)).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator(panel(BASIC)).nth(1)).not.toHaveAttribute("inert");
        await expect
            .poll(() => offsetHeight(page.locator(panel(BASIC)).nth(1)), { timeout: TRANSITION_TIMEOUT_MS })
            .toBe(target);
    });

    test("many stay open at once, and closing one closes only that one", async ({ page }) => {
        await page.locator(header(BASIC)).nth(1).click();
        await page.locator(header(BASIC)).nth(2).click();

        await expect(page.locator(header(BASIC)).nth(1), "every opened section stays open").toHaveAttribute(
            "aria-expanded",
            "true",
        );
        await expect(page.locator(header(BASIC)).nth(2)).toHaveAttribute("aria-expanded", "true");

        await page.locator(header(BASIC)).nth(1).click();

        await expect(page.locator(header(BASIC)).nth(1), "closing one touches only that one").toHaveAttribute(
            "aria-expanded",
            "false",
        );
        await expect(page.locator(header(BASIC)).nth(2)).toHaveAttribute("aria-expanded", "true");
    });

    test("single-expand mode closes the previous section itself", async ({ page }) => {
        await choosePolicy(page, "single");

        await page.locator(header(BASIC)).nth(0).click();
        await expect(page.locator(header(BASIC)).nth(0)).toHaveAttribute("aria-expanded", "true");

        await page.locator(header(BASIC)).nth(1).click();

        await expect(page.locator(header(BASIC)).nth(1), "the component opens the new one").toHaveAttribute(
            "aria-expanded",
            "true",
        );
        await expect(
            page.locator(header(BASIC)).nth(0),
            "and drops the previous one itself, rather than the consumer doing it",
        ).toHaveAttribute("aria-expanded", "false");
        await expect
            .poll(() => offsetHeight(page.locator(panel(BASIC)).nth(0)), { timeout: TRANSITION_TIMEOUT_MS })
            .toBe(0);
    });

    /**
     * The third state of the same question: single-expand allows zero open, because pressing the open header
     * closes it. Requiring one turns that press into a no-op — the open header is still a real button and still
     * says it is expanded, the way an already-selected radio is still pressable and does nothing.
     */
    test("a required expansion refuses to close the last open section", async ({ page }) => {
        await choosePolicy(page, "single_required");

        await page.locator(header(BASIC)).nth(0).click();
        await expect(page.locator(header(BASIC)).nth(0)).toHaveAttribute("aria-expanded", "true");

        await page.locator(header(BASIC)).nth(0).click();

        await expect(
            page.locator(header(BASIC)).nth(0),
            "pressing the only open header leaves it open, and the header still says so",
        ).toHaveAttribute("aria-expanded", "true");

        await page.locator(header(BASIC)).nth(1).click();

        await expect(page.locator(header(BASIC)).nth(1), "the way out is into another section").toHaveAttribute(
            "aria-expanded",
            "true",
        );
        await expect(page.locator(header(BASIC)).nth(0)).toHaveAttribute("aria-expanded", "false");

        await page.locator(header(BASIC)).nth(1).click();

        await expect(page.locator(header(BASIC)).nth(1), "which is then the one that cannot be closed").toHaveAttribute(
            "aria-expanded",
            "true",
        );
    });

    test("the page can open and close every section from outside", async ({ page }) => {
        const controlled = page
            .locator("[data-docs-example]")
            .filter({ has: page.getByRole("button", { name: "Open all" }) });

        await controlled.getByRole("button", { name: "Open all" }).click();

        for (const index of [0, 1, 2]) {
            await expect(
                controlled.locator("button[aria-expanded]").nth(index),
                "writing the list opens every section",
            ).toHaveAttribute("aria-expanded", "true");
        }

        await controlled.getByRole("button", { name: "Close all" }).click();

        for (const index of [0, 1, 2]) {
            await expect(
                controlled.locator("button[aria-expanded]").nth(index),
                "and writing an empty one closes them all",
            ).toHaveAttribute("aria-expanded", "false");
        }
    });

    test("an open panel follows content that appears after it opened", async ({ page }) => {
        const before = await offsetHeight(page.locator(panel(GROWING)).first());

        await page.locator("#addALine").click();

        await expect
            .poll(() => offsetHeight(page.locator(panel(GROWING)).first()), { timeout: TRANSITION_TIMEOUT_MS })
            .toBeGreaterThan(before);
    });

    test("arrows and the edge keys walk the headers, skipping the disabled one", async ({ page }) => {
        await page.locator(header(BASIC)).nth(0).focus();

        await page.keyboard.press("ArrowDown");
        expect(await activeText(page), "ArrowDown moves to the next header").toContain("Returns");

        await page.keyboard.press("End");
        expect(await activeText(page), "End lands on the last enabled header, not the disabled one after it").toContain(
            "Warranty",
        );

        await page.keyboard.press("ArrowDown");
        expect(await activeText(page), "and the walk wraps past the disabled header rather than stopping").toContain(
            "Shipping",
        );
    });

    test("a disabled header carries no native attribute and cannot open its panel", async ({ page }) => {
        await expect(page.locator("button[disabled]"), "no header uses the native disabled attribute").toHaveCount(0);
        await expect(page.locator(header(BASIC)).nth(3)).toHaveAttribute("aria-disabled", "true");
        expect(await tabIndex(page.locator(header(BASIC)).nth(3)), "and it is out of the tab order").toBe(-1);

        await page.locator(header(BASIC)).nth(3).dispatchEvent("click");

        await expect(page.locator(header(BASIC)).nth(3), "clicking it changes nothing").toHaveAttribute(
            "aria-expanded",
            "false",
        );
        expect(await offsetHeight(page.locator(panel(BASIC)).nth(3))).toBe(0);
    });

    /**
     * The row is the same accordion with its sections side by side: each panel opens beside its header and grows in
     * width rather than height, and the arrows that walk the headers are the ones along the row. It holds one section
     * open at all times, so the only way out of a section is into another.
     */
    test("a row walks its headers with the left and right arrows, and not with up and down", async ({ page }) => {
        await page.locator(header(ROW)).first().focus();
        await page.keyboard.press("ArrowRight");

        await expect(page.locator(header(ROW)).nth(1), "the right arrow moves to the next header").toBeFocused();

        await page.keyboard.press("ArrowDown");

        await expect(page.locator(header(ROW)).nth(1), "the down arrow is not the row's to answer").toBeFocused();

        await page.keyboard.press("ArrowLeft");

        await expect(page.locator(header(ROW)).first(), "and the left arrow moves back").toBeFocused();
    });

    test("a row opens a panel in width, and pressing the open header leaves it open", async ({ page }) => {
        await page.locator(header(ROW)).nth(2).click();

        await expect
            .poll(() => offsetWidthOf(page, panel(ROW), 2), { timeout: TRANSITION_TIMEOUT_MS })
            .toBeGreaterThan(0);
        await expect
            .poll(() => offsetWidthOf(page, panel(ROW), 0), {
                message: "opening another closes the one that was open",
                timeout: TRANSITION_TIMEOUT_MS,
            })
            .toBe(0);

        await page.locator(header(ROW)).nth(2).click();

        await expect(page.locator(header(ROW)).nth(2), "the only way out of a section is into another").toHaveAttribute(
            "aria-expanded",
            "true",
        );
    });

    test("the orientation knob turns the row into a column, and the arrows follow", async ({ page }) => {
        await page.locator(`${prop("orientation")} [role="combobox"]`).click();
        await page.locator('[role="listbox"]').getByRole("option", { name: "vertical", exact: true }).click();

        await page.locator(header(ROW)).first().focus();
        await page.keyboard.press("ArrowDown");

        await expect(page.locator(header(ROW)).nth(1), "the down arrow now walks the headers").toBeFocused();

        await page.keyboard.press("ArrowRight");

        await expect(
            page.locator(header(ROW)).nth(1),
            "and the right arrow is no longer a column's to answer",
        ).toBeFocused();
    });

    /**
     * The scroll is opt-in, so the box is what makes it visible: four sections in a window a couple of headers tall
     * means the lower ones grow below the fold, which is a long page reproduced inside a card. Neither test asserts a
     * scroll distance — what matters is where the section ends up, not how far anything traveled to put it there.
     */
    const scrollBox = (page: Page) => page.locator(`${SCROLLED} [data-scroll-box]`);

    const EDGE_TOLERANCE_PX = 2;

    /**
     * Both of these wait in three phases, because there are three things that have to be true and only one of
     * them is about the click.
     *
     * **The box has to be overflowing before any of this means anything.** `beforeEach` waits for a header in
     * the first example on the page, which says nothing about this one; on a loaded machine the scrolling example can
     * still be laying out when the click lands, and a box that is not yet taller than its window has nowhere to
     * scroll to.
     *
     * **Then the panel's height animates**, and only once that is over does `Collapsible` scroll the section
     * into view. So a wait that watches the panel settle can land in the gap between the two and measure before
     * anything has scrolled. Waiting for the height to reach its content's, and then for the box to stop moving, is
     * the same sequence the component performs.
     */
    const openAndSettle = async (page: Page, index: number) => {
        await scrollBox(page).scrollIntoViewIfNeeded();
        await expect
            .poll(() => isScrolling(scrollBox(page)), { message: "the box has more in it than it can show" })
            .toBe(true);

        const target = await offsetHeight(page.locator(panel(SCROLLED)).nth(index).locator("> *"));

        await page.locator(header(SCROLLED)).nth(index).click();
        await expect
            .poll(() => offsetHeight(page.locator(panel(SCROLLED)).nth(index)), { timeout: TRANSITION_TIMEOUT_MS })
            .toBe(target);
        await waitUntilStill(page.locator(panel(SCROLLED)).nth(index));
    };

    test("opening a section below the fold brings it into view", { tag: "@solo" }, async ({ page }) => {
        expect(await scrollTop(scrollBox(page)), "nothing has scrolled yet").toBe(0);

        await openAndSettle(page, 2);

        expect(await scrollTop(scrollBox(page)), "the box scrolled to reach the section").toBeGreaterThan(0);

        const box = (await scrollBox(page).boundingBox())!;
        const opened = (await page.locator(panel(SCROLLED)).nth(2).boundingBox())!;

        expect(opened.y + opened.height, "and the whole of the panel is inside the box").toBeLessThanOrEqual(
            box.y + box.height + EDGE_TOLERANCE_PX,
        );
    });

    /**
     * The case that decides whether this behavior is worth having: a panel with more in it than the box can
     * show cannot be brought fully into view, and scrolling to its far edge would push the header someone just
     * pressed off the top. So the header wins, and the panel is cut at the bottom instead.
     */
    test(
        "a section taller than the box keeps the pressed header in view rather than scrolling past it",
        { tag: "@solo" },
        async ({ page }) => {
            await openAndSettle(page, 3);

            const box = (await scrollBox(page).boundingBox())!;
            const opened = (await page.locator(panel(SCROLLED)).nth(3).boundingBox())!;
            const pressed = (await page.locator(header(SCROLLED)).nth(3).boundingBox())!;

            expect(opened.height, "the panel really is more than the box can show").toBeGreaterThan(box.height);
            expect(pressed.y, "the header is still inside the box").toBeGreaterThanOrEqual(box.y - EDGE_TOLERANCE_PX);
            expect(pressed.y, "and sits at its top, so as much of the panel as fits is showing").toBeLessThan(
                box.y + pressed.height,
            );
        },
    );

    /**
     * The lazy panel, and the reason it is worth having rather than being the same trade twice. A panel is kept
     * mounted at zero height so it stays measurable, which is what lets the height animate; the cost is that a
     * hundred sections build a hundred panels to show one. `isPanelBuiltOnExpand` withholds the content until
     * the first expansion, and the animation survives because the measurement lands before the transition
     * starts: opening mounts the content into a box still at zero height, the height observer reads it in the
     * same update, and the fader flips its target a frame later.
     *
     * Nothing here asserts a pixel count. The three assertions are the three claims: nothing is built at load,
     * opening one builds only that one, and the growth is gradual rather than a jump — the last read as a
     * height that is above zero and below its final value while the transition is running.
     */
    test("a lazy section builds nothing until it is opened, and still animates when it is", async ({ page }) => {
        await expect(page.locator(`${DEFERRED} [data-built]`), "no panel is in the page to begin with").toHaveCount(0);

        const target = await offsetHeight(page.locator(panel(DEFERRED)).nth(0).locator("> *"));

        expect(target, "and the collapsed panel has nothing to measure, which is the point").toBe(0);

        await page.locator(header(DEFERRED)).nth(0).click();

        const midway = await offsetHeight(page.locator(panel(DEFERRED)).nth(0));

        await expect
            .poll(() => offsetHeight(page.locator(panel(DEFERRED)).nth(0)), { timeout: TRANSITION_TIMEOUT_MS })
            .toBeGreaterThan(0);

        const opened = await offsetHeight(page.locator(panel(DEFERRED)).nth(0));

        expect(midway, "the first frame is still short of the height it is heading for").toBeLessThan(opened);
        await expect(page.locator(DEFERRED), "and only the opened section was built").toContainText(
            "Built so far: Shipping",
        );
    });

    test("and keeps it once built, so closing a lazy section does not discard what is inside it", async ({ page }) => {
        await page.locator(header(DEFERRED)).nth(0).click();

        await expect(page.locator(`${DEFERRED} [data-built="Shipping"]`).first()).toBeVisible();

        const built = await page.locator(`${DEFERRED} [data-built]`).count();

        await page.locator(header(DEFERRED)).nth(0).click();

        await expect
            .poll(() => offsetHeight(page.locator(panel(DEFERRED)).nth(0)), { timeout: TRANSITION_TIMEOUT_MS })
            .toBe(0);

        await expect(
            page.locator(`${DEFERRED} [data-built]`),
            "the content is still there behind the collapsed panel, so anything in it survives",
        ).toHaveCount(built);

        await expect(
            page.locator(`${DEFERRED} [data-built="Returns"]`),
            "and a section nobody opened is still unbuilt",
        ).toHaveCount(0);
    });
});
