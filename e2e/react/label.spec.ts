import { expect, test } from "@playwright/test";

import { isChecked } from "../helpers";

/**
 * The React `Label` around the React `Checkbox`. The cases follow `e2e/label.spec.ts`, which covers the Solid pair:
 * one `<label>` wrapping caption and control, a caption click reaching the control unless it is disabled, and a
 * control's own `aria-label` dropped in favor of the visible caption.
 */
const BOX = "#checkbox";
const CAPTION = "#caption";

test("a Label wraps caption and control, and the caption activates it", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Labeled");

    await expect(component.locator("label"), "a Label wraps its caption and control in one <label>").toHaveCount(1);
    await expect(component.locator(BOX), "and the caption names the control").toHaveAccessibleName("Remember me");

    await component.locator(CAPTION).click();
    await expect(component.locator('[data-readout="checked"]'), "clicking the caption reaches the control").toHaveText(
        "true",
    );
});

test("an aria-label inside a Label warns and is dropped", async ({ page, mount }) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    const component = await mount("Essentials/Checkbox/Labeled", { ariaLabel: "Announced as something else" });

    expect(
        warnings.some((text) => text.includes("aria-label")),
        "an aria-label inside a Label warns, rather than silently renaming the control",
    ).toBe(true);
    await expect(
        component.locator(BOX),
        "the aria-label is dropped, so the visible caption stays the accessible name",
    ).not.toHaveAttribute("aria-label");
    await expect(component.locator(BOX)).toHaveAccessibleName("Remember me");
});

test("a caption click on a disabled control is stopped", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Labeled", { isDisabled: true });

    await component.locator(CAPTION).click({ force: true });

    await expect(
        component.locator('[data-readout="checked"]'),
        "a caption click on a disabled control is stopped",
    ).toHaveText("true");
    expect(
        await isChecked(component.locator(BOX)),
        "and the input is not left holding the flip the browser made before the click was canceled",
    ).toBe(true);
});
