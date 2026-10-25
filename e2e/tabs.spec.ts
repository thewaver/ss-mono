import { type Page, expect, test } from "@playwright/test";

import {
    activeText,
    centerDistance,
    computedStyle,
    docsDemo,
    docsSettled,
    inlineStyle,
    prop,
    tabIndex,
    tagName,
} from "./helpers";

/**
 * Every example on the Docs page holds its own selection and shows it only by which tab is selected, so the
 * selection is read off `aria-selected` — the same thing a screen reader goes by. Every locator is scoped to its own
 * example. The disabled-tab example holds a disabled entry in the middle rather than at an edge, which is the case a
 * walk can get wrong in both directions at once; the Basic example's tabs are all enabled, as the page's own words
 * say, and its knobs turn it into a column or disable all of it.
 */
const DOCS = "/src/App/Pages/TabsPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const DISABLED_TAB = docsDemo(DOCS, "DisabledTab");
const LINKS = docsDemo(DOCS, "Links");
const CLEARABLE = docsDemo(DOCS, "Clearable");
const AUTOMATIC = docsDemo(DOCS, "Automatic");
const HOVER_PILL = docsDemo(DOCS, "HoverPill");
const HONEYCOMB = docsDemo(DOCS, "Honeycomb");

const list = (scope: string) => `${scope} [role="tablist"]`;
const tab = (scope: string) => `${scope} [role="tab"]`;

/** The floater is the library's box; the painter inside it is the consumer's, so the geometry is one level up. */
const floater = (scope: string) => `${scope} [data-floater]`;

const FLOATER_TIMEOUT_MS = 5_000;

const selectedText = async (page: Page, scope: string) =>
    ((await page.locator(`${tab(scope)}[aria-selected="true"]`).textContent()) ?? "").trim();

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

const pickKnobOption = async (page: Page, key: string, option: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: option }).first().click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator(tab(BASIC)).first()).toBeVisible();
    await docsSettled(page);
});

test("a tab list is one tab stop, and it sits on the selected tab", async ({ page }) => {
    await expect(page.locator(tab(DISABLED_TAB)), "the disabled tab is still rendered and still a tab").toHaveCount(4);
    await expect(page.locator(`${tab(DISABLED_TAB)}[aria-disabled="true"]`), "and it says so with aria").toHaveCount(1);

    await expect(page.locator(`${tab(BASIC)}[tabindex="0"]`), "exactly one tab holds the tab stop").toHaveCount(1);
    await expect(page.locator(`${tab(BASIC)}[tabindex="0"]`), "which is the selected one").toHaveAttribute(
        "aria-selected",
        "true",
    );
    expect(await tabIndex(page.locator(tab(BASIC)).nth(1)), "every other tab is reachable only by arrow").toBe(-1);
});

test("the keyboard walks the row and steps over the disabled tab", async ({ page }) => {
    await page.locator(`${tab(DISABLED_TAB)}[tabindex="0"]`).focus();
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

test("a column list declares its orientation and takes the other pair of arrows", async ({ page }) => {
    await expect(
        page.locator(list(BASIC)),
        "a row says so, since the orientation prop is written through as given",
    ).toHaveAttribute("aria-orientation", "horizontal");

    await pickKnobOption(page, "orientation", "vertical");

    await expect(
        page.locator(list(BASIC)),
        "a stacked list has to say so, since a tab list is horizontal by default",
    ).toHaveAttribute("aria-orientation", "vertical");

    await page.locator(`${tab(BASIC)}[tabindex="0"]`).focus();
    expect(await activeText(page)).toBe("Render");

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "ArrowDown walks a column forward").toBe("Source");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "while the cross-axis arrows do nothing in a column").toBe("Source");

    await page.keyboard.press("ArrowUp");
    expect(await activeText(page), "and ArrowUp walks it back").toBe("Render");
});

