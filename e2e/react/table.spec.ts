import { type Page, expect, test } from "@playwright/test";

import { activeMatches, tabIndex } from "../helpers";

/**
 * The React `Table`, with `TableHeaderSort` and `TableHeaderReorder`. The cases follow `e2e/table.spec.ts`, which
 * covers the Solid one: the grid publishes its size and every cell's place, a sortable header cycles through three
 * states, the whole grid is one tab stop walked by the arrows, rows are picked with Space, Shift and Ctrl-A, a column
 * resizes from the keyboard and stops at its floor, a column without a comparator reports its sort, a virtualized
 * grid states its real length, a disabled grid reads but does not act, and columns reorder by drag and by Shift with
 * an arrow. The warnings about a header missing its controls, and a builtin rendered outside any header, are pinned
 * here as well.
 *
 * A cell is addressed by the indices the grid publishes rather than by its text, because the text is what sorting
 * moves.
 */
const STORY = "Essentials/Table/Default";
const CONSUMER_SORTED = "Essentials/Table/ConsumerSorted";

const GRID = '[role="grid"]';
const ROW = '[role="row"]';
const CELL = '[role="gridcell"]';
const HEADER = '[role="columnheader"]';

const sortControl = `${HEADER} button >> nth=0`;

const at = (rowIndex: number, columnIndex: number) =>
    `[role="row"][aria-rowindex="${rowIndex}"] [aria-colindex="${columnIndex}"]`;

const readout = async (page: Page) => ((await page.locator('[data-readout="table"]').textContent()) ?? "").trim();

const mountTable = async (page: Page, mount: (story: string, props?: object) => Promise<unknown>, props?: object) => {
    await mount(STORY, props);
    await expect(page.locator(CELL).first()).toBeVisible();
};

test("the grid publishes its size, and every cell says where it sits", async ({ page, mount }) => {
    await mountTable(page, mount);

    const root = page.locator(GRID);

    await expect(root).toHaveAttribute("aria-label", "Parts");
    await expect(root).toHaveAttribute("aria-rowcount", "13");
    await expect(root).toHaveAttribute("aria-colcount", "5");
    await expect(root).toHaveAttribute("aria-multiselectable", "true");

    await expect(page.locator(ROW).first()).toHaveAttribute("aria-rowindex", "1");
    await expect(page.locator(ROW).nth(1)).toHaveAttribute("aria-rowindex", "2");

    await expect(page.locator(HEADER).first()).toHaveAttribute("aria-colindex", "1");
    await expect(page.locator(HEADER).last()).toHaveAttribute("aria-colindex", "5");
});

test("a sortable header cycles ascending, descending, then back to no sort at all", async ({ page, mount }) => {
    await mountTable(page, mount);

    const sku = page.locator(HEADER).first();
    const skuSort = page.locator(sortControl).first();

    await expect(sku).toHaveAttribute("aria-sort", "none");
    expect(await readout(page)).toContain("sort: unsorted");

    await skuSort.click();

    await expect(sku).toHaveAttribute("aria-sort", "ascending");
    await expect(page.locator(at(2, 1))).toHaveText("BK-6015");

    await skuSort.click();

    await expect(sku).toHaveAttribute("aria-sort", "descending");
    await expect(page.locator(at(2, 1))).toHaveText("SP-5199");

    await skuSort.click();

    await expect(sku).toHaveAttribute("aria-sort", "none");
    await expect(page.locator(at(2, 1))).toHaveText("FS-1042");
});

test("the sort control is out of the tab order and hidden, and focuses its own cell", async ({ page, mount }) => {
    await mountTable(page, mount);

    const control = page.locator(sortControl).first();

    await expect(control).toHaveAttribute("tabindex", "-1");
    await expect(control).toHaveAttribute("aria-hidden", "true");

    await page.locator(HEADER).nth(2).locator("button").first().click();

    expect(await activeMatches(page, `${HEADER}[aria-colindex="3"]`)).toBe(true);
});

test("sorting a number column orders by the number rather than by how it reads", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(HEADER).nth(3).locator("button").first().click();

    await expect(page.locator(at(2, 4))).toHaveText("0");
    await expect(page.locator(at(13, 4))).toHaveText("1,840");
});

