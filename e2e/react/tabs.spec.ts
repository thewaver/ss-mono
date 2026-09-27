import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeText, computedStyle, inlineStyle, tabIndex, tagName } from "../helpers";

/**
 * The React `Tabs` and `TabPanel`. The cases follow `e2e/tabs.spec.ts` and the `Tabs` block of
 * `e2e/rightToLeft.spec.ts`, which cover the Solid ones, so the two frameworks are held to the same behavior. Each
 * story renders its lists inside boxes keyed by `data-testid`, standing in for the Playground's example keys, and
 * every list keeps its disabled entry in the middle, where a walk can go wrong in both directions at once.
 */
const STORY = "Essentials/Tabs";

const scope = (key: string) => `[data-testid="${key}"]`;
const list = (key: string) => `${scope(key)} [role="tablist"]`;
const tab = (key: string) => `${scope(key)} [role="tab"]`;
const named = (key: string, name: string) => `${tab(key)}:has-text("${name}")`;
const floater = (key: string) => `${scope(key)} [data-floater]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="selected"]`).textContent();

const FLOATER_TIMEOUT_MS = 5_000;
const SHOWN_TRANSFORM = "matrix(1, 0, 0, 1, 0, 0)";
const RETURN_TOLERANCE_PX = 4;

const box = async (locator: Locator) => {
    const measured = await locator.boundingBox();

    if (!measured) throw new Error("the element has no box to measure");

    return { ...measured, centerX: measured.x + measured.width * 0.5 };
};

test("a tab list is one tab stop, and it sits on the selected tab", async ({ page, mount }) => {
    await mount(`${STORY}/Row`);

    await expect(page.locator(tab("row")), "the disabled tab is still rendered and still a tab").toHaveCount(4);
    await expect(page.locator(`${tab("row")}[aria-disabled="true"]`), "and it says so with aria").toHaveCount(1);

    await expect(page.locator(`${tab("row")}[tabindex="0"]`), "exactly one tab holds the tab stop").toHaveCount(1);
    await expect(page.locator(`${tab("row")}[tabindex="0"]`), "which is the selected one").toHaveAttribute(
        "aria-selected",
        "true",
    );
    expect(await tabIndex(page.locator(tab("row")).nth(1)), "every other tab is reachable only by arrow").toBe(-1);
});

test("the keyboard walks the row and steps over the disabled tab", async ({ page, mount }) => {
    await mount(`${STORY}/Row`);

    await page.locator(`${tab("row")}[tabindex="0"]`).focus();
    expect(await activeText(page), "focus starts on the selected tab").toBe("Render");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "ArrowRight walks a row forward").toBe("Source");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "and skips the disabled tab rather than landing on it").toBe("Export");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "the walk wraps from the last tab to the first").toBe("Render");

    await page.keyboard.press("ArrowLeft");
    expect(await activeText(page), "and back the other way").toBe("Export");

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "while the cross-axis arrows do nothing in a row").toBe("Export");

    await page.keyboard.press("Home");
    expect(await activeText(page), "Home goes to the first enabled tab").toBe("Render");

    await page.keyboard.press("End");
    expect(await activeText(page), "and End to the last one").toBe("Export");
});

test("a column list declares its orientation and takes the other pair of arrows", async ({ page, mount }) => {
    await mount(`${STORY}/Column`);

    await expect(page.locator(list("column"))).toHaveAttribute("aria-orientation", "vertical");
    await expect(page.locator(list("row")), "and a row says so as well").toHaveAttribute(
        "aria-orientation",
        "horizontal",
    );

    await page.locator(`${tab("column")}[tabindex="0"]`).focus();
    expect(await activeText(page)).toBe("Overview");

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "ArrowDown walks a column forward").toBe("Details");

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "over the disabled entry").toBe("Settings");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "while the cross-axis arrows do nothing in a column").toBe("Settings");
});

test("each list carries its own name, so several on a page stay distinguishable", async ({ page, mount }) => {
    await mount(`${STORY}/Column`);

    await expect(page.locator(list("row"))).toHaveAttribute("aria-label", "Example views");
    await expect(page.locator(list("column"))).toHaveAttribute("aria-label", "Example sections");
});

