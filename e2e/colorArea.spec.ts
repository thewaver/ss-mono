import { type Locator, type Page, expect, test } from "@playwright/test";

import { attributesOf, docsDemo, docsSettled, inputValue, prop, tabIndex } from "./helpers";

const DOCS = "/src/App/Pages/ColorAreaPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const RTL = docsDemo(DOCS, "RightToLeft");
const PICKER = docsDemo(DOCS, "Picker");

const surface = (scope: string) => `${scope} [role="group"]`;
const axis = (scope: string) => `${scope} input[type="range"]`;
const POPUP = '[role="dialog"]';
const TRIGGER = `${PICKER} button`;
const RADIO = `${POPUP} input[type="radio"]`;

const channel = (key: string) => `#channel${key[0].toUpperCase()}${key.slice(1)}`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/**
 * A two-dimensional drag is the one thing the surface exists for and the one thing no native input can
 * carry, so it is driven with real pointer moves rather than by setting a value: pressing, moving and
 * releasing is what exercises the pointer capture underneath.
 */
const dragAcross = async (page: Page, selector: string, from: [number, number], to: [number, number]) => {
    const box = (await page.locator(selector).boundingBox())!;

    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: 5 });
    await page.mouse.up();
};

/** The two axes as numbers, saturation first: the hidden sliders are what the surface reports through. */
const axisValues = async (page: Page, scope: string) => ({
    saturation: Number(await inputValue(page.locator(axis(scope)).first())),
    brightness: Number(await inputValue(page.locator(axis(scope)).last())),
});

/** The picker shows no readout; its trigger names the color it holds, which is what a reader sees. */
const triggerText = async (page: Page) => ((await page.locator(TRIGGER).first().textContent()) ?? "").trim();

/** Replaces a field's text the way a person does: click into it, select everything, type over it. */
const typeOver = async (page: Page, field: Locator, text: string) => {
    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 20 });
};

