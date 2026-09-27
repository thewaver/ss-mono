import { type Page, expect, test } from "@playwright/test";

/**
 * The React `PopupTrigger`, over the React `InteractionWrapper` and opening a React `Popover`. The Solid one is
 * checked through the controls built on it — `e2e/colorInput.spec.ts` and the flyout cases of `e2e/hoverCard.spec.ts`
 * — so these cases carry that part over: the trigger announces a dialog popup and whether it is open, points at the
 * popup only while it is open, toggles it, stays shut while disabled, hands its painter the open state, and lets its
 * visible caption name it inside a `Label`.
 */
const TRIGGER = "#trigger";
const POPUP = '[role="dialog"]';
const STORY = "Primitives/PopupTrigger/Default";

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

test("the trigger announces the dialog it owns, starts closed, and points at nothing while closed", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-haspopup", "dialog");
    await expect(page.locator(TRIGGER), "and says whether it is open").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(TRIGGER), "pointing at no popup while there is none").not.toHaveAttribute(
        "aria-controls",
    );
    await expect(page.locator(TRIGGER), "and it is a plain button that does not submit").toHaveAttribute(
        "type",
        "button",
    );
    await expect(page.locator(POPUP), "with nothing portaled until it is open").toHaveCount(0);
});

test("pressing it opens the popup, points at it, and hands the painter the open state", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(TRIGGER)).toHaveText("Closed");

    await page.locator(TRIGGER).click();

    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "true");

    const controls = await page.locator(TRIGGER).getAttribute("aria-controls");

    expect(await page.locator(`#${controls}`).getAttribute("role"), "which is the dialog it just opened").toBe(
        "dialog",
    );
    await expect(page.locator(TRIGGER), "and the painter is told it is open").toHaveText("Open");
});

test("pressing it again closes the popup, since a press inside the trigger is not a dismissal", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await page.locator(TRIGGER).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator(TRIGGER).click();

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "false");
    await expect(readout(page, "open")).toHaveText("false");
});

test("Escape closes a popup opened from it, and the trigger says it is closed", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(TRIGGER).click();
    await expect(page.locator(POPUP)).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-expanded", "false");
});

test("a disabled trigger is disabled through ARIA and opens nothing", async ({ page, mount }) => {
    await mount(STORY, { isDisabled: true });

    await expect(page.locator(TRIGGER)).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(TRIGGER)).not.toHaveAttribute("disabled");

    await page.locator(TRIGGER).click({ force: true });

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(readout(page, "open")).toHaveText("false");
});

test("inside a Label the caption names the trigger, and its own aria-label is dropped with a warning", async ({
    page,
    mount,
}) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    await mount("Primitives/PopupTrigger/Labeled");

    await expect(page.locator(TRIGGER)).not.toHaveAttribute("aria-label");
    expect(warnings.some((text) => text.includes("aria-label"))).toBe(true);
});