test("moving the focus does not move the selection, and the tab itself does the selecting", async ({ page, mount }) => {
    await mount(`${STORY}/Row`);

    await page.locator(`${tab("row")}[tabindex="0"]`).focus();
    await page.keyboard.press("ArrowRight");

    expect(await readout(page, "row"), "an arrow moves the focus and nothing else").toBe("selected: Render");
    await expect(page.locator(`${tab("row")}[aria-selected="true"]`)).toHaveText("Render");

    await page.keyboard.press("Enter");
    expect(await readout(page, "row"), "and the focused tab selects when it is activated").toBe("selected: Source");

    await page.locator(tab("row")).nth(3).click();
    expect(await readout(page, "row"), "a click does the same thing").toBe("selected: Export");

    await page.locator(tab("row")).nth(2).click({ force: true });
    expect(await readout(page, "row"), "and a disabled tab refuses both").toBe("selected: Export");
});

test("automatic activation takes the selection along with the focus", async ({ page, mount }) => {
    await mount(`${STORY}/Automatic`);

    await page.locator(`${tab("automatic")}[tabindex="0"]`).focus();
    expect(await activeText(page)).toBe("Render");

    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "the focus moves as it always did").toBe("Source");
    expect(await readout(page, "automatic"), "and the selection comes with it, unasked").toBe("selected: Source");

    await page.keyboard.press("ArrowRight");
    expect(await readout(page, "automatic"), "the disabled tab is skipped by both").toBe("selected: Export");

    await page.keyboard.press("ArrowRight");
    expect(await readout(page, "automatic"), "and the wrap selects the first tab again").toBe("selected: Render");

    expect(await readout(page, "row"), "the manual list beside it is untouched").toBe("selected: Render");
});

test("a disabled tab kept reachable takes focus from the arrows and still refuses to be chosen", async ({
    page,
    mount,
}) => {
    await mount(`${STORY}/Reachable`);

    await page.locator(`${tab("reachable")}[tabindex="0"]`).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "the walk lands on the disabled tab rather than passing it").toBe("Metrics");

    await page.keyboard.press("Enter");
    expect(await readout(page, "reachable"), "and activating it selects nothing").toBe("selected: Render");
});

test("a tab and its panel point at each other, and the pair moves with the selection", async ({ page, mount }) => {
    await mount(`${STORY}/Row`);

    const controls = await page.locator(`${tab("row")}[aria-selected="true"]`).getAttribute("aria-controls");
    const panel = page.locator(`#${controls}`);

    expect(await panel.getAttribute("role"), "the selected tab points at a real panel").toBe("tabpanel");
    expect(await panel.getAttribute("aria-labelledby"), "and the panel points back at the tab").toBe(
        await page.locator(`${tab("row")}[aria-selected="true"]`).getAttribute("id"),
    );
    expect(await tabIndex(panel), "a panel of plain prose is focusable, since nothing inside it can be").toBe(0);

    await page.locator(tab("row")).nth(3).click();

    const next = await page.locator(`${tab("row")}[aria-selected="true"]`).getAttribute("aria-controls");

    expect(next, "selecting another tab swaps in that tab's panel").not.toBe(controls);
    await expect(page.locator(`#${next}`)).toHaveAttribute("role", "tabpanel");

    await mount(`${STORY}/Links`);

    await expect(
        page.locator(tab("links")).first(),
        "a list with no panel behind it says nothing rather than pointing at a missing one",
    ).not.toHaveAttribute("aria-controls");
});

