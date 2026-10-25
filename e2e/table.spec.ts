import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, activeText, docsDemo, docsSettled, prop, tabIndex, waitUntilStill } from "./helpers";

const DOCS = "/src/App/Pages/TablePage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const RESIZABLE = docsDemo(DOCS, "Resizable");
const REORDERABLE = docsDemo(DOCS, "Reorderable");
const CONSUMER_SORTED = docsDemo(DOCS, "ConsumerSorted");
const VIRTUALIZED = docsDemo(DOCS, "Virtualized");
const PINNED = docsDemo(DOCS, "Pinned");
const EXPANDABLE = docsDemo(DOCS, "Expandable");

const grid = (scope: string) => `${scope} [role="grid"]`;

const row = (scope: string) => `${scope} [role="row"]`;

const cell = (scope: string) => `${scope} [role="gridcell"]`;

const header = (scope: string) => `${scope} [role="columnheader"]`;

/**
 * Sorting and reordering each have a control of their own inside the header, because a header cell cannot be
 * one target for both — so a tap can only ever mean one thing. They are the header's only two buttons, in
 * that order, and neither is a tab stop: the keyboard route is still the cell's.
 */
const sortControl = (scope: string) => `${header(scope)} button >> nth=0`;

/**
 * In a reorderable header the Playground draws the grip ahead of the title, so it is that header's first button
 * and the sort control comes after it.
 */
const reorderGrip = (scope: string, columnIndex: number) => `${header(scope)} >> nth=${columnIndex} >> button >> nth=0`;

/**
 * A cell is addressed by the pair of indices the grid publishes rather than by its text, because the text
 * is the point of the sorting tests: a locator built from a caption would move when the sort moves and
 * every assertion below would quietly follow it.
 */
const at = (scope: string, rowIndex: number, columnIndex: number) =>
    `${scope} [role="row"][aria-rowindex="${rowIndex}"] [aria-colindex="${columnIndex}"]`;

/**
 * No example prints its sort, selection or widths: each shows on screen, so each is read back the way a reader
 * meets it — a column's cells top to bottom, the rows that say they are selected, the width a header is drawn at.
 */
const columnTexts = (page: Page, scope: string, columnIndex: number) =>
    page.locator(`${scope} [role="row"]:has([role="gridcell"])`).evaluateAll(
        (rows, index) =>
            rows
                .map((element) => ({
                    at: Number(element.getAttribute("aria-rowindex")),
                    text: (element.querySelector(`[aria-colindex="${index}"]`)?.textContent ?? "").trim(),
                }))
                .sort((a, b) => a.at - b.at)
                .map((entry) => entry.text),
        columnIndex,
    );

const selectedRows = (page: Page, scope: string) =>
    page
        .locator(`${scope} [role="row"][aria-selected="true"]`)
        .evaluateAll((rows) => rows.map((element) => Number(element.getAttribute("aria-rowindex"))));

const widthOf = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetWidth);

const sortedText = (texts: string[]) => [...texts].sort((a, b) => a.localeCompare(b));

const chooseProp = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();

    const options = page.locator(`[id="${await picker.getAttribute("aria-controls")}"]`);

    await options.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/table/docs");
    await expect(page.locator(cell(BASIC)).first()).toBeVisible();
    await docsSettled(page);
});

/**
 * The counts and the per-cell indices are what let a reader announce "row 4 of 50,000" when only thirty
 * rows exist in the document. They are asserted on the small table first, where the DOM holds every row,
 * so a disagreement between the published count and the real one is visible without virtualization in play.
 */
