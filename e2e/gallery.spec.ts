import { type Locator, type Page, expect, test } from "@playwright/test";

import { centerDistance } from "./helpers";

/**
 * The gallery draws one live demo of every page as a tile — the first live example on its Docs page, or, for a page
 * without a Docs page, the first example on its Examples page — and the menu shows the same drawing beside a row the
 * pointer rests on. Both are found here by route — a tile carries its page's route in `data-testid`, a menu row
 * in its `href` — and what a tile should hold is read off the page it stands for, never written down here, so a
 * page reordering its examples changes what the tile shows without changing whether the spec passes.
 */
const GALLERY = '[data-view="gallery"]';
const TILE = `${GALLERY} [data-gallery-tile]`;
const tileFor = (route: string) => `${TILE}[data-testid="${route}"]`;

const menu = (page: Page) => page.getByRole("navigation", { name: "Library" }).getByRole("tree");

/**
 * A menu row's link ends in the tab the last page was on (Docs at first), so the page's own route is the segment before it
 * when the last one names a tab. Examples is the index and adds no segment.
 */
const TAB_SEGMENTS = ["docs", "api"];

const toRoute = (href: string) => {
    const segments = href.split("/").filter(Boolean);

    if (TAB_SEGMENTS.includes(segments.at(-1)!)) segments.pop();

    return `/${segments.at(-1)}`;
};

/**
 * A menu row's own name, without the marker drawn beside it — that marker is hidden from assistive technology, so
 * it is no part of the name, and reading the row's whole text would take it along.
 */
const rowName = (row: Locator) =>
    row.evaluate((element) => {
        const copy = element.cloneNode(true) as HTMLElement;

        copy.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove());

        return (copy.textContent ?? "").trim();
    });

test.beforeEach(async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.locator(TILE).first()).toBeVisible();
});

/**
 * Whether a page has live examples in its docs is only known once its Docs page has loaded, and that page arrives in
 * a chunk of its own, so the check waits for the network to go quiet before counting them.
 */
test("a tile draws its page's first live example and nothing else of the page", async ({ page }) => {
    const tile = page.locator(TILE).first();
    const route = (await tile.getAttribute("data-testid"))!;

    await expect(tile.locator("[data-demo]"), "one demo is drawn").toHaveCount(1);
    await expect(
        tile.locator("[data-example], [data-docs-example]"),
        "without the card an example sits in on its page",
    ).toHaveCount(0);
    await expect(tile.locator("[data-docs-section], [data-docs-alert]"), "without the docs' text").toHaveCount(0);
    await expect(tile.locator("[data-panel]"), "and without the page's controls").toHaveCount(0);

    const drawn = await tile.locator("[data-demo]").getAttribute("data-testid");

    await page.goto(`${route}/docs`);
    await page.waitForLoadState("networkidle");

    const docsDemo = page.locator("[data-docs-example] [data-demo]").first();

    if (await docsDemo.count()) {
        await expect(docsDemo, "it is the first live example in the page's docs").toHaveAttribute(
            "data-testid",
            drawn!,
        );

        return;
    }

    await page.goto(route);

    await expect(page.locator("[data-example]").first(), "or, with no docs, the page's first example").toHaveAttribute(
        "data-testid",
        drawn!,
    );
});

/**
 * Dozens of live examples are only affordable because a tile draws while it is on screen and lets go once it
 * leaves. The last tile is far below the first screenful, so it starts empty.
 */
test("a tile far down draws nothing until it is scrolled to, and lets go once scrolled away", async ({ page }) => {
    const last = page.locator(TILE).last();

    await expect(last.locator("[data-demo]"), "a tile off screen draws nothing").toHaveCount(0);

    await last.scrollIntoViewIfNeeded();
    await expect(last.locator("[data-demo]"), "it draws once it is scrolled to").toHaveCount(1);

    await page.locator(TILE).first().scrollIntoViewIfNeeded();
    await expect(last.locator("[data-demo]"), "and lets go once it is scrolled away").toHaveCount(0);
});

