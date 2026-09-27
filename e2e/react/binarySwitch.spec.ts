import { type Page, expect, test } from "@playwright/test";

import { isChecked, isIndeterminate, tabIndex } from "../helpers";

/**
 * The React `BinarySwitch`, driven through the React `Checkbox` over the React `InteractionWrapper`. The cases follow
 * `e2e/binarySwitch.spec.ts`, which covers the Solid one on the Checkbox page, so the two frameworks are held to the
 * same behavior: the native input kept in step with its owner, `aria-disabled` rather than native disabled, and a
 * mixed state that the browser's own flip does not get to overwrite.
 */
const BOX = "#checkbox";
const TOOLTIP = '[role="tooltip"]';

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id);

test("no box uses the native disabled attribute, a disabled one included", async ({ mount }) => {
    const plain = await mount("Essentials/Checkbox/Default");

    await expect(plain.locator(BOX)).not.toHaveAttribute("disabled");

    const disabled = await mount("Essentials/Checkbox/Disabled");

    await expect(disabled.locator("input[disabled]")).toHaveCount(0);
});

test("a plain box toggles by pointer and by Space, and the input agrees with its owner", async ({ page, mount }) => {
    const component = await mount("Essentials/Checkbox/Default");

    await component.locator(BOX).click();
    await expect(component.locator('[data-readout="checked"]'), "clicking the box reports the change").toHaveText(
        "true",
    );
    expect(await isChecked(component.locator(BOX)), "and the input agrees with the state").toBe(true);

    await component.locator(BOX).focus();
    await page.keyboard.press(" ");
    await expect(component.locator('[data-readout="checked"]'), "Space toggles it back").toHaveText("false");
    expect(await isChecked(component.locator(BOX))).toBe(false);
});

test("a box given no state holds its own, and reports every change", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Uncontrolled");

    await component.locator(BOX).click();
    await component.locator(BOX).click();

    await expect(component.locator('[data-readout="changes"]')).toHaveText("true, false");
    expect(await isChecked(component.locator(BOX))).toBe(false);
});

test("a mixed summary box resolves to checked and follows its children", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Mixed");
    const summary = component.locator("#selectAll");

    expect(await isIndeterminate(summary), "a mixed summary box starts indeterminate").toBe(true);
    expect(await isChecked(summary), "and unchecked, since its children disagree").toBe(false);
    await expect(summary, "and a mixed checkbox keeps its native role").not.toHaveAttribute("role");

    await summary.click();
    await expect(
        component.locator('[data-readout="mixed"]'),
        "clicking a mixed box resolves it to checked and sets both children",
    ).toHaveText("mixed: false | all: true | children: true, true");
    expect(
        await isIndeterminate(summary),
        "the indeterminate property follows the resolution rather than the browser's clear",
    ).toBe(false);
    expect(await isChecked(summary), "and checked follows it too").toBe(true);

    await component.locator("#firstChild").click();
    expect(await isIndeterminate(summary), "unchecking one child puts the summary box back to indeterminate").toBe(
        true,
    );
    expect(await isChecked(summary), "and drops its checkedness with it").toBe(false);
});

test("an owner that refuses a write leaves the control where it put it", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/RefusedWrite");
    const email = component.locator("#email");

    await expect(component.locator('[data-readout="refused"]')).toHaveText("email: true | sms: false");

    await email.click();
    await expect(
        component.locator('[data-readout="refused"]'),
        "a refused write leaves the state where the owner put it",
    ).toHaveText("email: true | sms: false");
    expect(await isChecked(email), "and the input is resynced rather than left holding the browser's flip").toBe(true);

    await email.click();
    expect(
        await isChecked(email),
        "a second click still refuses, which is where a missing resync would have inverted the control",
    ).toBe(true);

    await component.locator("#sms").click();
    await email.click();
    await expect(
        component.locator('[data-readout="refused"]'),
        "and once the other is on, the write goes through",
    ).toHaveText("email: false | sms: true");
    expect(await isChecked(email)).toBe(false);
});

test("a disabled box refuses activation and focus", async ({ page, mount }) => {
    const component = await mount("Essentials/Checkbox/Disabled");

    await expect(component.locator(BOX), "a disabled box says so through ARIA").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(await tabIndex(component.locator(BOX)), "and is out of the tab order").toBe(-1);

    await component.locator(BOX).click({ force: true });
    await expect(component.locator('[data-readout="checked"]'), "clicking a disabled box changes nothing").toHaveText(
        "true",
    );
    expect(await isChecked(component.locator(BOX)), "and the canceled click leaves the input alone").toBe(true);
    expect(await activeId(page), "clicking a disabled box does not even focus it").not.toBe("checkbox");
});

test("a click refused while disabled does not swallow the first click once the box is enabled", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Disabled");

    await component.locator(BOX).click({ force: true });
    await component.update({ isDisabled: false });
    await component.locator(BOX).click();

    await expect(component.locator('[data-readout="checked"]')).toHaveText("false");
    expect(await isChecked(component.locator(BOX))).toBe(false);
});

test("a reachable disabled box keeps its tab stop and explains itself", async ({ page, mount }) => {
    const component = await mount("Essentials/Checkbox/Disabled", { isReachable: true });

    expect(await tabIndex(component.locator(BOX)), "a reachable disabled box keeps its tab stop").toBe(0);

    await component.locator(BOX).focus();
    expect(await activeId(page), "and can be focused so its tooltip can be read").toBe("checkbox");

    await page.keyboard.press(" ");
    await expect(component.locator('[data-readout="checked"]'), "Space on it changes nothing").toHaveText("true");
    expect(await isChecked(component.locator(BOX))).toBe(true);

    await component.locator(BOX).hover({ force: true });
    await expect(page.locator(TOOLTIP), "hovering it reveals the tooltip that explains it").toBeVisible();
    await expect(component.locator(BOX), "and the tooltip wires itself up as its description").toHaveAttribute(
        "aria-describedby",
        /.+/,
    );
});

test("an errored required box is announced invalid and required", async ({ mount }) => {
    const component = await mount("Essentials/Checkbox/Errored");

    await expect(component.locator(BOX)).toHaveAttribute("aria-invalid", "true");
    await expect(component.locator(BOX)).toHaveAttribute("aria-required", "true");
    await expect(component.locator(BOX)).toHaveAttribute("type", "checkbox");
});
