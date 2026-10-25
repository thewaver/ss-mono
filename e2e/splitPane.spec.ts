import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, inlineStyle, prop } from "./helpers";

const DOCS = "/src/App/Pages/SplitPanePage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const BOUNDED = docsDemo(DOCS, "Bounded");
const TRIPLE = docsDemo(DOCS, "Triple");
const CRAMPED = docsDemo(DOCS, "Cramped");

const root = (scope: string) => `${scope} [role="group"]`;
const gutter = (scope: string) => `${scope} [role="separator"]`;

/**
 * Every example but the cramped one prints its ratios beneath it, in whole percents, because a share is not
 * something a reader can measure off the screen. The spec reads them back as numbers so it can ask how they moved
 * rather than what they are.
 */
const ratiosOf = async (page: Page, scope: string) => {
    const text = (await page.locator(`${scope} [data-readout]`).textContent()) ?? "";

    return [...text.matchAll(/(\d+)%/g)].map((match) => Number(match[1]));
};

const chooseProp = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();

    const list = page.locator(`[id="${await picker.getAttribute("aria-controls")}"]`);

    await list.getByRole("option", { name, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/split-pane/docs");
    await expect(page.locator(root(BASIC))).toBeVisible();
    await docsSettled(page);
});

/**
 * The template is the whole component, so it is what gets asserted. Ratios are written as `fr`-free
 * `calc()` shares of the container minus its gutters, and a pane's bounds are a `clamp()` around that
 * share — which is why a window resize needs no code here at all: the browser recomputes, and the stored
 * ratios never move.
 */
test("the split is a grid template built from the ratios", async ({ page }) => {
    const [first] = await ratiosOf(page, BASIC);
    const gutterSize = await page.locator(`${prop("gutterSize")} input`).inputValue();
    const template = await inlineStyle(page.locator(root(BASIC)), "grid-template-columns");

    expect(template, "the ratio becomes a share of the container minus its gutters").toContain(`${first}%`);
    expect(template, "and the gutter is a fixed track between the panes, as wide as the knob says").toContain(
        `${gutterSize}px`,
    );

    await chooseProp(page, "orientation", "vertical");

    await expect
        .poll(() => inlineStyle(page.locator(root(BASIC)), "grid-template-rows"), {
            message: "the other axis writes rows instead of columns",
        })
        .not.toBe("");
    expect(
        await inlineStyle(page.locator(root(BASIC)), "grid-template-columns"),
        "and writes nothing on the axis it is not using",
    ).toBe("");
});

test("a bounded pane is a clamp around its share", async ({ page }) => {
    const template = await inlineStyle(page.locator(root(BOUNDED)), "grid-template-columns");

    expect(template, "both bounds land in the track, the minimum first and the maximum as the ceiling").toMatch(
        /clamp\(\d+px, .+, \d+px\)/,
    );
});

/**
 * A separator carries a value, so it is announced as one: the published role wants `aria-valuenow` with a
 * range, and here that value is the boundary as a percentage of the whole. The keyboard moves it without
 * a pointer, which is the half a drag-only implementation leaves out.
 */
test("a gutter is a separator with a value, and arrows move it", async ({ page }) => {
    const first = page.locator(gutter(BASIC));
    const [start] = await ratiosOf(page, BASIC);

    await expect(first, "the separator states which way it splits").toHaveAttribute("aria-orientation", "vertical");
    await expect(first, "and where it currently sits, which is the first pane's share").toHaveAttribute(
        "aria-valuenow",
        String(start),
    );
    await expect(first).toHaveAttribute("aria-valuemin", "0");
    await expect(first).toHaveAttribute("aria-valuemax", "100");

    await first.focus();
    await page.keyboard.press("ArrowRight");

    const [grown, rest] = await ratiosOf(page, BASIC);
    const step = grown - start;

    expect(step, "an arrow moves the boundary by a step").toBeGreaterThan(0);
    expect(grown + rest, "and the two panes trade what one gains").toBe(100);

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");

    const [shrunk] = await ratiosOf(page, BASIC);

    expect(shrunk, "and back the other way, by the same step").toBe(start - step);
});

test("a stacked split takes the other pair of arrows", async ({ page }) => {
    await chooseProp(page, "orientation", "vertical");

    const first = page.locator(gutter(BASIC));

    await expect(first, "a stacked split separates horizontally").toHaveAttribute("aria-orientation", "horizontal");

    const [start] = await ratiosOf(page, BASIC);

    await first.focus();
    await page.keyboard.press("ArrowRight");
    expect((await ratiosOf(page, BASIC))[0], "the cross-axis arrows do nothing").toBe(start);

    await page.keyboard.press("ArrowDown");
    expect((await ratiosOf(page, BASIC))[0], "and its own axis moves it").toBeGreaterThan(start);
});