test("the grid publishes its size, and every cell says where it sits", async ({ page }) => {
    const root = page.locator(grid(BASIC));
    const rowCount = await page.locator(row(BASIC)).count();
    const columnCount = await page.locator(header(BASIC)).count();

    await expect(root).toHaveAttribute("aria-label", "Parts");
    await expect(root, "every part and the header row above them").toHaveAttribute("aria-rowcount", String(rowCount));
    await expect(root).toHaveAttribute("aria-colcount", String(columnCount));
    await expect(root, "a selection may hold more than one row").toHaveAttribute("aria-multiselectable", "true");

    await expect(page.locator(row(BASIC)).first(), "the header is row one").toHaveAttribute("aria-rowindex", "1");
    await expect(page.locator(row(BASIC)).nth(1), "so the first part is row two").toHaveAttribute("aria-rowindex", "2");

    await expect(page.locator(header(BASIC)).first()).toHaveAttribute("aria-colindex", "1");
    await expect(page.locator(header(BASIC)).last()).toHaveAttribute("aria-colindex", String(columnCount));
});

/**
 * `aria-sort` is the only place the sort state is stated to a reader — the arrow the Playground paints is
 * `aria-hidden`, so a spec that read the arrow would be checking the Playground rather than the component.
 */
test("a sortable header cycles ascending, descending, then back to no sort at all", async ({ page }) => {
    const sku = page.locator(header(BASIC)).first();
    const skuSort = page.locator(sortControl(BASIC)).first();
    const arrival = await columnTexts(page, BASIC, 1);

    await expect(sku, "sortable but not yet sorted").toHaveAttribute("aria-sort", "none");

    await skuSort.click();

    await expect(sku).toHaveAttribute("aria-sort", "ascending");
    expect(await columnTexts(page, BASIC, 1), "the rows run from the first code alphabetically").toEqual(
        sortedText(arrival),
    );

    await skuSort.click();

    await expect(sku).toHaveAttribute("aria-sort", "descending");
    expect(await columnTexts(page, BASIC, 1), "and then from the last").toEqual(sortedText(arrival).reverse());

    await skuSort.click();

    await expect(sku, "the third click returns the rows to the order they arrived in").toHaveAttribute(
        "aria-sort",
        "none",
    );
    expect(await columnTexts(page, BASIC, 1)).toEqual(arrival);
});

test("sorting a number column orders by the number rather than by how it reads", async ({ page }) => {
    await page.locator(header(BASIC)).nth(3).locator("button").first().click();
    await expect(page.locator(header(BASIC)).nth(3)).toHaveAttribute("aria-sort", "ascending");

    const texts = await columnTexts(page, BASIC, 4);
    const numbers = texts.map((text) => Number(text.replace(/,/g, "")));

    expect(
        numbers,
        "each count is no smaller than the one above it, which a sort by the written text would break",
    ).toEqual([...numbers].sort((a, b) => a - b));
    expect(texts, "and the written text is out of its own order, so the two sorts really differ").not.toEqual(
        sortedText(texts),
    );
});

/**
 * The whole grid is one tab stop, which is what separates a grid from a list of focusable cells: sixty
 * cells in the tab order would take sixty presses of Tab to walk past.
 */
test("exactly one cell is in the tab order, and moving focus moves it", async ({ page }) => {
    const cells = page.locator(`${BASIC} [role="columnheader"], ${BASIC} [role="gridcell"]`);

    expect(await tabIndex(page.locator(header(BASIC)).first()), "the first header cell starts as the stop").toBe(0);

    const tabbable = await cells.evaluateAll(
        (elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length,
    );

    expect(tabbable).toBe(1);

    await page.locator(at(BASIC, 4, 2)).click();

    expect(await tabIndex(page.locator(at(BASIC, 4, 2))), "clicking a cell hands it the stop").toBe(0);
    expect(await tabIndex(page.locator(header(BASIC)).first()), "and takes it off the old one").toBe(-1);
});

/**
 * The arrow walk carries at the ends of a row rather than stopping, so a reader can cross the whole grid
 * with one key. The header is row one of that walk, which is what makes a sort reachable without a mouse.
 */
test("arrows walk cell to cell, and carry from one row's end to the next row's start", async ({ page }) => {
    const lastColumn = await page.locator(header(BASIC)).count();

    await page.locator(at(BASIC, 2, 1)).click();

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, at(BASIC, 2, 2))).toBe(true);

    await page.keyboard.press("End");
    expect(await activeMatches(page, at(BASIC, 2, lastColumn)), "End is the row's last cell").toBe(true);

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, at(BASIC, 3, 1)), "past the last column is the next row's first").toBe(true);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    expect(
        await activeMatches(page, `${BASIC} [role="columnheader"][aria-colindex="1"]`),
        "and up from row one is the header",
    ).toBe(true);
});

