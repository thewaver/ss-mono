import { type Page, expect, test } from "@playwright/test";

import { accessibleText, demo, prop, readout, tagName } from "./helpers";

/**
 * Every list on the page reads the same three knobs — page count, sibling count and boundary count — so
 * the arithmetic under test is the panel's rather than each variant's. What separates the variants is
 * which step controls they ask for and whether their pages are links.
 *
 * The painter draws a bare number and marks it `aria-hidden`, exactly as the calendar's day cells do, so
 * the visible text and the accessible name are deliberately different things here: `accessibleText` on a
 * page item is empty, and the name a screen reader would read comes from `aria-label`.
 */
const STEPS = demo("steps");
const ENDS = demo("ends");
const LINKS = demo("links");
const LINK_COMPONENT = demo("linkComponent");

const nav = (scope: string) => `${scope} nav`;
const item = (scope: string) => `${scope} nav a, ${scope} nav button`;
const pageItem = (scope: string, number: number) => `${scope} nav [aria-label="Page ${number}"]`;
const step = (scope: string, name: string) => `${scope} nav [aria-label="${name} page"]`;
const gap = (scope: string) => `${scope} nav [aria-hidden="true"] [title]`;

const field = (key: string) => `${prop(key)} input`;

test.beforeEach(async ({ page: browserPage }) => {
    await browserPage.goto("/paginator");
    await expect(browserPage.locator(pageItem(STEPS, 1))).toBeVisible();
});

test("the list names itself, and every page carries a name the painted number does not give it", async ({ page }) => {
    await expect(page.locator(nav(STEPS))).toHaveAttribute("aria-label", "Results");

    expect(
        await accessibleText(page.locator(pageItem(STEPS, 1))),
        "the painter's digits are hidden, so the label is the only name",
    ).toBe("");
    await expect(page.locator(pageItem(STEPS, 1))).toHaveAttribute("aria-current", "page");
    await expect(page.locator(pageItem(STEPS, 2)), "and only the current one is marked").not.toHaveAttribute(
        "aria-current",
    );
});

test("the gaps stand for named pages rather than for an unspecified some", async ({ page }) => {
    await expect(page.locator(gap(STEPS)), "one gap on the far side while the current page is the first").toHaveCount(
        1,
    );
    await expect(page.locator(gap(STEPS))).toHaveAttribute("title", "Pages 5 to 19");

    await page.locator(pageItem(STEPS, 4)).click();
    await page.locator(pageItem(STEPS, 5)).click();

    await expect(page.locator(gap(STEPS)), "and one either side once the page is clear of both ends").toHaveCount(2);
    await expect(page.locator(gap(STEPS)).first()).toHaveAttribute("title", "Pages 2 to 3");
});

test("a gap is skipped rather than announced, since a reader cannot act on the pages it hides", async ({ page }) => {
    await expect(page.locator(`${STEPS} nav [aria-hidden="true"]`).first()).toBeVisible();
    await expect(
        page.locator(`${STEPS} nav [aria-hidden="true"][aria-label]`),
        "the gap is not a control and is not named as one",
    ).toHaveCount(0);
});

test("stepping stops at each end rather than wrapping, and says so before it is pressed", async ({ page }) => {
    await expect(page.locator(step(STEPS, "Previous")), "there is nowhere back from the first page").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(step(STEPS, "Next"))).not.toHaveAttribute("aria-disabled");

    await page.locator(step(STEPS, "Previous")).click({ force: true });
    expect(await readout(page, "steps"), "and pressing it does nothing").toContain("page 1 of 20");

    await page.locator(step(STEPS, "Next")).click();
    expect(await readout(page, "steps")).toContain("page 2 of 20");
});