test("the floater follows the selected tab, over a gutter that spans the list", async ({ page, mount }) => {
    await mount(`${STORY}/Row`);

    await expect(
        page.locator(`${list("row")} [data-gutter]`),
        "the gutter is painted once behind the list",
    ).toHaveCount(1);

    const floaterBox = page.locator(floater("row")).locator("..");
    const before = await inlineStyle(floaterBox, "left");

    expect(before, "the floater is placed off a real measurement rather than left at zero").not.toBe("");

    await page.locator(tab("row")).nth(3).click();

    await expect.poll(() => inlineStyle(floaterBox, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before);
});

test("the floater plays itself out before it goes, and back in when a selection returns", async ({ page, mount }) => {
    await mount(`${STORY}/Clearable`);

    const painted = page.locator(floater("clearable"));

    await expect(painted, "a list with a selection paints one").toHaveCount(1);
    await expect.poll(() => computedStyle(painted, "transform"), { timeout: FLOATER_TIMEOUT_MS }).toBe(SHOWN_TRANSFORM);

    await page.getByTestId("clear").click();

    await expect
        .poll(() => computedStyle(painted, "transform"), {
            message: "clearing the selection aims the painter at hidden while it is still in the document",
        })
        .not.toBe(SHOWN_TRANSFORM);

    await expect(painted, "and it leaves once the transition it was promised has run").toHaveCount(0, {
        timeout: FLOATER_TIMEOUT_MS,
    });

    await page.locator(tab("clearable")).nth(2).click();

    await expect(painted, "selecting again brings it back").toHaveCount(1);

    const returned = (await painted.locator("..").boundingBox())!;
    const third = (await page.locator(tab("clearable")).nth(2).boundingBox())!;

    expect(
        Math.abs(returned.x - third.x),
        "and it comes back at the tab that was chosen, rather than at the one it left and sliding across",
    ).toBeLessThan(RETURN_TOLERANCE_PX);

    await expect.poll(() => computedStyle(painted, "transform")).toBe(SHOWN_TRANSFORM);
    expect(await readout(page, "clearable")).toBe("selected: Three");
});

test("an href makes the tab an anchor, and a link component replaces the element", async ({ page, mount }) => {
    await mount(`${STORY}/Links`);

    expect(await tagName(page.locator(tab("links")).first()), "a tab with an href is a link, not a button").toBe("A");
    expect(await tagName(page.locator(tab("row")).first()), "and one without stays a button").toBe("BUTTON");
    await expect(page.locator(tab("links")).first()).toHaveAttribute("href", "#tabs-docs");

    await expect(
        page.locator(`${tab("linkComponent")}[data-link-component]`),
        "the consumer's own component renders every tab when one is given",
    ).toHaveCount(3);

    await page.locator(tab("linkComponent")).nth(1).click();
    expect(await readout(page, "linkComponent"), "and it still reports the selection").toBe("selected: Guides");
});

/**
 * A router's link typically hands its element a new ref function on every render, so React detaches and reattaches
 * it each time. The tab list records its tabs' elements as state, and it must take a detach and reattach of the same
 * element as no change — otherwise every render schedules another, and the list never settles.
 */
test("a link component that makes a new ref every render still settles, and still selects", async ({ page, mount }) => {
    await mount(`${STORY}/Links`);

    await expect(page.locator(`${tab("freshRefLink")}[data-fresh-ref-link]`)).toHaveCount(3);

    await page.locator(tab("freshRefLink")).nth(1).click();
    expect(await readout(page, "freshRefLink"), "the selection is reported").toBe("selected: Guides");
});

test("a list with nothing enabled holds no tab stop at all", async ({ page, mount }) => {
    await mount(`${STORY}/AllDisabled`);

    await expect(page.locator(`${tab("disabled")}[aria-disabled="true"]`)).toHaveCount(3);
    await expect(
        page.locator(`${tab("disabled")}[tabindex="0"]`),
        "with nowhere for the roving stop to land, the list drops out of the tab order",
    ).toHaveCount(0);

    await page.locator(tab("disabled")).nth(1).click({ force: true });
    expect(await readout(page, "disabled"), "and clicking changes nothing").toBe("selected: Draft");
});

/**
 * Placements are written as shares of the container's width, so the offsets can be read straight off the boxes and
 * compared with each other: the second row of a honeycomb starts half a column in, which is a relationship between
 * the rows rather than a measurement of either.
 */
const placedBox = (key: string) => `${scope(key)} [role="presentation"][style*="left"]`;

const placedOffsets = (page: Page, key: string) =>
    page.locator(placedBox(key)).evaluateAll((elements) =>
        elements.map((element) => {
            const style = element.getAttribute("style") ?? "";
            const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);

            return { left: at("left"), top: at("top") };
        }),
    );

test("a honeycomb is a box per tab, and the rows interlock rather than stacking", async ({ page, mount }) => {
    await mount(`${STORY}/Honeycomb`);

    await expect(page.locator(placedBox("honeycomb"))).toHaveCount(await page.locator(tab("honeycomb")).count());

    const offsets = await placedOffsets(page, "honeycomb");
    const firstRow = offsets.filter((offset) => offset.top === offsets[0].top);
    const secondRow = offsets.filter((offset) => offset.top !== offsets[0].top);

    expect(firstRow.length, "the first row is filled before the second is started").toBeGreaterThan(1);
    expect(secondRow.length, "and there is a second").toBeGreaterThan(0);
    expect(
        secondRow[0].left - firstRow[0].left,
        "which starts half a column in, so each cell sits in the notch between the two above it",
    ).toBeCloseTo((firstRow[1].left - firstRow[0].left) * 0.5, 3);

    await mount(`${STORY}/Row`);

    await expect(page.locator(placedBox("row")), "while a row places nothing").toHaveCount(0);
});

