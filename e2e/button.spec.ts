import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, demo, prop, readout, tabIndex } from "./helpers";

const DECORATED = `${demo("decorated")} button`;
const PENDING = `${demo("pending")} button`;
const TOOLTIP = '[role="tooltip"]';

/**
 * A plain button, a disabled one, a reachable disabled one and an errored one are not examples of their own: they
 * are the Docs view's live examples, each state behind a knob. So the specs that drive those states drive the knobs
 * there, and find the example by the key of a knob it holds. The Docs view is in the Solid Playground only so far,
 * which is what the `@solid` tag keeps the other three from running against.
 */
const BASIC = `[data-docs-example]:has(${prop("isDisabled")}) [data-demo] button`;
const TOOLTIP_BUTTON = `[data-docs-example]:has(${prop("tooltipIsReachableWhenDisabled")}) [data-demo] button`;

const basicButton = (page: Page) => page.locator(BASIC);

const tooltipButton = (page: Page) => page.locator(TOOLTIP_BUTTON);

const knob = (page: Page, key: string): Locator => page.locator(`${prop(key)} input`);

const HOVER_SHOW_DELAY_MARGIN_MS = 1500;

test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("no control uses the native disabled attribute", async ({ page }) => {
    await expect(page.locator("button[disabled]"), "not one button on the page carries native disabled").toHaveCount(0);
});

test("a plain button activates by pointer and by both keys", async ({ page }) => {
    await page.goto("/button/docs");

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
        page.locator(PENDING),
        "a button with no pressed state omits aria-pressed rather than claiming it is unpressed",
    ).not.toHaveAttribute("aria-pressed");

    await expect(page.locator(DECORATED), "one that has the state reports it").toHaveAttribute("aria-pressed", "false");

    await page.locator(DECORATED).click();
    await expect(page.locator(DECORATED), "and flips it on activation").toHaveAttribute("aria-pressed", "true");
    expect(await readout(page, "decorated"), "with the owner's signal following").toContain("pressed: true");
});

test("a button with a tooltip reveals and announces it", async ({ page }) => {
    await page.locator(DECORATED).hover();

    await expect(page.locator(TOOLTIP), "hovering a button with a tooltip reveals it").toBeVisible();
    await expect(
        page.locator(DECORATED),
        "and the tooltip wires itself up as the button's description",
    ).toHaveAttribute("aria-describedby", /.+/);
});

test("a disabled button is disabled through ARIA and gated in JS", async ({ page }) => {
    await page.goto("/button/docs");

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
    await page.goto("/button/docs");

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
    await page.goto("/button/docs");

    const button = basicButton(page);

    await knob(page, "hasError").click();
    await button.click();

    await expect(button, "an ordinary click reaches the handler of a button in its error look").toHaveText(/\b1$/);
});

/**
 * The copy button's handler answers with the clipboard's own promise, so it exercises the one thing only
 * `Button` does with a promise: it holds the pending state until the write settles and refuses presses in
 * the meantime. The confirmation is checked the way the page gives it — the owner's count, the text that
 * actually landed on the clipboard, and a message in the shared live region — and the button's caption is
 * only ever compared with itself, so rewording "Copied" cannot turn this red.
 *
 * Headless Chromium refuses clipboard access unless the context is granted it, and the pending and failure
 * cases replace `writeText` before the page loads so the promise is the spec's to settle or reject.
 */
const COPY = `${demo("copy")} button`;
const COPY_TEXT = `${demo("copy")} code`;
const POLITE = 'body > [role="log"][aria-live="polite"]';
const ASSERTIVE = 'body > [role="log"][aria-live="assertive"]';

