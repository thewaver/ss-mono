import { expect, test } from "@playwright/test";

import { activeMatches, demo, readout, tabIndex } from "./helpers";

const DEFAULT = demo("default");
const SINGLE = demo("singleSelection");
const RESIZABLE = demo("resizable");
const REORDERABLE = demo("reorderable");
const CONSUMER_SORTED = demo("consumerSorted");
const VIRTUALIZED = demo("virtualized");
const DISABLED = demo("disabled");

const grid = (scope: string) => `${scope} [role="grid"]`;

const row = (scope: string) => `${scope} [role="row"]`;

const cell = (scope: string) => `${scope} [role="gridcell"]`;

const header = (scope: string) => `${scope} [role="columnheader"]`;

/**
 * A cell is addressed by the pair of indices the grid publishes rather than by its text, because the text
 * is the point of the sorting tests: a locator built from a caption would move when the sort moves and
 * every assertion below would quietly follow it.
 */
const at = (scope: string, rowIndex: number, columnIndex: number) =>
    `${scope} [role="row"][aria-rowindex="${rowIndex}"] [aria-colindex="${columnIndex}"]`;

test.beforeEach(async ({ page }) => {
    await page.goto("/table");
    await expect(page.locator(cell(DEFAULT)).first()).toBeVisible();
});

/**
 * The counts and the per-cell indices are what let a reader announce "row 4 of 50,000" when only thirty
 * rows exist in the document. They are asserted on the small table first, where the DOM holds every row,
 * so a disagreement between the published count and the real one is visible without virtualization in play.
 */
test("the grid publishes its size, and every cell says where it sits", async ({ page }) => {
    const root = page.locator(grid(DEFAULT));

    await expect(root).toHaveAttribute("aria-label", "Parts");
    await expect(root, "twelve parts and the header row above them").toHaveAttribute("aria-rowcount", "13");
    await expect(root).toHaveAttribute("aria-colcount", "5");
    await expect(root, "a selection may hold more than one row").toHaveAttribute("aria-multiselectable", "true");

    await expect(page.locator(row(DEFAULT)).first(), "the header is row one").toHaveAttribute("aria-rowindex", "1");
    await expect(page.locator(row(DEFAULT)).nth(1), "so the first part is row two").toHaveAttribute(
        "aria-rowindex",
        "2",
    );

    await expect(page.locator(header(DEFAULT)).first()).toHaveAttribute("aria-colindex", "1");
    await expect(page.locator(header(DEFAULT)).last()).toHaveAttribute("aria-colindex", "5");
});

/**
 * `aria-sort` is the only place the sort state is stated to a reader — the arrow the Playground paints is
 * `aria-hidden`, so a spec that read the arrow would be checking the Playground rather than the component.
 */
test("a sortable header cycles ascending, descending, then back to no sort at all", async ({ page }) => {
    const sku = page.locator(header(DEFAULT)).first();

    await expect(sku, "sortable but not yet sorted").toHaveAttribute("aria-sort", "none");
    expect(await readout(page, "default")).toContain("sort: unsorted");

    await sku.click();

    await expect(sku).toHaveAttribute("aria-sort", "ascending");
    await expect(page.locator(at(DEFAULT, 2, 1)), "BK-6015 is first alphabetically").toHaveText("BK-6015");

    await sku.click();

    await expect(sku).toHaveAttribute("aria-sort", "descending");
    await expect(page.locator(at(DEFAULT, 2, 1)), "and SP-5199 is last").toHaveText("SP-5199");

    await sku.click();

    await expect(sku, "the third click returns the rows to the order they arrived in").toHaveAttribute(
        "aria-sort",
        "none",
    );
    await expect(page.locator(at(DEFAULT, 2, 1))).toHaveText("FS-1042");
});

test("sorting a number column orders by the number rather than by how it reads", async ({ page }) => {
    await page.locator(header(DEFAULT)).nth(3).click();

    await expect(page.locator(at(DEFAULT, 2, 4)), "zero, not 1,502, which sorts first as text").toHaveText("0");
    await expect(page.locator(at(DEFAULT, 13, 4))).toHaveText("1,840");
});

/**
 * The whole grid is one tab stop, which is what separates a grid from a list of focusable cells: sixty
 * cells in the tab order would take sixty presses of Tab to walk past.
 */