/**
 * Tiles run in menu order, which is alphabetical only within a branch, so a tile is named with the branches
 * between its category and its page. The category is the section heading and is left out: a page one level
 * below it is named alone, a page inside a branch carries one more name per level.
 */
test("a tile is named for its page, with the menu branches above it", async ({ page }) => {
    const levelOf = async (row: Locator) => Number(await row.getAttribute("aria-level"));
    const nameOf = (route: string) =>
        page
            .locator(`${tileFor(route)} a`)
            .first()
            .textContent();

    const branch = menu(page).locator('[role="treeitem"][aria-expanded="false"]').first();
    const branchLevel = await levelOf(branch);

    await branch.click();

    const child = menu(page)
        .locator(`[role="treeitem"][aria-level="${branchLevel + 1}"][href]`)
        .first();
    const childRoute = toRoute((await child.getAttribute("href"))!);
    const childName = await rowName(child);
    const childTileName = (await nameOf(childRoute))!;

    expect(childTileName, "a page inside a branch ends with its own name").toMatch(new RegExp(` / ${childName}$`));
    expect(childTileName.split(" / "), "after one more name per level below the category").toHaveLength(branchLevel);

    const leaf = menu(page).locator('[role="treeitem"][aria-level="2"][href]:not([aria-expanded])').first();
    const leafRoute = toRoute((await leaf.getAttribute("href"))!);

    await expect(
        page.locator(`${tileFor(leafRoute)} a`).first(),
        "a page right below its category is named alone",
    ).toHaveText(await rowName(leaf));
});

/**
 * The menu's preview is the tile's drawing in a tooltip: a picture to look at, not a demo to use. So the row's
 * description stays empty, since the preview inside is hidden from assistive technology, and nothing in it can
 * take focus. Which row is tried is chosen by the gallery — the first row whose page has a tile.
 */
test("resting on a menu row shows its page's tile drawing beside it, as a picture", async ({ page }) => {
    const rows = menu(page).locator('[role="treeitem"][href]');
    const routes = await page.locator(TILE).evaluateAll((tiles) => tiles.map((tile) => tile.dataset.testid!));
    let row: Locator | undefined;

    for (let index = 0; index < (await rows.count()) && !row; index++) {
        const candidate = rows.nth(index);

        if (routes.includes(toRoute((await candidate.getAttribute("href"))!))) row = candidate;
    }

    const route = toRoute((await row!.getAttribute("href"))!);
    const tile = page.locator(tileFor(route));

    await tile.scrollIntoViewIfNeeded();
    const drawn = await tile.locator("[data-demo]").getAttribute("data-testid");

    await row!.hover();

    const tooltip = page.locator('[role="tooltip"]');

    await expect(tooltip.locator("[data-demo]"), "the row's page's tile drawing is drawn beside it").toHaveAttribute(
        "data-testid",
        drawn!,
    );
    await expect(row!, "the drawing does not become the row's description").toHaveAccessibleDescription("");
    await expect(
        tooltip.locator("[inert] [data-demo]"),
        "and sits where nothing can be focused or pressed",
    ).toHaveCount(1);
});

/** Two rows next to each other in the menu whose pages both have a tile, so both rest on a preview. */
const findPreviewedPair = async (page: Page) => {
    const rows = menu(page).locator('[role="treeitem"]');
    const routes = await page.locator(TILE).evaluateAll((tiles) => tiles.map((tile) => tile.dataset.testid!));
    const hrefs = await rows.evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    const isPreviewed = (href: string | null) => href !== null && routes.includes(toRoute(href));
    const index = hrefs.findIndex((href, at) => isPreviewed(href) && isPreviewed(hrefs[at + 1] ?? null));

    return [rows.nth(index), rows.nth(index + 1)] as const;
};

const SAMPLE_COUNT = 6;
const SAMPLE_GAP_MS = 40;

const sampleVisibility = async (tooltip: Locator) => {
    const samples: boolean[] = [];

    for (let sample = 0; sample < SAMPLE_COUNT; sample++) {
        samples.push(await tooltip.isVisible());
        await tooltip.page().waitForTimeout(SAMPLE_GAP_MS);
    }

    return samples;
};

