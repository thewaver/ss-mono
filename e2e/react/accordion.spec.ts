import { type Page, expect, test } from "@playwright/test";

import { activeText, isScrolling, offsetHeight, scrollTop, tabIndex, waitUntilStill } from "../helpers";

/**
 * The React `Accordion` and the `Collapsible` it is built from. The cases follow `e2e/accordion.spec.ts`, which
 * covers the Solid ones, so the two frameworks are held to the same behavior. The sections story starts with its
 * first section open and its last one disabled, as the Playground's does, and writes the open list out as JSON.
 */
const STORY = "Essentials/Accordions/Accordion";
const COLLAPSIBLE_STORY = "Essentials/Accordions/Collapsible/Panel";

const header = "button[aria-expanded]";
const panel = '[role="region"]';

const TRANSITION_TIMEOUT_MS = 5_000;
const EDGE_TOLERANCE_PX = 2;

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`).textContent();

test("each section is a heading, a button and a region wired to each other", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    await expect(page.locator("h3"), "every header sits in a heading, so the page keeps an outline").toHaveCount(4);

    const controls = await page.locator(header).first().getAttribute("aria-controls");
    const labelledBy = await page.locator(panel).first().getAttribute("aria-labelledby");

    expect(
        await page.locator(`[id="${controls}"]`).getAttribute("role"),
        "the header points at the region it opens",
    ).toBe("region");
    expect(
        await page.locator(`[id="${labelledBy}"]`).getAttribute("aria-expanded"),
        "and the region points back at the header that names it",
    ).toBe("true");
});

test("a collapsed panel is inert and takes no height, while its content stays measurable", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    await expect(page.locator(panel).nth(1), "a collapsed panel is inert").toHaveAttribute("inert", "");
    expect(await offsetHeight(page.locator(panel).nth(1)), "and it takes no height").toBe(0);
    expect(
        await offsetHeight(page.locator(panel).nth(1).locator("> *")),
        "but the content inside it still has one, which is what the panel animates towards",
    ).toBeGreaterThan(0);
});

test("opening a section animates it to its content's own height", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    const target = await offsetHeight(page.locator(panel).nth(1).locator("> *"));

    await page.locator(header).nth(1).click();

    await expect(page.locator(header).nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(panel).nth(1)).not.toHaveAttribute("inert");
    await expect.poll(() => offsetHeight(page.locator(panel).nth(1)), { timeout: TRANSITION_TIMEOUT_MS }).toBe(target);
});

test("many stay open at once, and the owner's list says which", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    await page.locator(header).nth(1).click();
    await page.locator(header).nth(2).click();

    await expect
        .poll(() => readout(page, "expanded"), { message: "every opened section is in the list" })
        .toBe('["Shipping","Returns","Warranty"]');

    await page.locator(header).nth(0).click();

    await expect
        .poll(() => readout(page, "expanded"), { message: "and closing one removes only that one" })
        .toBe('["Returns","Warranty"]');
});

test("an accordion left to itself keeps its own list, starting closed", async ({ page, mount }) => {
    await mount(`${STORY}/Uncontrolled`);

    await expect(page.locator(header).first()).toHaveAttribute("aria-expanded", "false");

    await page.locator(header).first().click();

    await expect(page.locator(header).first()).toHaveAttribute("aria-expanded", "true");
});

test("single-expand mode closes the previous section itself", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`, { isSingleExpand: true, initial: [] });

    await page.locator(header).nth(0).click();
    await expect.poll(() => readout(page, "expanded")).toBe('["Shipping"]');

    await page.locator(header).nth(1).click();
    await expect
        .poll(() => readout(page, "expanded"), { message: "the component drops the previous value" })
        .toBe('["Returns"]');

    await expect.poll(() => offsetHeight(page.locator(panel).nth(0)), { timeout: TRANSITION_TIMEOUT_MS }).toBe(0);
});

