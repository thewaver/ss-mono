import { type Page, expect, test } from "@playwright/test";

import { inputValue } from "../helpers";

/**
 * The React `ColorInput`: a popup button whose picker is a React `ColorArea` and a hue `Range` inside a `Popover`.
 * The cases follow `e2e/colorInput.spec.ts`, which covers the Solid one, so the two frameworks are held to the same
 * behavior. What is worth asserting is that the value comes back in the notation it was handed in — hex, here — since
 * that round trip is the control's public contract.
 */
const STORY = "Essentials/ColorInput/Page";

const scope = (key: string) => `[data-testid="${key}"]`;
const field = (key: string) => `${scope(key)} button[aria-haspopup="dialog"]`;
const readout = async (page: Page, key: string) =>
    (await page.locator(`${scope(key)} [data-readout="value"]`).textContent()) ?? "";
const POPUP = '[role="dialog"]';

const OUTSIDE_POINT = 5;
const SETTLE_MS = 200;

const dragAcross = async (page: Page, selector: string, from: [number, number], to: [number, number]) => {
    const box = (await page.locator(selector).boundingBox())!;

    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: 5 });
    await page.mouse.up();
};

test.beforeEach(async ({ page, mount }) => {
    await mount(STORY);
    await expect(page.locator(field("default"))).toBeVisible();
});

test("the control is a popup button rather than a native color input", async ({ page }) => {
    await expect(page.locator("input[type='color']"), "no native color input survives").toHaveCount(0);
    await expect(page.locator(field("default")), "the field announces the popup it owns").toHaveAttribute(
        "aria-haspopup",
        "dialog",
    );
    await expect(page.locator(field("default")), "and says whether it is open").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    await expect(page.locator(POPUP), "with nothing portaled until it is").toHaveCount(0);
});

test("opening it points the field at the popup and back", async ({ page }) => {
    await page.locator(field("default")).click();

    await expect(page.locator(field("default"))).toHaveAttribute("aria-expanded", "true");

    const controls = await page.locator(field("default")).getAttribute("aria-controls");

    expect(await page.locator(`[id="${controls}"]`).getAttribute("role"), "which is the dialog it just opened").toBe(
        "dialog",
    );
});

/**
 * The settle is load-bearing rather than defensive: a layer's opening placement is provisional — it measures itself
 * on mount, before it has its final size, and the next frame corrects it — so a box read in that first frame can be
 * somewhere other than where the surface ends up.
 */
test("dragging the surface writes a hex value to the owner", async ({ page }) => {
    const before = await readout(page, "default");

    await page.locator(field("default")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.9, 0.1]);

    await expect.poll(() => readout(page, "default"), { message: "the value changed" }).not.toBe(before);
    expect(await readout(page, "default"), "and it is still a six digit hex, since nothing asked for alpha").toMatch(
        /#[0-9a-f]{6}/,
    );
});

test("the hue slider is a real range and moves the same value", async ({ page }) => {
    await page.locator(field("default")).click();

    const hue = page.locator(`${POPUP} input[aria-label="Hue"]`);

    await expect(hue, "one native range carries hue").toHaveCount(1);

    const before = await inputValue(hue);

    await hue.focus();
    await page.keyboard.press("ArrowRight");

    expect(Number(await inputValue(hue)), "an arrow moves it").toBeGreaterThan(Number(before));
});

/**
 * The popup is portaled to the end of the document, so if opening it left focus on the field, Tab would go to the
 * next control on the page, the popup would read that as focus leaving and close. Opening has to move focus into
 * the picker, so the first Tab lands on its first control — the saturation axis of the surface.
 */
test("opening it from the keyboard puts the sliders within one Tab", async ({ page }) => {
    await page.locator(field("default")).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(POPUP), "opening it moves focus into the picker").toBeFocused();

    await page.keyboard.press("Tab");

    await expect(page.locator(POPUP), "Tab does not carry focus out and close it").toBeVisible();
    await expect(
        page.locator(`${POPUP} [role="group"] input[type="range"]`).first(),
        "and lands on the picker's first control, the saturation axis",
    ).toBeFocused();
});

test("Escape closes it and hands focus back to the field", async ({ page }) => {
    await page.locator(field("default")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(field("default")), "and the field is focused again").toBeFocused();
});

test("clicking outside closes it, clicking its own controls does not", async ({ page }) => {
    await page.locator(field("default")).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator(`${POPUP} input[aria-label="Hue"]`).click();
    await expect(page.locator(POPUP), "the popup's own controls keep it open").toBeVisible();

    await page.mouse.click(OUTSIDE_POINT, OUTSIDE_POINT);
    await expect(page.locator(POPUP), "a click anywhere else closes it").toHaveCount(0);
});

test("a snapping owner rewrites the value and the field follows", async ({ page }) => {
    await page.locator(field("snapping")).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.1, 0.9]);

    await expect
        .poll(() => readout(page, "snapping"), {
            message: "the owner's own value wins, because the field reads it back",
        })
        .toMatch(/#(ff0055|00d1b2|ffb400|7a5cff)/);
});

test("a disabled field opens nothing and uses no native attribute", async ({ page }) => {
    await expect(page.locator("button[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);
    await expect(page.locator(field("disabled"))).toHaveAttribute("aria-disabled", "true");

    await page.locator(field("disabled")).dispatchEvent("click");

    await expect(page.locator(POPUP), "clicking it opens nothing").toHaveCount(0);
});