test("Enter on a header cell sorts it, so the mouse is not the only way in", async ({ page }) => {
    await page.locator(sortControl(BASIC)).first().click();
    await expect(page.locator(header(BASIC)).first()).toHaveAttribute("aria-sort", "ascending");

    await page.keyboard.press("Enter");

    await expect(page.locator(header(BASIC)).first()).toHaveAttribute("aria-sort", "descending");
});

/**
 * Selection lives on the row rather than on the cell, because a row is the thing being picked; the cells
 * only paint it. Space toggles, so a row picked by mistake is unpicked by the same key.
 */
test("Space picks the focused row, and picking a second row keeps the first", async ({ page }) => {
    await page.locator(at(BASIC, 3, 2)).click();

    expect(await selectedRows(page, BASIC), "a plain click already picks one").toEqual([3]);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press(" ");

    expect(await selectedRows(page, BASIC)).toEqual([3, 4]);

    await page.keyboard.press(" ");

    expect(await selectedRows(page, BASIC), "and the same key gives it back").toEqual([3]);
});

test("Shift with an arrow extends the selection from where it was anchored", async ({ page }) => {
    await page.locator(at(BASIC, 2, 1)).click();

    await page.keyboard.press("Shift+ArrowDown");
    await page.keyboard.press("Shift+ArrowDown");

    expect(await selectedRows(page, BASIC)).toEqual([2, 3, 4]);
});

test("Control and A picks every row there is", async ({ page }) => {
    await page.locator(at(BASIC, 2, 1)).click();

    await page.keyboard.press("Control+a");

    const selected = page.locator(`${BASIC} [role="row"][aria-selected="true"]`);
    const bodyRows = await page.locator(`${BASIC} [role="row"]:has([role="gridcell"])`).count();

    await expect(selected, "every part, and the header is not one of them").toHaveCount(bodyRows);
});

/**
 * Single selection is the same component with a different mode, so the interesting assertion is not that
 * one row is selected but that the previous one was dropped without anybody asking.
 */
test("a single-selection grid holds one row and says so", async ({ page }) => {
    await chooseProp(page, "selectionMode", "single");

    await expect(page.locator(grid(BASIC)), "no multi-select claim to a reader").not.toHaveAttribute(
        "aria-multiselectable",
        /.*/,
    );

    await page.locator(at(BASIC, 2, 1)).click();
    expect(await selectedRows(page, BASIC)).toEqual([2]);

    await page.locator(at(BASIC, 3, 1)).click();
    expect(await selectedRows(page, BASIC), "the second pick replaces the first").toEqual([3]);
});

/**
 * The width lands in the consumer's own signal and the table draws what that signal holds, so the width the
 * header is drawn at is the width the consumer was handed.
 */
test("a column resizes from the keyboard, by the same step each way", async ({ page }) => {
    const sku = page.locator(header(RESIZABLE)).first();
    const start = await widthOf(sku);

    await sku.click();
    await page.keyboard.press("Control+ArrowRight");

    await expect.poll(() => widthOf(sku), { message: "one step wider" }).toBeGreaterThan(start);

    const step = (await widthOf(sku)) - start;

    await page.keyboard.press("Control+ArrowLeft");
    await page.keyboard.press("Control+ArrowLeft");

    await expect.poll(() => widthOf(sku), { message: "and two steps back is one step narrower" }).toBe(start - step);
});

test("a resize stops at the column's own minimum rather than collapsing it", async ({ page }) => {
    const sku = page.locator(header(RESIZABLE)).first();
    const start = await widthOf(sku);

    await sku.click();

    for (let press = 0; press < 20; press++) await page.keyboard.press("Control+ArrowLeft");

    const floor = await widthOf(sku);

    await page.keyboard.press("Control+ArrowLeft");

    expect(floor, "the column did narrow").toBeLessThan(start);
    expect(floor, "but stopped short of nothing").toBeGreaterThan(0);
    expect(await widthOf(sku), "and a further press moves it no more").toBe(floor);
});