test("the end jumps are a separate pair, and go quiet alongside their neighbours", async ({ page }) => {
    await expect(page.locator(step(ENDS, "First"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step(ENDS, "Last"))).not.toHaveAttribute("aria-disabled");

    await page.locator(step(ENDS, "Last")).click();
    expect(await readout(page, "ends")).toContain("page 20 of 20");

    await expect(page.locator(step(ENDS, "Last")), "which is where that pair falls silent").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(step(ENDS, "Next"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step(ENDS, "First"))).not.toHaveAttribute("aria-disabled");
});

test("the sibling and boundary knobs widen the window and pin the ends", async ({ page }) => {
    const before = await page.locator(item(STEPS)).count();

    await page.locator(field("siblingCount")).fill("3");
    await page.locator(field("siblingCount")).blur();

    await expect
        .poll(() => page.locator(item(STEPS)).count(), { message: "more siblings means more pages on show" })
        .toBeGreaterThan(before);

    await page.locator(field("boundaryCount")).fill("3");
    await page.locator(field("boundaryCount")).blur();

    await expect(page.locator(pageItem(STEPS, 18)), "three pinned at the end means page 18 is one of them").toHaveCount(
        1,
    );
});

test("an href makes a page an anchor, and a link component replaces the element", async ({ page }) => {
    expect(await tagName(page.locator(pageItem(LINKS, 2))), "a page with an href is a link").toBe("A");
    expect(await tagName(page.locator(pageItem(STEPS, 2))), "and one without stays a button").toBe("BUTTON");
    await expect(page.locator(pageItem(LINKS, 2))).toHaveAttribute("href", "#paginator-page-2");

    await expect(
        page.locator(`${LINK_COMPONENT} nav a[data-link-component]`),
        "the consumer's own component renders every page when one is given",
    ).toHaveCount(await page.locator(`${LINK_COMPONENT} nav a`).count());

    await expect(
        page.locator(step(LINKS, "Previous")),
        "a step with nowhere to go offers no address either, so it cannot be followed",
    ).not.toHaveAttribute("href");
});

test("the disabled knob reaches every control in every list", async ({ page }) => {
    await page.locator(field("isDisabled")).click();

    await expect(page.locator(`${STEPS} nav [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item(STEPS)).count(),
    );
    await expect(page.locator(`${LINKS} nav [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item(LINKS)).count(),
    );

    await page.locator(pageItem(STEPS, 3)).click({ force: true });
    expect(await readout(page, "steps"), "and nothing moves the page").toContain("page 1 of 20");
});

/**
 * The dial reads the same knobs as the straight rows and asks for the same four step controls `ENDS` does,
 * so what separates the two is the layout function and nothing else — which is what makes them comparable
 * name for name.
 */
const DIAL = demo("dial");

const placedBox = (scope: string) => `${scope} nav [role="presentation"][style*="left"]`;

const controlNames = (page: Page, scope: string) =>
    page.locator(item(scope)).evaluateAll((elements) => elements.map((element) => element.ariaLabel));

/**
 * A placement is written in fractions of the container's width, so the pair of `cqw` offsets the component
 * wrote onto the box is what a spec can read — layout space rather than the measured page, which is the
 * space `playwright.config.ts` explains every geometric assertion here has to stay in.
 */
const placedAngles = async (page: Page, scope: string) => {
    const styles = await page
        .locator(placedBox(scope))
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("style") ?? ""));

    return styles.map((style) => {
        const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);
        const centre = 50;

        return (Math.atan2(at("top") - centre, at("left") - centre) * 180) / Math.PI;
    });
};

/**
 * Read clockwise from wherever the first item happens to sit, so the check is that the ring walks one way
 * round rather than that it starts anywhere in particular — a start angle is the layout's to choose.
 */
const toTurnedBy = (angles: number[]) => {
    const full = 360;

    return angles.map((angle) => (((angle - angles[0]) % full) + full) % full);
};

test("a laid-out row is the same controls in the same order, moved rather than rebuilt", async ({ page }) => {
    expect(
        await controlNames(page, DIAL),
        "the dial asks for the same steps as the row with end jumps, so the names should match in order",
    ).toEqual(await controlNames(page, ENDS));

    await expect(
        page.locator(placedBox(DIAL)),
        "and every element of it has a box of its own, gaps included",
    ).toHaveCount((await page.locator(item(DIAL)).count()) + (await page.locator(gap(DIAL)).count()));

    await expect(page.locator(placedBox(ENDS)), "while a row with no layout places nothing").toHaveCount(0);
});

test("the ring walks one way round, so the order a pointer sees is the order the keyboard walks", async ({ page }) => {
    const turnedBy = toTurnedBy(await placedAngles(page, DIAL));

    expect(turnedBy.length, "a wedge for every step, page and gap").toBe(
        (await page.locator(item(DIAL)).count()) + (await page.locator(gap(DIAL)).count()),
    );

    for (let index = 1; index < turnedBy.length; index++) {
        expect(turnedBy[index], `wedge ${index} sits further round than the one before it`).toBeGreaterThan(
            turnedBy[index - 1],
        );
    }
});

test("the page moves from a wedge the same as from a cell, and the wedge that is current follows it", async ({
    page,
}) => {
    await expect(page.locator(pageItem(DIAL, 1))).toHaveAttribute("aria-current", "page");

    await page.locator(step(DIAL, "Last")).click();

    expect(await readout(page, "dial"), "the end jump reaches the last page from a wedge").toContain("page 20 of 20");
    await expect(page.locator(pageItem(DIAL, 20)), "and the mark moves with it").toHaveAttribute(
        "aria-current",
        "page",
    );
    await expect(page.locator(pageItem(DIAL, 1))).not.toHaveAttribute("aria-current");
});
