import { expect, test } from "@playwright/test";

/**
 * The React `Button`, over the React `InteractionWrapper` and `Tooltip`. The cases follow `e2e/button.spec.ts`, which
 * covers the Solid one, so the two frameworks are held to the same behavior.
 */
const BUTTON = "#button";
const TOOLTIP = '[role="tooltip"]';

test("a plain button activates by pointer and by both keys, and never carries native disabled", async ({
    page,
    mount,
}) => {
    const component = await mount("Essentials/Button/Default");

    await component.locator(BUTTON).click();
    await component.locator(BUTTON).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press(" ");

    await expect(component.locator('[data-readout="clicks"]')).toHaveText("3");
    await expect(component.locator("button[disabled]")).toHaveCount(0);
});

test("the painter is handed the flags, hover included", async ({ mount }) => {
    const component = await mount("Essentials/Button/Default");

    await component.locator(BUTTON).hover();

    await expect(component.locator(BUTTON)).toHaveText("Hovered");
});

test("pressed state is announced only by a button that has one, and follows its owner", async ({ mount }) => {
    const plain = await mount("Essentials/Button/Default");

    await expect(plain.locator(BUTTON)).not.toHaveAttribute("aria-pressed");

    const toggle = await mount("Essentials/Button/Pressed");

    await expect(toggle.locator(BUTTON)).toHaveAttribute("aria-pressed", "false");

    await toggle.locator(BUTTON).click();
    await expect(toggle.locator(BUTTON)).toHaveAttribute("aria-pressed", "true");
});

test("a button with a tooltip reveals it and is described by it", async ({ page, mount }) => {
    const component = await mount("Essentials/Button/Pressed");

    await component.locator(BUTTON).hover();

    await expect(page.locator(TOOLTIP)).toBeVisible();
    await expect(component.locator(BUTTON)).toHaveAttribute("aria-describedby", /.+/);
});

test("a disabled button is disabled through ARIA, out of the tab order, and gated in JS", async ({ page, mount }) => {
    const component = await mount("Essentials/Button/Default", { isDisabled: true });

    await expect(component.locator(BUTTON)).toHaveAttribute("aria-disabled", "true");
    await expect(component.locator(BUTTON)).not.toHaveAttribute("disabled");
    await expect(component.locator(BUTTON)).toHaveAttribute("tabindex", "-1");

    await component.locator(BUTTON).click({ force: true });

    await expect(component.locator('[data-readout="clicks"]')).toHaveText("0");
    expect(await page.evaluate(() => document.activeElement?.id), "and the press does not focus it").not.toBe("button");
});

test("a reachable disabled button keeps its tab stop, refuses Enter, and its tooltip explains why", async ({
    page,
    mount,
}) => {
    const component = await mount("Essentials/Button/Default", { isDisabled: true, isReachable: true });

    await expect(component.locator(BUTTON)).toHaveAttribute("aria-disabled", "true");
    await expect(component.locator(BUTTON)).toHaveAttribute("tabindex", "0");

    await component.locator(BUTTON).focus();
    await page.keyboard.press("Enter");
    await expect(component.locator('[data-readout="clicks"]')).toHaveText("0");

    await component.locator(BUTTON).hover({ force: true });
    await expect(page.locator(TOOLTIP)).toContainText("isDisabled: true");
});

test("a press answered with a promise holds the button busy and refuses presses until it settles", async ({
    mount,
}) => {
    const component = await mount("Essentials/Button/Pending");

    await component.locator(BUTTON).click();
    await expect(component.locator(BUTTON)).toHaveAttribute("aria-busy", "true");

    await component.locator(BUTTON).click();
    await expect(component.locator('[data-readout="clicks"]'), "the second press is refused").toHaveText("1");

    await component.getByTestId("release").click();
    await expect(component.locator(BUTTON)).not.toHaveAttribute("aria-busy");
});

test("inside a Label the caption names the control, and the control's own aria-label is dropped with a warning", async ({
    page,
    mount,
}) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    const component = await mount("Essentials/Button/Labeled");

    await expect(component.locator("label")).toHaveCount(1);
    await expect(component.locator(BUTTON)).not.toHaveAttribute("aria-label");
    expect(warnings.some((text) => text.includes("aria-label"))).toBe(true);
});