test("moving the focus does not move the selection, and the tab itself does the selecting", async ({ page }) => {
    await page.locator(`${tab(BASIC)}[tabindex="0"]`).focus();
    await page.keyboard.press("ArrowRight");

    expect(await selectedText(page, BASIC), "an arrow moves the focus and nothing else").toBe("Render");

    await page.keyboard.press("Enter");
    expect(await selectedText(page, BASIC), "and the focused tab selects when it is activated").toBe("Source");

    await page.locator(tab(BASIC)).nth(2).click();
    expect(await selectedText(page, BASIC), "a click does the same thing").toBe("Export");

    await page.locator(tab(DISABLED_TAB)).nth(3).click();
    await page.locator(tab(DISABLED_TAB)).nth(2).click({ force: true });
    expect(await selectedText(page, DISABLED_TAB), "and a disabled tab refuses both").toBe("Export");
});

/**
 * The other half of the published pattern: arrowing onto a tab selects it as it lands. Manual is still the
 * default, because a panel that costs something to build should not be built on the way past — this is the opt-in
 * for the case where the panel is already there, and the section's knob starts on it.
 */
test("automatic activation takes the selection along with the focus", async ({ page }) => {
    await page.locator(`${tab(AUTOMATIC)}[tabindex="0"]`).focus();
    expect(await activeText(page)).toBe("Render");

    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "the focus moves as it always did").toBe("Source");
    expect(await selectedText(page, AUTOMATIC), "and the selection comes with it, unasked").toBe("Source");

    await page.keyboard.press("ArrowRight");

    expect(await selectedText(page, AUTOMATIC), "the disabled tab is skipped by both").toBe("Export");

    await page.keyboard.press("ArrowRight");

    expect(await selectedText(page, AUTOMATIC), "and the wrap selects the first tab again").toBe("Render");

    expect(await selectedText(page, BASIC), "the manual list above it is untouched").toBe("Render");
});

test("with automatic activation turned off, the arrows move the focus alone", async ({ page }) => {
    await knob(page, "hasAutoActivation").click();

    await page.locator(`${tab(AUTOMATIC)}[tabindex="0"]`).focus();
    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "the focus moves").toBe("Source");
    expect(await selectedText(page, AUTOMATIC), "and the selection stays where it was").toBe("Render");
});

test("a tab and its panel point at each other, and the pair moves with the selection", async ({ page }) => {
    const controls = await page.locator(`${tab(BASIC)}[aria-selected="true"]`).getAttribute("aria-controls");
    const panel = page.locator(`#${controls}`);

    expect(await panel.getAttribute("role"), "the selected tab points at a real panel").toBe("tabpanel");
    expect(
        await panel.getAttribute("aria-labelledby"),
        "and the panel points back at the tab, so a reader arriving in it knows which one they are in",
    ).toBe(await page.locator(`${tab(BASIC)}[aria-selected="true"]`).getAttribute("id"));
    expect(await tabIndex(panel), "a panel of plain prose is focusable, since nothing inside it can be").toBe(0);

    await page.locator(tab(BASIC)).nth(2).click();

    const next = await page.locator(`${tab(BASIC)}[aria-selected="true"]`).getAttribute("aria-controls");

    expect(next, "selecting another tab swaps in that tab's panel").not.toBe(controls);
    await expect(page.locator(`#${next}`)).toHaveAttribute("role", "tabpanel");

    await expect(
        page.locator(tab(LINKS)).first(),
        "a list with no panel behind it says nothing rather than pointing at a missing one",
    ).not.toHaveAttribute("aria-controls");
});

