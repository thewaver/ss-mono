import { type Page, expect, test } from "@playwright/test";

import { demo, readout, waitUntilStill } from "./helpers";

test.beforeEach(async ({ page }) => {
    await page.goto("/table-of-contents");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * What a table of contents promises is the relationship between two lists: the link marked `aria-current` is the
 * one for the last heading scrolled past a line near the top, and pressing a link takes the reader to its
 * heading. So these read the mark off the links and the position off the headings, and never ask what the mark
 * looks like. The token is `location` — the current place within a document — rather than `page`, which would say
 * the link is the page itself.
 *
 * The page scrolls in a container of the Playground's own rather than the window, so the one that moves is
 * found by walking up from the article to the first ancestor that actually scrolls.
 */
test.describe("a table of contents following the page", () => {
    const TOC = demo("tableOfContents");
    const LINKS = `${TOC} nav a`;
    const HEADINGS = `${TOC} article h3`;
    const MARKED = `${LINKS}[aria-current="location"]`;
    const WHEEL_STEP = 120;
    const MAX_WHEEL_STEPS = 80;

    const markedIndex = (page: Page) =>
        page.locator(LINKS).evaluateAll((links) => links.findIndex((link) => link.getAttribute("aria-current")));

    const scrollerOf = (page: Page) =>
        page
            .locator(`${TOC} article`)
            .evaluateHandle((element) => {
                let node = element.parentElement;

                const scrolls = (candidate: HTMLElement) =>
                    candidate.scrollHeight > candidate.clientHeight &&
                    /auto|scroll/.test(getComputedStyle(candidate).overflowY);

                while (node && !scrolls(node)) node = node.parentElement;

                return node!;
            })
            .then((handle) => handle.asElement()!);

    test("is a named navigation landmark whose links each point at their own heading", async ({ page }) => {
        const nav = page.locator(`${TOC} nav`);

        expect(
            await nav.getAttribute("aria-label"),
            "the landmark carries a name to tell it from the site's own",
        ).toBeTruthy();

        const pairs = await page.locator(LINKS).evaluateAll((links) =>
            links.map((link) => {
                const target = document.getElementById((link.getAttribute("href") ?? "").replace(/^#/, ""));

                return {
                    tag: target?.tagName,
                    focusable: target?.getAttribute("tabindex"),
                    labels: target?.closest("section")?.getAttribute("aria-labelledby") === target?.id,
                };
            }),
        );

        expect(pairs.length, "one link per section").toBe(await page.locator(HEADINGS).count());

        for (const pair of pairs) {
            expect(pair.tag, "every link's fragment names a heading on the page").toBe("H3");
            expect(pair.focusable, "which can take focus without joining the tab order").toBe("-1");
            expect(pair.labels, "and names the section it opens").toBe(true);
        }
    });

    test("marks nothing before any heading has been reached", async ({ page }) => {
        await expect(page.locator(MARKED)).toHaveCount(0);
    });

    /**
     * Focus moving to the heading is the half a keyboard or screen reader user depends on: scrolling alone
     * would leave them on the link, and the next Tab would carry on through the table of contents rather than
     * into the section they asked for. The readout is compared against the marked link's own words, so this
     * checks that the page and the markup agree rather than what either says.
     */
    test("pressing a link brings its heading into view, focuses it, and marks that link alone", async ({ page }) => {
        const links = page.locator(LINKS);
        const headings = page.locator(HEADINGS);
        const count = await links.count();

        for (const index of [2, count - 1, 0]) {
            await links.nth(index).click();

            await expect(headings.nth(index), "focus lands on the heading the link names").toBeFocused();
            await expect(headings.nth(index), "which is on screen").toBeInViewport();
            await expect(links.nth(index), "that link is the current one").toHaveAttribute("aria-current", "location");
            await expect(page.locator(MARKED), "and no other is").toHaveCount(1);
            expect(await readout(page, "tableOfContents"), "the page reports the same section").toContain(
                ((await links.nth(index).textContent()) ?? "").trim(),
            );
        }
    });

    test("a link pressed from the keyboard does the same", async ({ page }) => {
        const links = page.locator(LINKS);

        await links.first().focus();
        await page.keyboard.press("Tab");
        await expect(links.nth(1), "Tab walks the links in order").toBeFocused();

        await page.keyboard.press("Enter");

        await expect(page.locator(HEADINGS).nth(1)).toBeFocused();
        await expect(links.nth(1)).toHaveAttribute("aria-current", "location");
    });

    /**
     * The mark has to follow a reader who scrolls rather than one who presses links, which is the half the
     * observer exists for. The wheel moves the page a little at a time, and the mark is read after each step
     * once the headings have stopped moving; what is asserted is the order it visits the sections in and that
     * it visits all of them, not which one is marked at any particular scroll offset — that depends on a tuned
     * line and on how tall the window is.
     */
    test("scrolling by hand moves the mark through every section in reading order", async ({ page }) => {
        const scroller = await scrollerOf(page);
        const box = (await scroller.boundingBox())!;
        const count = await page.locator(LINKS).count();
        const seen: number[] = [await markedIndex(page)];

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

        for (let step = 0; step < MAX_WHEEL_STEPS; step++) {
            const atBottom = await scroller.evaluate(
                (element) => element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
            );

            if (atBottom) break;

            await page.mouse.wheel(0, WHEEL_STEP);
            await waitUntilStill(page.locator(HEADINGS).first());
            seen.push(await markedIndex(page));
        }

        expect(seen[0], "nothing is marked at the top").toBe(-1);

        for (let step = 1; step < seen.length; step++) {
            expect(
                seen[step],
                `scrolling down never moves the mark back up (readings: ${seen.join(", ")})`,
            ).toBeGreaterThanOrEqual(seen[step - 1]);
        }

        expect([...new Set(seen.filter((index) => index >= 0))], "and every section is marked on the way down").toEqual(
            Array.from({ length: count }, (_, index) => index),
        );
    });

    /**
     * The scroll back is made with the wheel rather than from script: a pressed link holds the mark until the reader
     * does something of their own, and a scroll from script is not that.
     */
    test("scrolling back to the top clears the mark", async ({ page }) => {
        await page.locator(LINKS).nth(2).click();
        await expect(page.locator(MARKED)).toHaveCount(1);

        const scroller = await scrollerOf(page);
        const box = (await scroller.boundingBox())!;

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(0, -100_000);

        await expect(page.locator(MARKED)).toHaveCount(0);
    });
});

/**
 * A depth is something the painter is handed so it can indent, and nothing else: the links stay one flat list
 * for the keyboard and for a screen reader, so a sub-section is reached by the same Tab as its parent and is
 * announced as one more item of the same list rather than as the start of a nested one.
 */
test.describe("an outline whose links carry a depth", () => {
    const OUTLINE = demo("outline");
    const LINKS = `${OUTLINE} nav a`;

    test("stays one flat list, every link a direct item of it", async ({ page }) => {
        await expect(page.locator(`${OUTLINE} nav ol`), "one list").toHaveCount(1);
        await expect(
            page.locator(`${OUTLINE} nav ol ol, ${OUTLINE} nav ol ul`),
            "and nothing nested in it",
        ).toHaveCount(0);

        const parents = await page
            .locator(LINKS)
            .evaluateAll((links) => links.map((link) => link.closest("li")?.parentElement?.tagName));

        expect(parents.length, "the outline has links").toBeGreaterThan(0);

        for (const parent of parents) expect(parent, "each link sits in an item of that one list").toBe("OL");
    });

    test("pressing a sub-section's link focuses its heading and marks that link alone", async ({ page }) => {
        const links = page.locator(LINKS);
        const count = await links.count();

        for (let index = 0; index < count; index++) {
            const link = links.nth(index);
            const id = ((await link.getAttribute("href")) ?? "").replace(/^#/, "");

            await link.click();

            await expect(page.locator(`#${id}`), "focus lands on the heading the link names").toBeFocused();
            await expect(link, "that link is the current one").toHaveAttribute("aria-current", "location");
            await expect(page.locator(`${LINKS}[aria-current]`), "and no other is").toHaveCount(1);
        }
    });
});

/**
 * The line that decides the mark sits a fifth of the way down, so on a page whose last sections are shorter than the
 * stretch below it, their headings run out of scroll before they reach it. Two rules sit on top of the line for that:
 * once the page is scrolled as far as it goes, the last heading on screen is current; and a pressed link holds the
 * mark until the reader does something of their own, since the end rule alone would hand a press of the
 * second-to-last link to the last one.
 *
 * The Playground's Breadcrumbs Docs page is the case: it ends on short tables, and its table of contents is the library's own
 * table of contents. Each test checks that the page really does end short before it relies on it, so a page that
 * grows past the problem fails with that said rather than passing for the wrong reason.
 */
test.describe("a table of contents on a page whose last sections are short", () => {
    const DOCS = '[data-view="docs"]';
    const LINKS = `${DOCS} nav a`;
    const MARKED = `${LINKS}[aria-current="location"]`;
    const WHEEL_STEP = 120;

    const scrollerOf = (page: Page) =>
        page
            .locator(`${DOCS} [data-api-group]`)
            .first()
            .evaluateHandle((element) => {
                let node = element.parentElement;

                const scrolls = (candidate: HTMLElement) =>
                    candidate.scrollHeight > candidate.clientHeight &&
                    /auto|scroll/.test(getComputedStyle(candidate).overflowY);

                while (node && !scrolls(node)) node = node.parentElement;

                return node!;
            })
            .then((handle) => handle.asElement()!);

    const isAtEnd = (scroller: Awaited<ReturnType<typeof scrollerOf>>) =>
        scroller.evaluate(
            (element) => element.scrollTop > 0 && element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
        );

    const pressSecondToLast = async (page: Page) => {
        const links = page.locator(LINKS);
        const index = (await links.count()) - 2;
        const id = ((await links.nth(index).getAttribute("href")) ?? "").replace(/^#/, "");

        await links.nth(index).click();
        await expect(page.locator(`[id="${id}"]`), "focus lands on the heading the link names").toBeFocused();
        await waitUntilStill(page.locator(`[id="${id}"]`));

        expect(
            await isAtEnd(await scrollerOf(page)),
            "the page ran out of scroll before that heading reached the top, which is the case being tested",
        ).toBe(true);

        return index;
    };

    test.beforeEach(async ({ page }) => {
        await page.goto("/breadcrumbs/docs");
        await expect(page.locator(LINKS).first()).toBeVisible();
    });

    test("scrolling all the way down marks the last link", async ({ page }) => {
        const scroller = await scrollerOf(page);
        const box = (await scroller.boundingBox())!;
        const links = page.locator(LINKS);

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(0, 100_000);
        await expect.poll(() => isAtEnd(scroller), "the page reaches its end").toBe(true);
        await waitUntilStill(page.locator(`${DOCS} [data-api-group]`).first());

        await expect(links.last(), "the last link is the current one").toHaveAttribute("aria-current", "location");
        await expect(page.locator(MARKED), "and no other is").toHaveCount(1);
    });

    test("pressing a link whose heading cannot reach the top marks that link, not the last", async ({ page }) => {
        const index = await pressSecondToLast(page);
        const links = page.locator(LINKS);

        await expect(links.nth(index), "the pressed link is the current one").toHaveAttribute(
            "aria-current",
            "location",
        );
        await expect(links.last(), "even though the last heading is on screen too").not.toHaveAttribute(
            "aria-current",
            /.*/,
        );
        await expect(page.locator(MARKED)).toHaveCount(1);
    });

    /**
     * The wheel is turned downwards at the end of the page, so nothing moves: what releases the mark is the reader's
     * input, not a scroll, and once released it goes where the end rule puts it.
     */
    test("the reader's next wheel input releases the pressed link's hold", async ({ page }) => {
        const index = await pressSecondToLast(page);
        const links = page.locator(LINKS);

        await expect(links.nth(index)).toHaveAttribute("aria-current", "location");

        await page.mouse.wheel(0, WHEEL_STEP);

        await expect(links.last(), "the mark goes back to the end rule's choice").toHaveAttribute(
            "aria-current",
            "location",
        );
        await expect(page.locator(MARKED)).toHaveCount(1);
    });
});
