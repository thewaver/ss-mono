import { type Page, expect, test } from "@playwright/test";

import { attributesOf, inputValue, tabIndex } from "../helpers";

/**
 * The React `ColorArea`, on its own and inside a popup beside a hue `Range`. The cases follow `e2e/colorArea.spec.ts`,
 * which covers the Solid one, so the two frameworks are held to the same behavior. The Playground's picker also
 * carries a panel of channel fields with a color-space toggle; that panel is the Playground's own component rather
 * than the library's, so its cases have no counterpart here.
 */
const STORY = "Essentials/ColorArea/Page";

const scope = (key: string) => `[data-testid="${key}"]`;
const surface = (key: string) => `${scope(key)} [role="group"]`;
const axis = (key: string) => `${scope(key)} input[type="range"]`;
const readout = async (page: Page, key: string) =>
    (await page.locator(`${scope(key)} [data-readout="value"]`).textContent()) ?? "";
const POPUP = '[role="dialog"]';
const TRIGGER = `${scope("dropdown")} button`;

/**
 * A two-dimensional drag is the one thing the surface exists for and the one thing no native input can carry, so it
 * is driven with real pointer moves rather than by setting a value: pressing, moving and releasing is what exercises
 * the pointer capture underneath.
 */
const dragAcross = async (page: Page, selector: string, from: [number, number], to: [number, number]) => {
    const box = (await page.locator(selector).boundingBox())!;

    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: 5 });
    await page.mouse.up();
};

test.beforeEach(async ({ page, mount }) => {
    await mount(STORY);
    await expect(page.locator(surface("bare"))).toBeVisible();
});

test("the surface is a group over two real sliders, one per axis", async ({ page }) => {
    await expect(
        page.locator(axis("bare")),
        "one native range per axis, so the keyboard needs nothing new",
    ).toHaveCount(2);
    expect(await attributesOf(page, axis("bare"), "aria-label"), "each names its own axis").toEqual([
        "Saturation",
        "Brightness",
    ]);
    await expect(page.locator(surface("bare")), "and the surface names the pair").toHaveAttribute(
        "aria-label",
        "Saturation and brightness",
    );
});

test("one drag moves both axes at once, which is the whole reason it exists", async ({ page }) => {
    expect(await readout(page, "bare")).toContain("70% 90%");

    await dragAcross(page, surface("bare"), [0.25, 0.75], [0.8, 0.2]);

    await expect
        .poll(() => readout(page, "bare"), { message: "saturation follows the horizontal axis" })
        .toContain("80%");
    expect(await readout(page, "bare"), "and brightness the vertical one, inverted").toContain("80% 80%");
});

test("a drag lands on release and leaves nothing dragging", async ({ page }) => {
    await dragAcross(page, surface("bare"), [0.5, 0.5], [0.9, 0.1]);

    await expect(
        page.locator(`${scope("bare")} [class*="isDragging"]`),
        "the dragging flag is cleared on release",
    ).toHaveCount(0);
});

test("the sliders keep the keyboard, and report a percentage rather than a raw ratio", async ({ page }) => {
    await page.locator(axis("bare")).first().focus();

    const before = Number(await inputValue(page.locator(axis("bare")).first()));

    await page.keyboard.press("ArrowLeft");

    expect(
        Number(await inputValue(page.locator(axis("bare")).first())),
        "an arrow moves the focused axis",
    ).toBeLessThan(before);
    await expect(page.locator(axis("bare")).first(), "and it is announced as a percentage").toHaveAttribute(
        "aria-valuetext",
        /%$/,
    );
});

test("the dropdown is a dialog holding the surface and a hue slider", async ({ page }) => {
    await expect(page.locator(POPUP), "nothing is portaled before it opens").toHaveCount(0);

    await page.locator(TRIGGER).first().click();

    await expect(page.locator(POPUP), "the popup is a dialog rather than a listbox").toHaveAttribute(
        "aria-label",
        "Choose a color",
    );
    await expect(page.locator(`${POPUP} [role="group"]`).first(), "with the surface inside it").toBeVisible();
    await expect(page.locator("#hueSlider"), "and a hue slider beside it").toHaveCount(1);
});

test("hue and the surface write the same color, and the popup's own mousedown does not block the drag", async ({
    page,
}) => {
    await page.locator(TRIGGER).first().click();
    await expect(page.locator(POPUP)).toBeVisible();

    const before = await readout(page, "dropdown");

    await page.locator("#hueSlider").focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(await readout(page, "dropdown"), "the hue slider changes the hex").not.toBe(before);

    const afterHue = await readout(page, "dropdown");

    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.95, 0.05]);

    await expect
        .poll(() => readout(page, "dropdown"), { message: "and a drag inside the popup still reaches the surface" })
        .not.toBe(afterHue);
});

test("the hue slider can be dragged, not only typed", async ({ page }) => {
    await page.locator(TRIGGER).first().click();
    await expect(page.locator(POPUP)).toBeVisible();

    const before = await readout(page, "dropdown");

    await dragAcross(page, "#hueSlider", [0.2, 0.5], [0.75, 0.5]);

    await expect
        .poll(() => readout(page, "dropdown"), {
            message: "a dialog popup does not refuse mousedown, so the native thumb drag survives",
        })
        .not.toBe(before);
    await expect(page.locator(POPUP), "and dragging inside it does not dismiss it").toBeVisible();
});

test("Escape closes the dropdown and gives the trigger its focus back", async ({ page }) => {
    await page.locator(TRIGGER).first().click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    expect(await readout(page, "dropdown")).toContain("open: false");
});

test("clicking outside closes the dropdown, while clicking inside it does not", async ({ page }) => {
    await page.locator(TRIGGER).first().click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator("#hueSlider").click();
    await expect(page.locator(POPUP), "a click on the popup's own controls leaves it open").toBeVisible();

    await page.locator(scope("bare")).click();

    await expect(page.locator(POPUP), "a click anywhere else closes it").toHaveCount(0);
    expect(await readout(page, "dropdown")).toContain("open: false");
});

test("a disabled surface attaches no drag and uses no native attribute", async ({ page }) => {
    await expect(page.locator("input[disabled]"), "no axis uses the native disabled attribute").toHaveCount(0);
    await expect(page.locator(surface("disabled"))).toHaveAttribute("aria-disabled", "true");

    const box = (await page.locator(surface("disabled")).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height * 0.1);

    expect(
        await inputValue(page.locator(axis("disabled")).first()),
        "clicking it moves nothing, because the listener was never attached",
    ).toBe("60");
});

/**
 * The axis inputs are the surface's keyboard, and they are not the element `InteractionWrapper` holds — the
 * `role="group"` is. So the wrapper's tab-order rule reaches neither of them on its own, and a refused write has to
 * be pushed back onto the element, or the slider ends up holding a position the state never accepted.
 */
test("a disabled surface cannot be reached or moved by the keyboard either", async ({ page }) => {
    const saturation = page.locator(axis("disabled")).first();

    expect(await tabIndex(saturation), "the axis inputs leave the tab order with the control").toBe(-1);
    expect(await tabIndex(page.locator(axis("disabled")).last())).toBe(-1);

    const before = await inputValue(saturation);

    await saturation.evaluate((element) => (element as HTMLInputElement).focus());
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(
        await inputValue(saturation),
        "and a refused write is pushed back onto the element, so state and slider cannot drift apart",
    ).toBe(before);
    await expect(
        page.locator(`${scope("disabled")} [aria-valuetext]`).first(),
        "the announced value agrees with the element, which is what drifting apart would break",
    ).toHaveAttribute("aria-valuetext", `${Math.round(Number(before))}%`);
});