test("exactly one cell is in the tab order, and moving focus moves it", async ({ page }) => {
    const cells = page.locator(`${DEFAULT} [role="columnheader"], ${DEFAULT} [role="gridcell"]`);

    expect(await tabIndex(page.locator(header(DEFAULT)).first()), "the first header cell starts as the stop").toBe(0);

    const tabbable = await cells.evaluateAll(
        (elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length,
    );

    expect(tabbable).toBe(1);

    await page.locator(at(DEFAULT, 4, 2)).click();

    expect(await tabIndex(page.locator(at(DEFAULT, 4, 2))), "clicking a cell hands it the stop").toBe(0);
    expect(await tabIndex(page.locator(header(DEFAULT)).first()), "and takes it off the old one").toBe(-1);
});

/**
 * The arrow walk carries at the ends of a row rather than stopping, so a reader can cross the whole grid
 * with one key. The header is row one of that walk, which is what makes a sort reachable without a mouse.
 */
test("arrows walk cell to cell, and carry from one row's end to the next row's start", async ({ page }) => {
    await page.locator(at(DEFAULT, 2, 1)).click();

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, `[aria-rowindex="2"] [aria-colindex="2"]`)).toBe(true);

    await page.keyboard.press("End");
    expect(await activeMatches(page, `[aria-rowindex="2"] [aria-colindex="5"]`), "End is the row's last cell").toBe(
        true,
    );

    await page.keyboard.press("ArrowRight");
    expect(
        await activeMatches(page, `[aria-rowindex="3"] [aria-colindex="1"]`),
        "past the last column is the next row's first",
    ).toBe(true);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    expect(
        await activeMatches(page, `[role="columnheader"][aria-colindex="1"]`),
        "and up from row one is the header",
    ).toBe(true);
});

test("Enter on a header cell sorts it, so the mouse is not the only way in", async ({ page }) => {
    await page.locator(header(DEFAULT)).first().click();
    await expect(page.locator(header(DEFAULT)).first()).toHaveAttribute("aria-sort", "ascending");

    await page.keyboard.press("Enter");

    await expect(page.locator(header(DEFAULT)).first()).toHaveAttribute("aria-sort", "descending");
});

/**
 * Selection lives on the row rather than on the cell, because a row is the thing being picked; the cells
 * only paint it. Space toggles, so a row picked by mistake is unpicked by the same key.
 */