test("the floater follows the selected tab, over a gutter that spans the list", async ({ page }) => {
    await expect(
        page.locator(`${list(BASIC)} [data-gutter]`),
        "the gutter is painted once behind the list",
    ).toHaveCount(1);

    const box = page.locator(floater(BASIC)).locator("..");
    const before = await inlineStyle(box, "left");

    expect(before, "the floater is placed off a real measurement rather than left at zero").not.toBe("");

    await page.locator(tab(BASIC)).nth(2).click();

    await expect.poll(() => inlineStyle(box, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before);
});

/**
 * Losing the selection is not the same as losing the floater: the painter is handed a target of `0` and
 * has to be given the time it was promised to reach it, so the element stays in the document while the
 * transition runs and goes only once it has. That example sets a deliberately long duration, which is
 * what makes the middle of it observable rather than a race.
 *
 * The class the painter toggles is hashed by the stylesheet compiler, so the state is read off the
 * computed transform instead — `SHOWN_TRANSFORM` is `scaleX(1)`, and anything else means the painter is
 * on its way out. An element that vanished the moment the selection went would fail the first
 * assertion by not being there to measure; one that never left would fail the second.
 *
 * The last assertion is about where it returns rather than whether it does. The position the marker
 * animates out at has to survive the exit and must not survive past it: a list that kept it would bring
 * the marker back where it left and slide it across to the new tab, over the same long duration, which
 * is watchable and wrong. Both boxes are measured the same way, so the viewport's scale divides out and
 * the tolerance only has to absorb the box's own padding.
 */
const SHOWN_TRANSFORM = "matrix(1, 0, 0, 1, 0, 0)";
const RETURN_TOLERANCE_PX = 4;

test("the floater plays itself out before it goes, and back in when a selection returns", async ({ page }) => {
    const painted = page.locator(floater(CLEARABLE));

    await expect(painted, "a list with a selection paints one").toHaveCount(1);
    await expect.poll(() => computedStyle(painted, "transform"), { timeout: FLOATER_TIMEOUT_MS }).toBe(SHOWN_TRANSFORM);

    await page.locator("#clearSelection").click();

    await expect
        .poll(() => computedStyle(painted, "transform"), {
            message: "clearing the selection aims the painter at hidden while it is still in the document",
        })
        .not.toBe(SHOWN_TRANSFORM);
    await expect(page.locator(`${tab(CLEARABLE)}[aria-selected="true"]`), "and no tab is selected").toHaveCount(0);

    await expect(painted, "and it leaves once the transition it was promised has run").toHaveCount(0, {
        timeout: FLOATER_TIMEOUT_MS,
    });

    await page.locator(tab(CLEARABLE)).nth(2).click();

    await expect(painted, "selecting again brings it back").toHaveCount(1);

    const returned = (await painted.locator("..").boundingBox())!;
    const third = (await page.locator(tab(CLEARABLE)).nth(2).boundingBox())!;

    expect(
        Math.abs(returned.x - third.x),
        "and it comes back at the tab that was chosen, rather than at the one it left and sliding across",
    ).toBeLessThan(RETURN_TOLERANCE_PX);

    await expect.poll(() => computedStyle(painted, "transform")).toBe(SHOWN_TRANSFORM);
    expect(await selectedText(page, CLEARABLE)).toBe("Three");
});

test("an href makes the tab an anchor, and a link component replaces the element", async ({ page }) => {
    expect(await tagName(page.locator(tab(LINKS)).first()), "a tab with an href is a link, not a button").toBe("A");
    expect(await tagName(page.locator(tab(BASIC)).first()), "and one without stays a button").toBe("BUTTON");
    await expect(page.locator(tab(LINKS)).first()).toHaveAttribute("href", "#tabs-docs");
    await expect(
        page.locator(`${tab(LINKS)}[data-link-component]`),
        "the native anchor is used until a link component is given",
    ).toHaveCount(0);

    await knob(page, "hasLinkComponent").click();

    await expect(
        page.locator(`${tab(LINKS)}[data-link-component]`),
        "the consumer's own component renders every tab when one is given",
    ).toHaveCount(3);

    await page.locator(tab(LINKS)).nth(1).click();
    expect(await selectedText(page, LINKS), "and it still reports the selection").toBe("Guides");
});

test("a list with nothing enabled holds no tab stop at all", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator(`${tab(BASIC)}[aria-disabled="true"]`)).toHaveCount(3);
    await expect(
        page.locator(`${tab(BASIC)}[tabindex="0"]`),
        "with nowhere for the roving stop to land, the list drops out of the tab order",
    ).toHaveCount(0);

    const before = await selectedText(page, BASIC);

    await page.locator(tab(BASIC)).nth(1).click({ force: true });
    expect(await selectedText(page, BASIC), "and clicking changes nothing").toBe(before);
});