/**
 * A column with no comparator is the server-side case: the table refuses to guess an order and reports the
 * sort instead. The example's own handler is what reorders, so a red here means the report stopped arriving.
 */
test("a column with no comparator leaves the order to the page", async ({ page }) => {
    const category = page.locator(header(CONSUMER_SORTED)).nth(2);
    const arrival = await columnTexts(page, CONSUMER_SORTED, 1);

    await expect(category, "not offered as sortable at all").not.toHaveAttribute("aria-sort", /.*/);

    await page.locator(sortControl(CONSUMER_SORTED)).first().click();

    await expect(page.locator(header(CONSUMER_SORTED)).first(), "the sort is reported").toHaveAttribute(
        "aria-sort",
        "ascending",
    );
    await expect
        .poll(() => columnTexts(page, CONSUMER_SORTED, 1), { message: "and the page's own handler reordered the rows" })
        .toEqual(sortedText(arrival));
});

/**
 * Tens of thousands of rows with thirty in the document is the whole point of the count being published
 * rather than counted: `aria-rowcount` is the only thing that still knows how long the table is.
 */
test("a virtualized grid mounts a window of rows but still states its real length", async ({ page }) => {
    const count = Number(((await page.locator(`${prop("count")} input`).inputValue()) ?? "").replace(/\D/g, ""));

    await expect(page.locator(grid(VIRTUALIZED)), "every row the knob asks for, and the header").toHaveAttribute(
        "aria-rowcount",
        String(count + 1),
    );

    const mounted = await page.locator(row(VIRTUALIZED)).count();

    expect(mounted, "far fewer rows exist than the grid claims").toBeLessThan(100);
    expect(mounted, "and more than none of them").toBeGreaterThan(1);
});

test("the header stays put while the rows scroll under it", async ({ page }) => {
    const first = page.locator(header(VIRTUALIZED)).first();

    await first.scrollIntoViewIfNeeded();

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
    await page.locator(`${prop("isDisabled")} input`).click();

    await expect(page.locator(grid(BASIC))).toHaveAttribute("aria-disabled", "true");

    await page.locator(header(BASIC)).first().click({ force: true });

    await expect(page.locator(header(BASIC)).first(), "the sort did not move").toHaveAttribute("aria-sort", "none");

    await page.locator(at(BASIC, 2, 1)).click({ force: true });

    await expect(page.locator(row(BASIC)).nth(1)).toHaveAttribute("aria-selected", "false");
});

/**
 * Reordering has two ways in and they must agree. The pointer half drags a header past the middle of its
 * neighbor, which is where `Carrier.computeDropIndex` flips the landing place. The keyboard half is
 * Shift with an arrow on the focused header cell, chosen because the header already spends Enter and Space
 * on sorting and Ctrl with the arrows on resizing.
 *
 * Both assert the order through the header text, because the order is the thing being changed.
 */
test("a header dragged past its neighbor's middle swaps the two columns", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);
    const second = page.locator(header(REORDERABLE)).nth(1);

    await expect(first).toContainText("SKU");
    await expect(second).toContainText("Name");

    await first.scrollIntoViewIfNeeded();

    const from = await first.boundingBox();
    const to = await second.boundingBox();

    if (!from || !to) throw new Error("the reorderable demo drew no header boxes");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height * 0.5, { steps: 12 });
    await page.mouse.up();

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("Name");
    await expect(page.locator(header(REORDERABLE)).nth(1)).toContainText("SKU");
});

test("a drag that reorders does not also sort the column it started on", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);

    await expect(first).toHaveAttribute("aria-sort", "none");

    await first.scrollIntoViewIfNeeded();

    const from = await first.boundingBox();
    const to = await page.locator(header(REORDERABLE)).nth(1).boundingBox();

    if (!from || !to) throw new Error("the reorderable demo drew no header boxes");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height * 0.5, { steps: 12 });
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

