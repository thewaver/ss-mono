import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsExample, docsSettled, inputValue, prop } from "./helpers";

const DOCS = "/src/App/Pages/ColorInputPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const SWATCH = docsDemo(DOCS, "Swatch");
const SNAPPING = docsDemo(DOCS, "Snapping");
const RTL = docsDemo(DOCS, "RightToLeft");
const LABELED = docsDemo(DOCS, "Labeled");
const POPUP = '[role="dialog"]';

const field = (scope: string) => `${scope} button[aria-haspopup="dialog"]`;

const SETTLE_MS = 200;
const HEX_RADIX = 16;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/**
 * The OS color dialog is gone, so everything here is drivable for the first time: the surface is a real
 * element with a real drag, and the hue slider is a native range. What is worth asserting is that the value
 * comes back in the notation it was handed in — hex, on this page — since that round trip is the control's
 * public contract.
 */
const dragAcross = async (page: Page, selector: string, from: [number, number], to: [number, number]) => {
    const box = (await page.locator(selector).boundingBox())!;

    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: 5 });
    await page.mouse.up();
};

/**
 * The settle is load-bearing rather than defensive. A layer's opening placement is provisional — it measures
 * itself on mount, before it has its final size, and the next frame corrects it — so a `boundingBox` read in
 * that first frame reports a box up to 30px away from where the surface ends up, and the drag then starts
 * somewhere other than the middle. `viewport.spec.ts` waits for the same reason.
 */
const openPicker = async (page: Page, scope: string) => {
    await page.locator(field(scope)).click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);
};

/** The text a field's description points at: what a screen reader reads after the field's name. */
const descriptionOf = (page: Page, scope: string) =>
    page.locator(field(scope)).evaluate((element) =>
        (element.getAttribute("aria-describedby") ?? "")
            .split(" ")
            .filter(Boolean)
            .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
            .join(" "),
    );

const swatchValue = async (page: Page) =>
    ((await page.locator(`${SWATCH} [data-readout]`).textContent()) ?? "").match(/#[0-9a-f]{6,8}/i)?.[0] ?? "";

test.beforeEach(async ({ page }) => {
    await page.goto("/color-input/docs");
    await expect(page.locator(field(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("the control is a popup button rather than a native color input", async ({ page }) => {
    await expect(page.locator("input[type='color']"), "no native color input survives").toHaveCount(0);
    await expect(page.locator(field(BASIC)), "the field announces the popup it owns").toHaveAttribute(
        "aria-haspopup",
        "dialog",
    );
    await expect(page.locator(field(BASIC)), "and says whether it is open").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(POPUP), "with nothing portaled until it is").toHaveCount(0);
});

test("opening it points the field at the popup and back", async ({ page }) => {
    await page.locator(field(BASIC)).click();

    await expect(page.locator(field(BASIC))).toHaveAttribute("aria-expanded", "true");

    const controls = await page.locator(field(BASIC)).getAttribute("aria-controls");

    expect(await page.locator(`#${controls}`).getAttribute("role"), "which is the dialog it just opened").toBe(
        "dialog",
    );
});

/**
 * The field's name says what the color is for, so the color itself is its description. Left to the default, the
 * description is the value as written, which is also what the Basic painter shows inside the field.
 */
test("the field describes its color, as written by default", async ({ page }) => {
    const description = await descriptionOf(page, BASIC);
    const painted = ((await page.locator(field(BASIC)).textContent()) ?? "").trim();

    expect(description, "the field carries a description").not.toBe("");
    expect(description, "which is the value as the field holds it").toBe(painted);

    await openPicker(page, BASIC);
    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.9, 0.1]);
    await page.keyboard.press("Escape");

    expect(await descriptionOf(page, BASIC), "and it follows the value as it changes").not.toBe(description);
});

/**
 * Given its own words, the description says them instead. The Swatch example spells out red, green and blue,
 * so the numbers it reads are checked against the hex its readout shows.
 */
test("a field given its own value text is described in those words", async ({ page }) => {
    const hex = await swatchValue(page);
    const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), HEX_RADIX));
    const description = await descriptionOf(page, SWATCH);

    expect(description, "the description is not the value as written").not.toContain(hex);

    for (const channel of [red, green, blue]) {
        expect(description, "and names each channel of the color the readout shows").toContain(String(channel));
    }
});

test("dragging the surface writes a hex value to the owner", async ({ page }) => {
    const before = await swatchValue(page);

    await openPicker(page, SWATCH);
    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.9, 0.1]);

    const after = await swatchValue(page);

    expect(after, "the value changed").not.toBe(before);
    expect(after, "and it is still a six digit hex, since nothing asked for alpha").toMatch(/^#[0-9a-f]{6}$/i);
});