/**
 * The menu's previews are one tooltip, shared by every row: moving from one row to the next hands it over rather than
 * closing one and opening another, so it stays up the whole way and ends up describing the row it reached.
 */
test("moving the pointer down the menu carries one preview from row to row", async ({ page }) => {
    const tooltip = page.locator('[role="tooltip"]');
    const [first, second] = await findPreviewedPair(page);

    await first.hover();
    await expect(tooltip).toBeVisible();

    const tooltipId = await tooltip.getAttribute("id");
    const box = (await second.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 6 });

    expect(await sampleVisibility(tooltip), "the preview never went away on the way down").not.toContain(false);
    await expect(tooltip, "there is only ever one").toHaveCount(1);
    await expect(second, "and it is now the row the pointer reached").toHaveAttribute(
        "aria-describedby",
        new RegExp(tooltipId!),
    );
});

/**
 * The keyboard carries it too. Only the first opening waits; arrowing on from a row whose preview is showing moves the
 * preview to the next row at once.
 */
test("arrowing through the menu carries the preview with the focus", async ({ page }) => {
    const tooltip = page.locator('[role="tooltip"]');
    const [first, second] = await findPreviewedPair(page);

    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(second).toBeFocused();
    await expect(tooltip, "a keyboard focus opens the preview").toBeVisible();

    const tooltipId = await tooltip.getAttribute("id");

    await page.keyboard.press("ArrowUp");
    await expect(first).toBeFocused();

    expect(await sampleVisibility(tooltip), "the preview never went away as focus moved").not.toContain(false);
    await expect(first, "and it moved to the row focus reached").toHaveAttribute(
        "aria-describedby",
        new RegExp(tooltipId!),
    );
});

const SETTLE_MS = 500;

/**
 * The menu marks the row under the pointer with its highlight floater, and the preview is drawn outside the menu, so
 * carrying the pointer from a row onto that row's preview leaves the menu. That crossing is not the pointer going
 * away: the preview is still up for that very row, and the row stays marked until the pointer has left both. The
 * check is the floater's box against the row's, never where either sits.
 *
 * The drawing inside the preview is inert, which a pointer passes straight through, so the pointer is put on a spot
 * the browser itself reports as part of the tooltip. It is carried there in one move, from the row straight onto the
 * tooltip.
 */
test("a menu row stays marked while the pointer is on its preview", async ({ page }) => {
    const tooltip = page.locator('[role="tooltip"]');
    const highlight = menu(page).locator('[data-floater="highlight"]');
    const [row] = await findPreviewedPair(page);

    await row.hover();
    await expect(tooltip, "resting on the row shows its preview").toBeVisible();
    await expect(row).toHaveAttribute("aria-describedby", new RegExp((await tooltip.getAttribute("id"))!));
    await expect.poll(() => centerDistance(highlight.locator(".."), row), "the row is marked").toBeLessThan(2);

    const spot = await tooltip.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const STEPS = 12;

        for (let across = 1; across < STEPS; across++) {
            for (let down = 1; down < STEPS; down++) {
                const x = rect.left + (rect.width * across) / STEPS;
                const y = rect.top + (rect.height * down) / STEPS;

                if (element.contains(document.elementFromPoint(x, y))) return { x, y };
            }
        }

        return undefined;
    });

    expect(spot, "some part of the tooltip takes the pointer").toBeDefined();

    await page.mouse.move(spot!.x, spot!.y);
    await page.waitForTimeout(SETTLE_MS);

    await expect(tooltip, "the preview is still up with the pointer on it").toBeVisible();
    await expect(highlight, "the row is still marked").toHaveCount(1);
    expect(await centerDistance(highlight.locator(".."), row), "and the mark is still on that row").toBeLessThan(2);

    const viewport = page.viewportSize()!;

    await page.mouse.move(viewport.width - 40, viewport.height - 40);

    await expect(highlight, "once the pointer has left both, the mark plays out and goes").toHaveCount(0);
});