/**
 * The disabled-tab example's knob keeps Metrics reachable: the arrows then stop on it, so a screen reader names it
 * and says it is unavailable, and it still cannot be selected.
 */
test("a disabled tab kept reachable is a stop in the walk that selects nothing", async ({ page }) => {
    await knob(page, "isReachableWhenDisabled").click();

    await page.locator(`${tab(DISABLED_TAB)}[tabindex="0"]`).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    await expect(page.locator(tab(DISABLED_TAB)).nth(2), "the walk stops on the disabled tab").toBeFocused();

    await page.keyboard.press("Enter");
    expect(await selectedText(page, DISABLED_TAB), "and activating it selects nothing").toBe("Render");
});

/**
 * A honeycomb is the same tab list with a layout function added, and it is the first arrangement in the
 * library with no angle in it — the others are all a radius and a bearing. What is worth checking is that
 * the list is still a list: the pairing, the roving walk and the floater all belong to `Tabs` rather than
 * to the row it used to be drawn as, so none of them should notice.
 */
const placedBox = (scope: string) => `${scope} [role="presentation"][style*="left"]`;

/**
 * Placements are written as shares of the container's width, so the offsets can be read straight off the
 * boxes and compared with each other. Nothing here compares one against a number: what makes a honeycomb
 * a honeycomb is that the second row starts half a column in, and half is a relationship between the two
 * rows rather than a measurement of either.
 */
const placedOffsets = (page: Page, scope: string) =>
    page.locator(placedBox(scope)).evaluateAll((elements) =>
        elements.map((element) => {
            const style = element.getAttribute("style") ?? "";
            const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);

            return { left: at("left"), top: at("top") };
        }),
    );

test("a honeycomb is a box per tab, and the rows interlock rather than stacking", async ({ page }) => {
    await expect(page.locator(placedBox(HONEYCOMB))).toHaveCount(await page.locator(tab(HONEYCOMB)).count());
    await expect(page.locator(placedBox(BASIC)), "while a row places nothing").toHaveCount(0);

    const offsets = await placedOffsets(page, HONEYCOMB);
    const firstRow = offsets.filter((offset) => offset.top === offsets[0].top);
    const secondRow = offsets.filter((offset) => offset.top !== offsets[0].top);

    expect(firstRow.length, "the first row is filled before the second is started").toBeGreaterThan(1);
    expect(secondRow.length, "and there is a second").toBeGreaterThan(0);
    expect(
        secondRow[0].left - firstRow[0].left,
        "which starts half a column in, so each cell sits in the notch between the two above it",
    ).toBeCloseTo((firstRow[1].left - firstRow[0].left) * 0.5, 3);
});

test("a placed tab list is still a tab list: the pairing, the walk and the skip all hold", async ({ page }) => {
    const selected = page.locator(`${HONEYCOMB} [aria-selected="true"]`);

    await expect(selected, "one cell is selected and points at its panel").toHaveCount(1);
    await expect(page.locator(`${HONEYCOMB} [role="tabpanel"]`)).toHaveAttribute(
        "aria-labelledby",
        (await selected.getAttribute("id")) ?? "",
    );

    await page.locator(tab(HONEYCOMB)).first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(await activeText(page), "two steps from the first cell lands past the disabled one rather than on it").toBe(
        await page.locator(tab(HONEYCOMB)).nth(3).textContent(),
    );
});