/**
 * Escape puts a picked-up column back, however it was picked up. A tap on a grip starts a carry that the next
 * tap on a grip drops, so without the cancel the second tap below would land column 0 at column 2's place; with
 * it, the second tap starts a carry of its own and nothing moves. A drag is the other route, and while it runs
 * focus can be anywhere, which is why the key is listened for on the document rather than on the grid: the
 * release after Escape must drop nothing.
 */
test("Escape cancels a column picked up by tapping its grip", async ({ page }) => {
    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("SKU");
    await expect(page.locator(header(REORDERABLE)).nth(2)).toContainText("Category");

    await page.locator(reorderGrip(REORDERABLE, 0)).click();
    await page.keyboard.press("Escape");
    await page.locator(reorderGrip(REORDERABLE, 2)).click();

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("SKU");
    await expect(page.locator(header(REORDERABLE)).nth(2)).toContainText("Category");
});

test("Escape during a drag cancels it, so the release moves nothing", async ({ page }) => {
    const first = page.locator(header(REORDERABLE)).nth(0);
    const second = page.locator(header(REORDERABLE)).nth(1);

    await expect(first).toContainText("SKU");

    await first.scrollIntoViewIfNeeded();

    const from = await first.boundingBox();
    const to = await second.boundingBox();

    if (!from || !to) throw new Error("the reorderable demo drew no header boxes");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height * 0.5, { steps: 12 });
    await page.keyboard.press("Escape");
    await page.mouse.up();

    await expect(page.locator(header(REORDERABLE)).nth(0)).toContainText("SKU");
    await expect(page.locator(header(REORDERABLE)).nth(1)).toContainText("Name");
    await expect(page.locator(header(REORDERABLE)).nth(0)).toHaveAttribute("aria-sort", "none");
});

test("a table with no order signal ignores the reorder key entirely", async ({ page }) => {
    const first = page.locator(header(BASIC)).nth(0);

    await first.click();

    const before = (await first.textContent()) ?? "";

    await page.keyboard.press("Shift+ArrowRight");

    await expect(page.locator(header(BASIC)).nth(0)).toHaveText(before);
});

/**
 * The pinned example's frame is narrower than its columns, so the frame scrolls sideways and the table inside it does
 * not — the frame is the grid's parent, the box the Playground gave it. SKU is pinned at the start and Price at the
 * end; the three between them scroll.
 */
const frameOf = (page: Page, scope: string) => page.locator(grid(scope)).locator("xpath=..");

const leftOf = async (locator: Locator) => (await locator.boundingBox())!.x;

test("a pinned column stays put at either edge while the columns between them scroll sideways", async ({ page }) => {
    const frame = frameOf(page, PINNED);
    const lastColumn = await page.locator(header(PINNED)).count();
    const pinnedStart = [page.locator(header(PINNED)).first(), page.locator(at(PINNED, 2, 1))];
    const pinnedEnd = [page.locator(header(PINNED)).last(), page.locator(at(PINNED, 2, lastColumn))];
    const scrolling = page.locator(at(PINNED, 2, 2));

    await frame.scrollIntoViewIfNeeded();

    expect(
        await frame.evaluate((element) => element.scrollWidth > element.clientWidth),
        "the columns are wider than the frame, so there is something to scroll",
    ).toBe(true);

    const before = await Promise.all([...pinnedStart, ...pinnedEnd, scrolling].map(leftOf));

    await frame.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
    });
    await waitUntilStill(scrolling);

    const after = await Promise.all([...pinnedStart, ...pinnedEnd, scrolling].map(leftOf));

    for (let index = 0; index < pinnedStart.length + pinnedEnd.length; index++) {
        expect(after[index], "a pinned header or body cell has not moved").toBeCloseTo(before[index], 0);
    }

    expect(after.at(-1), "while a column between the pins went with the scroll").toBeLessThan(before.at(-1)! - 1);
});