test("the hue slider is a real range and moves the same value", async ({ page }) => {
    await page.locator(field(BASIC)).click();

    const hue = page.locator(`${POPUP} input[type="range"]`).last();

    await expect(hue, "the last native range is hue, after the surface's two axes").not.toHaveAttribute(
        "aria-hidden",
        "true",
    );

    const before = await inputValue(hue);

    await hue.focus();
    await page.keyboard.press("ArrowRight");

    expect(Number(await inputValue(hue)), "an arrow moves it").toBeGreaterThan(Number(before));
});

/**
 * The popup is portaled to the end of the document, so if opening it left focus on the field, Tab would go
 * to the next control on the page, the popup would read that as focus leaving and close, and a keyboard user
 * could open the picker without ever reaching a slider in it. Opening has to move focus into the picker, so
 * the first Tab lands on its first control — the saturation axis of the surface.
 */
test("opening it from the keyboard puts the sliders within one Tab", async ({ page }) => {
    await page.locator(field(BASIC)).focus();
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
    await page.locator(field(BASIC)).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(POPUP)).toHaveCount(0);
    await expect(page.locator(field(BASIC)), "and the field is focused again").toBeFocused();
});

test("clicking outside closes it, clicking its own controls does not", async ({ page }) => {
    await page.locator(field(BASIC)).click();
    await expect(page.locator(POPUP)).toBeVisible();

    await page.locator(`${POPUP} input[type="range"]`).last().click();
    await expect(page.locator(POPUP), "the popup's own controls keep it open").toBeVisible();

    await page.locator(docsExample(DOCS, "Snapping")).click({ position: { x: 5, y: 5 } });
    await expect(page.locator(POPUP), "a click anywhere else closes it").toHaveCount(0);
});

test("a snapping owner rewrites the value and the field follows", async ({ page }) => {
    await openPicker(page, SNAPPING);
    await dragAcross(page, `${POPUP} [role="group"]`, [0.5, 0.5], [0.1, 0.9]);

    expect(
        await descriptionOf(page, SNAPPING),
        "the owner's own value wins, because the field reads the signal back",
    ).toMatch(/^#(ff0055|00d1b2|ffb400|7a5cff)$/);
});

/**
 * The field turns round in right-to-left text, and the picker it opens runs right to left too, but the square and
 * the hue strip are pictures of color: their sliders stay left to right, so the right arrow still moves right.
 */
test("in right-to-left text the picker's sliders still run left to right", async ({ page }) => {
    await openPicker(page, RTL);

    expect(
        await page.locator(POPUP).evaluate((element) => getComputedStyle(element).direction),
        "the picker takes the direction of the field it belongs to",
    ).toBe("rtl");

    const ranges = page.locator(`${POPUP} input[type="range"]`);
    const directions = await ranges.evaluateAll((inputs) => inputs.map((input) => getComputedStyle(input).direction));

    expect(directions.length, "the picker holds its sliders").toBeGreaterThan(0);
    expect(directions, "and every one of them runs left to right").not.toContain("rtl");

    const hue = ranges.last();
    const before = Number(await inputValue(hue));

    await hue.focus();
    await page.keyboard.press("ArrowRight");

    expect(Number(await inputValue(hue)), "so the right arrow raises the hue").toBeGreaterThan(before);
});

/** Inside a Label the caption alone names the field, through `aria-labelledby`, and pressing it opens the picker. */
test("inside a Label the caption names the field and opens it", async ({ page }) => {
    const labelledBy = await page.locator(field(LABELED)).getAttribute("aria-labelledby");

    expect(labelledBy, "the field points at its caption").toBeTruthy();

    const caption = page.locator(`#${labelledBy}`);
    const words = ((await caption.textContent()) ?? "").trim();

    expect(words, "the caption has words").not.toBe("");
    await expect(page.locator(field(LABELED)), "and the field's name is those words alone").toHaveAccessibleName(words);

    await caption.click();

    await expect(page.locator(POPUP), "pressing the caption opens the picker").toBeVisible();
});

test("a disabled field opens nothing and uses no native attribute", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator("button[disabled]"), "no field carries the native disabled attribute").toHaveCount(0);
    await expect(page.locator(field(BASIC))).toHaveAttribute("aria-disabled", "true");

    await page.locator(field(BASIC)).dispatchEvent("click");

    await expect(page.locator(POPUP), "clicking it opens nothing").toHaveCount(0);
});

test("an error is stated, not only painted", async ({ page }) => {
    await expect(page.locator(field(BASIC))).not.toHaveAttribute("aria-invalid", "true");

    await knob(page, "hasError").click();

    await expect(page.locator(field(BASIC)), "the Error knob marks the field invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
});
