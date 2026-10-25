import { type Locator, type Page, expect, test } from "@playwright/test";

import { accessibleText, activeMatches, docsDemo, docsSettled, prop, tabIndex } from "./helpers";

/**
 * `Button`'s page is its Docs view. A plain button, a disabled one, a reachable disabled one and an errored one are
 * the first two examples, each state behind a knob, so the specs that drive those states drive the knobs. The basic
 * button counts its own clicks in its caption, as the number at the end.
 */
const DOCS = "/src/App/Pages/ButtonPage/Docs";

const BASIC = `${docsDemo(DOCS, "Basic")} button`;
const TOOLTIP_BUTTON = `${docsDemo(DOCS, "Tooltip")} button`;
const DECORATED = `${docsDemo(DOCS, "Decorated")} button`;
const TOOLTIP = '[role="tooltip"]';

const basicButton = (page: Page) => page.locator(BASIC);

const tooltipButton = (page: Page) => page.locator(TOOLTIP_BUTTON);

const knob = (page: Page, key: string): Locator => page.locator(`${prop(key)} input`);

const HOVER_SHOW_DELAY_MARGIN_MS = 1500;

test.beforeEach(async ({ page }) => {
    await page.goto("/button/docs");
    await expect(basicButton(page)).toBeVisible();
    await docsSettled(page);
});

test("no control uses the native disabled attribute", async ({ page }) => {
    await knob(page, "isDisabled").click();
    await knob(page, "tooltipIsDisabled").click();

    await expect(page.locator("button[disabled]"), "not one button on the page carries native disabled").toHaveCount(0);
});

test("a plain button activates by pointer and by both keys", async ({ page }) => {
    const button = basicButton(page);

    await button.click();
    await expect(button, "a click reaches the handler").toHaveText(/\b1$/);

    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button, "Enter activates it as a native button does").toHaveText(/\b2$/);

    await page.keyboard.press(" ");
    await expect(button, "and so does Space").toHaveText(/\b3$/);
});

test("pressed state is announced only by a button that has one", async ({ page }) => {
    await expect(
        tooltipButton(page),
        "a button with no pressed state omits aria-pressed rather than claiming it is unpressed",
    ).not.toHaveAttribute("aria-pressed");

    await expect(page.locator(DECORATED), "one that has the state reports it").toHaveAttribute("aria-pressed", "false");

    await page.locator(DECORATED).click();
    await expect(page.locator(DECORATED), "and flips it on activation, as its owner's signal does").toHaveAttribute(
        "aria-pressed",
        "true",
    );
});

test("a button with a tooltip reveals and announces it", async ({ page }) => {
    await tooltipButton(page).hover();

    await expect(page.locator(TOOLTIP), "hovering a button with a tooltip reveals it").toBeVisible();
    await expect(tooltipButton(page), "and the tooltip wires itself up as the button's description").toHaveAttribute(
        "aria-describedby",
        /.+/,
    );
});

test("a disabled button is disabled through ARIA and gated in JS", async ({ page }) => {
    const button = basicButton(page);

    await knob(page, "isDisabled").click();

    await expect(button, "a disabled button says so through ARIA").toHaveAttribute("aria-disabled", "true");
    await expect(button, "and never through the native attribute").not.toHaveAttribute("disabled");
    expect(await tabIndex(button), "it is out of the tab order").toBe(-1);

    await button.click({ force: true });
    await expect(button, "clicking it does not reach the handler").toHaveText(/\b0$/);
    expect(await activeMatches(page, BASIC), "and does not even focus it").toBe(false);
});

test("a disabled button shows its tooltip only when it is kept reachable", async ({ page }) => {
    const button = tooltipButton(page);

    await knob(page, "tooltipIsDisabled").click();

    await expect(button, "a disabled button says so through ARIA").toHaveAttribute("aria-disabled", "true");
    await expect(button, "and never through the native attribute").not.toHaveAttribute("disabled");
    expect(await tabIndex(button), "left alone it is out of the tab order").toBe(-1);

    await button.hover();
    await page.waitForTimeout(HOVER_SHOW_DELAY_MARGIN_MS);
    await expect(page.locator(TOOLTIP), "and shows no tooltip by pointer either").toHaveCount(0);

    await knob(page, "tooltipIsReachableWhenDisabled").click();

    await expect(button, "kept reachable it carries the same ARIA state").toHaveAttribute("aria-disabled", "true");
    expect(await tabIndex(button), "what differs is that it keeps its tab stop").toBe(0);

    await page.keyboard.press("Shift");
    await button.focus();
    expect(await activeMatches(page, TOOLTIP_BUTTON), "so it can be focused").toBe(true);
    await expect(page.locator(TOOLTIP), "and its tooltip is read by keyboard").toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(TOOLTIP), "Escape puts it away").toHaveCount(0);

    await button.blur();
    await page.mouse.move(0, 0);
    await button.hover();
    await expect(page.locator(TOOLTIP), "and by pointer").toBeVisible();
});

test("an errored button still activates", async ({ page }) => {
    const button = basicButton(page);

    await knob(page, "hasError").click();
    await button.click();

    await expect(button, "an ordinary click reaches the handler of a button in its error look").toHaveText(/\b1$/);
});

/**
 * "Hold to repeat": two icon buttons and a count between them. The arrows draw only a glyph, so their names come from
 * `ariaLabel`, and finding them by those names is the assertion that they have them. A key press steps once; a held
 * pointer steps once and then repeats until it lets go, and the click a pointer press ends with is not counted again.
 * The count is the demo's only text a screen reader would read, since the glyphs are hidden.
 */
const COUNTER = docsDemo(DOCS, "Repeating");
const REPEAT_HOLD_MS = 1_000;
const AFTER_RELEASE_MS = 400;

const counted = async (page: Page) => Number(await accessibleText(page.locator(COUNTER)));

test("the counter's arrows are named, and each key press steps once", async ({ page }) => {
    const increase = page.locator(COUNTER).getByRole("button", { name: "Increase" });
    const decrease = page.locator(COUNTER).getByRole("button", { name: "Decrease" });
    const start = await counted(page);

    await increase.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press(" ");

    expect(await counted(page), "Enter and Space each step up once").toBe(start + 2);

    await decrease.focus();
    await page.keyboard.press("Enter");

    expect(await counted(page), "and the other arrow steps down").toBe(start + 1);
});

test("holding an arrow down repeats, and letting go stops it", async ({ page }) => {
    const increase = page.locator(COUNTER).getByRole("button", { name: "Increase" });
    const start = await counted(page);

    await increase.scrollIntoViewIfNeeded();

    const box = (await increase.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(REPEAT_HOLD_MS);
    await page.mouse.up();

    const released = await counted(page);

    expect(released, "a held press steps more than once").toBeGreaterThan(start + 2);

    await page.waitForTimeout(AFTER_RELEASE_MS);

    expect(await counted(page), "and nothing more arrives once it is let go").toBe(released);
});