test("exactly one cell is in the tab order, and moving focus moves it", async ({ page, mount }) => {
    await mountTable(page, mount);

    const cells = page.locator(`${HEADER}, ${CELL}`);

    expect(await tabIndex(page.locator(HEADER).first())).toBe(0);

    const tabbable = await cells.evaluateAll(
        (elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length,
    );

    expect(tabbable).toBe(1);

    await page.locator(at(4, 2)).click();

    expect(await tabIndex(page.locator(at(4, 2)))).toBe(0);
    expect(await tabIndex(page.locator(HEADER).first())).toBe(-1);
});

test("arrows walk cell to cell, and carry from one row's end to the next row's start", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(at(2, 1)).click();

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, `[aria-rowindex="2"] [aria-colindex="2"]`)).toBe(true);

    await page.keyboard.press("End");
    expect(await activeMatches(page, `[aria-rowindex="2"] [aria-colindex="5"]`)).toBe(true);

    await page.keyboard.press("ArrowRight");
    expect(await activeMatches(page, `[aria-rowindex="3"] [aria-colindex="1"]`)).toBe(true);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    expect(await activeMatches(page, `[role="columnheader"][aria-colindex="1"]`)).toBe(true);

    await page.keyboard.press("Control+End");
    expect(await activeMatches(page, `[aria-rowindex="13"] [aria-colindex="5"]`), "Ctrl-End is the last cell").toBe(
        true,
    );

    await page.keyboard.press("Control+Home");
    expect(await activeMatches(page, `[role="columnheader"][aria-colindex="1"]`)).toBe(true);
});

test("Enter on a header cell sorts it, so the mouse is not the only way in", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(sortControl).first().click();
    await expect(page.locator(HEADER).first()).toHaveAttribute("aria-sort", "ascending");

    await page.keyboard.press("Enter");

    await expect(page.locator(HEADER).first()).toHaveAttribute("aria-sort", "descending");
});

test("Space picks the focused row, and picking a second row keeps the first", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(at(3, 2)).click();

    expect(await readout(page)).toContain("selected: BR-2201;");
    await expect(page.locator(ROW).nth(2)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press(" ");

    expect(await readout(page)).toContain("selected: BR-2201, GK-3310;");

    await page.keyboard.press(" ");

    expect(await readout(page)).toContain("selected: BR-2201;");
});

test("Shift with an arrow extends the selection from where it was anchored", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(at(2, 1)).click();

    await page.keyboard.press("Shift+ArrowDown");
    await page.keyboard.press("Shift+ArrowDown");

    expect(await readout(page)).toContain("selected: FS-1042, BR-2201, GK-3310;");
});

test("Control and A picks every row there is", async ({ page, mount }) => {
    await mountTable(page, mount);

    await page.locator(at(2, 1)).click();
    await page.keyboard.press("Control+a");

    await expect(page.locator(`${ROW}[aria-selected="true"]`)).toHaveCount(12);
});

test("a single-selection grid holds one row and says so", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "singleSelection" });

    await expect(page.locator(GRID)).not.toHaveAttribute("aria-multiselectable", /.*/);

    await page.locator(at(2, 1)).click();
    expect(await readout(page)).toContain("selected: FS-1042;");

    await page.locator(at(3, 1)).click();
    expect(await readout(page)).toContain("selected: BR-2201;");
});

test("a column resizes from the keyboard, and the width goes to the consumer", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "resizable" });

    await page.locator(HEADER).first().click();

    expect(await readout(page)).toContain("widths: {}");

    await page.keyboard.press("Control+ArrowRight");

    expect(await readout(page)).toContain('"sku":118');

    await page.keyboard.press("Control+ArrowLeft");
    await page.keyboard.press("Control+ArrowLeft");

    expect(await readout(page)).toContain('"sku":102');
});

test("a resize stops at the column's own minimum rather than collapsing it", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "resizable" });

    await page.locator(HEADER).first().click();

    for (let press = 0; press < 8; press++) await page.keyboard.press("Control+ArrowLeft");

    expect(await readout(page)).toContain('"sku":80');
});

test("a press on the resizer that does not drag steps the width", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "resizable" });

    const resizer = page.locator(`${HEADER} [aria-hidden="true"]:not(button)`).first();
    const box = (await resizer.boundingBox())!;

    await page.mouse.click(box.x + box.width - 1, box.y + box.height * 0.5);

    expect(await readout(page), "the trailing half grows it by a step").toContain('"sku":118');
});

test("a drag on the resizer widens the column", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "resizable" });

    const resizer = page.locator(`${HEADER} [aria-hidden="true"]:not(button)`).first();
    const box = (await resizer.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 + 40, box.y + box.height * 0.5, { steps: 5 });
    await page.mouse.up();

    expect(await readout(page)).toContain('"sku":150');
});