test("a placed tab list is still a tab list: the pairing, the walk and the skip all hold", async ({ page, mount }) => {
    await mount(`${STORY}/Honeycomb`);

    const selected = page.locator(`${scope("honeycomb")} [aria-selected="true"]`);

    await expect(selected, "one cell is selected and points at its panel").toHaveCount(1);
    await expect(page.locator(`${scope("honeycomb")} [role="tabpanel"]`)).toHaveAttribute(
        "aria-labelledby",
        (await selected.getAttribute("id")) ?? "",
    );

    await page.locator(tab("honeycomb")).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "two steps from the first cell lands past the disabled one rather than on it").toBe(
        await page.locator(tab("honeycomb")).nth(3).textContent(),
    );
});

test("the floater lands on the cell the layout chose, in both axes", async ({ page, mount }) => {
    await mount(`${STORY}/Honeycomb`);

    const floaterBox = page.locator(floater("honeycomb")).locator("..");
    const before = { left: await inlineStyle(floaterBox, "left"), top: await inlineStyle(floaterBox, "top") };

    expect(before.left, "the floater is placed from the layout rather than left at zero").not.toBe("");

    await page.locator(tab("honeycomb")).nth(4).click();

    await expect.poll(() => inlineStyle(floaterBox, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before.left);
    expect(await inlineStyle(floaterBox, "top"), "a cell on the second row is down as well as across").not.toBe(
        before.top,
    );
});

/**
 * The visible cell is a hexagon and the element under it a rectangle, so a press in the notch between two rows must
 * land on the cell it looks like rather than on whichever rectangle is later in the document.
 */
const CORNER_ACROSS = 0.08;
const CORNER_DOWN = 0.92;

test("a press in the notch between two cells lands on the one it looks like", async ({ page, mount }) => {
    await mount(`${STORY}/Honeycomb`);

    const cells = page.locator(tab("honeycomb"));
    const upper = cells.first();
    const elsewhere = cells.last();

    await elsewhere.click();
    expect(await readout(page, "honeycomb"), "start from a cell other than the one being aimed past").toBe(
        `selected: ${await elsewhere.textContent()}`,
    );

    const cornerBox = (await upper.boundingBox())!;

    await page.mouse.click(cornerBox.x + cornerBox.width * CORNER_ACROSS, cornerBox.y + cornerBox.height * CORNER_DOWN);

    expect(
        await readout(page, "honeycomb"),
        "the bottom-left corner of the first cell's rectangle is outside its hexagon, so nothing there selects it",
    ).toBe(`selected: ${await elsewhere.textContent()}`);
});

test.describe("right to left", () => {
    test("the left arrow moves to the next tab and the right arrow to the previous one", async ({ page, mount }) => {
        await mount(`${STORY}/RightToLeft`);

        expect(
            (await box(page.locator(named("rtl", "Source")))).centerX,
            "the second tab is drawn to the left of the first",
        ).toBeLessThan((await box(page.locator(named("rtl", "Render")))).centerX);

        await page.locator(`${tab("rtl")}[tabindex="0"]`).focus();
        expect(await activeText(page), "focus starts on the selected tab").toBe("Render");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "ArrowLeft walks forward, toward where the next tab is drawn").toBe("Source");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and still steps over the disabled tab").toBe("Export");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "ArrowRight walks back").toBe("Source");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page)).toBe("Render");

        await page.keyboard.press("End");
        expect(await activeText(page), "End is still the last tab").toBe("Export");

        await page.keyboard.press("Home");
        expect(await activeText(page), "and Home the first").toBe("Render");
    });

    test("a left-to-right list on the same page keeps its own direction", async ({ page, mount }) => {
        await mount(`${STORY}/RightToLeft`);

        await page.locator(`${tab("rtl")}[tabindex="0"]`).focus();
        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "the right-to-left list has been walked").toBe("Source");

        expect(
            (await box(page.locator(named("row", "Source")))).centerX,
            "the plain row is drawn from the left",
        ).toBeGreaterThan((await box(page.locator(named("row", "Render")))).centerX);

        await page.locator(`${tab("row")}[tabindex="0"]`).focus();
        expect(await activeText(page)).toBe("Render");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "and its right arrow still walks forward").toBe("Source");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and its left arrow back").toBe("Render");
    });
});
