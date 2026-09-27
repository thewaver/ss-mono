import { expect, test } from "@playwright/test";

import { isChecked, isIndeterminate } from "../helpers";

/**
 * The React `Toggle`, a `BinarySwitch` announced as a switch. The cases follow `e2e/toggle.spec.ts`, which covers the
 * Solid one: a switch over a native checkbox, and one that drops the switch role exactly while it is mixed, because
 * ARIA gives a switch no mixed state.
 */
test("a plain toggle is a switch over a native checkbox, and flips by pointer and by Space", async ({
    page,
    mount,
}) => {
    const component = await mount("Essentials/Toggle/Default");
    const toggle = component.locator("#toggle");

    await expect(toggle, "a plain toggle announces as a switch").toHaveAttribute("role", "switch");
    await expect(toggle, "over a native checkbox input").toHaveAttribute("type", "checkbox");

    await toggle.click();
    await expect(component.locator('[data-readout="checked"]')).toHaveText("true");
    expect(await isChecked(toggle)).toBe(true);

    await page.keyboard.press(" ");
    await expect(component.locator('[data-readout="checked"]')).toHaveText("false");
});

test("a mixed toggle drops the switch role and takes it back", async ({ mount }) => {
    const component = await mount("Essentials/Toggle/Mixed");
    const summary = component.locator("#allSettings");

    await expect(summary, 'a mixed toggle drops role="switch", which ARIA gives no mixed state').not.toHaveAttribute(
        "role",
    );
    expect(await isIndeterminate(summary), "and falls back to a mixed native checkbox").toBe(true);

    await summary.click();
    await expect(summary, "resolving the mixed state hands the switch role straight back").toHaveAttribute(
        "role",
        "switch",
    );
    expect(await isIndeterminate(summary)).toBe(false);

    await component.locator("#firstSetting").click();
    await expect(summary, "and going mixed again takes it away").not.toHaveAttribute("role");
});