test("Space picks the focused row, and picking a second row keeps the first", async ({ page }) => {
    await page.locator(at(DEFAULT, 3, 2)).click();

    expect(await readout(page, "default"), "a plain click already picks one").toContain("selected: BR-2201");
    await expect(page.locator(row(DEFAULT)).nth(2)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press(" ");

    expect(await readout(page, "default")).toContain("selected: BR-2201, GK-3310");

    await page.keyboard.press(" ");

    expect(await readout(page, "default"), "and the same key gives it back").toContain("selected: BR-2201");
});

test("Shift with an arrow extends the selection from where it was anchored", async ({ page }) => {
    await page.locator(at(DEFAULT, 2, 1)).click();

    await page.keyboard.press("Shift+ArrowDown");
    await page.keyboard.press("Shift+ArrowDown");

    expect(await readout(page, "default")).toContain("selected: FS-1042, BR-2201, GK-3310");
});

test("Control and A picks every row there is", async ({ page }) => {
    await page.locator(at(DEFAULT, 2, 1)).click();

    await page.keyboard.press("Control+a");

    const selected = page.locator(`${DEFAULT} [role="row"][aria-selected="true"]`);

    await expect(selected, "all twelve, and the header is not one of them").toHaveCount(12);
});

/**
 * The single-selection table is the same component with a different mode, so the interesting assertion is
 * not that one row is selected but that the previous one was dropped without anybody asking.
 */
test("a single-selection grid holds one row and says so", async ({ page }) => {
    await expect(page.locator(grid(SINGLE)), "no multi-select claim to a reader").not.toHaveAttribute(
        "aria-multiselectable",
        /.*/,
    );

    await page.locator(at(SINGLE, 2, 1)).click();
    expect(await readout(page, "singleSelection")).toContain("selected: FS-1042");

    await page.locator(at(SINGLE, 3, 1)).click();
    expect(await readout(page, "singleSelection"), "the second pick replaces the first").toContain("selected: BR-2201");
});

/**
 * The width lands in the consumer's own signal, which is what the readout reads back — the component holds
 * no width of its own, so a resize that only moved pixels would leave the readout untouched.
 */
test("a column resizes from the keyboard, and the width goes to the consumer", async ({ page }) => {
    const sku = page.locator(header(RESIZABLE)).first();

    await sku.click();

    expect(await readout(page, "resizable"), "nothing is stored until something is dragged").toContain("widths: {}");

    await page.keyboard.press("Control+ArrowRight");

    expect(await readout(page, "resizable"), "110 as declared, plus one step of 8").toContain('"sku":118');

    await page.keyboard.press("Control+ArrowLeft");
    await page.keyboard.press("Control+ArrowLeft");

    expect(await readout(page, "resizable")).toContain('"sku":102');
});

test("a resize stops at the column's own minimum rather than collapsing it", async ({ page }) => {
    await page.locator(header(RESIZABLE)).first().click();

    for (let press = 0; press < 8; press++) await page.keyboard.press("Control+ArrowLeft");

    expect(await readout(page, "resizable"), "eight steps down from 110 would be 46, and the floor is 80").toContain(
        '"sku":80',
    );
});

/**
 * A column with no comparator is the server-side case: the table refuses to guess an order and reports the
 * sort instead. The example's own handler is what reorders, so a red here means the report stopped arriving.
 */
test("a column with no comparator leaves the order to the page", async ({ page }) => {
    const category = page.locator(header(CONSUMER_SORTED)).nth(2);

    await expect(category, "not offered as sortable at all").not.toHaveAttribute("aria-sort", /.*/);

    await page.locator(header(CONSUMER_SORTED)).first().click();

    expect(await readout(page, "consumerSorted")).toContain("sort: sku ascending");
    await expect(page.locator(at(CONSUMER_SORTED, 2, 1)), "reordered by the page's own handler").toHaveText("BK-6015");
});

/**
 * Fifty thousand rows with thirty in the document is the whole point of the count being published rather
 * than counted: `aria-rowcount` is the only thing that still knows how long the table is.
 */
test("a virtualized grid mounts a window of rows but still states its real length", async ({ page }) => {
    await expect(page.locator(grid(VIRTUALIZED))).toHaveAttribute("aria-rowcount", "50001");

    const mounted = await page.locator(row(VIRTUALIZED)).count();

    expect(mounted, "far fewer rows exist than the grid claims").toBeLessThan(100);
    expect(mounted, "and more than none of them").toBeGreaterThan(1);
});

test("the header stays put while the rows scroll under it", async ({ page }) => {
    const first = page.locator(header(VIRTUALIZED)).first();
    const before = await first.boundingBox();

    await page
        .locator(VIRTUALIZED)
        .locator("div")
        .first()
        .evaluate((element) => element.scrollBy(0, 2000));

    await expect(page.locator(row(VIRTUALIZED)).nth(1)).toBeVisible();

    const after = await first.boundingBox();

    expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
});

/**
 * Disabled here is `aria-disabled` rather than anything the browser enforces, so the cells stay in the
 * accessibility tree and stay readable — the thing being asserted is that reading still works and acting
 * does not.
 */
test("a disabled grid reads out but does not act", async ({ page }) => {
    await expect(page.locator(grid(DISABLED))).toHaveAttribute("aria-disabled", "true");

    await page.locator(header(DISABLED)).first().click({ force: true });

    await expect(page.locator(header(DISABLED)).first(), "the sort did not move").toHaveAttribute("aria-sort", "none");
    expect(await readout(page, "disabled")).toContain("sort: unsorted");

    await page.locator(at(DISABLED, 2, 1)).click({ force: true });

    await expect(page.locator(row(DISABLED)).nth(1)).toHaveAttribute("aria-selected", "false");
});

/**
 * Reordering has two ways in and they must agree. The pointer half drags a header past the middle of its
 * neighbour, which is where `CarrierUtils.computeDropIndex` flips the landing place. The keyboard half is
 * Shift with an arrow on the focused header cell, chosen because the header already spends Enter and Space
 * on sorting and Ctrl with the arrows on resizing.
 *
 * Both assert the order through the header text rather than through the readout, because the order is the
 * thing being changed and reading it back off the page's own summary would only prove the summary agrees
 * with itself.
 */
test("a header dragged past its neighbour's middle swaps the two columns", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);
    const second = page.locator(header(REORDERABLE)).nth(1);

    await expect(first).toContainText("SKU");
    await expect(second).toContainText("Name");

    const from = await first.boundingBox();
    const to = await second.boundingBox();

    if (!from || !to) throw new Error("the reorderable demo drew no header boxes");

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height / 2, { steps: 12 });
    await page.mouse.up();

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("Name");
    await expect(page.locator(header(REORDERABLE)).nth(1)).toContainText("SKU");
});

test("a drag that reorders does not also sort the column it started on", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);

    await expect(first).toHaveAttribute("aria-sort", "none");

    const from = await first.boundingBox();
    const to = await page.locator(header(REORDERABLE)).nth(1).boundingBox();

    if (!from || !to) throw new Error("the reorderable demo drew no header boxes");

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height / 2, { steps: 12 });
    await page.mouse.up();

    await expect(page.locator(header(REORDERABLE)).nth(1)).toHaveAttribute("aria-sort", "none");
});

test("shift with an arrow moves the focused column and focus travels with it", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);

    await expect(first).toContainText("SKU");

    await first.click();
    await page.keyboard.press("Shift+ArrowRight");

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("Name");
    await expect(page.locator(header(REORDERABLE)).nth(1)).toContainText("SKU");
    await expect(page.locator(`${header(REORDERABLE)}:focus`)).toContainText("SKU");
});

test("a column at the end of the row does not move past it", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);

    await first.click();
    await page.keyboard.press("Shift+ArrowLeft");

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("SKU");
});

test("a table with no order signal ignores the reorder key entirely", async ({ page }) => {
    const first = page.locator(header(DEFAULT)).nth(0);

    await first.click();

    const before = (await first.textContent()) ?? "";

    await page.keyboard.press("Shift+ArrowRight");

    await expect(page.locator(header(DEFAULT)).nth(0)).toHaveText(before);
});
