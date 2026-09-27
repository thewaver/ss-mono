import { type Page, expect, test } from "@playwright/test";

import { waitUntilStill } from "../helpers";

/**
 * The React `TableOfContents`. The cases follow `e2e/tableOfContents.spec.ts`, which covers the Solid one, so the two
 * frameworks are held to the same promise: the link marked `aria-current="location"` is the one for the last heading
 * scrolled past a line near the top, and pressing a link takes the reader to its heading and focuses it. The story's
 * article scrolls in a box that fills the window, so the scroller is found the same way the Solid spec finds the
 * Playground's.
 */
const STORY = "Essentials/TableOfContents";

const scope = (key: string) => `[data-testid="${key}"]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="current"]`).textContent();

test.describe("a table of contents following the page", () => {
    const TOC = scope("tableOfContents");
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

    test.beforeEach(async ({ mount }) => {
        await mount(`${STORY}/Default`);
    });

    test("is a named navigation landmark whose links each point at their own heading", async ({ page }) => {
        expect(await page.locator(`${TOC} nav`).getAttribute("aria-label"), "the landmark carries a name").toBeTruthy();

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
            await expect
                .poll(() => readout(page, "tableOfContents"), { message: "the page is told the same section" })
                .toContain(((await links.nth(index).textContent()) ?? "").trim());
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

    test("scrolling back to the top clears the mark", async ({ page }) => {
        await page.locator(LINKS).nth(2).click();
        await expect(page.locator(MARKED)).toHaveCount(1);

        const scroller = await scrollerOf(page);

        await scroller.evaluate((element) => element.scrollTo({ top: 0 }));

        await expect(page.locator(MARKED)).toHaveCount(0);
        await expect
            .poll(() => readout(page, "tableOfContents"), { message: "and the page is told so" })
            .toBe("current: none");
    });
});

test.describe("an outline whose links carry a depth", () => {
    const OUTLINE = scope("outline");
    const LINKS = `${OUTLINE} nav a`;

    test.beforeEach(async ({ mount }) => {
        await mount(`${STORY}/Outline`);
    });

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