test("the floater lands on the cell the layout chose, in both axes", async ({ page }) => {
    const box = page.locator(`${HONEYCOMB} [data-floater=""]`).locator("..");
    const before = { left: await inlineStyle(box, "left"), top: await inlineStyle(box, "top") };

    expect(before.left, "the floater is placed from the layout rather than left at zero").not.toBe("");

    await page.locator(tab(HONEYCOMB)).nth(4).click();

    await expect.poll(() => inlineStyle(box, "left"), { timeout: FLOATER_TIMEOUT_MS }).not.toBe(before.left);
    expect(
        await inlineStyle(box, "top"),
        "a cell on the second row is down as well as across, which a row would never have asked of it",
    ).not.toBe(before.top);
});

/**
 * The visible cell is a hexagon and the element under it is a rectangle, so the rectangles of two
 * interlocking rows overlap in the notches — a press in one would otherwise land on whichever cell
 * happens to be later in the document rather than on the one it looks like. The layout hands the box its
 * own shape and CSS Masking 1 says pointer events "must not be dispatched on the clipped-out (non-visible)
 * regions", so this presses a corner inside the rectangle and outside the hexagon and asks who answers.
 *
 * The corner is named as shares of the box rather than in pixels because the box is measured through the
 * `Viewport` scale. At `CORNER_DOWN` the cell's lower-left edge has traveled two thirds of the way across,
 * so `CORNER_ACROSS` is well outside the drawn shape while staying inside the element.
 */
const CORNER_ACROSS = 0.08;
const CORNER_DOWN = 0.92;

test("a press in the notch between two cells lands on the one it looks like", async ({ page }) => {
    const cells = page.locator(tab(HONEYCOMB));
    const upper = cells.first();
    const elsewhere = cells.last();
    const elsewhereText = ((await elsewhere.textContent()) ?? "").trim();

    await elsewhere.click();
    expect(await selectedText(page, HONEYCOMB), "start from a cell other than the one being aimed past").toBe(
        elsewhereText,
    );

    await upper.scrollIntoViewIfNeeded();

    const box = await upper.boundingBox();

    expect(box, "the first cell has a box to aim at").not.toBeNull();

    await page.mouse.click(box!.x + box!.width * CORNER_ACROSS, box!.y + box!.height * CORNER_DOWN);

    expect(
        await selectedText(page, HONEYCOMB),
        "the bottom-left corner of the first cell's rectangle is outside its hexagon, so nothing there selects it",
    ).toBe(elsewhereText);
});

/**
 * The highlight marker is a second floater beside the selection's: it follows the tab under the pointer, or the
 * focused tab while the pointer is elsewhere, and leaves the selection's marker where it was. With neither, it
 * plays out and goes.
 */
test("a second marker glides to the hovered or focused tab and leaves the selection's alone", async ({ page }) => {
    const highlight = page.locator(`${HOVER_PILL} [data-floater="highlight"]`);
    const highlightBox = highlight.locator("..");
    const tabs = page.locator(tab(HOVER_PILL));
    const selectionBox = page.locator(`${HOVER_PILL} [data-floater=""]`).locator("..");
    const selectionLeft = await inlineStyle(selectionBox, "left");

    await expect(highlight, "nothing is hovered or focused yet").toHaveCount(0);

    await tabs.nth(3).hover();
    await expect.poll(() => centerDistance(highlightBox, tabs.nth(3)), { timeout: FLOATER_TIMEOUT_MS }).toBeLessThan(2);

    await tabs.nth(1).hover();
    await expect.poll(() => centerDistance(highlightBox, tabs.nth(1)), { timeout: FLOATER_TIMEOUT_MS }).toBeLessThan(2);
    expect(await inlineStyle(selectionBox, "left"), "the selection's marker has not moved").toBe(selectionLeft);

    await page.mouse.move(0, 0);
    await expect(highlight, "with the pointer gone and nothing focused, the marker plays out and goes").toHaveCount(0, {
        timeout: FLOATER_TIMEOUT_MS,
    });

    await tabs.nth(0).focus();
    await expect.poll(() => centerDistance(highlightBox, tabs.nth(0)), { timeout: FLOATER_TIMEOUT_MS }).toBeLessThan(2);
});