/**
 * Pinned columns gather at their edge whatever the order says, and reorder only among their own kind. The keyboard
 * route is driven because it is one press per question: Shift with an arrow either moves the focused column one
 * place or does nothing. The last move is the control — a column between the pins does move, so the refusals before
 * it are refusals and not a key that was never wired up.
 */
test("a column reordered by the keyboard never crosses a pin boundary", async ({ page }) => {
    const headers = page.locator(header(PINNED));
    const order = () => headers.evaluateAll((cells) => cells.map((cell) => cell.textContent ?? ""));
    const declared = await order();

    expect(declared[0], "SKU is the start pin").toContain("SKU");
    expect(declared.at(-1), "and Price the end pin").toContain("Price");

    await headers.first().click();
    await page.keyboard.press("Shift+ArrowRight");

    expect(await order(), "the start pin cannot step out among the scrolling columns").toEqual(declared);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Shift+ArrowLeft");

    expect(await order(), "nor can the first scrolling column step in front of it").toEqual(declared);

    await page.keyboard.press("End");
    await page.keyboard.press("Shift+ArrowLeft");

    expect(await order(), "the end pin cannot step in among them").toEqual(declared);

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Shift+ArrowRight");

    expect(await order(), "nor the last scrolling column step past it").toEqual(declared);

    await page.keyboard.press("Shift+ArrowLeft");

    const moved = await order();

    expect(moved, "while between the pins a column moves as it always does").not.toEqual(declared);
    expect(moved[0]).toContain("SKU");
    expect(moved.at(-1)).toContain("Price");
});

/**
 * ARIA 1.2 forbids `aria-expanded` on a row of a plain `grid`, so a table whose rows open is a `treegrid`: every row
 * says it is level 1, a row that can open says whether it is, and its detail is level 2. Which rows can open is the
 * example's rule (a part out of stock has nothing to show), so the spec reads it off the rows rather than naming them.
 */
test("an expandable table is a treegrid whose openable rows say whether they are open", async ({ page }) => {
    await expect(page.locator(`${EXPANDABLE} [role="treegrid"]`)).toHaveCount(1);
    await expect(page.locator(grid(EXPANDABLE)), "and not a plain grid").toHaveCount(0);

    const rows = page.locator(`${EXPANDABLE} [role="row"]:has([role="gridcell"])`);
    const levels = await rows.evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-level")));

    expect(levels.length, "some rows are drawn").toBeGreaterThan(0);
    expect(new Set(levels), "every body row is level 1 while nothing is open").toEqual(new Set(["1"]));

    await expect(
        page.locator(`${EXPANDABLE} [role="row"][aria-level="1"][aria-expanded="false"]`).first(),
        "rows that can open say they are shut",
    ).toBeAttached();
});

test("a row that cannot open has no expander, and every row that can has one", async ({ page }) => {
    const shut = page.locator(`${EXPANDABLE} [role="row"][aria-level="1"]:not([aria-expanded])`);
    const openable = page.locator(`${EXPANDABLE} [role="row"][aria-expanded]`);

    expect(await shut.count(), "the example has a row that cannot open in view").toBeGreaterThan(0);
    await expect(shut.first().locator("button"), "and it draws nothing to press").toHaveCount(0);

    const expanderCounts = await openable.evaluateAll((elements) =>
        elements.map((element) => element.querySelectorAll("button").length),
    );

    expect(new Set(expanderCounts), "while each row that can open carries exactly one expander").toEqual(new Set([1]));
});

/**
 * The APG treegrid's cell-only focus: Enter on a row's first cell opens and shuts it, and Enter anywhere else is the
 * ordinary activation, which opens nothing. The first cell is reached by Home from a cell beside it, so the click that
 * puts focus in the grid never lands on the expander.
 */
