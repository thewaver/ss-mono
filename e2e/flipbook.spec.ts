import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

/**
 * The book is a named region holding a spine of leaves, two pages to a leaf, and every page is in the document at
 * all times — the ones turned away and the ones covered by the pile included. So what these checks read is which
 * pages are in reach, not which are painted: the two the book is open at are named and reachable, and every other
 * one is hidden from a reader and inert. That set moves the moment the spread changes, which is why nothing here
 * waits out a turn.
 *
 * The step buttons are the library's, placed by the page, and are found by the name the page gave them — that
 * name is the consumer's wording, which is part of what is being checked.
 */
const BOOK = demo("book");

const region = `${BOOK} [aria-roledescription="book"]`;
const pages = `${BOOK} [aria-roledescription="page"]`;
const showing = `${pages}:not([aria-hidden="true"])`;
const pageNamed = (name: string) => `${pages}[aria-label="${name}"]`;
const control = (name: string) => `${BOOK} button[aria-label="${name}"]`;
const book = `${region} > div:first-child`;

const NEXT = control("Next page");
const PREVIOUS = control("Previous page");
const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

const DRAG_STEPS = 10;

const showingLabels = (page: Page) =>
    page.evaluate(
        (selector) => [...document.querySelectorAll(selector)].map((element) => element.getAttribute("aria-label")),
        showing,
    );

const transformOf = (page: Page, selector: string) =>
    page.locator(selector).evaluate((element) => (element as HTMLElement).style.transform);

/**
 * A drag is written as fractions of the book's own box, which is what the commit point is measured against. The
 * two used here sit far from it on either side — most of the book's width, and a tenth of it — so they say "past"
 * and "short" whatever the default is tuned to.
 */
const PAST = 0.7;
const SHORT = 0.1;
const GRAB_RIGHT = 0.9;
const GRAB_LEFT = 0.1;

const point = async (page: Page, ratio: number) => {
    const box = (await page.locator(book).boundingBox())!;

    return { x: box.x + box.width * ratio, y: box.y + box.height * 0.5 };
};

const drag = async (page: Page, from: number, to: number) => {
    const start = await point(page, from);
    const end = await point(page, to);

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/flipbook");
    await expect(page.locator(region)).toBeVisible();
    await page.mouse.move(0, 0);
});

test("the book is a named region, and it opens shut with the front cover alone on the right", async ({ page }) => {
    await expect(page.locator(region)).toHaveAttribute("role", "region");
    await expect(page.locator(region)).toHaveAttribute("aria-label", "A book of hinges");
    await expect(page.locator(region), "it takes focus, which is what the arrow keys need").toHaveAttribute(
        "tabindex",
        "0",
    );

    expect(await showingLabels(page), "one page, the cover, named on its own").toEqual(["page 1 of 12"]);
    await expect(page.locator(PREVIOUS), "there is nothing before the front cover").toHaveAttribute(
        "aria-disabled",
        "true",
    );
});

test("only the pages the book is open at are in reach, and every other one is out of it", async ({ page }) => {
    await page.locator(NEXT).click();
    await page.locator(NEXT).click();

    expect(await showingLabels(page), "the page read on the left, the next on the right").toEqual([
        "page 4 of 12",
        "page 5 of 12",
    ]);

    for (const name of ["page 4 of 12", "page 5 of 12"]) {
        await expect(page.locator(pageNamed(name))).not.toHaveAttribute("inert");
    }

    const away = page.locator(`${pages}[aria-hidden="true"]`);

    expect(await away.count(), "the rest are there, turned away or under the pile").toBeGreaterThan(0);

    for (const name of ["page 1 of 12", "page 3 of 12", "page 6 of 12", "page 12 of 12"]) {
        await expect(page.locator(pageNamed(name)), `${name} is hidden`).toHaveAttribute("aria-hidden", "true");
        await expect(page.locator(pageNamed(name)), `${name} is out of the tab order too`).toHaveAttribute("inert", "");
    }
});

test("the step buttons turn one spread each way, and the back cover ends the book alone on the left", async ({
    page,
}) => {
    await page.locator(NEXT).click();

    expect(await showingLabels(page)).toEqual(["page 2 of 12", "page 3 of 12"]);
    expect(await readout(page, "book"), "the page is told where the book is open").toContain("pages 2 and 3 of 12");

    await page.locator(PREVIOUS).click();

    expect(await showingLabels(page), "and back again to the cover").toEqual(["page 1 of 12"]);

    for (let turn = 0; turn < 6; turn++) await page.locator(NEXT).click();

    expect(await showingLabels(page), "the back cover alone").toEqual(["page 12 of 12"]);
    await expect(page.locator(NEXT), "with nothing after it").toHaveAttribute("aria-disabled", "true");
});

test("the arrow keys turn the book while it has focus", async ({ page }) => {
    await page.locator(region).focus();

    await page.keyboard.press("ArrowRight");
    expect(await showingLabels(page), "right turns on").toEqual(["page 2 of 12", "page 3 of 12"]);

    await page.keyboard.press("ArrowRight");
    expect(await showingLabels(page)).toEqual(["page 4 of 12", "page 5 of 12"]);

    await page.keyboard.press("ArrowLeft");
    expect(await showingLabels(page), "left turns back").toEqual(["page 2 of 12", "page 3 of 12"]);
});

test("a page dragged past the commit point turns over, either way", async ({ page }) => {
    await drag(page, GRAB_RIGHT, GRAB_RIGHT - PAST);

    expect(await showingLabels(page), "dragged left, the cover went over").toEqual(["page 2 of 12", "page 3 of 12"]);

    await drag(page, GRAB_LEFT, GRAB_LEFT + PAST);

    expect(await showingLabels(page), "dragged right, it came back").toEqual(["page 1 of 12"]);
});

test("a page let go short of the commit point turns partway and falls back", async ({ page }) => {
    const cover = pageNamed("page 1 of 12");
    const resting = await transformOf(page, cover);
    const start = await point(page, GRAB_RIGHT);
    const end = await point(page, GRAB_RIGHT - SHORT);

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: DRAG_STEPS });

    await expect
        .poll(() => transformOf(page, cover), "the page follows the pointer while it is held")
        .not.toBe(resting);

    await page.mouse.up();

    await expect.poll(() => transformOf(page, cover), "and lies back down once let go").toBe(resting);
    expect(await showingLabels(page), "the book is still shut").toEqual(["page 1 of 12"]);
});

/**
 * The announcement goes through the live region that belongs to no component, on the body, so the assertion looks
 * there. The region is reserved as the book mounts and starts empty: the book says nothing about itself as it
 * appears, and every turn after that is its own message.
 */
test("a turn announces the spread it opened at, in the page's own words", async ({ page }) => {
    await expect(page.locator(`${ANNOUNCER} > *`), "nothing is said as the book appears").toHaveCount(0);

    await page.locator(NEXT).click();
    await expect(page.locator(ANNOUNCER)).toContainText("pages 2 and 3 of 12");

    await page.locator(region).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(ANNOUNCER), "a key turn is announced the same way").toContainText("page 1 of 12");
});