test("a required expansion refuses to close the last open section", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`, { isSingleExpand: true, isExpandRequired: true });

    await expect.poll(() => readout(page, "expanded"), { message: "it starts with one open" }).toBe('["Shipping"]');

    await page.locator(header).nth(0).click();

    await expect(page.locator(header).nth(0), "the header still reports it open").toHaveAttribute(
        "aria-expanded",
        "true",
    );
    expect(await readout(page, "expanded"), "and pressing that header left it open").toBe('["Shipping"]');

    await page.locator(header).nth(1).click();
    await expect.poll(() => readout(page, "expanded"), { message: "the way out is into another" }).toBe('["Returns"]');

    await page.locator(header).nth(1).click();
    await expect(page.locator(header).nth(1)).toHaveAttribute("aria-expanded", "true");
    expect(await readout(page, "expanded"), "which is then the one that cannot be closed").toBe('["Returns"]');
});

test("an open panel follows content that appears after it opened", async ({ page, mount }) => {
    await mount(`${STORY}/Growing`);

    await expect.poll(() => offsetHeight(page.locator(panel).first())).toBeGreaterThan(0);
    await waitUntilStill(page.locator(panel).first());

    const before = await offsetHeight(page.locator(panel).first());

    await page.locator("#addALine").click();

    await expect
        .poll(() => offsetHeight(page.locator(panel).first()), { timeout: TRANSITION_TIMEOUT_MS })
        .toBeGreaterThan(before);
});

test("arrows and the edge keys walk the headers, skipping the disabled one", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    await page.locator(header).nth(0).focus();

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "ArrowDown moves to the next header").toContain("Returns");

    await page.keyboard.press("End");
    expect(await activeText(page), "End lands on the last enabled header, not the disabled one after it").toContain(
        "Warranty",
    );

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "and the walk wraps past the disabled header rather than stopping").toContain(
        "Shipping",
    );
});

test("a disabled header carries no native attribute and cannot open its panel", async ({ page, mount }) => {
    await mount(`${STORY}/Sections`);

    await expect(page.locator("button[disabled]"), "no header uses the native disabled attribute").toHaveCount(0);
    await expect(page.locator(header).nth(3)).toHaveAttribute("aria-disabled", "true");
    expect(await tabIndex(page.locator(header).nth(3)), "and it is out of the tab order").toBe(-1);

    await page.locator(header).nth(3).dispatchEvent("click");

    await expect(page.locator(header).nth(3), "clicking it changes nothing").toHaveAttribute("aria-expanded", "false");
    expect(await offsetHeight(page.locator(panel).nth(3))).toBe(0);
});

test("a lone Collapsible is a trigger and a panel and nothing else", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY);

    const trigger = page.locator("button");

    await expect(trigger, "collapsed to begin with").toHaveAttribute("aria-expanded", "false");
    await expect(trigger, "and pointing at the panel it controls").toHaveAttribute("aria-controls", /.+/);
    await expect(
        page.locator("h1, h2, h3, h4, h5, h6"),
        "no heading element, because a show-more is not a section of the document",
    ).toHaveCount(0);
    await expect(page.locator(panel), "and no region landmark either, for the same reason").toHaveCount(0);
});

test("a Collapsible given a heading level sits in that heading", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY, { headingLevel: 9 });

    await expect(page.locator("h6 button"), "a level past six is held to the deepest heading").toHaveCount(1);
});

test("it opens and closes itself, writing the boolean its owner handed over", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY);

    const trigger = page.locator("button");

    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-readout="expanded"]'), "the owner's own state is what moved").toHaveText(
        "expanded: true",
    );

    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator('[data-readout="expanded"]')).toHaveText("expanded: false");
});

test("the panel animates to its content's measured height, and is inert while closed", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY);

    const panelId = await page.locator("button").getAttribute("aria-controls");
    const panelLocator = page.locator(`[id="${panelId}"]`);

    await expect(panelLocator, "a closed panel is out of the tab order and the accessibility tree").toHaveAttribute(
        "inert",
        "",
    );
    expect(await offsetHeight(panelLocator), "and has no height").toBe(0);

    const contentHeight = await offsetHeight(panelLocator.locator("> *"));

    expect(contentHeight, "while its content is still built, and measurable").toBeGreaterThan(0);

    await page.locator("button").click();

    await expect
        .poll(() => offsetHeight(panelLocator), { message: "opening animates the panel to that measured height" })
        .toBe(contentHeight);
    await expect(panelLocator, "and it stops being inert").not.toHaveAttribute("inert", "");
});

test("a sideways panel grows its width rather than its height", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY, { side: "right" });

    const panelId = await page.locator("button").getAttribute("aria-controls");
    const width = () => page.locator(`[id="${panelId}"]`).evaluate((element) => (element as HTMLElement).offsetWidth);

    expect(await width(), "closed, it has no width").toBe(0);

    await page.locator("button").click();

    await expect.poll(width, { message: "opening it uncovers its contents across" }).toBeGreaterThan(0);
});

test("arrow keys do nothing to a lone panel, because it is not part of a set", async ({ page, mount }) => {
    await mount(COLLAPSIBLE_STORY);

    await page.locator("button").focus();
    await page.keyboard.press("ArrowDown");

    expect(await activeText(page), "focus stays where it was rather than walking to a sibling").toContain("Show more");
});

const scrollBox = (page: Page) => page.locator("[data-scroll-box]");

const openAndSettle = async (page: Page, index: number) => {
    await expect
        .poll(() => isScrolling(scrollBox(page)), { message: "the box has more in it than it can show" })
        .toBe(true);

    const target = await offsetHeight(page.locator(panel).nth(index).locator("> *"));

    await page.locator(header).nth(index).click();
    await expect
        .poll(() => offsetHeight(page.locator(panel).nth(index)), { timeout: TRANSITION_TIMEOUT_MS })
        .toBe(target);
    await waitUntilStill(page.locator(panel).nth(index));
};

test("opening a section below the fold brings it into view", { tag: "@solo" }, async ({ page, mount }) => {
    await mount(`${STORY}/Scrolled`);

    expect(await scrollTop(scrollBox(page)), "nothing has scrolled yet").toBe(0);

    await openAndSettle(page, 2);

    expect(await scrollTop(scrollBox(page)), "the box scrolled to reach the section").toBeGreaterThan(0);

    const box = (await scrollBox(page).boundingBox())!;
    const opened = (await page.locator(panel).nth(2).boundingBox())!;

    expect(opened.y + opened.height, "and the whole of the panel is inside the box").toBeLessThanOrEqual(
        box.y + box.height + EDGE_TOLERANCE_PX,
    );
});

test(
    "a section taller than the box keeps the pressed header in view rather than scrolling past it",
    { tag: "@solo" },
    async ({ page, mount }) => {
        await mount(`${STORY}/Scrolled`);

        await openAndSettle(page, 3);

        const box = (await scrollBox(page).boundingBox())!;
        const opened = (await page.locator(panel).nth(3).boundingBox())!;
        const pressed = (await page.locator(header).nth(3).boundingBox())!;

        expect(opened.height, "the panel really is more than the box can show").toBeGreaterThan(box.height);
        expect(pressed.y, "the header is still inside the box").toBeGreaterThanOrEqual(box.y - EDGE_TOLERANCE_PX);
        expect(pressed.y, "and sits at its top, so as much of the panel as fits is showing").toBeLessThan(
            box.y + pressed.height,
        );
    },
);

test("a lazy section builds nothing until it is opened, and still animates when it is", async ({ page, mount }) => {
    await mount(`${STORY}/Deferred`);

    await expect(page.locator("[data-built]"), "no panel is in the page to begin with").toHaveCount(0);
    expect(
        await offsetHeight(page.locator(panel).nth(0).locator("> *")),
        "and the collapsed panel has nothing to measure, which is the point",
    ).toBe(0);

    await page.locator(header).nth(0).click();

    const midway = await offsetHeight(page.locator(panel).nth(0));

    await expect
        .poll(() => offsetHeight(page.locator(panel).nth(0)), { timeout: TRANSITION_TIMEOUT_MS })
        .toBeGreaterThan(0);
    await waitUntilStill(page.locator(panel).nth(0));

    const opened = await offsetHeight(page.locator(panel).nth(0));

    expect(midway, "the first frame is still short of the height it is heading for").toBeLessThan(opened);
    expect(await readout(page, "built"), "and only the opened section was built").toBe('["Shipping"]');
});

test("and keeps it once built, so closing a lazy section does not discard what is inside it", async ({
    page,
    mount,
}) => {
    await mount(`${STORY}/Deferred`);

    await page.locator(header).nth(0).click();

    await expect(page.locator('[data-built="Shipping"]').first()).toBeVisible();

    const built = await page.locator("[data-built]").count();

    await page.locator(header).nth(0).click();

    await expect.poll(() => offsetHeight(page.locator(panel).nth(0)), { timeout: TRANSITION_TIMEOUT_MS }).toBe(0);
    await expect(
        page.locator("[data-built]"),
        "the content is still there behind the collapsed panel, so anything in it survives",
    ).toHaveCount(built);
    await expect(page.locator('[data-built="Returns"]'), "and a section nobody opened is still unbuilt").toHaveCount(0);
});
