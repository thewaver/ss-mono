import { type Page, expect, test } from "@playwright/test";

import { accessibleText, docsDemo, docsSettled, prop, tagName } from "./helpers";

/**
 * The Basic example carries the knobs — item count, page size, sibling count, boundary count and disabled — and
 * starts at 60 items, 3 to a page, which is 20 pages. Every other example is fixed at that same 60 and 3. What
 * separates them is which step controls they ask for, whether their pages are links, and — for the count and the
 * field — which pieces the page arranged itself. No example reads out its page in words, so the current page is the
 * one marked `aria-current`, which is what a screen reader goes by.
 *
 * The painter draws a bare number and marks it `aria-hidden`, exactly as the calendar's day cells do, so
 * the visible text and the accessible name are deliberately different things here: `accessibleText` on a
 * page item is empty, and the name a screen reader would read comes from `aria-label`.
 */
const DOCS = "/src/App/Pages/PaginatorPage/Docs";

const STEPS = docsDemo(DOCS, "Basic");
const ENDS = docsDemo(DOCS, "Ends");
const LINKS = docsDemo(DOCS, "Links");

const nav = (scope: string) => `${scope} nav`;
const item = (scope: string) => `${scope} nav a, ${scope} nav button`;
const pageItem = (scope: string, number: number) => `${scope} nav [aria-label="Page ${number}"]`;
const step = (scope: string, name: string) => `${scope} nav [aria-label="${name} page"]`;
const gap = (scope: string) => `${scope} nav [aria-hidden="true"] [title]`;

const field = (key: string) => `${prop(key)} input`;

/** The page a list marks as current, by the name it gives that page. */
const currentPage = (scope: string) => `${scope} nav [aria-current="page"]`;

/** Types a knob's value the way a person would, and leaves the field so it settles. */
const typeInto = async (page: Page, selector: string, value: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(value);
    await page.keyboard.press("Tab");
};

test.beforeEach(async ({ page: browserPage }) => {
    await browserPage.goto("/paginator/docs");
    await expect(browserPage.locator(pageItem(STEPS, 1))).toBeVisible();
    await docsSettled(browserPage);
});

test("the list names itself, and every page carries a name the painted number does not give it", async ({ page }) => {
    await expect(page.locator(nav(STEPS))).toHaveAttribute("aria-label", /.+/);

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
    await expect(page.locator(currentPage(STEPS)), "and pressing it does nothing").toHaveAttribute(
        "aria-label",
        "Page 1",
    );

    await page.locator(step(STEPS, "Next")).click();
    await expect(page.locator(currentPage(STEPS))).toHaveAttribute("aria-label", "Page 2");
});