/**
 * With three panes there are two separators, and moving one must leave the far pane alone — otherwise a
 * drag at one end quietly reflows the whole row. The two neighbors trade their share and the total is
 * conserved, which is what keeps the ratios summing to one without a normalization pass.
 */
test("a gutter moves its two neighbors and leaves the rest alone", async ({ page }) => {
    await expect(page.locator(gutter(TRIPLE)), "two separators for three panes").toHaveCount(2);

    const before = await ratiosOf(page, TRIPLE);

    await page.locator(gutter(TRIPLE)).first().focus();
    await page.keyboard.press("ArrowRight");

    const after = await ratiosOf(page, TRIPLE);

    expect(after[0], "the first pane grows").toBeGreaterThan(before[0]);
    expect(after[0] + after[1], "by what its neighbor gives up").toBe(before[0] + before[1]);
    expect(after[2], "and the third is untouched").toBe(before[2]);
});

test("a disabled split is out of the tab order and refuses the keyboard", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();

    const first = page.locator(gutter(BASIC));

    await expect(first, "the separator says it is disabled without the native attribute").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(first, "and leaves the tab order entirely, since there is nothing to read on it").toHaveAttribute(
        "tabindex",
        "-1",
    );

    const before = await ratiosOf(page, BASIC);

    await first.evaluate((element) => (element as HTMLElement).focus());
    await page.keyboard.press("ArrowRight");
    expect(await ratiosOf(page, BASIC), "so the arrows move nothing").toEqual(before);
});

/**
 * The accepted behavior, pinned so that a later change has to break it deliberately. Two minimums that
 * cannot both fit inside the box are not arbitrated: grid honors both floors and the row overflows its
 * container. That is inherited rather than designed, and the decision was to inherit it whole.
 */
test("minimums that cannot fit overflow rather than shrink", async ({ page }) => {
    const overflow = await page.locator(root(CRAMPED)).evaluate((element) => ({
        content: element.scrollWidth,
        box: element.clientWidth,
    }));

    expect(
        overflow.content,
        "the panes keep their floors, so the row of tracks is wider than the box holding it",
    ).toBeGreaterThan(overflow.box);
});

/**
 * The bounds are declared in pixels and the value is a ratio, so the two have to be reconciled somewhere.
 * They used to be reconciled only in CSS, which meant the drag kept writing ratios the `clamp()` then
 * refused: past a pane's floor the pane stopped moving, the gutter carried on under the pointer, and the
 * tracks added up to more than the container. Converting each bound into a ratio against the measured
 * container and clamping the drag there keeps the stored value inside what CSS will honor, so the panes
 * always add up to the box.
 *
 * The floors are the fixtures' own `minPx` — 80px for each of the three panes, 160px for the bounded content
 * pane — read here as data, as an option's name would be.
 */
const OVERSHOOT_PX = 2000;
const TRIPLE_FLOOR_PX = 80;
const BOUNDED_CONTENT_FLOOR_PX = 160;

test("a drag stops where the pixel bounds do, rather than writing past them", async ({ page }) => {
    const drag = async (scope: string, index: number, dx: number) => {
        const handle = page.locator(gutter(scope)).nth(index);

        await handle.scrollIntoViewIfNeeded();

        const box = (await handle.boundingBox())!;

        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.5 + dx, box.y + box.height * 0.5, { steps: 10 });
        await page.mouse.up();
    };

    const tracks = (scope: string) =>
        page.locator(root(scope)).evaluate((element) => ({
            box: (element as HTMLElement).offsetWidth,
            sum: Array.from(element.children).reduce((total, child) => total + (child as HTMLElement).offsetWidth, 0),
            panes: Array.from(element.children)
                .filter((child) => child.getAttribute("role") !== "separator")
                .map((child) => (child as HTMLElement).offsetWidth),
        }));

    await drag(TRIPLE, 1, -OVERSHOOT_PX);

    const triple = await tracks(TRIPLE);

    expect(triple.panes[1], "the middle pane stops on its floor").toBe(TRIPLE_FLOOR_PX);
    expect(triple.sum, "and the tracks still add up to the container rather than spilling out of it").toBe(triple.box);

    await drag(BOUNDED, 0, OVERSHOOT_PX);

    const bounded = await tracks(BOUNDED);

    expect(bounded.panes[1], "a drag the other way stops on the neighbor's floor instead").toBe(
        BOUNDED_CONTENT_FLOOR_PX,
    );
    expect(bounded.sum).toBe(bounded.box);
});
