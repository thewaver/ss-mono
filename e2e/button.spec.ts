import { expect, test } from "@playwright/test";

import { activeMatches, demo, readout, tabIndex } from "./helpers";

const DEFAULT = `${demo("default")} button`;
const DECORATED = `${demo("decorated")} button`;
const DISABLED = `${demo("disabled")} button`;
const REACHABLE = `${demo("reachable")} button`;
const ERROR = `${demo("errored")} button`;
const TOOLTIP = '[role="tooltip"]';

test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("no control uses the native disabled attribute", async ({ page }) => {
    await expect(page.locator("button[disabled]"), "not one button on the page carries native disabled").toHaveCount(0);
});

test("a plain button activates by pointer and by both keys", async ({ page }) => {
    await page.locator(DEFAULT).click();
    expect(await readout(page, "default"), "a click reaches the handler").toContain("clicks: 1");

    await page.locator(DEFAULT).focus();
    await page.keyboard.press("Enter");
    expect(await readout(page, "default"), "Enter activates it as a native button does").toContain("clicks: 2");

    await page.keyboard.press(" ");
    expect(await readout(page, "default"), "and so does Space").toContain("clicks: 3");
});

test("pressed state is announced only by a button that has one", async ({ page }) => {
    await expect(
        page.locator(DEFAULT),
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
    await expect(page.locator(DISABLED), "a disabled button says so through ARIA").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(DISABLED), "and never through the native attribute").not.toHaveAttribute("disabled");
    expect(await tabIndex(page.locator(DISABLED)), "it is out of the tab order").toBe(-1);

    await page.locator(DISABLED).click({ force: true });
    expect(await readout(page, "disabled"), "clicking it does not reach the handler").toContain("clicks: 0");
    expect(await activeMatches(page, DISABLED), "and does not even focus it").toBe(false);
});

test("a reachable disabled button is identical to a disabled one but for its tab stop", async ({ page }) => {
    await expect(
        page.locator(REACHABLE),
        "a reachable disabled button carries the same attribute as a plain disabled one",
    ).toHaveAttribute("aria-disabled", "true");
    await expect(
        page.locator(REACHABLE),
        "which is what makes the two states structurally identical rather than merely styled alike",
    ).not.toHaveAttribute("disabled");
    expect(await tabIndex(page.locator(REACHABLE)), "what differs is that it keeps its tab stop").toBe(0);

    await page.locator(REACHABLE).focus();
    expect(await activeMatches(page, REACHABLE), "so it can be focused and its tooltip read").toBe(true);

    await page.keyboard.press("Enter");
    expect(
        await readout(page, "reachable"),
        "Enter on it still reaches nothing — gating is in JS, not in the native attribute",
    ).toContain("clicks: 0");

    await page.locator(REACHABLE).hover();
    await expect(page.locator(TOOLTIP), "and the shell hands the painter the flag that explains why").toContainText(
        "isDisabled: true",
    );
});

test("an errored button still activates", async ({ page }) => {
    expect(await readout(page, "errored"), "an errored button starts errored").toContain("hasError: true");

    await page.locator(ERROR).click();
    expect(await readout(page, "errored"), "and an ordinary click clears it").toContain("hasError: false");
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