test("the end jumps are a separate pair, and go quiet alongside their neighbors", async ({ page }) => {
    await expect(page.locator(step(ENDS, "First"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step(ENDS, "Last"))).not.toHaveAttribute("aria-disabled");

    await page.locator(step(ENDS, "Last")).click();
    await expect(page.locator(currentPage(ENDS))).toHaveAttribute("aria-label", "Page 20");

    await expect(page.locator(step(ENDS, "Last")), "which is where that pair falls silent").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(step(ENDS, "Next"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step(ENDS, "First"))).not.toHaveAttribute("aria-disabled");
});

test("the sibling and boundary knobs widen the window and pin the ends", async ({ page }) => {
    const before = await page.locator(item(STEPS)).count();

    await typeInto(page, field("siblingCount"), "3");

    await expect
        .poll(() => page.locator(item(STEPS)).count(), { message: "more siblings means more pages on show" })
        .toBeGreaterThan(before);

    await typeInto(page, field("boundaryCount"), "3");

    await expect(page.locator(pageItem(STEPS, 18)), "three pinned at the end means page 18 is one of them").toHaveCount(
        1,
    );
});

test("an href makes a page an anchor, and a link component replaces the element", async ({ page }) => {
    expect(await tagName(page.locator(pageItem(LINKS, 2))), "a page with an href is a link").toBe("A");
    expect(await tagName(page.locator(pageItem(STEPS, 2))), "and one without stays a button").toBe("BUTTON");
    await expect(page.locator(pageItem(LINKS, 2))).toHaveAttribute("href", "#paginator-page-2");

    await expect(
        page.locator(`${LINKS} nav a[data-link-component]`),
        "the native anchor is used until a link component is given",
    ).toHaveCount(0);

    await page.locator(field("hasLinkComponent")).click();

    await expect(
        page.locator(`${LINKS} nav a[data-link-component]`),
        "the consumer's own component renders every page when one is given",
    ).toHaveCount(await page.locator(`${LINKS} nav a`).count());
    expect(await page.locator(`${LINKS} nav a`).count(), "and there are pages for it to render").toBeGreaterThan(0);

    await expect(
        page.locator(step(LINKS, "Previous")),
        "a step with nowhere to go offers no address either, so it cannot be followed",
    ).not.toHaveAttribute("href");
});

test("the disabled knob reaches every control in the list", async ({ page }) => {
    await page.locator(field("isDisabled")).click();

    await expect(page.locator(`${STEPS} nav [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item(STEPS)).count(),
    );

    await page.locator(pageItem(STEPS, 3)).click({ force: true });
    await expect(page.locator(currentPage(STEPS)), "and nothing moves the page").toHaveAttribute(
        "aria-label",
        "Page 1",
    );
});

test("the page count is worked out from the items and the page size, and the last page holds the remainder", async ({
    page,
}) => {
    await typeInto(page, field("pageSize"), "7");

    await expect(
        page.locator(pageItem(STEPS, 9)),
        "60 items at 7 a page is 9 pages, so the ninth is the last one shown",
    ).toHaveCount(1);
    await expect(page.locator(pageItem(STEPS, 10)), "and there is no tenth").toHaveCount(0);

    await page.locator(pageItem(STEPS, 9)).click();

    await expect(page.locator(`${STEPS} [role="status"]`)).toHaveText("showing 57 to 60 of 60");
});

test("an empty list has no pages, and every step goes quiet", async ({ page }) => {
    await typeInto(page, field("itemCount"), "0");

    await expect(page.locator(`${STEPS} nav [aria-label^="Page "]`)).toHaveCount(0);
    await expect(page.locator(`${STEPS} nav [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item(STEPS)).count(),
    );
    await expect(page.locator(`${STEPS} [role="status"]`)).toHaveText("nothing to show");
});

/**
 * The last two examples are arranged by the page rather than handed over whole: the steps piece with the
 * page's own "3 of 20" in its slot and no number row, and the usual row with a field beside it that writes
 * the same page signal. What they prove is that the pieces read one root, whatever sits between them.
 */
const COUNT = docsDemo(DOCS, "Count");
const JUMP = docsDemo(DOCS, "Jump");

test("the steps piece puts whatever the page gives it between the leading and the trailing steps", async ({ page }) => {
    await expect(page.locator(`${COUNT} nav [aria-label^="Page "]`), "no number row was asked for").toHaveCount(0);
    expect(
        await page.locator(`${COUNT} nav`).evaluate((nav) => {
            const text = [...nav.querySelectorAll("div")].find((element) => element.textContent === "1 of 20");
            const previous = nav.querySelector('[aria-label="Previous page"]');
            const next = nav.querySelector('[aria-label="Next page"]');

            return (
                text !== undefined &&
                previous !== null &&
                next !== null &&
                (previous.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 &&
                (text.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
            );
        }),
        "the page's own text sits between previous and next",
    ).toBe(true);

    await page.locator(step(COUNT, "Next")).click();

    await expect(page.locator(`${COUNT} nav`), "and the text follows the page it reads").toContainText("2 of 20");
    await expect(page.locator(`${COUNT} [role="status"]`), "as does the list of results").toHaveText(
        "showing 4 to 6 of 60",
    );

    await page.locator(step(COUNT, "Last")).click();

    await expect(page.locator(step(COUNT, "Next")), "the steps still stop at the end").toHaveAttribute(
        "aria-disabled",
        "true",
    );
});

test("a field the page puts beside the row moves the same page the row shows", async ({ page }) => {
    await typeInto(page, "#goToPage", "7");

    await expect(page.locator(pageItem(JUMP, 7))).toHaveAttribute("aria-current", "page");
    await expect(page.locator(currentPage(JUMP)), "and it is the only page marked").toHaveCount(1);
});

/**
 * The dial reads the same knobs as the straight rows and asks for the same four step controls `ENDS` does,
 * so what separates the two is the layout function and nothing else — which is what makes them comparable
 * name for name.
 */
const DIAL = docsDemo(DOCS, "Dial");

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
        const center = 50;

        return (Math.atan2(at("top") - center, at("left") - center) * 180) / Math.PI;
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

    await expect(page.locator(currentPage(DIAL)), "the end jump reaches the last page from a wedge").toHaveCount(1);
    await expect(page.locator(pageItem(DIAL, 20)), "and the mark moves with it").toHaveAttribute(
        "aria-current",
        "page",
    );
    await expect(page.locator(pageItem(DIAL, 1))).not.toHaveAttribute("aria-current");
});

test("the ring keeps document order as the number row changes length under it", async ({ page }) => {
    for (const number of [4, 5, 6]) await page.locator(pageItem(DIAL, number)).click();

    await expect(page.locator(gap(DIAL)), "a gap either side now, where there was one").toHaveCount(2);

    const turnedBy = toTurnedBy(await placedAngles(page, DIAL));

    expect(turnedBy.length, "a wedge for every step, page and gap after the change").toBe(
        (await page.locator(item(DIAL)).count()) + (await page.locator(gap(DIAL)).count()),
    );

    for (let index = 1; index < turnedBy.length; index++) {
        expect(turnedBy[index], `wedge ${index} still sits further round than the one before it`).toBeGreaterThan(
            turnedBy[index - 1],
        );
    }
});