test("a column with no comparator leaves the order to the page", async ({ page, mount }) => {
    await mount(CONSUMER_SORTED);

    await expect(page.locator(HEADER).nth(2)).not.toHaveAttribute("aria-sort", /.*/);

    await page.locator(sortControl).first().click();

    expect(await readout(page)).toContain("sort: sku ascending");
    await expect(page.locator(at(2, 1))).toHaveText("BK-6015");
});

test("a virtualized grid mounts a window of rows but still states its real length", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "virtualized" });

    await expect(page.locator(GRID)).toHaveAttribute("aria-rowcount", "50001");

    const mounted = await page.locator(ROW).count();

    expect(mounted).toBeLessThan(100);
    expect(mounted).toBeGreaterThan(1);
});

test("the header stays put while the rows scroll under it", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "virtualized" });

    const first = page.locator(HEADER).first();
    const before = await first.boundingBox();

    await page.locator("[data-frame]").evaluate((element) => element.scrollBy(0, 2000));

    await expect(page.locator(ROW).nth(1)).toBeVisible();
    await expect
        .poll(async () => Number(await page.locator(ROW).nth(1).getAttribute("aria-rowindex")))
        .toBeGreaterThan(10);

    const after = await first.boundingBox();

    expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
});

test("a disabled grid reads out but does not act", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "disabled" });

    await expect(page.locator(GRID)).toHaveAttribute("aria-disabled", "true");

    await page.locator(sortControl).first().click({ force: true });

    await expect(page.locator(HEADER).first()).toHaveAttribute("aria-sort", "none");
    expect(await readout(page)).toContain("sort: unsorted");

    await page.locator(at(2, 1)).click({ force: true });

    await expect(page.locator(ROW).nth(1)).toHaveAttribute("aria-selected", "false");
});

const dragHeader = async (page: Page, fromIndex: number, toIndex: number) => {
    const from = (await page.locator(HEADER).nth(fromIndex).boundingBox())!;
    const to = (await page.locator(HEADER).nth(toIndex).boundingBox())!;

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width * 0.75, to.y + to.height * 0.5, { steps: 12 });
    await page.mouse.up();
};

test("a header dragged past its neighbor's middle swaps the two columns", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    await expect(page.locator(HEADER).nth(0)).toContainText("SKU");
    await expect(page.locator(HEADER).nth(1)).toContainText("Name");

    await dragHeader(page, 0, 1);

    await expect(page.locator(HEADER).nth(0)).toContainText("Name");
    await expect(page.locator(HEADER).nth(1)).toContainText("SKU");
});

test("a drag that reorders does not also sort the column it started on", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    await expect(page.locator(HEADER).first()).toHaveAttribute("aria-sort", "none");

    await dragHeader(page, 0, 1);

    await expect(page.locator(HEADER).nth(1)).toContainText("SKU");
    await expect(page.locator(HEADER).nth(1)).toHaveAttribute("aria-sort", "none");
});

test("the grip picks a column up and a tap on another header's grip drops it there", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    const grip = (index: number) => page.locator(HEADER).nth(index).locator("button").first();

    await grip(0).click();
    await grip(2).click();

    await expect(page.locator(HEADER).nth(2)).toContainText("SKU");
});

test("a reorderable header is described by the resting key hint", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    const describedBy = await page.locator(HEADER).first().getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`)).toHaveText("Press Enter to pick this column up and move it.");
});

test("shift with an arrow moves the focused column and focus travels with it", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    await page.locator(HEADER).nth(0).click();
    await page.keyboard.press("Shift+ArrowRight");

    await expect(page.locator(HEADER).nth(0)).toContainText("Name");
    await expect(page.locator(HEADER).nth(1)).toContainText("SKU");
    await expect(page.locator(`${HEADER}:focus`)).toContainText("SKU");
});

test("a column at the end of the row does not move past it", async ({ page, mount }) => {
    await mountTable(page, mount, { preset: "reorderable" });

    await page.locator(HEADER).nth(0).click();
    await page.keyboard.press("Shift+ArrowLeft");

    await expect(page.locator(HEADER).nth(0)).toContainText("SKU");
});

test("a table with no order signal ignores the reorder key entirely", async ({ page, mount }) => {
    await mountTable(page, mount);

    const first = page.locator(HEADER).nth(0);

    await first.click();

    const before = (await first.textContent()) ?? "";

    await page.keyboard.press("Shift+ArrowRight");

    await expect(page.locator(HEADER).nth(0)).toHaveText(before);
});

test("a header control rendered outside any header cell warns and renders nothing", async ({ page, mount }) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    await mount("Essentials/Table/Orphan");

    await expect(page.locator("button")).toHaveCount(0);
    expect(warnings.some((text) => text.includes("TableHeaderSort: no Table header cell"))).toBe(true);
});