const openPicker = async (page: Page) => {
    await page.locator(TRIGGER).first().click();
    await expect(page.locator(POPUP)).toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/color-area/docs");
    await expect(page.locator(surface(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("the surface is a group over two real sliders, one per axis", async ({ page }) => {
    await expect(page.locator(axis(BASIC)), "one native range per axis, so the keyboard needs nothing new").toHaveCount(
        2,
    );

    const names = await attributesOf(page, axis(BASIC), "aria-label");

    expect(names[0], "each axis is named").toBeTruthy();
    expect(names[1]).toBeTruthy();
    expect(names[0], "each by its own name").not.toBe(names[1]);
    expect(
        await page.locator(surface(BASIC)).getAttribute("aria-label"),
        "and the surface names the pair",
    ).toBeTruthy();
});

test("one drag moves both axes at once, which is the whole reason it exists", async ({ page }) => {
    await dragAcross(page, surface(BASIC), [0.25, 0.75], [0.8, 0.2]);

    const after = await axisValues(page, BASIC);

    expect(Math.abs(after.saturation - 80), "saturation follows the horizontal axis").toBeLessThanOrEqual(2);
    expect(Math.abs(after.brightness - 80), "and brightness the vertical one, inverted").toBeLessThanOrEqual(2);
});

/**
 * WCAG 2.5.7 asks a drag for a single-pointer alternative, and the surface's is the press itself: a press that
 * never moves puts the handle under the pointer.
 */
test("a press without movement moves the handle, so the drag has a single-pointer route", async ({ page }) => {
    const box = (await page.locator(surface(BASIC)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.1, box.y + box.height * 0.9);

    const after = await axisValues(page, BASIC);

    expect(Math.abs(after.saturation - 10), "the press sets saturation where it landed").toBeLessThanOrEqual(2);
    expect(Math.abs(after.brightness - 10), "and brightness with it").toBeLessThanOrEqual(2);
});

test("a drag lands on release and leaves nothing dragging", async ({ page }) => {
    await dragAcross(page, surface(BASIC), [0.5, 0.5], [0.9, 0.1]);

    await expect(page.locator(`${BASIC} [class*="isDragging"]`), "the dragging flag is cleared on release").toHaveCount(
        0,
    );
});

test("the readout follows the surface", async ({ page }) => {
    const readout = page.locator(`${BASIC} [data-readout]`);
    const before = await readout.textContent();

    await dragAcross(page, surface(BASIC), [0.5, 0.5], [0.9, 0.1]);

    await expect(readout, "the example's readout moves with the handle").not.toHaveText(before ?? "");
});

test("the sliders keep the keyboard, and report a percentage rather than a raw ratio", async ({ page }) => {
    await page.locator(axis(BASIC)).first().focus();

    const before = Number(await inputValue(page.locator(axis(BASIC)).first()));

    await page.keyboard.press("ArrowLeft");

    expect(Number(await inputValue(page.locator(axis(BASIC)).first())), "an arrow moves the focused axis").toBeLessThan(
        before,
    );
    await expect(page.locator(axis(BASIC)).first(), "and it is announced as a percentage").toHaveAttribute(
        "aria-valuetext",
        /%$/,
    );
});

/**
 * The surface is a picture of color, not text, so a right-to-left box mirrors nothing: saturation still grows to
 * the right, and the right arrow still moves the handle right, as on screen.
 */
test("in right-to-left text the axes still run left to right by key", async ({ page }) => {
    expect(
        await attributesOf(page, axis(RTL), "dir"),
        "each axis input is pinned left to right, whatever the box around it says",
    ).toEqual(["ltr", "ltr"]);

    const saturation = page.locator(axis(RTL)).first();
    const before = Number(await inputValue(saturation));

    await saturation.focus();
    await page.keyboard.press("ArrowRight");

    expect(Number(await inputValue(saturation)), "the right arrow raises saturation").toBeGreaterThan(before);
});

test("in right-to-left text a press further right is higher saturation", async ({ page }) => {
    const saturation = page.locator(axis(RTL)).first();

    await expect(page.locator(surface(RTL)), "the square is drawn with room to press in").toBeVisible();

    const box = (await page.locator(surface(RTL)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.5);

    const leftPress = Number(await inputValue(saturation));

    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.5);

    expect(Number(await inputValue(saturation)), "and a press further right is higher saturation").toBeGreaterThan(
        leftPress,
    );
});

test("a disabled surface attaches no drag and uses no native attribute", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator("input[disabled]"), "no axis uses the native disabled attribute").toHaveCount(0);
    await expect(page.locator(surface(BASIC))).toHaveAttribute("aria-disabled", "true");

    const before = await axisValues(page, BASIC);
    const box = (await page.locator(surface(BASIC)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.1, box.y + box.height * 0.9);

    expect(await axisValues(page, BASIC), "clicking it moves nothing, because the listener was never attached").toEqual(
        before,
    );
});

/**
 * The axis inputs are the surface's keyboard, and they are not the element `InteractionWrapper` holds — the
 * `role="group"` is. So the wrapper's tab-order rule reached neither of them, and a disabled surface could
 * be tabbed into and arrowed: the write was refused, but nothing pushed the element back afterwards, so the
 * slider ended up holding a position the state had never accepted and the next press moved on from it.
 */
test("a disabled surface cannot be reached or moved by the keyboard either", async ({ page }) => {
    await knob(page, "isDisabled").click();

    const saturation = page.locator(axis(BASIC)).first();

    await expect(page.locator(surface(BASIC))).toHaveAttribute("aria-disabled", "true");
    expect(await tabIndex(saturation), "the axis inputs leave the tab order with the control").toBe(-1);
    expect(await tabIndex(page.locator(axis(BASIC)).last())).toBe(-1);

    const before = await inputValue(saturation);

    await saturation.evaluate((element) => (element as HTMLInputElement).focus());
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(
        await inputValue(saturation),
        "and a refused write is pushed back onto the element, so state and slider cannot drift apart",
    ).toBe(before);
    await expect(
        saturation,
        "the announced value agrees with the element, which is what drifting apart would break",
    ).toHaveAttribute("aria-valuetext", `${Math.round(Number(before))}%`);
});

test("the picker's button says it opens a dialog, and whether it is open", async ({ page }) => {
    const trigger = page.locator(TRIGGER).first();

    await expect(trigger, "it states the kind of popup it opens").toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger, "and that it is closed").toHaveAttribute("aria-expanded", "false");

    await openPicker(page);

    await expect(trigger, "and then that it is open").toHaveAttribute("aria-expanded", "true");
});

test("the picker is a named dialog holding the surface and a hue slider", async ({ page }) => {
    await expect(page.locator(POPUP), "nothing is portaled before it opens").toHaveCount(0);

    await openPicker(page);

    expect(await page.locator(POPUP).getAttribute("aria-label"), "the popup is a named dialog").toBeTruthy();
    await expect(page.locator(surface(POPUP)).first(), "with the surface inside it").toBeVisible();
    await expect(page.locator(`${POPUP} #hueSlider`), "and a hue slider beside it").toHaveCount(1);
});

test("hue and the surface write the same color, and the popup's own mousedown does not block the drag", async ({
    page,
}) => {
    await openPicker(page);

    const before = await triggerText(page);

    await page.locator("#hueSlider").focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    expect(await triggerText(page), "the hue slider changes the color").not.toBe(before);

    const afterHue = await triggerText(page);

    await dragAcross(page, surface(POPUP), [0.5, 0.5], [0.95, 0.05]);

    expect(await triggerText(page), "and a drag inside the popup still reaches the surface").not.toBe(afterHue);
});

test("the hue slider can be dragged, not only typed", async ({ page }) => {
    await openPicker(page);

    const before = await triggerText(page);

    await dragAcross(page, "#hueSlider", [0.2, 0.5], [0.75, 0.5]);

    expect(
        await triggerText(page),
        "a dialog popup does not refuse mousedown, so the native thumb drag survives",
    ).not.toBe(before);
    await expect(page.locator(POPUP), "and dragging inside it does not dismiss it").toBeVisible();
});

test("Escape closes the picker and gives the trigger its focus back", async ({ page }) => {
    await openPicker(page);

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(TRIGGER).first(), "focus returns to the button that opened it").toBeFocused();
    await expect(page.locator(TRIGGER).first(), "which says it is closed").toHaveAttribute("aria-expanded", "false");
});

test("clicking outside closes the picker, while clicking inside it does not", async ({ page }) => {
    await openPicker(page);

    await page.locator("#hueSlider").click();
    await expect(page.locator(POPUP), "a click on the popup's own controls leaves it open").toBeVisible();

    await page.locator(BASIC).click();

    await expect(page.locator(POPUP), "a click anywhere else closes it").toHaveCount(0);
    await expect(page.locator(TRIGGER).first()).toHaveAttribute("aria-expanded", "false");
});

test("the space toggle is a radio group, so the picker holds no second dropdown", async ({ page }) => {
    await openPicker(page);

    expect(
        await page.locator(`${POPUP} [role="radiogroup"]`).getAttribute("aria-label"),
        "one group naming itself",
    ).toBeTruthy();
    await expect(page.locator(RADIO), "with one radio per space").toHaveCount(3);
    await expect(page.locator(`${POPUP} [role="combobox"]`), "and no select nested inside the popup").toHaveCount(0);
});

test("each space shows its own channels and writes the same color", async ({ page }) => {
    await openPicker(page);

    await typeOver(page, page.locator(channel("r")), "17");
    await typeOver(page, page.locator(channel("g")), "34");
    await typeOver(page, page.locator(channel("b")), "51");

    expect(await triggerText(page), "rgba writes the channels it names").toContain("#112233");

    await page.locator(RADIO).nth(1).click();

    expect(await inputValue(page.locator(channel("h"))), "and hsla reads the same color back in its own units").toBe(
        "210",
    );

    await page.locator(RADIO).nth(2).click();

    expect(await inputValue(page.locator(channel("hexa"))), "as does hexa, always eight digits").toBe("#112233ff");
});

test("alpha is a channel like any other, and reaches the hex form", async ({ page }) => {
    await openPicker(page);

    await typeOver(page, page.locator(channel("a")), "0.5");

    expect(await triggerText(page), "half alpha is 80 in hex").toMatch(/80$/);
});

test("a half-typed hex is not committed over the text being typed", async ({ page }) => {
    await openPicker(page);
    await page.locator(RADIO).nth(2).click();

    const hex = page.locator(channel("hexa"));

    await typeOver(page, hex, "#f0a");

    expect(await inputValue(hex), "the field keeps exactly what was typed").toBe("#f0a");

    await page.locator(RADIO).nth(2).focus();

    expect(await inputValue(hex), "and only snaps to the canonical spelling once it is left").toBe("#ff00aaff");
    expect(await triggerText(page)).toContain("#ff00aaff");
});