test("Enter on a row's first cell opens and shuts its detail, and Enter elsewhere does not", async ({ page }) => {
    const firstRow = page.locator(`${EXPANDABLE} [role="row"][aria-rowindex="2"]`);
    const details = page.locator(`${EXPANDABLE} [role="row"][aria-level="2"]`);

    await expect(firstRow, "the first part can open").toHaveAttribute("aria-expanded", "false");

    await page.locator(at(EXPANDABLE, 2, 2)).click();
    await page.keyboard.press("Enter");

    await expect(firstRow, "Enter on the second cell is not the toggle").toHaveAttribute("aria-expanded", "false");
    await expect(details).toHaveCount(0);

    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");

    await expect(firstRow, "Enter on the first cell opens the row").toHaveAttribute("aria-expanded", "true");
    await expect(details, "and draws its detail").toHaveCount(1);

    await page.keyboard.press("Enter");

    await expect(firstRow, "and the same key shuts it").toHaveAttribute("aria-expanded", "false");
    await expect(details).toHaveCount(0);
});

/**
 * An open detail is a row of its own in the walk, one cell spanning every column, so the down arrow steps into it
 * from its row and out of it onto the next row, and the up arrow retraces the way.
 */
test("the arrows walk down into an open detail and back out of it", async ({ page }) => {
    const detailCell = `${EXPANDABLE} [role="row"][aria-level="2"] [role="gridcell"]`;
    const openRowFirstCell = `${EXPANDABLE} [role="row"][aria-expanded="true"] [aria-colindex="1"]`;

    await page.locator(at(EXPANDABLE, 2, 2)).click();
    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");
    await expect(page.locator(detailCell)).toHaveCount(1);

    const nextRowText = await page
        .locator(`${EXPANDABLE} [role="row"][aria-level="2"] + [role="row"] [aria-colindex="1"]`)
        .textContent();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator(detailCell), "down from the open row is its detail").toBeFocused();

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "down again leaves it for the row after").toBe((nextRowText ?? "").trim());

    await page.keyboard.press("ArrowUp");
    await expect(page.locator(detailCell), "up comes back into the detail").toBeFocused();

    await page.keyboard.press("ArrowUp");
    expect(await activeMatches(page, openRowFirstCell), "and up again is the row that opened it").toBe(true);
});

test("the expander opens its row by pointer, and focus lands on the row it opened", async ({ page }) => {
    const firstRow = page.locator(`${EXPANDABLE} [role="row"][aria-rowindex="2"]`);

    await firstRow.locator("button").click();

    await expect(firstRow).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(`${EXPANDABLE} [role="row"][aria-level="2"]`)).toHaveCount(1);
    expect(
        await activeMatches(page, at(EXPANDABLE, 2, 1)),
        "the expander takes no tab stop of its own, so focus goes to its cell",
    ).toBe(true);

    await firstRow.locator("button").click();

    await expect(firstRow, "and a second press shuts it").toHaveAttribute("aria-expanded", "false");
});

/**
 * Focus is on the detail when its row is shut, so the element holding focus leaves the document. Left to the
 * browser, focus would fall to the page body and the next key would go nowhere (WCAG 2.4.3); the grid hands it to the
 * row the detail belonged to instead. The page has no control that shuts a row from outside the grid, so it is shut
 * by its own expander, pressed while the detail holds focus.
 */
test("a detail shut while it holds focus hands focus back to its row", async ({ page }) => {
    const firstRow = page.locator(`${EXPANDABLE} [role="row"][aria-rowindex="2"]`);
    const detailCell = page.locator(`${EXPANDABLE} [role="row"][aria-level="2"] [role="gridcell"]`);

    await firstRow.locator("button").click();
    await page.keyboard.press("ArrowDown");
    await expect(detailCell, "focus is on the detail").toBeFocused();

    await firstRow.locator("button").click();

    await expect(detailCell, "the detail is gone").toHaveCount(0);
    expect(
        await activeMatches(page, at(EXPANDABLE, 2, 1)),
        "and focus is on its row rather than on the page body",
    ).toBe(true);

    await page.keyboard.press("ArrowDown");
    expect(await activeMatches(page, at(EXPANDABLE, 3, 1)), "so the next key still walks the grid").toBe(true);
});