test.describe("a copy button", () => {
    test("puts the text it shows on the clipboard, confirms it for a while, and announces it", async ({
        page,
        context,
    }) => {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);

        const caption = (await page.locator(COPY).textContent()) ?? "";

        await page.locator(COPY).click();

        await expect.poll(() => readout(page, "copy"), "the owner hears of the copy once").toContain("copies: 1");
        expect(
            await page.evaluate(() => navigator.clipboard.readText()),
            "and the clipboard holds exactly the text beside the button",
        ).toBe(await page.locator(COPY_TEXT).textContent());
        await expect(page.locator(`${POLITE} > *`), "the copy is said out loud, politely").toHaveCount(1);
        await expect(page.locator(COPY), "the button confirms it by changing what it says").not.toHaveText(caption);
        await expect(page.locator(COPY), "and goes back to what it said once the moment has passed").toHaveText(
            caption,
            { timeout: 5_000 },
        );
    });

    test("is busy while the clipboard writes, keeps its focus, and refuses a second press", async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator.clipboard, "writeText", {
                value: () =>
                    new Promise<void>((resolve) => {
                        const probe = window as unknown as { finishCopy: () => void; copyCalls?: number };

                        probe.copyCalls = (probe.copyCalls ?? 0) + 1;
                        probe.finishCopy = resolve;
                    }),
            });
        });
        await page.reload();

        await page.locator(COPY).focus();
        await page.keyboard.press("Enter");

        await expect(page.locator(COPY), "a pending button says it is busy").toHaveAttribute("aria-busy", "true");
        await expect(page.locator(COPY), "rather than claiming it cannot be used").not.toHaveAttribute(
            "aria-disabled",
            "true",
        );
        expect(await activeMatches(page, COPY), "and the keyboard user stays where they pressed").toBe(true);

        await page.keyboard.press("Enter");
        await page.locator(COPY).click();

        expect(
            await page.evaluate(() => (window as unknown as { copyCalls: number }).copyCalls),
            "neither a second key press nor a click reaches the handler while the first write is running",
        ).toBe(1);

        await page.evaluate(() => (window as unknown as { finishCopy: () => void }).finishCopy());

        await expect(page.locator(COPY), "once the write settles it is no longer busy").not.toHaveAttribute(
            "aria-busy",
            "true",
        );
        expect(await readout(page, "copy"), "and the one write that ran is the one counted").toContain("copies: 1");
    });

    test("says a failed copy assertively and counts nothing", async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator.clipboard, "writeText", {
                value: () => Promise.reject(new Error("refused")),
            });
        });
        await page.reload();

        const caption = (await page.locator(COPY).textContent()) ?? "";

        await page.locator(COPY).click();

        await expect(page.locator(`${ASSERTIVE} > *`), "a failure interrupts, since the user must hear it").toHaveCount(
            1,
        );
        await expect(page.locator(`${POLITE} > *`), "and nothing claims it worked").toHaveCount(0);
        expect(await readout(page, "copy"), "the owner hears of no copy").toContain("copies: 0");
        await expect(page.locator(COPY), "and the button does not confirm one").toHaveText(caption);
    });
});

/**
 * "Hold to repeat": two icon buttons and a count between them. The arrows draw only a glyph, so their names come from
 * `ariaLabel`, and finding them by those names is the assertion that they have them. A key press steps once; a held
 * pointer steps once and then repeats until it lets go, and the click a pointer press ends with is not counted again.
 */
const COUNTER = demo("counter");
const REPEAT_HOLD_MS = 1_000;
const AFTER_RELEASE_MS = 400;

const counted = async (page: Page) => Number(/count: (-?\d+)/.exec(await readout(page, "counter"))?.[1]);

test("the counter's arrows are named, and each key press steps once", async ({ page }) => {
    const increase = page.locator(COUNTER).getByRole("button", { name: "Increase" });
    const decrease = page.locator(COUNTER).getByRole("button", { name: "Decrease" });

    await increase.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press(" ");

    expect(await counted(page), "Enter and Space each step up once").toBe(2);

    await decrease.focus();
    await page.keyboard.press("Enter");

    expect(await counted(page), "and the other arrow steps down").toBe(1);
});

test("holding an arrow down repeats, and letting go stops it", async ({ page }) => {
    const box = (await page.locator(COUNTER).getByRole("button", { name: "Increase" }).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(REPEAT_HOLD_MS);
    await page.mouse.up();

    const released = await counted(page);

    expect(released, "a held press steps more than once").toBeGreaterThan(2);

    await page.waitForTimeout(AFTER_RELEASE_MS);

    expect(await counted(page), "and nothing more arrives once it is let go").toBe(released);
});
