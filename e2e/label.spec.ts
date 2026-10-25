import { type ConsoleMessage, type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, isChecked, prop } from "./helpers";

const DOCS = "/src/App/Pages/LabelPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const CAPTION_FIRST = docsDemo(DOCS, "CaptionFirst");
const PER_RADIO = docsDemo(DOCS, "LabelPerRadio");
const SUPPRESSED = docsDemo(DOCS, "Suppressed");

const CAPTION = "#rememberCaption";

/**
 * Inside a Label the caption alone names the control: the control's `aria-labelledby` points at the caption, so the
 * name is the caption's words and nothing else the `<label>` holds. Returns the control's name and the caption's
 * words, for the caller to compare.
 */
const nameAndCaption = async (page: Page, control: string) => {
    const element = page.locator(control);
    const labelledBy = (await element.getAttribute("aria-labelledby")) ?? "";
    const caption = labelledBy ? ((await page.locator(`#${labelledBy}`).textContent()) ?? "").trim() : "";

    return { labelledBy, caption };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/label/docs");
    await expect(page.locator(`${BASIC} input`)).toBeVisible();
    await docsSettled(page);
});

test("a Label wraps caption and control, and the caption activates it", async ({ page }) => {
    await expect(page.locator(`${BASIC} label`), "a Label wraps its caption and control in one <label>").toHaveCount(1);

    const before = await isChecked(page.locator(`${BASIC} input`));

    await page.locator(CAPTION).click();

    expect(await isChecked(page.locator(`${BASIC} input`)), "clicking the caption reaches the control").toBe(!before);
});

/**
 * The `<label>` element stays, so pressing the caption still reaches the control, but it no longer names it: a
 * `<label>` would name its control from every word inside it. The caption's id in `aria-labelledby` keeps the name
 * to the caption's words, whichever side of the control the caption sits on and however many Labels share a group.
 */
test("the caption alone names its control, through aria-labelledby", async ({ page }) => {
    for (const control of [`${BASIC} input`, `${CAPTION_FIRST} input`, `${PER_RADIO} input`]) {
        const controls = page.locator(control);

        for (let index = 0; index < (await controls.count()); index++) {
            const nth = `${control} >> nth=${index}`;
            const { labelledBy, caption } = await nameAndCaption(page, nth);

            expect(labelledBy, "the control points at a caption").toBeTruthy();
            expect(caption, "which has words").not.toBe("");
            await expect(page.locator(nth), "and the control's name is those words alone").toHaveAccessibleName(
                caption,
            );
        }
    }

    const radios = page.locator(`${PER_RADIO} input`);

    expect(
        await radios.nth(0).getAttribute("aria-labelledby"),
        "each radio in a group is named by its own Label's caption",
    ).not.toBe(await radios.nth(1).getAttribute("aria-labelledby"));
});

/**
 * The warning fires while the component mounts, so the listener has to be attached before the navigation rather
 * than in `beforeEach` after it. The prop is `ariaLabel` in all four frameworks, and the warning names it so.
 */
test("an aria-label inside a Label warns and is dropped", async ({ page }) => {
    const messages: ConsoleMessage[] = [];

    page.on("console", (message) => messages.push(message));

    await page.goto("/label/docs");
    await expect(page.locator(`${SUPPRESSED} input`)).toBeVisible();

    const warning = messages.find((message) => message.text().startsWith("Label: ariaLabel"));

    expect(warning, "an aria-label inside a Label warns, rather than silently renaming the control").toBeTruthy();
    expect(warning?.type(), "and it warns rather than logs").toBe("warning");
    await expect(
        page.locator(`${SUPPRESSED} input`),
        "the aria-label is dropped, so the visible caption stays the accessible name",
    ).not.toHaveAttribute("aria-label");

    const { caption } = await nameAndCaption(page, `${SUPPRESSED} input`);

    expect(caption, "the control is named by its caption instead").not.toBe("");
    await expect(page.locator(`${SUPPRESSED} input`)).toHaveAccessibleName(caption);
});

test("a caption click on a disabled control is stopped", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();
    await expect(page.locator(`${BASIC} input`)).toHaveAttribute("aria-disabled", "true");

    const before = await isChecked(page.locator(`${BASIC} input`));

    await page.locator(CAPTION).click({ force: true });

    expect(
        await isChecked(page.locator(`${BASIC} input`)),
        "a caption click on a disabled control is stopped, and the input is not left holding the flip the browser made before the click was canceled",
    ).toBe(before);
});
