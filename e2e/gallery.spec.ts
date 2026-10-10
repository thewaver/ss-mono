import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The gallery draws every page's first example as a tile, and the menu shows the same drawing beside a row the
 * pointer rests on. Both are found here by route — a tile carries its page's route in `data-testid`, a menu row
 * in its `href` — and what a tile should hold is read off the page it stands for, never written down here, so a
 * page reordering its examples changes what the tile shows without changing whether the spec passes.
 */
const GALLERY = '[data-view="gallery"]';
const TILE = `${GALLERY} [data-gallery-tile]`;
const tileFor = (route: string) => `${TILE}[data-testid="${route}"]`;

const menu = (page: Page) => page.getByRole("navigation", { name: "Library" }).getByRole("tree");

const toRoute = (href: string) => `/${href.split("/").filter(Boolean).at(-1)}`;

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

test("a tile draws its page's first example and nothing else of the page", async ({ page }) => {
    const tile = page.locator(TILE).first();
    const route = (await tile.getAttribute("data-testid"))!;

    await expect(tile.locator("[data-demo]"), "one demo is drawn").toHaveCount(1);
    await expect(tile.locator("[data-example]"), "without the card an example sits in on its page").toHaveCount(0);
    await expect(tile.locator("[data-panel]"), "and without the page's controls").toHaveCount(0);

    const drawn = await tile.locator("[data-demo]").getAttribute("data-testid");

    await page.goto(route);

    await expect(page.locator("[data-example]").first(), "it is the page's first example").toHaveAttribute(
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
test("resting on a menu row shows its page's first example beside it, as a picture", async ({ page }) => {
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

    await expect(tooltip.locator("[data-demo]"), "the row's page's first example is drawn beside it").toHaveAttribute(
        "data-testid",
        drawn!,
    );
    await expect(row!, "the drawing does not become the row's description").toHaveAccessibleDescription("");
    await expect(
        tooltip.locator("[inert] [data-demo]"),
        "and sits where nothing can be focused or pressed",
    ).toHaveCount(1);
});
